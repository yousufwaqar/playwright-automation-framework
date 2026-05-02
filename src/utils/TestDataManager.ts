import * as fs from "fs";
import * as path from "path";

/**
 * TestDataManager - Centralized test data management
 *
 * Loads and provides test data from JSON files,
 * supporting data-driven testing patterns.
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

export class TestDataManager {
  private static instance: TestDataManager;
  private usersData: UsersData;

  private constructor() {
<<<<<<< HEAD
    const usersPath = path.resolve(__dirname, "../../tests/test-data/users.json");
=======
    const usersPath = path.resolve(__dirname, "../../test-data/users.json");
>>>>>>> e78c24ec695b43146e56984be943791800ec77d2
    const rawData = fs.readFileSync(usersPath, "utf-8");
    this.usersData = JSON.parse(rawData);
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
