#!/usr/bin/env node

/**
 * record-performance.mjs
 *
 * Reads test results from test-results/results.json (Playwright JSON reporter output)
 * and records performance metrics to the Performance API endpoint.
 *
 * Usage:
 *   node scripts/record-performance.mjs [--api-url http://localhost:3000]
 *
 * Environment Variables:
 *   PERFORMANCE_API_URL - Override API URL (default: http://localhost:3000)
 *   GIT_COMMIT_HASH - Git commit hash (auto-detected from git if not provided)
 *   GIT_BRANCH - Git branch name (auto-detected from git if not provided)
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

// Parse command line arguments
const args = process.argv.slice(2);
let apiUrl = process.env.PERFORMANCE_API_URL || 'http://localhost:3000';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--api-url' && args[i + 1]) {
    apiUrl = args[i + 1];
    i++;
  }
}

// Get git information
function getGitInfo() {
  try {
    const commitHash = process.env.GIT_COMMIT_HASH || execSync('git rev-parse HEAD').toString().trim();
    const branch = process.env.GIT_BRANCH || execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    return { commitHash, branch };
  } catch (error) {
    console.warn('Warning: Could not get git information:', error.message);
    return {
      commitHash: process.env.GIT_COMMIT_HASH || 'unknown',
      branch: process.env.GIT_BRANCH || 'unknown',
    };
  }
}

// Baseline thresholds from docs/PERFORMANCE_BASELINE.md
const baselineThresholds = {
  lint: { baselineMs: 5000, thresholdMs: 10000 },
  unit: { baselineMs: 10000, thresholdMs: 15000 },
  federation: { baselineMs: 90000, thresholdMs: 108000 },
  storybook: { baselineMs: 75000, thresholdMs: 90000 },
  code_examples: { baselineMs: 60000, thresholdMs: 72000 },
};

// Map Playwright test suites to our TestSuite enum
const suiteMap = {
  'federation': 'federation',
  'storybook': 'storybook',
  'code-examples': 'code_examples',
};

// Browser map
const browserMap = {
  chromium: 'chromium',
  firefox: 'firefox',
  webkit: 'webkit',
};

// Determine performance status
function getStatus(durationMs, baselineMs, thresholdMs) {
  if (durationMs > thresholdMs) {
    return 'critical';
  } else if (durationMs > baselineMs * 1.5) {
    return 'warning';
  } else if (durationMs > baselineMs * 1.2) {
    return 'good';
  }
  return 'excellent';
}

// Read and parse Playwright results
function readPlaywrightResults() {
  const resultsPath = 'test-results/results.json';

  if (!existsSync(resultsPath)) {
    console.warn(`Warning: ${resultsPath} not found. No metrics to record.`);
    return [];
  }

  try {
    const content = readFileSync(resultsPath, 'utf8');
    const data = JSON.parse(content);
    return data.suites || [];
  } catch (error) {
    console.error(`Error reading results file: ${error.message}`);
    process.exit(1);
  }
}

// Convert Playwright test suite to metrics
function convertToMetrics(suites, gitInfo) {
  const metrics = [];

  for (const suite of suites) {
    const suiteName = suite.title;
    const testSuite = Object.values(suiteMap).find((s) => suiteName.toLowerCase().includes(s.toLowerCase())) || 'federation';

    const baseline = baselineThresholds[testSuite];
    if (!baseline) {
      console.warn(`Warning: No baseline defined for test suite "${testSuite}", skipping.`);
      continue;
    }

    for (const test of suite.tests || []) {
      // Extract browser from test name or title
      let browser = null;
      const titleLower = (test.title || '').toLowerCase();
      if (titleLower.includes('chromium')) {
        browser = 'chromium';
      } else if (titleLower.includes('firefox')) {
        browser = 'firefox';
      } else if (titleLower.includes('webkit')) {
        browser = 'webkit';
      }

      const duration = test.duration || 0;
      const status = getStatus(duration, baseline.baselineMs, baseline.thresholdMs);

      metrics.push({
        testSuite,
        testName: test.title || 'unknown',
        browser: browser || undefined,
        durationMs: duration,
        baselineMs: baseline.baselineMs,
        thresholdMs: baseline.thresholdMs,
        status,
        passed: test.status === 'passed',
        errorMessage: test.error?.message || null,
        commitHash: gitInfo.commitHash,
        branch: gitInfo.branch,
      });
    }
  }

  return metrics;
}

// Record metrics via API
async function recordMetrics(metrics, apiUrl) {
  if (metrics.length === 0) {
    console.log('No metrics to record.');
    return;
  }

  let successCount = 0;
  let failureCount = 0;

  for (const metric of metrics) {
    try {
      const response = await fetch(`${apiUrl}/api/performance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`Failed to record metric for "${metric.testName}": ${response.status} ${text}`);
        failureCount++;
      } else {
        console.log(`✓ Recorded: ${metric.testSuite} - ${metric.testName} (${metric.durationMs}ms, ${metric.status})`);
        successCount++;
      }
    } catch (error) {
      console.error(`Error recording metric for "${metric.testName}": ${error.message}`);
      failureCount++;
    }
  }

  console.log(`\nResults: ${successCount} recorded, ${failureCount} failed.`);

  if (failureCount > 0) {
    process.exit(1);
  }
}

// Main execution
async function main() {
  console.log('Recording Performance Metrics...\n');
  console.log(`API URL: ${apiUrl}`);
  console.log(`Results file: test-results/results.json\n`);

  const gitInfo = getGitInfo();
  console.log(`Commit: ${gitInfo.commitHash}`);
  console.log(`Branch: ${gitInfo.branch}\n`);

  const suites = readPlaywrightResults();
  const metrics = convertToMetrics(suites, gitInfo);

  console.log(`Found ${metrics.length} test results to process.\n`);

  await recordMetrics(metrics, apiUrl);
}

main().catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
