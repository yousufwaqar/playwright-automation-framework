// Reads coverage/coverage-summary.json (produced by c8's json-summary reporter)
// and prints a compact Markdown table for the GitHub Actions job summary.
// No-op when the summary file is absent so the step never fails the job.

const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "coverage", "coverage-summary.json");
if (!fs.existsSync(file)) {
  process.exit(0);
}

const total = JSON.parse(fs.readFileSync(file, "utf-8")).total;
const row = (key) => `${total[key].pct}% (${total[key].covered}/${total[key].total})`;

const lines = [
  "### Unit coverage — framework utility layer (`src/utils`)",
  "",
  "| Metric | Coverage |",
  "| --- | --- |",
  `| Statements | ${row("statements")} |`,
  `| Branches | ${row("branches")} |`,
  `| Functions | ${row("functions")} |`,
  `| Lines | ${row("lines")} |`,
  "",
];

process.stdout.write(lines.join("\n") + "\n");
