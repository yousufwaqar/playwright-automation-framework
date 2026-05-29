import { test, expect } from "@playwright/test";
import { ConfigManager } from "../../src/utils/ConfigManager";
import { Logger } from "../../src/utils/Logger";
import { HealthCheckSchema, ReportsResponseSchema } from "../../src/utils/api-schemas";

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

  test("should return 200 for health check endpoint @smoke @api", async ({ request }) => {
    const logger = new Logger("API Health Check");

    logger.step(1, "Send GET request to health check endpoint");
    const response = await request.get(`${apiBaseUrl}/health`);

    logger.step(2, "Verify response status is 200");
    expect(response.status()).toBe(200);

    logger.step(3, "Verify response body matches schema");
    const body = await response.json();
    const result = HealthCheckSchema.safeParse(body);
    expect(result.success).toBe(true);
    expect(body.status).toBe("healthy");

    logger.info("Health check API test passed");
  });

  test("should return 401 for unauthorized request @regression @api", async ({ request }) => {
    const logger = new Logger("API Unauthorized Access");

    logger.step(1, "Send request without authentication");
    const response = await request.get(`${apiBaseUrl}/reports`, {
      headers: {
        Authorization: "Bearer invalid-token",
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
        Authorization: `Bearer ${process.env.API_TOKEN || "test-token"}`,
      },
    });

    logger.step(2, "Verify response status is 200");
    expect(response.status()).toBe(200);

    logger.step(3, "Validate response body matches schema");
    const body = await response.json();
    const result = ReportsResponseSchema.safeParse(body);
    expect(result.success).toBe(true);

    logger.info("Schema validation test passed");
  });

  test("should respond within acceptable time threshold @regression @api", async ({ request }) => {
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
