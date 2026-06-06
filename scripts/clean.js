/**
 * Cross-platform clean script.
 *
 * Removes generated test artifacts. Uses Node's built-in fs.rmSync so it works
 * identically on Windows, macOS and Linux without depending on `rm -rf` (which
 * is unavailable on Windows) or any third-party package.
 *
 * @author Yousuf Waqar
 */

const fs = require("fs");

const targets = ["test-results", "playwright-report"];

for (const dir of targets) {
  fs.rmSync(dir, { recursive: true, force: true });
}

console.log(`Cleaned: ${targets.join(", ")}`);
