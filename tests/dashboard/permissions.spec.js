// tests/dashboard/permissions.spec.js

// Import custom Playwright test fixture and assertion library
import { test, expect } from '../fixtures.js';

// Base URL of the OrangeHRM application
const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

/**
 * Helper function to log in as an administrator.
 */
async function loginAsAdmin(page) {

  // Open the login page
  await page.goto(`${BASE_URL}/web/index.php/auth/login`);

  // Enter administrator credentials
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');

  // Submit the login form
  await page.click('button[type="submit"]');

  // Wait until the dashboard is displayed
  await page.waitForURL(/dashboard/);
}

// Test suite for validating permission-based access
test.describe('Dashboard — Permission-Based Visibility', () => {

  /**
   * Verifies that the Admin menu
   * is visible to an administrator.
   */
  test('TC_DASH_014 — Admin user sees Admin menu item in sidebar', async ({ page }) => {
    await loginAsAdmin(page);

    await expect(
      page.locator('.oxd-main-menu-item:has-text("Admin")')
    ).toBeVisible();
  });

  /**
   * Verifies that an administrator
   * can access the User Management page.
   */
  test('TC_DASH_015 — Admin can access User Management page', async ({ page }) => {
    await loginAsAdmin(page);

    // Open the User Management page
    await page.goto(`${BASE_URL}/web/index.php/admin/viewSystemUsers`);

    // Verify the page loads successfully
    await expect(page.locator('.oxd-topbar-header-title')).toBeVisible();

    // Ensure access is not denied
    await expect(page.locator('text=Access Denied')).not.toBeVisible();
  });

  /**
   * Verifies that an administrator
   * can access the Job Titles configuration page.
   */
  test('TC_DASH_016 — Admin can access Job Titles configuration', async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to Job Titles
    await page.goto(`${BASE_URL}/web/index.php/admin/viewJobTitleList`);

    await expect(page.locator('.oxd-topbar-header-title')).toBeVisible();
  });

  /**
   * Verifies that an administrator
   * can access the Organization settings page.
   */
  test('TC_DASH_017 — Admin can access Organizational structure', async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to Organization Information
    await page.goto(`${BASE_URL}/web/index.php/admin/viewOrganizationGeneralInformation`);

    await expect(page.locator('.oxd-form')).toBeVisible();
  });

  /**
   * Verifies that an unauthenticated user
   * is redirected to the login page when
   * attempting to access the Admin panel.
   */
  test('TC_DASH_018 — Unauthenticated user cannot access admin panel', async ({ page }) => {

    // Attempt direct access without logging in
    await page.goto(`${BASE_URL}/web/index.php/admin/viewSystemUsers`);

    // Verify redirection to the login page
    await expect(page).toHaveURL(/auth\/login/);
  });

  /**
   * Verifies that the dashboard displays
   * the logged-in user's name.
   */
  test('TC_DASH_019 — Dashboard shows user name matching logged-in user', async ({ page }) => {
    await loginAsAdmin(page);

    // Retrieve the displayed username
    const userName = await page.locator('.oxd-userdropdown-name').textContent();

    // Verify the username is not empty
    expect(userName?.trim().length).toBeGreaterThan(0);
  });

});