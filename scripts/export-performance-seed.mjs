#!/usr/bin/env node

/**
 * export-performance-seed.mjs
 *
 * Exports the latest performance metrics from the database and updates
 * the test-performance.seed.json file to keep baseline data in sync.
 *
 * Usage:
 *   node scripts/export-performance-seed.mjs [--auto-commit]
 *
 * Environment Variables:
 *   DATABASE_URL - Prisma database URL
 *   AUTO_COMMIT - Set to 'true' to auto-commit and push changes
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://public_sector:public_sector@localhost:5432/public_sector_agile?schema=public';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const seedPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'apps/agile-api/prisma/seed-data/test-performance.seed.json');

// Parse args
const args = process.argv.slice(2);
const autoCommit = args.includes('--auto-commit') || process.env.AUTO_COMMIT === 'true';

async function exportMetrics() {
  try {
    console.log('Exporting performance metrics from database...\n');

    // Get all metrics, grouped by test suite/name/browser
    const allMetrics = await prisma.testPerformanceMetric.findMany({
      orderBy: [{ testSuite: 'asc' }, { testName: 'asc' }, { browser: 'asc' }, { recordedAt: 'desc' }],
    });

    if (allMetrics.length === 0) {
      console.log('No metrics found in database.');
      await prisma.$disconnect();
      return;
    }

    // Group by test suite/name/browser and get latest for each
    const metricsMap = new Map();
    for (const metric of allMetrics) {
      const key = `${metric.testSuite}:${metric.testName}:${metric.browser || 'null'}`;
      if (!metricsMap.has(key)) {
        metricsMap.set(key, metric);
      }
    }

    // Convert to seed format
    const performanceMetrics = Array.from(metricsMap.values())
      .sort((a, b) => {
        // Sort by suite, then name, then browser
        if (a.testSuite !== b.testSuite) {
          const suiteOrder = ['lint', 'unit', 'federation', 'storybook', 'code_examples'];
          return suiteOrder.indexOf(a.testSuite) - suiteOrder.indexOf(b.testSuite);
        }
        if (a.testName !== b.testName) {
          return a.testName.localeCompare(b.testName);
        }
        return (a.browser || '').localeCompare(b.browser || '');
      })
      .map((metric) => ({
        testSuite: metric.testSuite,
        testName: metric.testName,
        browser: metric.browser,
        durationMs: metric.durationMs,
        baselineMs: metric.baselineMs,
        thresholdMs: metric.thresholdMs,
        status: metric.status,
        passed: metric.passed,
        errorMessage: metric.errorMessage,
        commitHash: metric.commitHash,
        branch: metric.branch,
      }));

    // Write seed file
    const seedData = { performanceMetrics };
    writeFileSync(seedPath, JSON.stringify(seedData, null, 2) + '\n');

    console.log(`✓ Updated ${seedPath}`);
    console.log(`✓ Exported ${performanceMetrics.length} unique metric combinations\n`);

    // Print summary
    const suites = new Set(performanceMetrics.map((m) => m.testSuite));
    console.log('Metrics by test suite:');
    for (const suite of suites) {
      const count = performanceMetrics.filter((m) => m.testSuite === suite).length;
      console.log(`  ${suite}: ${count}`);
    }

    // Auto-commit if requested
    if (autoCommit) {
      try {
        console.log('\nAuto-committing changes...');
        execSync('git add apps/agile-api/prisma/seed-data/test-performance.seed.json', { stdio: 'pipe' });
        execSync(
          `git commit -m "chore: update performance seed with latest metrics (${performanceMetrics.length} combinations)"`,
          { stdio: 'pipe' }
        );
        execSync('git push origin master', { stdio: 'pipe' });
        console.log('✓ Committed and pushed to master');
      } catch (error) {
        console.warn('Warning: Could not auto-commit:', error.message);
      }
    }

    console.log('\n✓ Performance seed export complete!');
  } catch (error) {
    console.error('Error exporting metrics:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportMetrics();
