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

export class Logger {
  private testName: string;

  constructor(testName: string) {
    this.testName = testName;
  }

  private log(level: LogLevel, message: string): void {
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
