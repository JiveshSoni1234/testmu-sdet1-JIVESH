// tests/login/validLogin.spec.js

// Import custom Playwright test fixture and assertion library
import { test, expect } from '../fixtures.js';

// Application URL and valid login credentials
const BASE_URL = 'https://opensource-demo.orangehrmlive.com';
const VALID_USER = 'Admin';
const VALID_PASS = 'admin123';

// Test suite for validating successful login scenarios
test.describe('Login — Valid Credentials', () => {

  /**
   * Verifies that a user can successfully log in
   * using valid credentials.
   */
  test('TC_LOGIN_001 — Valid login with correct username and password', async ({ page }) => {

    // Open the login page
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);

    // Verify login page is displayed
    await expect(page.locator('.orangehrm-login-title')).toBeVisible();

    // Enter valid username and password
    await page.fill('input[name="username"]', VALID_USER);
    await page.fill('input[name="password"]', VALID_PASS);

    // Submit the login form
    await page.click('button[type="submit"]');

    // Verify successful login and dashboard navigation
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('.oxd-topbar-header-title')).toBeVisible();
  });

  /**
   * Verifies that all required login page
   * elements are displayed.
   */
  test('TC_LOGIN_002 — Login page title and UI elements are visible', async ({ page }) => {

    // Navigate to the login page
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);

    // Verify login form elements
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('.orangehrm-login-logo')).toBeVisible();
  });

  /**
   * Verifies that the username field
   * accepts valid input.
   */
  test('TC_LOGIN_003 — Username field accepts valid input', async ({ page }) => {

    // Open the login page
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);

    // Enter a valid username
    await page.fill('input[name="username"]', VALID_USER);

    // Verify the entered value
    const value = await page.inputValue('input[name="username"]');
    expect(value).toBe(VALID_USER);
  });

  /**
   * Verifies that the password field
   * masks the entered characters.
   */
  test('TC_LOGIN_004 — Password field masks input', async ({ page }) => {

    // Open the login page
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);

    // Verify password input type
    const pwdType = await page.getAttribute('input[name="password"]', 'type');
    expect(pwdType).toBe('password');
  });

  /**
   * Verifies that the logged-in user's
   * profile is displayed after login.
   */
  test('TC_LOGIN_005 — Successful login shows user info in navbar', async ({ page }) => {

    // Navigate to the login page
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);

    // Log in using valid credentials
    await page.fill('input[name="username"]', VALID_USER);
    await page.fill('input[name="password"]', VALID_PASS);
    await page.click('button[type="submit"]');

    // Wait until the dashboard is loaded
    await page.waitForURL(/dashboard/);

    // Verify the user profile is visible
    await expect(page.locator('.oxd-userrdropdown-name')).toBeVisible();
  });

});