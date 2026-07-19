from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

for directory in [ROOT / 'apps/agile-api', ROOT / 'docs/performance']:
    shutil.rmtree(directory, ignore_errors=True)

for path in [
    'docker-compose.yml',
    'prisma.config.ts',
    'scripts/ensure-platform.mjs',
    'scripts/export-agile-report.mjs',
    'scripts/agile-seed-e2e.mjs',
    'scripts/record-performance.mjs',
    'scripts/export-performance-seed.mjs',
    '.github/workflows/manual-perf-record.yml',
    '.github/workflows/performance-tracking.yml',
]:
    (ROOT / path).unlink(missing_ok=True)

qa_root = ROOT / 'apps/qa-remote'
if qa_root.exists():
    for path in qa_root.rglob('*'):
        if path.is_file() and ('performance' in path.name.lower() or 'agile' in path.name.lower()):
            path.unlink()

package_path = ROOT / 'package.json'
package = json.loads(package_path.read_text())
scripts = package['scripts']
for name in [
    'start:backend', 'start:backend:rebuild', 'start:all:rebuild', 'db:validate',
    'docker:up', 'docker:down', 'docker:logs', 'api:prisma:generate', 'api:migrate',
    'api:seed', 'serve:api', 'check:platform', 'agile:report', 'perf:record',
    'perf:export-seed', 'test:api',
]:
    scripts.pop(name, None)
scripts['start:all'] = (
    'node ./node_modules/.pnpm/nx@23.0.1/node_modules/nx/dist/bin/nx.js run-many '
    '--target=serve --projects=services-remote,reporting-remote,admin-remote,qa-remote,shell,starlight '
    '--parallel=6 --outputStyle=stream'
)
scripts['report:all'] = (
    'pnpm verify:smoke && pnpm screenshots:progress && '
    'pnpm zeroheight:export && pnpm zip:screenshots'
)
for name in ['@types/pg', 'prisma']:
    package.get('devDependencies', {}).pop(name, None)
for name in [
    '@nestjs/common', '@nestjs/core', '@nestjs/platform-express', '@nestjs/swagger',
    '@prisma/adapter-pg', '@prisma/client', 'chart.js', 'class-transformer',
    'class-validator', 'pg', 'reflect-metadata',
]:
    package.get('dependencies', {}).pop(name, None)
package_path.write_text(json.dumps(package, indent=2) + '\n')

readme = ROOT / 'README.md'
text = readme.read_text()
for line in [
    '- a NestJS API backed by Prisma and PostgreSQL\n',
    '| `apps/agile-api` | NestJS API with Prisma and PostgreSQL. |\n',
    '- Docker Desktop for PostgreSQL and the backend API\n',
    'pnpm start:backend\n',
]:
    text = text.replace(line, '')
text = text.replace(
    'The shell opens at `http://localhost:4200`. Frontend applications use ports `4200` through `4204`; the QA Storybook uses port `4400`.',
    'The shell opens at `http://localhost:4200`. Angular applications use ports `4200` through `4204`, Starlight uses `4321`, and QA Storybook uses `4400`. No database or backend service is required.',
)
readme.write_text(text)

portfolio = ROOT / 'docs/PORTFOLIO-OVERVIEW.md'
portfolio.write_text(portfolio.read_text().replace('- NestJS APIs, Prisma, and PostgreSQL\n', ''))

lint = ROOT / 'scripts/lint-workspace.mjs'
text = '\n'.join(
    line for line in lint.read_text().splitlines()
    if 'apps/agile-api/' not in line and "run('pnpm', ['db:validate']);" not in line
) + '\n'
text = text.replace(
    'PrimeNG boundaries, Prisma schema, SCSS guard, and Markdown linting.',
    'PrimeNG boundaries, SCSS guard, and Markdown linting.',
)
lint.write_text(text)

release_workflow = ROOT / '.github/workflows/component-manifest.yml'
text = release_workflow.read_text()
text = re.sub(r'\n      - name: Generate Prisma client\n        run: pnpm api:prisma:generate\n', '\n', text)
text = re.sub(
    r'\n      - name: Start Docker-backed API\n        shell: bash\n        run: \|\n'
    r'          set -o pipefail\n          pnpm start:backend 2>&1 \| tee backend\.log\n',
    '\n',
    text,
)
text = text.replace('            backend.log\n', '')
text = re.sub(
    r'\n      - name: Stop Docker-backed API\n        if: always\(\)\n'
    r'        continue-on-error: true\n        run: pnpm docker:down\n?',
    '\n',
    text,
)
release_workflow.write_text(text)

testing = ROOT / 'docs/TESTING.md'
text = re.sub(
    r'^.*(?:agile-api|Prisma|PostgreSQL|start:backend|docker:up|docker:down|api:prisma|test:api).*$\n?',
    '',
    testing.read_text(),
    flags=re.MULTILINE | re.IGNORECASE,
)
testing.write_text(text)
