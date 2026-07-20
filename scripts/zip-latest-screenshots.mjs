import { existsSync } from 'fs';
import { resolve } from 'path';
import { spawnSync } from 'child_process';

const screenshotsDir = resolve('docs', 'reports', 'agile-progress', 'latest', 'screenshots');
const date = new Date().toISOString().slice(0, 10);
const outputZip = resolve('docs', 'reports', 'agile-progress', 'latest', `screenshots-${date}.zip`);

if (!existsSync(screenshotsDir)) {
  console.error(`Screenshot directory not found: ${screenshotsDir}`);
  process.exit(1);
}

console.log(`Creating zip archive: ${outputZip}`);

const runCommand = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
};

if (process.platform === 'win32') {
  const command = `Compress-Archive -Path ${JSON.stringify(`${screenshotsDir}\\*`)} -DestinationPath ${JSON.stringify(outputZip)} -Force`;
  runCommand('powershell.exe', ['-NoProfile', '-Command', command]);
  process.exit(0);
}

const pythonCode = `import os, zipfile\nsrc = ${JSON.stringify(screenshotsDir)}\ndst = ${JSON.stringify(outputZip)}\nwith zipfile.ZipFile(dst, 'w', compression=zipfile.ZIP_DEFLATED) as zf:\n    for root, _, files in os.walk(src):\n        for filename in sorted(files):\n            path = os.path.join(root, filename)\n            zf.write(path, os.path.relpath(path, src))\n`;

try {
  runCommand('python3', ['-c', pythonCode]);
} catch {
  runCommand('python', ['-c', pythonCode]);
}

process.exit(0);
