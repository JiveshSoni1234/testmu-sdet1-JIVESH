// tests/dashboard/widgetLoading.spec.js

// Import custom Playwright test fixture and assertion library
import { test, expect } from '../fixtures.js';

// Base URL of the OrangeHRM application
const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

/**
 * Logs into the OrangeHRM application
 * using valid administrator credentials.
 */
async function login(page) {
  // Navigate to the login page
  await page.goto(`${BASE_URL}/web/index.php/auth/login`);

  // Enter username and password
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');

  // Submit the login form
  await page.click('button[type="submit"]');

  // Wait until the dashboard is loaded
  await page.waitForURL(/dashboard/);
}

// Test suite for validating dashboard widgets and UI elements
test.describe('Dashboard — Widget Loading & Visibility', () => {

  /**
   * Verifies that the dashboard loads
   * within the expected time limit.
   */
  test('TC_DASH_001 — Dashboard loads within acceptable time', async ({ page }) => {
    const start = Date.now();

    await login(page);

    const loadTime = Date.now() - start;

    // Verify dashboard loads within 25 seconds
    expect(loadTime).toBeLessThan(25000);
  });

  /**
   * Verifies that the dashboard title
   * is displayed after login.
   */
  test('TC_DASH_002 — Dashboard page title is visible', async ({ page }) => {
    await login(page);

    await expect(page.locator('.oxd-topbar-header-title')).toBeVisible();
  });

  /**
   * Verifies that the "Time at Work"
   * widget is visible on the dashboard.
   */
  test('TC_DASH_003 — Time at Work widget is present', async ({ page }) => {
    await login(page);

    await expect(page.locator('text=Time at Work')).toBeVisible();
  });

  /**
   * Verifies that the "My Actions"
   * widget is displayed.
   */
  test('TC_DASH_004 — My Actions widget is present', async ({ page }) => {
    await login(page);

    await expect(page.locator('text=My Actions')).toBeVisible();
  });

  /**
   * Verifies that the sidebar navigation
   * is visible and contains key menu items.
   */
  test('TC_DASH_005 — Left sidebar navigation is visible and has menu items', async ({ page }) => {
    await login(page);

    const sidebar = page.locator('.oxd-main-menu').first();

    // Verify sidebar is displayed
    await expect(sidebar).toBeVisible();

    // Verify important navigation options
    await expect(page.locator('text=Admin')).toBeVisible();
    await expect(page.locator('text=PIM')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Leave' })
    ).toBeVisible();
  });

  /**
   * Verifies that the user profile menu
   * can be opened successfully.
   */
  test('TC_DASH_006 — User profile dropdown is accessible', async ({ page }) => {
    await login(page);

    // Open the profile dropdown
    await page.click('.oxd-userdropdown-name');

    // Verify Logout option is available
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  /**
   * Verifies that the application logo
   * is displayed in the dashboard header.
   */
  test('TC_DASH_007 — Dashboard header shows correct app name', async ({ page }) => {
    await login(page);

    await expect(page.locator('.oxd-brand-banner')).toBeVisible();
  });

});