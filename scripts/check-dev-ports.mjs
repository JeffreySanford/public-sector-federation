const endpoints = [
  {
    name: 'shell',
    url: 'http://localhost:4200',
    expected: ['Public Sector Federation Shell'],
  },
  {
    name: 'services-remote',
    url: 'http://localhost:4201/main.js',
    expected: ['public-services-root', 'Citizen services workspace'],
  },
  {
    name: 'reporting-remote',
    url: 'http://localhost:4202/main.js',
    expected: ['public-reporting-root'],
  },
  {
    name: 'admin-remote',
    url: 'http://localhost:4203/main.js',
    expected: ['public-admin-root', 'Administrative settings'],
  },
  {
    name: 'qa-remote',
    url: 'http://localhost:4204/main.js',
    expected: ['public-qa-root', 'Component and token coverage'],
  },
];

async function checkEndpoint(endpoint) {
  try {
    const response = await fetch(`${endpoint.url}?health=${Date.now()}`, {
      signal: AbortSignal.timeout(2500),
    });

    if (!response.ok) {
      return {
        ...endpoint,
        ok: false,
        reason: `HTTP ${response.status}`,
      };
    }

    const body = await response.text();
    const missing = endpoint.expected.filter((marker) => !body.includes(marker));

    return {
      ...endpoint,
      ok: missing.length === 0,
      reason: missing.length > 0 ? `missing marker(s): ${missing.join(', ')}` : 'ok',
    };
  } catch (error) {
    return {
      ...endpoint,
      ok: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

const results = await Promise.all(endpoints.map(checkEndpoint));
const failures = results.filter((result) => !result.ok);

for (const result of results) {
  const status = result.ok ? 'OK' : 'FAIL';
  console.log(`${status} ${result.name} ${result.url} - ${result.reason}`);
}

if (failures.length > 0) {
  console.error(
    [
      '',
      'Dev server health check failed.',
      'Run exactly one owner for dev servers:',
      '  pnpm start:all',
      '',
      'Expected ports:',
      '  shell 4200, services 4201, reporting 4202, admin 4203, qa 4204',
    ].join('\n'),
  );
  process.exit(1);
}
