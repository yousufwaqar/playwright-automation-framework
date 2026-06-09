import { test, expect } from "@playwright/test";
import { Logger } from "../../src/utils/Logger";

/**
 * Unit tests for Logger: verifies the formatted output, that each level routes
 * to the correct console stream, and that a sub-threshold level (DEBUG at the
 * default INFO threshold) is suppressed. Pure logic, no browser.
 *
 * @author Yousuf Waqar
 */

type ConsoleCapture = { logs: string[]; errors: string[]; restore: () => void };

function captureConsole(): ConsoleCapture {
  const logs: string[] = [];
  const errors: string[] = [];
  const origLog = console.log;
  const origError = console.error;
  console.log = (...args: unknown[]) => {
    logs.push(String(args[0]));
  };
  console.error = (...args: unknown[]) => {
    errors.push(String(args[0]));
  };
  return {
    logs,
    errors,
    restore: () => {
      console.log = origLog;
      console.error = origError;
    },
  };
}

test.describe("Logger @unit", () => {
  test("info() writes a timestamped line to stdout with level and test name", () => {
    const cap = captureConsole();
    try {
      new Logger("MyTest").info("hello world");
    } finally {
      cap.restore();
    }
    expect(cap.errors).toHaveLength(0);
    expect(cap.logs).toHaveLength(1);
    expect(cap.logs[0]).toContain("[INFO]");
    expect(cap.logs[0]).toContain("[MyTest]");
    expect(cap.logs[0]).toContain("hello world");
    expect(cap.logs[0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T[\d:.]+Z\]/);
  });

  test("warn() and error() route to stderr with the right level tags", () => {
    const cap = captureConsole();
    try {
      const log = new Logger("Svc");
      log.warn("careful");
      log.error("boom");
    } finally {
      cap.restore();
    }
    expect(cap.logs).toHaveLength(0);
    expect(cap.errors).toHaveLength(2);
    expect(cap.errors[0]).toContain("[WARN]");
    expect(cap.errors[0]).toContain("careful");
    expect(cap.errors[1]).toContain("[ERROR]");
    expect(cap.errors[1]).toContain("boom");
  });

  test("step() emits an INFO-severity step trace to stdout", () => {
    const cap = captureConsole();
    try {
      new Logger("Flow").step(3, "do the thing");
    } finally {
      cap.restore();
    }
    expect(cap.errors).toHaveLength(0);
    expect(cap.logs).toHaveLength(1);
    expect(cap.logs[0]).toContain("[STEP]");
    expect(cap.logs[0]).toContain("Step 3: do the thing");
  });

  test("debug() is suppressed at the default INFO threshold", () => {
    const cap = captureConsole();
    try {
      new Logger("Quiet").debug("noise");
    } finally {
      cap.restore();
    }
    expect(cap.logs).toHaveLength(0);
    expect(cap.errors).toHaveLength(0);
  });
});
