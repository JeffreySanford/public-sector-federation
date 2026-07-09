import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const packageRoot = join('docs', 'reports', 'zeroheight', 'latest');
const manifestPath = join(packageRoot, 'manifest.json');
const endpoint = process.env.ZEROHEIGHT_PUBLISH_ENDPOINT;
const clientId = process.env.ZEROHEIGHT_CLIENT_ID;
const accessToken = process.env.ZEROHEIGHT_ACCESS_TOKEN;
const dryRun = process.env.ZEROHEIGHT_DRY_RUN !== 'false';

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

const publishRecord = {
  attemptedAt: new Date().toISOString(),
  dryRun: !endpoint || dryRun,
  endpointConfigured: Boolean(endpoint),
  clientIdConfigured: Boolean(clientId),
  accessTokenConfigured: Boolean(accessToken),
  manifestPath: manifestPath.replaceAll('\\', '/'),
  pageCount: manifest.pages.length,
  tokenFileCount: manifest.tokens.length,
  reportFileCount: manifest.reports.length,
  screenshotCount: manifest.screenshots.length,
  result: 'not-run',
  notes: [],
};

if (!endpoint) {
  publishRecord.result = 'dry-run';
  publishRecord.notes.push('ZEROHEIGHT_PUBLISH_ENDPOINT is not configured.');
  publishRecord.notes.push('Package is ready for manual Zeroheight upload or an internal publishing bridge.');
} else if (dryRun) {
  publishRecord.result = 'dry-run';
  publishRecord.notes.push('ZEROHEIGHT_DRY_RUN is not set to false, so no API call was made.');
} else {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(clientId ? { 'x-zeroheight-client-id': clientId } : {}),
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({
      manifest,
      packageRoot: packageRoot.replaceAll('\\', '/'),
    }),
  });

  publishRecord.result = response.ok ? 'published' : 'failed';
  publishRecord.httpStatus = response.status;
  publishRecord.responseBody = await response.text();

  if (!response.ok) {
    console.error(`Zeroheight publish bridge failed with HTTP ${response.status}.`);
    await writeFile(join(packageRoot, 'publish-result.json'), `${JSON.stringify(publishRecord, null, 2)}\n`);
    process.exit(1);
  }
}

await writeFile(join(packageRoot, 'publish-result.json'), `${JSON.stringify(publishRecord, null, 2)}\n`);

if (publishRecord.result === 'dry-run') {
  console.log(`Zeroheight publish dry run complete. Package: ${packageRoot}`);
} else {
  console.log(`Zeroheight publish result: ${publishRecord.result}.`);
}
