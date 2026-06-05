import { test, expect } from "@playwright/test";
import { ConfigManager } from "../../src/utils/ConfigManager";
import { Logger } from "../../src/utils/Logger";

/**
 * API Contract Tests
 *
 * Validates API contracts including:
 * - Response status codes
 * - Response schema structure
 * - Response time thresholds
 * - Authentication behavior
 * - Error handling
 *
 * @author Yousuf Waqar
 */

test.describe("API Contract Tests", () => {
  const config = ConfigManager.getInstance();
  const apiBaseUrl = config.getApiBaseUrl();

  test("should return 200 for health check endpoint @smoke @api", async ({
    request,
  }) => {
    const logger = new Logger("API Health Check");

    logger.step(1, "Send GET request to health check endpoint");
    const response = await request.get(`${apiBaseUrl}/health`);

    logger.step(2, "Verify response status is 200");
    expect(response.status()).toBe(200);

    logger.step(3, "Verify response body contains expected fields");
    const body = await response.json();
    expect(body).toHaveProperty("status");
    expect(body.status).toBe("healthy");

    logger.info("Health check API test passed");
  });

  test("should return 401 for unauthorized request @regression @api", async ({
    request,
  }) => {
    const logger = new Logger("API Unauthorized Access");

    logger.step(1, "Send request with an arbitrary, non-issued token");
    const response = await request.get(`${apiBaseUrl}/reports`, {
      headers: {
        Authorization: "Bearer not-a-real-token",
      },
    });

    logger.step(2, "Verify response status is 401");
    expect(response.status()).toBe(401);

    logger.info("Unauthorized access test passed");
  });

  test("should validate response schema for reports endpoint @regression @api", async ({
    request,
  }) => {
    const logger = new Logger("API Schema Validation");

    logger.step(1, "Send authenticated GET request to reports endpoint");
    const response = await request.get(`${apiBaseUrl}/reports`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN || "mock-jwt-token-12345"}`,
      },
    });

    logger.step(2, "Verify response status is 200");
    expect(response.status()).toBe(200);

    logger.step(3, "Validate response schema structure");
    const body = await response.json();
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);

    if (body.data.length > 0) {
      const firstReport = body.data[0];
      expect(firstReport).toHaveProperty("id");
      expect(firstReport).toHaveProperty("name");
      expect(firstReport).toHaveProperty("createdAt");
      expect(firstReport).toHaveProperty("status");
    }

    logger.info("Schema validation test passed");
  });

  test("should respond within acceptable time threshold @regression @api", async ({
    request,
  }) => {
    const logger = new Logger("API Performance Check");

    logger.step(1, "Send request and measure response time");
    const startTime = Date.now();
    const response = await request.get(`${apiBaseUrl}/health`);
    const responseTime = Date.now() - startTime;

    logger.step(2, `Response time: ${responseTime}ms`);
    expect(response.status()).toBe(200);

    logger.step(3, "Verify response time is within 2000ms threshold");
    expect(responseTime).toBeLessThan(2000);

    logger.info(`Performance test passed. Response time: ${responseTime}ms`);
  });
});
