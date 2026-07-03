// tests/api/errorHandling.spec.js

// Import custom Playwright test fixture and assertion library
import { test, expect } from '../fixtures.js';

// Base URL of the OrangeHRM application
const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

// Test suite for validating API error handling scenarios
test.describe('API — Error Handling (4xx / 5xx)', () => {

  /**
   * Verifies that accessing a non-existent page
   * returns an appropriate response.
   */
  test('TC_API_011 — 404: Non-existent page returns 404 or redirect', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/web/index.php/nonexistent/fakepage`);

    // Application may return a 404, redirect, or login page
    expect([404, 302, 200]).toContain(response.status());
  });

  /**
   * Verifies that an invalid API endpoint
   * returns an appropriate client error.
   */
  test('TC_API_012 — 404: Non-existent API endpoint returns error', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/web/index.php/api/v2/fake/endpoint/9999`);

    expect([404, 401, 403, 405]).toContain(response.status());
  });

  /**
   * Verifies that unsupported HTTP methods
   * are handled correctly by the server.
   */
  test('TC_API_013 — 405: Wrong HTTP method on login endpoint', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/web/index.php/auth/login`);

    expect([405, 302, 404, 200]).toContain(response.status());
  });

  /**
   * Verifies that the server returns
   * the required response headers.
   */
  test('TC_API_014 — Response headers are present', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/web/index.php/auth/login`);

    const headers = response.headers();

    expect(headers['content-type']).toBeDefined();
  });

  /**
   * Verifies that error responses do not expose
   * internal server details or stack traces.
   */
  test('TC_API_015 — Server does not expose internal stack trace on error', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/web/index.php/api/v2/fake/resource`);

    const body = await response.text();

    // Verify sensitive error details are not exposed
    expect(body).not.toContain('Fatal error');
    expect(body).not.toContain('Stack trace');
    expect(body).not.toContain('Traceback');
  });

  /**
   * Verifies that requesting an invalid employee ID
   * returns a handled error instead of a server failure.
   */
  test('TC_API_016 — GET employee with invalid ID handles gracefully', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/web/index.php/api/v2/pim/employees/99999999`);

    // Server should not return an internal error
    expect(response.status()).not.toBe(500);
    expect([401, 403, 404, 302]).toContain(response.status());
  });

  /**
   * Verifies that the application responds
   * within the acceptable response time.
   */
  test('TC_API_017 — API response time under 5 seconds', async ({ request }) => {
    const start = Date.now();

    await request.get(`${BASE_URL}/web/index.php/auth/login`);

    const duration = Date.now() - start;

    expect(duration).toBeLessThan(5000);
  });

});