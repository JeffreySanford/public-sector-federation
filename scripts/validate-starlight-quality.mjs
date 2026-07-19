#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

const workspaceRoot = process.cwd();
const docsRoot = path.resolve(workspaceRoot, 'apps/starlight/src/content/docs');
const integrityPath = path.resolve(workspaceRoot, 'apps/starlight/src/data/documentation-integrity.json');
const policyPath = path.resolve(workspaceRoot, 'apps/starlight/quality-policy.json');
const manifestPath = path.resolve(workspaceRoot, 'packages/ui-patterns/generated/component-manifest.json');
const failures = [];

function report(file, message, line) {
  failures.push(`${file}${line ? `:${line}` : ''} — ${message}`);
}

function relative(file) {
  return path.relative(workspaceRoot, file).replaceAll(path.sep, '/');
}

function frontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end < 0) return null;
  return {
    raw: content.slice(4, end),
    body: content.slice(end + 4),
  };
}

function headings(content) {
  const result = [];
  let inFence = false;
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (match) result.push({ level: match[1].length, text: match[2], line: index + 1 });
  }
  return result;
}

function extractedLinks(content) {
  const links = [];
  const markdownPattern = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  const hrefPattern = /\bhref=["']([^"']+)["']/g;
  for (const pattern of [markdownPattern, hrefPattern]) {
    for (const match of content.matchAll(pattern)) links.push(match[1]);
  }
  return [...new Set(links)];
}

async function pathExists(candidate) {
  try {
    await fs.access(candidate);
    return true;
  } catch {
    return false;
  }
}

async function resolvesContentLink(sourceFile, link) {
  const clean = decodeURIComponent(link.split('#')[0].split('?')[0]);
  if (!clean || clean.startsWith('#')) return true;
  if (/^(https?:|mailto:|tel:)/i.test(clean)) return true;
  if (/^\/(workbench|storybook|platform)\/?/.test(clean)) return true;

  let target;
  if (clean.startsWith('/docs')) {
    target = path.join(docsRoot, clean.replace(/^\/docs\/?/, ''));
  } else if (clean.startsWith('/')) {
    return false;
  } else {
    target = path.resolve(path.dirname(sourceFile), clean);
  }

  const candidates = [
    target,
    `${target}.md`,
    `${target}.mdx`,
    path.join(target, 'index.md'),
    path.join(target, 'index.mdx'),
  ];
  for (const candidate of candidates) {
    if (await pathExists(candidate)) return true;
  }
  return false;
}

const documentFiles = await glob('apps/starlight/src/content/docs/**/*.{md,mdx}', {
  cwd: workspaceRoot,
  absolute: true,
});

