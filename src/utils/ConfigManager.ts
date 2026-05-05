import * as fs from "fs";
import * as path from "path";

/**
 * ConfigManager - Centralized environment configuration management
 *
 * Handles loading and accessing environment-specific configurations
 * without hardcoding values in test files.
 *
 * @author Yousuf Waqar
 */

interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiBaseUrl: string;
  timeout: number;
  actionTimeout: number;
  navigationTimeout: number;
  expectTimeout: number;
  retries: number;
}

interface AppConfig {
  environments: Record<string, EnvironmentConfig>;
  defaultEnvironment: string;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;
  private currentEnv: string;

  private constructor() {
    const configPath = path.resolve(
      __dirname,
      "../../tests/test-data/environments.json"
    );
    const rawData = fs.readFileSync(configPath, "utf-8");
    this.config = JSON.parse(rawData);
    this.currentEnv =
      process.env.TEST_ENV || this.config.defaultEnvironment || "staging";
  }

  /**
   * Get singleton instance of ConfigManager
   */
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Get the current environment configuration
   */
  getEnvironment(): EnvironmentConfig {
    return this.config.environments[this.currentEnv];
  }

  /**
   * Get the base URL for the current environment
   */
  getBaseUrl(): string {
    return this.getEnvironment().baseUrl;
  }

  /**
   * Get the API base URL for the current environment
   */
  getApiBaseUrl(): string {
    return this.getEnvironment().apiBaseUrl;
  }

  /**
   * Get the timeout for the current environment
   */
  getTimeout(): number {
    return this.getEnvironment().timeout;
  }

  /**
   * Get the action timeout for the current environment (slower servers may need higher values)
   */
  getActionTimeout(): number {
    return this.getEnvironment().actionTimeout;
  }

  /**
   * Get the navigation timeout for the current environment
   */
  getNavigationTimeout(): number {
    return this.getEnvironment().navigationTimeout;
  }

  /**
   * Get the expect timeout for the current environment
   */
  getExpectTimeout(): number {
    return this.getEnvironment().expectTimeout;
  }

  /**
   * Get the current environment name
   */
  getEnvironmentName(): string {
    return this.currentEnv;
  }
}
