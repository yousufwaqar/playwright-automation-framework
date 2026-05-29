import * as fs from "fs";
import * as path from "path";
import { Logger } from "./Logger";

/**
 * TestDataManager - Centralized test data management
 *
 * Loads and provides test data from JSON files,
 * supporting data-driven testing patterns.
 * Includes type validation and clear error messages for missing data.
 *
 * @author Yousuf Waqar
 */

interface UserData {
  username: string;
  password: string;
  role: string;
  displayName: string;
}

interface UsersData {
  validUser: UserData;
  invalidUser: UserData;
  adminUser: UserData;
  readOnlyUser: UserData;
}

/**
 * Type guard to validate UserData structure
 */
function isValidUserData(data: unknown): data is UserData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const user = data as Record<string, unknown>;

  const requiredFields = ["username", "password", "role", "displayName"];
  for (const field of requiredFields) {
    if (typeof user[field] !== "string" || user[field] === "") {
      return false;
    }
  }

  return true;
}

/**
 * Type guard to validate UsersData structure
 */
function isValidUsersData(data: unknown): data is UsersData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const users = data as Record<string, unknown>;
  const requiredUsers = ["validUser", "invalidUser", "adminUser", "readOnlyUser"];

  for (const userKey of requiredUsers) {
    if (!isValidUserData(users[userKey])) {
      return false;
    }
  }

  return true;
}

export class TestDataManager {
  private static instance: TestDataManager;
  private usersData: UsersData;
  private logger: Logger;

  private constructor() {
    this.logger = new Logger("TestDataManager");

    try {
      const usersPath = path.resolve(__dirname, "../../tests/test-data/users.json");
      const rawData = fs.readFileSync(usersPath, "utf-8");
      const parsedData = JSON.parse(rawData);

      if (!isValidUsersData(parsedData)) {
        const errorMsg = this.generateValidationError(parsedData);
        this.logger.error(
          `❌ Invalid users.json structure: ${errorMsg}\n` +
            `Expected structure:\n` +
            `{\n` +
            `  "validUser": { "username", "password", "role", "displayName" },\n` +
            `  "invalidUser": { "username", "password", "role", "displayName" },\n` +
            `  "adminUser": { "username", "password", "role", "displayName" },\n` +
            `  "readOnlyUser": { "username", "password", "role", "displayName" }\n` +
            `}`
        );
        throw new Error(errorMsg);
      }

      this.usersData = parsedData;
      this.logger.info("✅ users.json loaded successfully with all required fields");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to initialize TestDataManager: ${message}`);
      throw error;
    }
  }

  /**
   * Generate detailed validation error message
   */
  private generateValidationError(data: unknown): string {
    if (typeof data !== "object" || data === null) {
      return "Data is not an object";
    }

    const users = data as Record<string, unknown>;
    const requiredUsers = ["validUser", "invalidUser", "adminUser", "readOnlyUser"];

    for (const userKey of requiredUsers) {
      if (!(userKey in users)) {
        return `Missing required key: "${userKey}"`;
      }

      const user = users[userKey];
      if (typeof user !== "object" || user === null) {
        return `"${userKey}" is not an object`;
      }

      const userObj = user as Record<string, unknown>;
      const requiredFields = ["username", "password", "role", "displayName"];

      for (const field of requiredFields) {
        if (!(field in userObj)) {
          return `Missing field "${field}" in "${userKey}"`;
        }

        if (typeof userObj[field] !== "string" || userObj[field] === "") {
          return `Field "${field}" in "${userKey}" must be a non-empty string`;
        }
      }
    }

    return "Unknown validation error";
  }

  /**
   * Get singleton instance
   */
  static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  /**
   * Get valid user credentials
   */
  getValidUser(): UserData {
    return this.usersData.validUser;
  }

  /**
   * Get invalid user credentials (for negative testing)
   */
  getInvalidUser(): UserData {
    return this.usersData.invalidUser;
  }

  /**
   * Get admin user credentials
   */
  getAdminUser(): UserData {
    return this.usersData.adminUser;
  }

  /**
   * Get read-only user credentials
   */
  getReadOnlyUser(): UserData {
    return this.usersData.readOnlyUser;
  }

  /**
   * Get a random valid email for testing
   */
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    return `testuser_${timestamp}@testdomain.com`;
  }
}
