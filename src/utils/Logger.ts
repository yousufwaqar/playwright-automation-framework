/**
 * Logger - Custom logging utility for test execution
 *
 * Provides structured logging with timestamps and log levels
 * for debugging and traceability.
 *
 * @author Yousuf Waqar
 */

enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
  STEP = "STEP",
}

// Numeric severity per level. STEP is informational and shares INFO's severity
// so step traces print at the default verbosity.
const LEVEL_SEVERITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 10,
  [LogLevel.STEP]: 20,
  [LogLevel.INFO]: 20,
  [LogLevel.WARN]: 30,
  [LogLevel.ERROR]: 40,
};

/**
 * Resolve the minimum severity to emit from process.env.LOG_LEVEL. Unknown or
 * unset values fall back to INFO so a typo never silences logging entirely.
 */
function resolveThreshold(): number {
  const raw = (process.env.LOG_LEVEL || "INFO").toUpperCase();
  return LEVEL_SEVERITY[raw as LogLevel] ?? LEVEL_SEVERITY[LogLevel.INFO];
}

const THRESHOLD = resolveThreshold();

export class Logger {
  private testName: string;

  constructor(testName: string) {
    this.testName = testName;
  }

  private log(level: LogLevel, message: string): void {
    if (LEVEL_SEVERITY[level] < THRESHOLD) {
      return;
    }
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] [${this.testName}] ${message}`;
    if (level === LogLevel.ERROR || level === LogLevel.WARN) {
      console.error(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }

  info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }

  debug(message: string): void {
    this.log(LogLevel.DEBUG, message);
  }

  step(stepNumber: number, description: string): void {
    this.log(LogLevel.STEP, `Step ${stepNumber}: ${description}`);
  }
}
