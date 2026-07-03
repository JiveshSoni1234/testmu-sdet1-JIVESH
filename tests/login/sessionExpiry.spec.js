// tests/login/sessionExpiry.spec.js

// Import custom Playwright test fixture and assertion library
import { test, expect } from '../fixtures.js';

// Base URL of the OrangeHRM application
const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

// Test suite for validating session management and logout behavior
test.describe('Login — Session & Logout Behavior', () => {

  /**
   * Verifies that logging out clears the user session
   * and redirects to the login page.
   */
  test('TC_LOGIN_018 — Logout clears session and redirects to login', async ({ page }) => {

    // Log in with valid credentials
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);

    // Open the user menu and log out
    await page.click('.oxd-userdropdown-name');
    await page.click('text=Logout');

    // Verify redirection to the login page
    await expect(page).toHaveURL(/auth\/login/);
  });

  /**
   * Verifies that using the browser's Back button
   * after logout does not restore the previous session.
   */
  test('TC_LOGIN_019 — After logout, back button does not restore session', async ({ page }) => {

    // Log in with valid credentials
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);

    // Log out of the application
    await page.click('.oxd-userdropdown-name');
    await page.click('text=Logout');
    await page.waitForURL(/auth\/login/);

    // Navigate back using the browser
    await page.goBack();

    // Verify the session is no longer valid
    await expect(page).toHaveURL(/auth\/login/);
  });

  /**
   * Verifies that accessing the dashboard
   * without authentication redirects to the login page.
   */
  test('TC_LOGIN_020 — Accessing dashboard URL without login redirects to login', async ({ page }) => {

    // Attempt to access the dashboard directly
    await page.goto(`${BASE_URL}/web/index.php/dashboard/index`);

    // Verify redirection to the login page
    await expect(page).toHaveURL(/auth\/login/);
  });

  /**
   * Verifies that accessing the Admin module
   * without authentication redirects to the login page.
   */
  test('TC_LOGIN_021 — Accessing admin panel URL without login redirects to login', async ({ page }) => {

    // Attempt to access the Admin page directly
    await page.goto(`${BASE_URL}/web/index.php/admin/viewSystemUsers`);

    // Verify redirection to the login page
    await expect(page).toHaveURL(/auth\/login/);
  });

});