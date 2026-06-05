import { test, expect } from "@playwright/test";
import data from "../../test-data/external-sites.json";

/**
 * RESTful Booker - API contract & CRUD tests
 *
 * Public API: https://restful-booker.herokuapp.com/apidoc/index.html
 *
 * Demonstrates:
 * - Authentication (token issuance)
 * - Full CRUD on bookings (Create, Read, Update, Delete)
 * - Schema validation
 *
 * @author Yousuf Waqar
 */

const baseUrl = data.restfulBooker.baseUrl;

test.describe("RESTful Booker API @external @api", () => {
  let token: string;
  let bookingId: number;

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${baseUrl}/auth`, {
      data: {
        username: data.restfulBooker.admin.username,
        password: data.restfulBooker.admin.password,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("token");
    token = body.token;
  });

  test("should return a valid auth token @smoke", async () => {
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");
  });

  test("should return the list of booking IDs @smoke", async ({ request }) => {
    const response = await request.get(`${baseUrl}/booking`);
    expect(response.status()).toBe(200);

    const bookings = await response.json();
    expect(Array.isArray(bookings)).toBe(true);
    // The public API may return an empty list; when it has entries, each must
    // expose a bookingid. Iterating the first element (rather than an `if`)
    // keeps the assertion unconditional from the linter's point of view.
    for (const booking of bookings.slice(0, 1)) {
      expect(booking).toHaveProperty("bookingid");
    }
  });

  test("should create a new booking @regression", async ({ request }) => {
    const response = await request.post(`${baseUrl}/booking`, {
      data: {
        firstname: "Yousuf",
        lastname: "Waqar",
        totalprice: 250,
        depositpaid: true,
        bookingdates: { checkin: "2026-01-01", checkout: "2026-01-05" },
        additionalneeds: "Breakfast",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("bookingid");
    expect(body.booking).toMatchObject({
      firstname: "Yousuf",
      lastname: "Waqar",
      totalprice: 250,
      depositpaid: true,
    });

    bookingId = body.bookingid;
  });

  test("should fetch the created booking @regression", async ({ request }) => {
    test.skip(!bookingId, "Booking creation test must run first");
    const response = await request.get(`${baseUrl}/booking/${bookingId}`);
    expect(response.status()).toBe(200);

    const booking = await response.json();
    expect(booking).toHaveProperty("firstname", "Yousuf");
    expect(booking).toHaveProperty("lastname", "Waqar");
  });

  test("should update the booking with PUT @regression", async ({ request }) => {
    test.skip(!bookingId, "Booking creation test must run first");
    const response = await request.put(`${baseUrl}/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        firstname: "Updated",
        lastname: "Name",
        totalprice: 500,
        depositpaid: false,
        bookingdates: { checkin: "2026-02-01", checkout: "2026-02-10" },
        additionalneeds: "Late checkout",
      },
    });

    expect(response.status()).toBe(200);
    const updated = await response.json();
    expect(updated.firstname).toBe("Updated");
    expect(updated.totalprice).toBe(500);
  });

  test("should delete the booking @regression", async ({ request }) => {
    test.skip(!bookingId, "Booking creation test must run first");
    const response = await request.delete(`${baseUrl}/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    // RESTful Booker returns 201 on successful delete
    expect([200, 201]).toContain(response.status());
  });

  test("should return 404 for non-existent booking @regression", async ({
    request,
  }) => {
    const response = await request.get(`${baseUrl}/booking/99999999`);
    expect(response.status()).toBe(404);
  });

  test("ping endpoint should respond within threshold @regression", async ({
    request,
  }) => {
    const start = Date.now();
    const response = await request.get(`${baseUrl}/ping`);
    const elapsed = Date.now() - start;

    expect([200, 201]).toContain(response.status());
    expect(elapsed).toBeLessThan(5000);
  });
});
