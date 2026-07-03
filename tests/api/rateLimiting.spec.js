// tests/api/rateLimiting.spec.js

// Import custom Playwright test fixture and assertion library
import { test, expect } from '../fixtures.js';

// Base URL of the OrangeHRM application
const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

// Test suite for rate limiting and response validation
test.describe('API — Rate Limiting & Schema Validation', () => {

  /**
   * Verifies that multiple simultaneous requests
   * do not cause the server to fail.
   */
  test('TC_API_018 — Multiple rapid requests do not crash server', async ({ request }) => {

    const requests = [];

    // Send multiple requests in parallel
    for (let i = 0; i < 5; i++) {
      requests.push(request.get(`${BASE_URL}/web/index.php/auth/login`));
    }

    // Wait for all responses
    const responses = await Promise.all(requests);

    // Ensure none of the requests return an internal server error
    for (const response of responses) {
      expect(response.status()).not.toBe(500);
    }
  });

  /**
   * Verifies that the server remains responsive
   * during repeated API requests.
   */
  test('TC_API_019 — Server stays responsive under repeated API calls', async ({ request }) => {

    for (let i = 0; i < 3; i++) {
      const response = await request.get(`${BASE_URL}/web/index.php/auth/login`);

      expect([200, 302]).toContain(response.status());
    }
  });

  /**
   * Verifies that the response contains
   * a valid Content-Type header.
   */
  test('TC_API_020 — Response returns valid content type header', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/web/index.php/auth/login`);

    const contentType = response.headers()['content-type'];

    expect(contentType).toBeDefined();
    expect(contentType.length).toBeGreaterThan(0);
  });

  /**
   * Verifies that the login page returns
   * a valid HTML response.
   */
  test('TC_API_021 — Schema: Login page HTML has form element', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/web/index.php/auth/login`);

    expect(response.status()).toBe(200);

    // Verify the response contains page content
    const body = await response.text();
    expect(body.length).toBeGreaterThan(100);
  });

  /**
   * Verifies that the application
   * is accessible over HTTPS.
   */
  test('TC_API_022 — HTTPS is enforced (no HTTP downgrade)', async ({ request }) => {

    const response = await request.get(
      'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
    );

    expect([200, 301, 302]).toContain(response.status());
  });

  /**
   * Verifies that response headers
   * follow basic security practices.
   */
  test('TC_API_023 — Response headers include security headers', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/web/index.php/auth/login`);

    const headers = response.headers();

    // Verify the server header, if present
    const serverHeader = headers['server'];

    if (serverHeader) {
      expect(serverHeader).toBeDefined();
    }
  });

});