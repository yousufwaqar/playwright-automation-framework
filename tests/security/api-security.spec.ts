import { test, expect } from "@playwright/test";
import { ConfigManager } from "../../src/utils/ConfigManager";
import { Logger } from "../../src/utils/Logger";

/**
 * API & HTTP Security Tests
 *
 * Verifies the security controls enforced by the application:
 *  - Authentication/authorization on protected endpoints
 *  - Baseline browser-hardening response headers
 *  - A non-wildcard CORS policy
 *  - Safe handling of malformed input (no 5xx, no internal leakage)
 *  - No technology-fingerprinting headers
 *
 * These assert ENFORCED controls (the mock app is hardened to back them), not a
 * documentation of insecure behaviour. HSTS is intentionally not required since
 * the app runs over plain HTTP on localhost.
 *
 * @author Yousuf Waqar
 */

test.describe("API & HTTP Security @security", () => {
  const config = ConfigManager.getInstance();
  const apiBaseUrl = config.getApiBaseUrl();

  test("protected reports endpoint rejects missing token @security @smoke", async ({
    request,
  }) => {
    const logger = new Logger("Security: missing token");
    logger.step(1, "Request reports with no Authorization header");
    const response = await request.get(`${apiBaseUrl}/reports`);

    logger.step(2, "Expect 401 Unauthorized");
    expect(response.status()).toBe(401);
    logger.info("Missing-token rejection verified");
  });

  test("protected reports endpoint rejects invalid token @security @regression", async ({
    request,
  }) => {
    const logger = new Logger("Security: invalid token");
    const response = await request.get(`${apiBaseUrl}/reports`, {
      headers: { Authorization: "Bearer invalid-token" },
    });
    expect(response.status()).toBe(401);
    logger.info("Invalid-token rejection verified");
  });

  test("protected reports endpoint accepts a valid token @security @regression", async ({
    request,
  }) => {
    const logger = new Logger("Security: valid token");
    const response = await request.get(`${apiBaseUrl}/reports`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN || "mock-jwt-token-12345"}`,
      },
    });
    expect(response.status()).toBe(200);
    logger.info("Valid-token access verified");
  });

  test("HTML responses set baseline browser-hardening headers @security @regression", async ({
    request,
  }) => {
    const logger = new Logger("Security: response headers");
    logger.step(1, "Fetch the login page");
    const response = await request.get("/");
    const headers = response.headers();

    logger.step(2, "Assert core security headers are present and strict");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("no-referrer");
    expect(headers["permissions-policy"]).toBeTruthy();

    logger.step(3, "Assert a strict Content-Security-Policy with no inline scripts");
    const csp = headers["content-security-policy"] || "";
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    // script-src must not allow inline scripts
    const scriptSrc = csp
      .split(";")
      .map((d) => d.trim())
      .find((d) => d.startsWith("script-src"));
    expect(scriptSrc).toBeDefined();
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'unsafe-eval'");

    logger.info("Security headers verified");
  });

  test("CORS policy is not a wildcard @security @regression", async ({
    request,
  }) => {
    const logger = new Logger("Security: CORS");
    const response = await request.get("/api/v1/health");
    const acao = response.headers()["access-control-allow-origin"];
    expect(acao).toBeTruthy();
    expect(acao).not.toBe("*");
    logger.info(`CORS origin restricted to: ${acao}`);
  });

  test("malformed JSON is rejected with 400 and no internal leakage @security @regression", async ({
    request,
  }) => {
    const logger = new Logger("Security: malformed input");
    logger.step(1, "POST broken JSON to the login endpoint");
    const response = await request.post("/api/login", {
      headers: { "Content-Type": "application/json" },
      data: Buffer.from('{"email": "x", ', "utf-8"), // intentionally malformed
    });

    logger.step(2, "Expect a 4xx (not a 5xx crash)");
    expect(response.status()).toBe(400);

    logger.step(3, "Assert the error body leaks no stack trace / internals");
    const text = await response.text();
    expect(text.toLowerCase()).not.toContain("stack");
    expect(text).not.toContain("at Object.");
    expect(text).not.toMatch(/[A-Za-z]:\\|\/home\/|\/usr\//); // no file paths
    logger.info("Malformed input handled safely");
  });

  test("does not expose technology-fingerprinting headers @security @regression", async ({
    request,
  }) => {
    const logger = new Logger("Security: fingerprinting");
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["x-powered-by"]).toBeUndefined();
    expect(headers["server"]).toBeFalsy();
    logger.info("No fingerprinting headers exposed");
  });

  test("unsupported method on an endpoint is handled without a 5xx @security @regression", async ({
    request,
  }) => {
    const logger = new Logger("Security: method handling");
    // /api/login only accepts POST; a GET must be safely rejected.
    const response = await request.get("/api/login");
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
    logger.info(`Unsupported method safely rejected (${response.status()})`);
  });
});
