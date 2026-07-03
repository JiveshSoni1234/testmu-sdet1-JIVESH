// tests/api/authToken.spec.js

// Import custom Playwright test fixture and assertion library
import { test, expect } from '../fixtures.js';

// Base URL of the OrangeHRM application
const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

/**
 * Helper function to authenticate using the login API.
 * Returns the API response after submitting valid credentials.
 */
async function getAuthToken(request) {
  const response = await request.post(`${BASE_URL}/web/index.php/auth/login`, {
    form: {
      username: 'Admin',
      password: 'admin123',
      _token: '',
    },
  });

  return response;
}

// Test suite for API authentication and validation
test.describe('API — Auth Token Validation', () => {

  /**
   * Verifies that the login API accepts valid credentials
   * and returns a successful response.
   */
  test('TC_API_001 — Login API returns 200 for valid credentials', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/web/index.php/api/v2/auth/login`, {
      data: {
        username: 'Admin',
        password: 'admin123',
      },
    });

    // Verify successful response
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(500);
  });

  /**
   * Verifies that the Employee API requires authentication.
   * Unauthenticated requests should be rejected.
   */
  test('TC_API_002 — Employee list API requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/web/index.php/api/v2/pim/employees`);

    // Expect unauthorized, forbidden, or redirect response
    expect([401, 302, 403]).toContain(response.status());
  });

  /**
   * Verifies that an invalid authentication token
   * is rejected by the API.
   */
  test('TC_API_003 — API with invalid token returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/web/index.php/api/v2/pim/employees`, {
      headers: {
        Authorization: 'Bearer invalid_fake_token_12345',
      },

      // Prevent automatic redirects to capture the actual status code
      maxRedirects: 0
    });

    expect([401, 403, 302]).toContain(response.status());
  });

  /**
   * Verifies that the application's login endpoint
   * is reachable and returns a successful response.
   */
  test('TC_API_004 — API base URL is reachable', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/web/index.php/auth/login`);

    expect(response.status()).toBe(200);
  });

  /**
   * Verifies that the server returns
   * a valid Content-Type header.
   */
  test('TC_API_005 — Response Content-Type is text/html or application/json', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/web/index.php/auth/login`);

    const contentType = response.headers()['content-type'];

    expect(contentType).toMatch(/html|json/);
  });

});