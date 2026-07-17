#!/usr/bin/env node

/**
 * Markdown Link Checker Script
 * Validates all links in documentation files
 */

import { promises as fs } from 'fs';
import { glob } from 'glob';
import linkCheck from 'markdown-link-check';
import path from 'path';
import { pathToFileURL } from 'url';

const configFile = '.markdown-link-check.json';
let config = {};

try {
  const configContent = await fs.readFile(configFile, 'utf-8');
  config = JSON.parse(configContent);
} catch (err) {
  console.log(`No config file found at ${configFile}, using defaults`);
}

// Find all markdown files
const pattern = 'docs/**/*.md';
let files = await glob(pattern, { ignore: 'docs/reports/**/*.md' });

// Add README.md
const readmeExists = await fs.stat('README.md').catch(() => null);
if (readmeExists) {
  files.push('README.md');
}

if (files.length === 0) {
  console.log('No markdown files found');
  process.exit(0);
}

console.log(`Checking links in ${files.length} markdown files...\n`);

let totalIssues = 0;

// Wait for all checks to complete
await Promise.all(
  files.map(file =>
    new Promise((resolve) => {
      fs.readFile(file, 'utf-8').then(content => {
        const fileConfig = {
          ...config,
          baseUrl: pathToFileURL(`${path.resolve(path.dirname(file))}${path.sep}`).href,
        };

        try {
          linkCheck(content, fileConfig, (err, results) => {
            if (err) {
              console.error(`Error checking ${file}:`, err);
              totalIssues++;
              resolve();
              return;
            }

            const brokenLinks = results.filter(r => r.status === 'dead');

            if (brokenLinks.length > 0) {
              console.log(`\n❌ ${file}`);
              brokenLinks.forEach(link => {
                console.log(`  - ${link.link} (${link.status})`);
                totalIssues++;
              });
            } else {
              console.log(`✅ ${file}`);
            }

            resolve();
          });
        } catch (err) {
          if (err) {
            console.error(`Error checking ${file}:`, err);
            totalIssues++;
            resolve();
            return;
          }
        }
      });
    })
  )
);

console.log(`\n${'─'.repeat(50)}`);

if (totalIssues === 0) {
  console.log(`✅ All links validated successfully!`);
  process.exit(0);
} else {
  console.log(`❌ Found ${totalIssues} broken link(s)`);
  process.exit(1);
}
