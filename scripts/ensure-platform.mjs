import { execFile } from 'node:child_process';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const apiImage = 'public-sector-federation-agile-api';
const apiContainer = 'public-sector-agile-api';
const postgresContainer = 'public-sector-agile-postgres';
const apiHealthUrl = 'http://localhost:3333/api/health';
const sourceRoots = ['apps/agile-api', 'docker-compose.yml', 'prisma.config.ts', 'package.json', 'pnpm-lock.yaml'];

async function run(command, args, options = {}) {
  return execFileAsync(command, args, {
    cwd: process.cwd(),
    shell: process.platform === 'win32',
    maxBuffer: 1024 * 1024 * 12,
    ...options,
  });
}

async function dockerAvailable() {
  await run('docker', ['version', '--format', '{{.Server.Version}}']);
  await run('docker', ['compose', 'config', '--quiet']);
}

async function inspectContainer(name) {
  try {
    const { stdout } = await run('docker', ['inspect', name]);
    return JSON.parse(stdout)[0];
  } catch {
    return null;
  }
}

async function inspectImageCreated(imageName) {
  try {
    const { stdout } = await run('docker', ['image', 'inspect', imageName, '--format', '{{.Created}}']);
    return new Date(stdout.trim()).getTime();
  } catch {
    return 0;
  }
}

async function latestSourceMtime(path) {
  const entry = await stat(path);
  if (!entry.isDirectory()) {
    return entry.mtimeMs;
  }

  const children = await readdir(path, { withFileTypes: true });
  const childTimes = await Promise.all(
    children
      .filter((child) => !['node_modules', 'dist', '.nx', '.angular'].includes(child.name))
      .map((child) => latestSourceMtime(join(path, child.name))),
  );
  return Math.max(entry.mtimeMs, ...childTimes);
}

async function latestRelevantSourceMtime() {
  const times = await Promise.all(sourceRoots.map((root) => latestSourceMtime(root)));
  return Math.max(...times);
}

function isRunning(container) {
  return container?.State?.Running === true;
}

function isHealthy(container) {
  const health = container?.State?.Health?.Status;
  return health ? health === 'healthy' : isRunning(container);
}

async function apiHealthOk() {
  try {
    const response = await fetch(apiHealthUrl, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) {
      return false;
    }
    const body = await response.json();
    return body.status === 'ok' && body.database === 'ok';
  } catch {
    return false;
  }
}

async function ensurePlatform() {
  const forceRebuild = process.env.PLATFORM_FORCE_REBUILD === 'true' || process.argv.includes('--rebuild');

  console.log('Checking Docker and Compose...');
  await dockerAvailable();

  const [postgres, api, imageCreated, sourceMtime] = await Promise.all([
    inspectContainer(postgresContainer),
    inspectContainer(apiContainer),
    inspectImageCreated(apiImage),
    latestRelevantSourceMtime(),
  ]);

  const postgresReady = isRunning(postgres) && isHealthy(postgres);
  const apiReady = isRunning(api);
  const imageMissing = imageCreated === 0;
  const imageStale = imageMissing || sourceMtime > imageCreated;
  const shouldBuild = imageMissing || forceRebuild;
  const healthOk = apiReady ? await apiHealthOk() : false;

  if (postgresReady && apiReady && healthOk) {
    if (imageStale && forceRebuild) {
      console.log('API is healthy but PLATFORM_FORCE_REBUILD=true. Rebuilding Docker image...');
    } else if (imageStale) {
      console.log('Docker API and DB are healthy.');
      console.log('API image is stale, but the running container is healthy. Skipping rebuild.');
      console.log('Run `pnpm start:backend:rebuild` when you need a fresh API image.');
      return;
    } else {
      console.log('Docker API and DB are already healthy.');
      return;
    }
  }

  console.log(
    [
      'Starting Docker API and DB...',
      `  postgresReady=${postgresReady}`,
      `  apiReady=${apiReady}`,
      `  imageStale=${imageStale}`,
      `  healthOk=${healthOk}`,
    ].join('\n'),
  );

  if (imageStale) {
    if (shouldBuild) {
      console.log('Rebuilding agile-api image. This can take several minutes on first run...');
    } else {
      console.log('API image is stale. Starting the existing image to avoid blocking normal startup.');
      console.log('Run `pnpm start:backend:rebuild` when you need a fresh API image.');
    }
  }

  const composeArgs = shouldBuild
    ? ['compose', 'up', '-d', '--build', 'postgres', 'agile-api']
    : ['compose', 'up', '-d', 'postgres', 'agile-api'];

  await run('docker', composeArgs, { stdio: 'inherit' });

  console.log('Waiting for Agile API health check...');

  for (let attempt = 1; attempt <= 30; attempt += 1) {
    if (await apiHealthOk()) {
      console.log('Agile API and Postgres are healthy.');
      return;
    }
    process.stdout.write(`  health attempt ${attempt}/30...\n`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error('Agile API did not become healthy after Docker startup.');
}

ensurePlatform().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
