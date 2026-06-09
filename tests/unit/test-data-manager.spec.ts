import { test, expect } from "@playwright/test";
import { TestDataManager } from "../../src/utils/TestDataManager";

/**
 * Unit tests for TestDataManager. Validates that the singleton loads users.json
 * and returns fully populated records, and that generated emails are well-formed.
 *
 * @author Yousuf Waqar
 */

test.describe("TestDataManager @unit", () => {
  const data = TestDataManager.getInstance();

  test("is a singleton", () => {
    expect(TestDataManager.getInstance()).toBe(data);
  });

  test("returns a fully populated valid user", () => {
    const user = data.getValidUser();
    expect(user.username).toBeTruthy();
    expect(user.password).toBeTruthy();
    expect(user.role).toBeTruthy();
    expect(user.displayName).toBeTruthy();
  });

  test("exposes admin and read-only users", () => {
    expect(data.getAdminUser().username).toBeTruthy();
    expect(data.getReadOnlyUser().username).toBeTruthy();
  });

  test("exposes a distinct invalid user for negative testing", () => {
    const invalid = data.getInvalidUser();
    expect(invalid.username).toBeTruthy();
    expect(invalid.password).toBeTruthy();
    expect(invalid).not.toEqual(data.getValidUser());
  });

  test("generates well-formed random emails", () => {
    expect(TestDataManager.generateRandomEmail()).toMatch(
      /^testuser_\d+@testdomain\.com$/
    );
  });
});
