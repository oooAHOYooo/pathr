import { spawn, exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

const help = args.has('-h') || args.has('--help');
const skipInstall = args.has('--skip-install');
const skipUpdateCheck = args.has('--skip-update-check');
const noSupabase = args.has('--no-supabase');
const webOnly = args.has('--web-only');
const mobileOnly = args.has('--mobile-only');
const quiet = args.has('--quiet');

function log(msg, type = 'info') {
  if (quiet && type !== 'error') return;
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warn' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} ${msg}`);
}

function logStep(msg) {
  if (!quiet) console.log(`\n🔧 ${msg}\n`);
}

// Check if a command exists in PATH
async function commandExists(command) {
  const shell = process.platform === 'win32';
  const checkCmd = shell ? `where ${command}` : `which ${command}`;
  
  try {
    await execAsync(checkCmd, { shell });
    return true;
  } catch {
    return false;
  }
}

// Get command version
async function getVersion(command) {
  try {
    const { stdout } = await execAsync(`${command} --version`, { shell: process.platform === 'win32' });
    return stdout.trim();
  } catch {
    return null;
  }
}

// Find Node.js installation
function findNodeJs() {
  const possiblePaths = [
    'C:\\Program Files\\nodejs\\node.exe',
    'C:\\Program Files (x86)\\nodejs\\node.exe',
    path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'nodejs', 'node.exe'),
  ];
  
  for (const nodePath of possiblePaths) {
    if (fs.existsSync(nodePath)) {
      return path.dirname(nodePath);
    }
  }
  return null;
}

// Find pnpm installation
function findPnpm() {
  const possiblePaths = [
    path.join(os.homedir(), 'AppData', 'Roaming', 'npm', 'pnpm.cmd'),
    path.join(os.homedir(), 'AppData', 'Local', 'pnpm', 'pnpm.exe'),
  ];
  
  for (const pnpmPath of possiblePaths) {
    if (fs.existsSync(pnpmPath)) {
      return path.dirname(pnpmPath);
    }
  }
  return null;
}

// Add to PATH for current process
function addToPath(...paths) {
  const separator = process.platform === 'win32' ? ';' : ':';
  const currentPath = process.env.PATH || '';
  const newPaths = paths.filter(p => p && !currentPath.includes(p));
  if (newPaths.length > 0) {
    process.env.PATH = currentPath + separator + newPaths.join(separator);
    log(`Added to PATH: ${newPaths.join(', ')}`, 'success');
    return true;
  }
  return false;
}

// Check and setup environment
async function setupEnvironment() {
  logStep('Checking environment...');
  
  let nodePath = null;
  let pnpmPath = null;
  let needsPathUpdate = false;
  
  // Check Node.js
  const nodeExists = await commandExists('node');
  if (!nodeExists) {
    log('Node.js not found in PATH, searching for installation...', 'warn');
    nodePath = findNodeJs();
    if (nodePath) {
      log(`Found Node.js at: ${nodePath}`, 'success');
      addToPath(nodePath);
      needsPathUpdate = true;
    } else {
      log('Node.js not found. Please install Node.js from https://nodejs.org/', 'error');
      process.exit(1);
    }
  } else {
    const version = await getVersion('node');
    log(`Node.js found: ${version}`, 'success');
  }
  
  // Check npm
  const npmExists = await commandExists('npm');
  if (!npmExists && nodePath) {
    // npm should be in the same directory as node
    addToPath(nodePath);
  }
  
  // Check pnpm
  const pnpmExists = await commandExists('pnpm');
  if (!pnpmExists) {
    log('pnpm not found in PATH, searching for installation...', 'warn');
    pnpmPath = findPnpm();
    if (pnpmPath) {
      log(`Found pnpm at: ${pnpmPath}`, 'success');
      addToPath(pnpmPath);
      needsPathUpdate = true;
    } else {
      log('pnpm not found. Installing pnpm globally...', 'warn');
      try {
        await execAsync('npm install -g pnpm', { shell: process.platform === 'win32' });
        const pnpmInstallPath = path.join(os.homedir(), 'AppData', 'Roaming', 'npm');
        addToPath(pnpmInstallPath);
        log('pnpm installed successfully!', 'success');
      } catch (err) {
        log(`Failed to install pnpm: ${err.message}`, 'error');
        log('Please install pnpm manually: npm install -g pnpm', 'error');
        process.exit(1);
      }
    }
  } else {
    const version = await getVersion('pnpm');
    log(`pnpm found: ${version}`, 'success');
  }
  
  if (needsPathUpdate) {
    log('\n⚠️  PATH was updated for this session only.', 'warn');
    log('To make it permanent, add these to your system PATH:', 'warn');
    if (nodePath) log(`  - ${nodePath}`);
    if (pnpmPath) log(`  - ${pnpmPath}`);
    log('Or restart your terminal after installing Node.js/pnpm.\n');
  }
  
  return true;
}

