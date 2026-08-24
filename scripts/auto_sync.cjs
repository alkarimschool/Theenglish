const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const DEBOUNCE_MS = 5000;

// Folders/files to ignore from triggering sync
const IGNORED_PATHS = [
  '.git',
  'node_modules',
  'dist',
  '.aistudio',
  '.vscode',
  '.idea',
  'bun.lock',
  'package-lock.json'
];

let syncTimer = null;
let pendingFiles = new Set();
let isSyncing = false;

function shouldIgnore(relativePath) {
  if (!relativePath) return true;
  const parts = relativePath.split(/[/\\]/);
  return parts.some(part => IGNORED_PATHS.includes(part));
}

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: rootDir }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function performSync() {
  if (isSyncing) {
    console.log('[Auto-Sync] Sync already in progress, queuing next check...');
    scheduleSync();
    return;
  }

  isSyncing = true;
  const filesToSync = Array.from(pendingFiles);
  pendingFiles.clear();

  try {
    const { stdout: status } = await runCommand('git status --porcelain');
    if (!status.trim()) {
      console.log('[Auto-Sync] No changes detected in Git working tree.');
      isSyncing = false;
      return;
    }

    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    console.log(`\n[Auto-Sync] [${timestamp}] Detected changes in ${filesToSync.length} file(s). Syncing to GitHub...`);

    console.log('[Auto-Sync] Running git add .');
    await runCommand('git add .');

    const commitMsg = `auto-sync: update from local edit [${timestamp}]`;
    console.log(`[Auto-Sync] Committing: "${commitMsg}"`);
    await runCommand(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);

    console.log('[Auto-Sync] Pushing to origin main...');
    await runCommand('git push origin main');

    console.log(`[Auto-Sync] ✅ Successfully pushed to GitHub & AI Studio at ${timestamp}!\n`);
  } catch (err) {
    console.error('[Auto-Sync] ❌ Sync error:', err.stderr || err.error || err);
  } finally {
    isSyncing = false;
  }
}

function scheduleSync() {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    performSync();
  }, DEBOUNCE_MS);
}

console.log('====================================================');
console.log('🚀 Auto-Sync Watcher is Active');
console.log(`📁 Watching: ${rootDir}`);
console.log(`⏱️  Debounce interval: ${DEBOUNCE_MS / 1000} seconds`);
console.log('====================================================\n');

try {
  fs.watch(rootDir, { recursive: true }, (eventType, filename) => {
    if (!filename || shouldIgnore(filename)) return;

    pendingFiles.add(filename);
    console.log(`[File Modified] ${filename} (${eventType}) -> Sync scheduled in ${DEBOUNCE_MS / 1000}s`);
    scheduleSync();
  });
} catch (err) {
  console.error('[Auto-Sync] Error starting fs.watch:', err);
}
