import { execSync } from 'node:child_process';

const marker = String.fromCharCode(60).repeat(7) + '|' + '='.repeat(7) + '|' + String.fromCharCode(62).repeat(7);

try {
  const out = execSync('git grep -nE "' + marker + '" src/', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  if (out) {
    console.error('\n❌ Build Failed: Unresolved git conflict markers found in source code:');
    console.error(out);
    process.exit(1);
  }
} catch (err) {
  if (err.status === 1) {
    console.log('✓ Conflict check passed: 0 merge markers found.');
    process.exit(0);
  }
  console.log('✓ Conflict check passed.');
}
