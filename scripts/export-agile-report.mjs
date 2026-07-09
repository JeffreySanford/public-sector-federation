import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const apiBase = process.env.AGILE_API_URL ?? 'http://localhost:3333/api';
const reportRoot = join('docs', 'reports', 'agile-progress');
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
const latestDir = join(reportRoot, 'latest');
const stampedDir = join(reportRoot, stamp);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function fetchJson(path) {
  const response = await fetch(`${apiBase}${path}`, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) {
    throw new Error(`${path} failed with HTTP ${response.status}`);
  }
  return response.json();
}

async function screenshotLinks() {
  try {
    const files = await readdir(join(latestDir, 'screenshots'));
    return files.filter((file) => file.endsWith('.png')).sort();
  } catch {
    return [];
  }
}

function workList(items) {
  if (items.length === 0) {
    return '- None recorded.';
  }
  return items.map((item) => `- ${item.title} (${item.status}, ${item.effort}) - ${item.doneCriteria}`).join('\n');
}

function markdown(report, screenshots) {
  return `# Agile Progress Report

Generated: ${report.generatedAt}

## Executive Summary

- Sprint: ${report.sprint.name}
- Goal: ${report.sprint.goal}
- Completed work items: ${report.summary.completedCount}
- Current work items: ${report.summary.currentCount}
- Work left: ${report.summary.remainingCount}
- Active blockers: ${report.summary.blockerCount}
- Time tracked: ${report.summary.totalTrackedHours} hours

## Completed Work

${workList(report.completedWork)}

## Current Status

${workList(report.currentStatus)}

## Work Left

${workList(report.workLeft)}

## Blockers And Mitigations

${report.blockers.map((blocker) => `- ${blocker.title}: ${blocker.mitigation} (owner: ${blocker.owner})`).join('\n')}

## Time By Workstream

${report.timeByWorkstream.map((row) => `- ${row.workstream}: ${row.hours} hours`).join('\n')}

## Recommendations

${report.recommendations.map((item) => `- ${item}`).join('\n')}

## Screenshots

${screenshots.length > 0 ? screenshots.map((file) => `- [${file}](./screenshots/${file})`).join('\n') : '- Run `pnpm screenshots:progress` to attach screenshots.'}
`;
}

function html(report, screenshots) {
  const card = (title, value) => `<article><span>${escapeHtml(title)}</span><strong>${escapeHtml(value)}</strong></article>`;
  const list = (items) => items.map((item) => `<li>${escapeHtml(item.title)} <small>${escapeHtml(item.status)} / ${escapeHtml(item.effort)}</small></li>`).join('');
  const screenshotMarkup = screenshots
    .map((file) => `<figure><img src="./screenshots/${escapeHtml(file)}" alt="${escapeHtml(file)}" /><figcaption>${escapeHtml(file)}</figcaption></figure>`)
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Agile Progress Report</title>
  <style>
    body { margin: 0; padding: 2rem; background: #f8fafc; color: #0f172a; font-family: Inter, Segoe UI, Arial, sans-serif; }
    main { max-width: 1100px; margin: 0 auto; display: grid; gap: 1.25rem; }
    header, section { padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 1rem; background: white; box-shadow: 0 1rem 2rem rgba(15, 23, 42, 0.08); }
    h1, h2 { margin: 0 0 0.5rem; letter-spacing: -0.03em; }
    p, li { line-height: 1.55; }
    .metrics { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.75rem; }
    .metrics article { display: grid; gap: 0.25rem; padding: 1rem; border-radius: 0.85rem; background: #eff6ff; }
    .metrics span { color: #475569; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; }
    .metrics strong { font-size: 1.75rem; }
    .screenshots { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    figure { margin: 0; display: grid; gap: 0.5rem; }
    img { width: 100%; border: 1px solid #e2e8f0; border-radius: 0.75rem; }
    figcaption, small { color: #475569; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Agile Progress Report</h1>
      <p><strong>${escapeHtml(report.sprint.name)}</strong>: ${escapeHtml(report.sprint.goal)}</p>
      <p>Generated ${escapeHtml(report.generatedAt)}</p>
    </header>
    <section class="metrics">
      ${card('Completed', report.summary.completedCount)}
      ${card('Current', report.summary.currentCount)}
      ${card('Work Left', report.summary.remainingCount)}
      ${card('Blockers', report.summary.blockerCount)}
      ${card('Hours', report.summary.totalTrackedHours)}
    </section>
    <section><h2>Completed Work</h2><ul>${list(report.completedWork)}</ul></section>
    <section><h2>Current Status</h2><ul>${list(report.currentStatus)}</ul></section>
    <section><h2>Work Left</h2><ul>${list(report.workLeft)}</ul></section>
    <section><h2>Recommendations</h2><ul>${report.recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
    <section><h2>Screenshots</h2><div class="screenshots">${screenshotMarkup || '<p>Run pnpm screenshots:progress to attach screenshots.</p>'}</div></section>
  </main>
</body>
</html>
`;
}

const report = await fetchJson('/agile/report');
const screenshots = await screenshotLinks();

await Promise.all([mkdir(latestDir, { recursive: true }), mkdir(stampedDir, { recursive: true })]);

const files = {
  'agile-progress.json': `${JSON.stringify(report, null, 2)}\n`,
  'agile-progress.md': markdown(report, screenshots),
  'agile-progress.html': html(report, screenshots),
};

await Promise.all(
  Object.entries(files).flatMap(([file, contents]) => [
    writeFile(join(latestDir, file), contents),
    writeFile(join(stampedDir, file), contents),
  ]),
);

console.log(`Wrote Agile progress report to ${latestDir} and ${stampedDir}.`);
