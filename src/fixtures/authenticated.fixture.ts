import { request as apiRequest } from "@playwright/test";
import { test as base } from "./base.fixture";
import { TestDataManager } from "../utils/TestDataManager";

/**
 * Authenticated test fixture.
 *
 * Logs in ONCE per worker against the mock `/api/login` endpoint, then seeds the
 * returned session token into every test's `storageState`
 * (`localStorage.authToken`). Tests that exercise a protected page therefore
 * start already authenticated, without driving the login UI in each test. The
 * mock `/dashboard` client guard reads this same token.
 *
 * Import this instead of `base.fixture` only in specs whose tests all need an
 * authenticated session (e.g. dashboard tests). Login-flow specs must keep using
 * `base.fixture` so they start logged out.
 *
 * @author Yousuf Waqar
 */

const APP_URL = process.env.BASE_URL || "http://localhost:3000";

type AuthWorkerFixtures = {
  workerAuthToken: string;
};

export const test = base.extend<object, AuthWorkerFixtures>({
  workerAuthToken: [
    async ({}, use) => {
      const user = TestDataManager.getInstance().getValidUser();
      const ctx = await apiRequest.newContext({ baseURL: APP_URL });
      const res = await ctx.post("/api/login", {
        data: { email: user.username, password: user.password },
      });
      const status = res.status();
      const body = status === 200 ? await res.json() : {};
      await ctx.dispose();

      if (status !== 200 || !body.token) {
        throw new Error(
          `Worker authentication failed: POST /api/login returned ${status}` +
            (body.message ? ` (${body.message})` : "")
        );
      }
      await use(body.token as string);
    },
    { scope: "worker" },
  ],

  storageState: async ({ workerAuthToken, baseURL }, use) => {
    const origin = new URL(baseURL || APP_URL).origin;
    await use({
      cookies: [],
      origins: [
        {
          origin,
          localStorage: [{ name: "authToken", value: workerAuthToken }],
        },
      ],
    });
  },
});

export { expect } from "@playwright/test";
