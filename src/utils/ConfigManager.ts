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
   * Falls back to default environment, then to hardcoded safe values
   */
  getEnvironment(): EnvironmentConfig {
    // Try current environment
    const env = this.config.environments[this.currentEnv];
    if (env) {
      return env;
    }

    // Try default environment
    const defaultEnv =
      this.config.environments[this.config.defaultEnvironment];
    if (defaultEnv) {
      console.warn(
        `[ConfigManager] Environment "${this.currentEnv}" not found. ` +
          `Falling back to default: "${this.config.defaultEnvironment}"`
      );
      return defaultEnv;
    }

    // Final hardcoded fallback
    console.warn(
      `[ConfigManager] No valid environment found. Using hardcoded fallback.`
    );
    return {
      name: "fallback",
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000/api/v1",
      timeout: 30000,
      actionTimeout: 10000,
      navigationTimeout: 30000,
      expectTimeout: 10000,
      retries: 1,
    };
  }

  