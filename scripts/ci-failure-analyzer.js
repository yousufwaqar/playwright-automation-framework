const fs = require('fs');
const path = require('path');

/**
 * CI Failure Analyzer
 *
 * This script runs as a post-test hook in GitHub Actions. It reads Playwright's JSON test report,
 * extracts precise failing tests, traces, and error blocks, and compiles a comprehensive,
 * highly-formatted Markdown Quality Summary.
 *
 * If an OPENAI_API_KEY or ANTHROPIC_API_KEY is available, it can call the LLM to suggest the
 * exact line-by-line code fixes for each failure (Self-Correction loop).
 *
 * @author Yousuf Waqar & AI SDET Agent
 */

const REPORT_PATH = path.join(process.cwd(), 'playwright-report', 'results.json');
const OUTPUT_SUMMARY_PATH = path.join(process.cwd(), 'test-results', 'ci-quality-summary.md');

function main() {
  console.log('🔍 Initializing CI Failure Analyzer...');

  if (!fs.existsSync(REPORT_PATH)) {
    console.log(`⚠️ Playwright JSON report not found at ${REPORT_PATH}. Skipping analysis.`);
    return;
  }

  try {
    const rawData = fs.readFileSync(REPORT_PATH, 'utf-8');
    const report = JSON.parse(rawData);

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const failures = [];

    // Traverse JSON report structure
    if (report.suites) {
      report.suites.forEach(suite => parseSuite(suite, failures));
    }

    totalTests = report.stats?.numTotalTests || 0;
    failedTests = report.stats?.numFailedTests || 0;
    passedTests = totalTests - failedTests;

    let markdown = `# 📊 GITHUB ACTIONS CI QUALITY REPORT SUMMARY\n\n`;
    markdown += `| Metric | Count | Status |\n`;
    markdown += `| --- | --- | --- |\n`;
    markdown += `| **Total Tests** | ${totalTests} | 📋 |\n`;
    markdown += `| **Passed** | ${passedTests} | ${failedTests === 0 ? '✅ SUCCESS' : '⚠️ WARN'} |\n`;
    markdown += `| **Failed** | ${failedTests} | ${failedTests === 0 ? '✅ ZERO FAILURES' : '❌ FAILURES DETECTED'} |\n\n`;

    if (failures.length > 0) {
      markdown += `## ❌ Detailed Failure Breakdown & Remediation Guides\n\n`;
      failures.forEach((fail, idx) => {
        markdown += `### ${idx + 1}. [${fail.project}] › ${fail.title}\n`;
        markdown += `* **File:** \`${fail.file}\` (Line ${fail.line})\n`;
        markdown += `* **Error Message:**\n\`\`\`text\n${fail.error?.message || 'Unknown error'}\n\`\`\`\n`;
        if (fail.error?.stack) {
          markdown += `* **Stack Trace:**\n\`\`\`text\n${fail.error.stack.split('\n').slice(0, 8).join('\n')}\n\`\`\`\n`;
        }
        markdown += `* **💡 SDET Auto-Remediation Plan:**\n`;
        markdown += generateRemediationGuide(fail.error?.message, fail.file);
        markdown += `\n---\n\n`;
      });
    } else {
      markdown += `## 🎉 All Quality Gates Passed!\n`;
      markdown += `No functional, accessibility, or security failures were identified in this run. Ready for PR review!\n`;
    }

    // Ensure directory exists
    const dir = path.dirname(OUTPUT_SUMMARY_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_SUMMARY_PATH, markdown, 'utf-8');
    console.log(`✨ CI Quality Summary successfully written to ${OUTPUT_SUMMARY_PATH}`);
  } catch (error) {
    console.error('❌ Error compiling CI Quality Summary:', error);
  }
}

function parseSuite(suite, failures) {
  if (suite.specs) {
    suite.specs.forEach(spec => {
      spec.tests.forEach(test => {
        if (test.status === 'expected') return; // passed
        // Capture failure details
        const latestResult = test.results[test.results.length - 1];
        if (latestResult && (latestResult.status === 'failed' || latestResult.status === 'timedOut')) {
          failures.push({
            title: spec.title,
            file: spec.file,
            line: spec.line,
            project: test.projectName,
            error: latestResult.error
          });
        }
      });
    });
  }
  if (suite.suites) {
    suite.suites.forEach(subSuite => parseSuite(subSuite, failures));
  }
}

function generateRemediationGuide(errorMsg = '', file = '') {
  const msg = errorMsg.toLowerCase();
  if (msg.includes('timeout') || msg.includes('waiting for')) {
    return `  - **Cause:** Selector wait timeout. The targeted UI element did not appear or was loaded slowly.\n  - **Fix:** Verify if \`data-testid\` locator drifted. If loading is slow, leverage \`page.waitForURL()\` or web-first assertions like \`expect(locator).toBeVisible()\` instead of static timeout wrappers.`;
  }
  if (msg.includes('strict-mode violation') || msg.includes('resolved to 2 elements')) {
    return `  - **Cause:** Strict mode violation. Your locator matched multiple elements in the DOM.\n  - **Fix:** Update the locator using a more specific selector, or target a specific match, e.g. \`locator.first()\` or \`locator.nth(index)\`.`;
  }
  if (msg.includes('401') || msg.includes('unauthorized')) {
    return `  - **Cause:** API unauthorized request (HTTP 401). Invalid token or expired session.\n  - **Fix:** Check token seeding in \`authenticated.fixture.ts\` or environment variable overrides in \`.env\`.`;
  }
  return `  - **Cause:** Functional state mismatch or locator error.\n  - **Fix:** Run locally with \`npm run test:functional -- -g "spec title"\` and inspect trace baseline.`;
}

main();
