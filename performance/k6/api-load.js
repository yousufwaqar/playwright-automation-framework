import http from "k6/http";
import { check, sleep } from "k6";

/**
 * k6 API load test (open source, AGPL-3.0).
 *
 * Demonstrative load test against the mock app's health endpoint. This is NOT a
 * real capacity test — it shows ramping virtual users, latency/error
 * thresholds, and a pass/fail gate that integrates with CI as a separate,
 * non-blocking job.
 *
 * Run locally:  k6 run performance/k6/api-load.js
 * Override URL: k6 run -e BASE_URL=http://localhost:3000 performance/k6/api-load.js
 */

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "10s", target: 10 }, // ramp up to 10 virtual users
    { duration: "20s", target: 10 }, // hold
    { duration: "5s", target: 0 }, // ramp down
  ],
  thresholds: {
    // 95% of requests must complete under 500ms.
    http_req_duration: ["p(95)<500"],
    // Less than 1% of requests may fail.
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/v1/health`);
  check(res, {
    "status is 200": (r) => r.status === 200,
    "body reports healthy": (r) => r.json("status") === "healthy",
  });
  sleep(1);
}
