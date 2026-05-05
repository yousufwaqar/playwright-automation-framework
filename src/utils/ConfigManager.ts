import * as fs from "fs";
import * as path from "path";

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

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  getEnvironment(): EnvironmentConfig {
    const env = this.config.environments[this.currentEnv];
    if (env) {
      return env;
    }
    const defaultEnv = this.config.environments[this.config.defaultEnvironment];
    if (defaultEnv) {
      return defaultEnv;
    }
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

  getBaseUrl(): string {
    return process.env.BASE_URL || this.getEnvironment().baseUrl;
  }

  getApiBaseUrl(): string {
    return process.env.API_BASE_URL || this.getEnvironment().apiBaseUrl;
  }

  getTimeout(): number {
    return this.getEnvironment().timeout;
  }

  getActionTimeout(): number {
    return this.getEnvironment().actionTimeout;
  }

  getNavigationTimeout(): number {
    return this.getEnvironment().navigationTimeout;
  }

  getExpectTimeout(): number {
    return this.getEnvironment().expectTimeout;
  }

  getEnvironmentName(): string {
    return this.currentEnv;
  }
}