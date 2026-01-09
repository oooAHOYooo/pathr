import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

const help = args.has('-h') || args.has('--help');
const skipInstall = args.has('--skip-install') || args.has('--no-install');
const noSupabase = args.has('--no-supabase');
const webOnly = args.has('--web-only');
const mobileOnly = args.has('--mobile-only');
const quiet = args.has('--quiet');

function log(msg) {
  if (!quiet) console.log(msg);
}

function spawnPromise(command, commandArgs, { cwd = repoRoot } = {}) {
  const shell = process.platform === 'win32';

  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      cwd,
      stdio: 'inherit',
      shell,
      env: process.env,
    });

    child.on('error', (err) => reject(err));
    child.on('exit', (code, signal) => {
      if (signal) return reject(new Error(`${command} exited with signal ${signal}`));
      if (code === 0) return resolve();
      return reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function commandExists(command) {
  const shell = process.platform === 'win32';

  return await new Promise((resolve) => {
    const child = spawn(command, ['--version'], {
      cwd: repoRoot,
      stdio: 'ignore',
      shell,
      env: process.env,
    });

    child.on('error', () => resolve(false));
    child.on('exit', (code) => resolve(code === 0));
  });
}

function fileExists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function printHelp() {
  // Keep this terse; most people just want "pnpm local".
  console.log(`
Pathr local dev runner

Usage:
  pnpm local

Options:
  --skip-install     Skip pnpm install
  --no-supabase      Don't attempt to start local Supabase
  --web-only         Run only the web app
  --mobile-only      Run only the mobile app
  -h, --help         Show help
`.trim());
}

if (help) {
  printHelp();
  process.exit(0);
}

if (webOnly && mobileOnly) {
  console.error('Use only one of --web-only or --mobile-only.');
  process.exit(2);
}

// Basic env heads-up (the repo doesn't ship .env.example right now).
const envHints = [
  path.join(repoRoot, '.env.local'),
  path.join(repoRoot, 'apps', 'web', '.env.local'),
  path.join(repoRoot, 'apps', 'mobile', '.env'),
  path.join(repoRoot, 'apps', 'mobile', '.env.local'),
];
const hasAnyEnv = envHints.some(fileExists);
if (!hasAnyEnv) {
  log(
    [
      '',
      'Note: no .env files found. That’s OK for the current placeholder UI,',
      'but you’ll need env vars once Supabase/Mapbox is wired up.',
      '',
    ].join('\n'),
  );
}

try {
  if (!skipInstall) {
    log('Installing dependencies (pnpm install)…');
    await spawnPromise('pnpm', ['install']);
  } else {
    log('Skipping install (--skip-install).');
  }

  if (!noSupabase) {
    const hasSupabase = await commandExists('supabase');
    if (hasSupabase) {
      log('Starting local Supabase (supabase start)…');
      await spawnPromise('supabase', ['start']);
    } else {
      log(
        [
          'Supabase CLI not found; skipping local Supabase.',
          'If you want local Supabase, install it and rerun:',
          '  - supabase: https://supabase.com/docs/guides/cli',
        ].join('\n'),
      );
    }
  } else {
    log('Skipping Supabase (--no-supabase).');
  }

  if (webOnly) {
    log('Starting web app (pnpm dev:web)…');
    await spawnPromise('pnpm', ['dev:web']);
  } else if (mobileOnly) {
    log('Starting mobile app (pnpm dev)…');
    await spawnPromise('pnpm', ['dev']);
  } else {
    log('Starting web + mobile (pnpm dev:all)…');
    await spawnPromise('pnpm', ['dev:all']);
  }
} catch (err) {
  console.error(err?.message ?? err);
  process.exit(1);
}