for (const file of documentFiles.sort()) {
  const fileName = relative(file);
  const content = await fs.readFile(file, 'utf8');
  const parsed = frontmatter(content);
  if (!parsed) {
    report(fileName, 'Frontmatter is required.');
    continue;
  }

  const title = /^title:\s*(.+)$/m.exec(parsed.raw)?.[1]?.trim();
  const description = /^description:\s*(.+)$/m.exec(parsed.raw)?.[1]?.trim();
  if (!title) report(fileName, 'A non-empty title is required.');
  if (!description) report(fileName, 'A non-empty description is required.');

  const pageHeadings = headings(parsed.body);
  if (pageHeadings.some((heading) => heading.level === 1)) {
    const heading = pageHeadings.find((item) => item.level === 1);
    report(fileName, 'Do not author an H1; Starlight renders the page title as the single H1.', heading.line);
  }
  let previousLevel = 1;
  for (const heading of pageHeadings) {
    if (heading.level > previousLevel + 1) {
      report(fileName, `Heading level skips from H${previousLevel} to H${heading.level}.`, heading.line);
    }
    previousLevel = heading.level;
  }

  const placeholder = /(?:\bTODO\b|\bTBD\b|\bFIXME\b|lorem ipsum|replace me|\[placeholder\])/i.exec(parsed.body);
  if (placeholder) report(fileName, `Unresolved placeholder text found: “${placeholder[0]}”.`);

  const localPath = /(?:file:\/\/|[A-Za-z]:\\|\/(?:Users|home)\/[^\s)`]+)/.exec(content);
  if (localPath) report(fileName, `Machine-local path found: “${localPath[0]}”.`);

  const publicWording = /(?:portfolio-grade|skills demonstrated|SitePen|Zeroheight)/i.exec(parsed.body);
  if (publicWording) report(fileName, `Non-canonical public wording found: “${publicWording[0]}”.`);

  if (/\bstyle\s*=/.test(parsed.body)) report(fileName, 'Inline styles are not allowed in Starlight content.');

  for (const link of extractedLinks(content)) {
    if (!(await resolvesContentLink(file, link))) report(fileName, `Unresolvable local link: ${link}`);
  }
}

const integrity = JSON.parse(await fs.readFile(integrityPath, 'utf8'));
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const policy = JSON.parse(await fs.readFile(policyPath, 'utf8'));
const knownRoutes = new Set(integrity.routes.map((entry) => entry.route));
const allowedFigmaStatuses = new Set([
  'pending-access',
  'not-applicable',
  'draft',
  'partial',
  'aligned',
  'blocked',
]);

for (const route of integrity.routes) {
  const source = path.resolve(workspaceRoot, route.source);
  if (!(await pathExists(source))) report('documentation-integrity.json', `Route ${route.route} references missing source ${route.source}.`);
  if (!route.route.startsWith('/docs/')) report('documentation-integrity.json', `Documentation route must start with /docs/: ${route.route}`);
}

for (const component of integrity.components) {
  const entry = manifest.entries.find((candidate) => candidate.identity.id === component.manifestId);
  if (!entry) {
    report('documentation-integrity.json', `Unknown manifest component ${component.manifestId}.`);
    continue;
  }
  if (entry.identity.source !== component.source) {
    report('documentation-integrity.json', `${component.manifestId} source differs from the generated manifest.`);
  }
  if (!(await pathExists(path.resolve(workspaceRoot, component.source)))) {
    report('documentation-integrity.json', `${component.manifestId} source file does not exist: ${component.source}.`);
  }
  if (!knownRoutes.has(component.docsRoute)) {
    report('documentation-integrity.json', `${component.manifestId} points to an unknown Starlight route: ${component.docsRoute}.`);
  }
  if (entry.evidence.storybook.title !== component.storybookTitle) {
    report('documentation-integrity.json', `${component.manifestId} Storybook title differs from the generated manifest.`);
  }
  if (!entry.evidence.storybook.files.includes(component.storybookFile)) {
    report('documentation-integrity.json', `${component.manifestId} Storybook source is not recorded in the generated manifest.`);
  }
  if (!(await pathExists(path.resolve(workspaceRoot, component.storybookFile)))) {
    report('documentation-integrity.json', `${component.manifestId} Storybook file does not exist: ${component.storybookFile}.`);
  }
  if (component.canonicalStoryId) {
    if (!/^[a-z0-9-]+--[a-z0-9-]+$/.test(component.canonicalStoryId)) {
      report('documentation-integrity.json', `${component.manifestId} uses an invalid canonical Storybook ID: ${component.canonicalStoryId}.`);
    }
    if (!entry.evidence.storybook.stories.includes(component.canonicalStoryId)) {
      report('documentation-integrity.json', `${component.manifestId} canonical Storybook ID is not recorded in the generated manifest.`);
    }
  }
  if (component.documentationFile) {
    if (!entry.evidence.documentation.files.includes(component.documentationFile)) {
      report('documentation-integrity.json', `${component.manifestId} documentation source is not recorded in the generated manifest.`);
    }
    if (!(await pathExists(path.resolve(workspaceRoot, component.documentationFile)))) {
      report('documentation-integrity.json', `${component.manifestId} documentation source does not exist: ${component.documentationFile}.`);
    }
  }
  if (!allowedFigmaStatuses.has(component.figmaStatus)) {
    report('documentation-integrity.json', `${component.manifestId} uses an unsupported Figma status: ${component.figmaStatus}.`);
  }
  if (entry.figma.status !== component.figmaStatus) {
    report('documentation-integrity.json', `${component.manifestId} Figma status differs from the generated manifest.`);
  }
}

const exceptionMatches = new Set();
for (const exception of policy.styleExceptions) {
  const filePath = path.resolve(workspaceRoot, exception.file);
  const fileContent = await fs.readFile(filePath, 'utf8');
  if (!fileContent.includes(exception.match)) {
    report('quality-policy.json', `Documented style exception no longer exists: ${exception.file} → ${exception.match}`);
  } else {
    exceptionMatches.add(`${exception.file}\0${exception.match}`);
  }
}

function isException(file, match) {
  return exceptionMatches.has(`${file}\0${match}`);
}

const styleFiles = [
  'apps/starlight/astro.config.mjs',
  'apps/starlight/src/components/StoryFrame.astro',
  'apps/starlight/src/styles/custom.css',
];
for (const file of styleFiles) {
  const content = await fs.readFile(path.resolve(workspaceRoot, file), 'utf8');
  for (const match of content.matchAll(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/gi)) {
    if (!isException(file, match[0])) report(file, `Raw color value is not tokenized or documented: ${match[0]}`);
  }
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const trimmed = line.trim();
    const spacing = /^(?:margin(?:-[\w-]+)?|padding(?:-[\w-]+)?|gap|row-gap|column-gap|border-radius|outline-offset):\s*([^;]+);/.exec(trimmed);
    if (spacing && /\d(?:\.\d+)?(?:px|rem|em)\b/.test(spacing[1]) && !/(?:var\(|calc\(|clamp\()/.test(spacing[1])) {
      if (!isException(file, trimmed)) report(file, `Arbitrary spacing requires a documented exception: ${trimmed}`, index + 1);
    }
    const fontFamily = /^font-family:\s*([^;]+);$/.exec(trimmed);
    if (fontFamily && fontFamily[1].trim() !== 'var(--ps-font-family)') {
      report(file, `Typography must use the shared font-family token: ${trimmed}`, index + 1);
    }
    if (trimmed.includes('!important') && !isException(file, trimmed)) {
      report(file, `!important requires a documented exception: ${trimmed}`, index + 1);
    }
  }
}

const allowedPolishStatuses = new Set([
  'polish-approved',
  'polish-approved-with-follow-up',
  'polish-changes-required',
]);
const review = policy.polishReview;
if (!allowedPolishStatuses.has(review.status)) report('quality-policy.json', `Unsupported polish status: ${review.status}`);
for (const field of ['reviewer', 'reviewedAt', 'scope']) {
  if (!review[field]) report('quality-policy.json', `Polish review field is required: ${field}`);
}
if (review.status === 'polish-approved-with-follow-up' && !review.followUp) {
  report('quality-policy.json', 'An approved-with-follow-up review must name the follow-up work.');
}
if (review.status === 'polish-changes-required') {
  report('quality-policy.json', 'Human polish review still requires changes.');
}
if (policy.visualBaselines?.automaticAcceptanceAllowed !== false) {
  report('quality-policy.json', 'Visual baseline policy must explicitly prohibit automatic acceptance.');
}

if (failures.length) {
  console.error(`\nStarlight quality validation failed with ${failures.length} issue(s):\n`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Validated ${documentFiles.length} Starlight pages, ${integrity.routes.length} routes, ${integrity.components.length} component relationships, shared style discipline, and human polish metadata.`);