// Check for updates
async function checkForUpdates() {
  if (skipUpdateCheck) {
    log('Skipping update check (--skip-update-check)', 'warn');
    return;
  }
  
  logStep('Checking for updates...');
  
  try {
    // Check pnpm version
    const { stdout: pnpmVersion } = await execAsync('pnpm --version', { shell: process.platform === 'win32' });
    log(`Current pnpm version: ${pnpmVersion.trim()}`, 'info');
    
    // Check Node.js version
    const { stdout: nodeVersion } = await execAsync('node --version', { shell: process.platform === 'win32' });
    log(`Current Node.js version: ${nodeVersion.trim()}`, 'info');
    
    // Check for outdated packages (optional, can be slow)
    log('Checking for outdated packages...', 'info');
    try {
      const { stdout } = await execAsync('pnpm outdated --recursive', { 
        shell: process.platform === 'win32',
        cwd: repoRoot,
        timeout: 10000, // 10 second timeout
      });
      if (stdout.trim()) {
        log('Some packages have updates available:', 'warn');
        console.log(stdout);
        log('Run "pnpm update" to update packages', 'info');
      } else {
        log('All packages are up to date!', 'success');
      }
    } catch {
      // Timeout or error, skip it
      log('Update check timed out or failed (this is OK)', 'warn');
    }
  } catch (err) {
    log(`Update check failed: ${err.message}`, 'warn');
  }
}

// Check if dependencies are installed
function dependenciesInstalled() {
  const nodeModulesExists = fs.existsSync(path.join(repoRoot, 'node_modules'));
  const webNodeModules = fs.existsSync(path.join(repoRoot, 'apps', 'web', 'node_modules'));
  const mobileNodeModules = fs.existsSync(path.join(repoRoot, 'apps', 'mobile', 'node_modules'));
  
  return nodeModulesExists && webNodeModules && mobileNodeModules;
}

// Install dependencies
async function installDependencies() {
  if (skipInstall) {
    log('Skipping dependency installation (--skip-install)', 'warn');
    return;
  }
  
  if (dependenciesInstalled()) {
    log('Dependencies appear to be installed', 'success');
    return;
  }
  
  logStep('Installing dependencies...');
  
  try {
    await execAsync('pnpm install', {
      shell: process.platform === 'win32',
      cwd: repoRoot,
      stdio: 'inherit',
    });
    log('Dependencies installed successfully!', 'success');
  } catch (err) {
    log(`Failed to install dependencies: ${err.message}`, 'error');
    process.exit(1);
  }
}

// Spawn background process
function spawnBackground(command, commandArgs, { cwd = repoRoot } = {}) {
  const shell = process.platform === 'win32';
  
  const child = spawn(command, commandArgs, {
    cwd,
    stdio: 'inherit',
    shell,
    env: process.env,
  });
  
  child.on('error', (err) => {
    log(`Error starting ${command}: ${err.message}`, 'error');
  });
  
  return child;
}

