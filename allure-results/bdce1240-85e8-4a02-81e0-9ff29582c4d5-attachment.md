# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/api-contract.spec.ts >> API Contract Tests >> should validate response schema for reports endpoint @regression @api
- Location: tests/api/api-contract.spec.ts:57:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { ConfigManager } from "../../src/utils/ConfigManager";
  3  | import { Logger } from "../../src/utils/Logger";
  4  | import { HealthCheckSchema, ReportsResponseSchema } from "../../src/utils/api-schemas";
  5  |
  6  | /**
  7  |  * API Contract Tests
  8  |  *
  9  |  * Validates API contracts including:
  10 |  * - Response status codes
  11 |  * - Response schema structure
  12 |  * - Response time thresholds
  13 |  * - Authentication behavior
  14 |  * - Error handling
  15 |  *
  16 |  * @author Yousuf Waqar
  17 |  */
  18 |
  19 | test.describe("API Contract Tests", () => {
  20 |   const config = ConfigManager.getInstance();
  21 |   const apiBaseUrl = config.getApiBaseUrl();
  22 |
  23 |   test("should return 200 for health check endpoint @smoke @api", async ({ request }) => {
  24 |     const logger = new Logger("API Health Check");
  25 |
  26 |     logger.step(1, "Send GET request to health check endpoint");
  27 |     const response = await request.get(`${apiBaseUrl}/health`);
  28 |
  29 |     logger.step(2, "Verify response status is 200");
  30 |     expect(response.status()).toBe(200);
  31 |
  32 |     logger.step(3, "Verify response body matches schema");
  33 |     const body = await response.json();
  34 |     const result = HealthCheckSchema.safeParse(body);
  35 |     expect(result.success).toBe(true);
  36 |     expect(body.status).toBe("healthy");
  37 |
  38 |     logger.info("Health check API test passed");
  39 |   });
  40 |
  41 |   test("should return 401 for unauthorized request @regression @api", async ({ request }) => {
  42 |     const logger = new Logger("API Unauthorized Access");
  43 |
  44 |     logger.step(1, "Send request without authentication");
  45 |     const response = await request.get(`${apiBaseUrl}/reports`, {
  46 |       headers: {
  47 |         Authorization: "Bearer invalid-token",
  48 |       },
  49 |     });
  50 |
  51 |     logger.step(2, "Verify response status is 401");
  52 |     expect(response.status()).toBe(401);
  53 |
  54 |     logger.info("Unauthorized access test passed");
  55 |   });
  56 |
  57 |   test("should validate response schema for reports endpoint @regression @api", async ({
  58 |     request,
  59 |   }) => {
  60 |     const logger = new Logger("API Schema Validation");
  61 |
  62 |     logger.step(1, "Send authenticated GET request to reports endpoint");
  63 |     const response = await request.get(`${apiBaseUrl}/reports`, {
  64 |       headers: {
  65 |         Authorization: `Bearer ${process.env.API_TOKEN || "test-token"}`,
  66 |       },
  67 |     });
  68 |
  69 |     logger.step(2, "Verify response status is 200");
  70 |     expect(response.status()).toBe(200);
  71 |
  72 |     logger.step(3, "Validate response body matches schema");
  73 |     const body = await response.json();
  74 |     const result = ReportsResponseSchema.safeParse(body);
> 75 |     expect(result.success).toBe(true);
     |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  76 |
  77 |     logger.info("Schema validation test passed");
  78 |   });
  79 |
  80 |   test("should respond within acceptable time threshold @regression @api", async ({ request }) => {
  81 |     const logger = new Logger("API Performance Check");
  82 |
  83 |     logger.step(1, "Send request and measure response time");
  84 |     const startTime = Date.now();
  85 |     const response = await request.get(`${apiBaseUrl}/health`);
  86 |     const responseTime = Date.now() - startTime;
  87 |
  88 |     logger.step(2, `Response time: ${responseTime}ms`);
  89 |     expect(response.status()).toBe(200);
  90 |
  91 |     logger.step(3, "Verify response time is within 2000ms threshold");
  92 |     expect(responseTime).toBeLessThan(2000);
  93 |
  94 |     logger.info(`Performance test passed. Response time: ${responseTime}ms`);
  95 |   });
  96 | });
  97 |
```