// Open browser
function openBrowser(url) {
  const platform = os.platform();
  let command;
  let args;
  
  if (platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'start', '""', url];
  } else if (platform === 'darwin') {
    command = 'open';
    args = [url];
  } else {
    command = 'xdg-open';
    args = [url];
  }
  
  spawn(command, args, {
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printHelp() {
  console.log(`
🚀 Pathr Startup Script

Usage:
  pnpm startup [options]

This script will:
  1. Check and setup Node.js/pnpm environment
  2. Check for updates
  3. Install dependencies if needed
  4. Start development servers

Options:
  --skip-install         Skip dependency installation
  --skip-update-check    Skip checking for updates
  --no-supabase         Don't attempt to start local Supabase
  --web-only            Run only the web app
  --mobile-only         Run only the mobile app
  --quiet               Reduce output
  -h, --help            Show this help

Examples:
  pnpm startup              # Full startup (recommended)
  pnpm startup --web-only   # Start only web app
  pnpm startup --skip-update-check  # Skip update check
`.trim());
}

if (help) {
  printHelp();
  process.exit(0);
}

if (webOnly && mobileOnly) {
  log('Cannot use both --web-only and --mobile-only', 'error');
  process.exit(2);
}

// Main execution
async function main() {
  try {
    console.log('\n🚀 Pathr Startup Script\n');
    console.log('='.repeat(50));
    
    // 1. Setup environment
    await setupEnvironment();
    
    // 2. Check for updates
    await checkForUpdates();
    
    // 3. Install dependencies
    await installDependencies();
    
    // 4. Start Supabase (if requested)
    if (!noSupabase) {
      const hasSupabase = await commandExists('supabase');
      if (hasSupabase) {
        logStep('Starting local Supabase...');
        try {
          await execAsync('supabase start', {
            shell: process.platform === 'win32',
            cwd: repoRoot,
            stdio: 'inherit',
          });
        } catch (err) {
          log('Supabase start failed or already running (this is OK)', 'warn');
        }
      } else {
        log('Supabase CLI not found. Skipping local Supabase.', 'warn');
        log('Install: https://supabase.com/docs/guides/cli', 'info');
      }
    }
    
    // 5. Start dev servers
    logStep('Starting development servers...');
    
    if (webOnly) {
      log('Starting web app...', 'info');
      const webProcess = spawnBackground('pnpm', ['dev:web'], { cwd: repoRoot });
      log('Waiting for web server to start...', 'info');
      await sleep(3000);
      log('Opening browser at http://localhost:3000', 'success');
      openBrowser('http://localhost:3000');
      
      // Keep process running
      await new Promise((resolve, reject) => {
        webProcess.on('exit', (code, signal) => {
          if (signal) return reject(new Error(`Web app exited with signal ${signal}`));
          if (code !== 0) return reject(new Error(`Web app exited with code ${code}`));
          resolve();
        });
        webProcess.on('error', reject);
      });
    } else if (mobileOnly) {
      log('Starting mobile app...', 'info');
      await execAsync('pnpm dev', {
        shell: process.platform === 'win32',
        cwd: repoRoot,
        stdio: 'inherit',
      });
    } else {
      log('Starting web + mobile apps...', 'info');
      const allProcess = spawnBackground('pnpm', ['dev:all'], { cwd: repoRoot });
      log('Waiting for servers to start...', 'info');
      await sleep(3000);
      log('Opening browser at http://localhost:3000', 'success');
      openBrowser('http://localhost:3000');
      
      // Keep process running
      await new Promise((resolve, reject) => {
        allProcess.on('exit', (code, signal) => {
          if (signal) return reject(new Error(`Dev servers exited with signal ${signal}`));
          if (code !== 0) return reject(new Error(`Dev servers exited with code ${code}`));
          resolve();
        });
        allProcess.on('error', reject);
      });
    }
  } catch (err) {
    log(`Startup failed: ${err.message}`, 'error');
    if (!quiet) console.error(err);
    process.exit(1);
  }
}

main();

