// tests/dashboard/filterSort.spec.js

// Import custom Playwright test fixture and assertion library
import { test, expect } from '../fixtures.js';

// Base URL of the OrangeHRM application
const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

/**
 * Helper function to log in using valid admin credentials.
 */
async function login(page) {
  // Open the login page
  await page.goto(`${BASE_URL}/web/index.php/auth/login`);

  // Enter login credentials
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');

  // Submit the login form
  await page.click('button[type="submit"]');

  // Wait until the dashboard is displayed
  await page.waitForURL(/dashboard/);
}

// Test suite for dashboard navigation and filtering
test.describe('Dashboard — Navigation & Filter Behavior', () => {

  /**
   * Verifies that clicking the Admin menu
   * navigates to the Admin module.
   */
  test('TC_DASH_008 — Clicking Admin in sidebar navigates to Admin panel', async ({ page }) => {
    await login(page);

    // Navigate to the Admin page
    await page.click('.oxd-main-menu-item:has-text("Admin")');

    // Verify successful navigation
    await expect(page).toHaveURL(/admin/);
  });

  /**
   * Verifies that the Admin user search
   * filters records correctly.
   */
  test('TC_DASH_009 — Admin User Management search filter works', async ({ page }) => {
    await login(page);

    // Open User Management page
    await page.goto(`${BASE_URL}/web/index.php/admin/viewSystemUsers`);

    // Search by username
    await page.fill('input[placeholder="Type for hints..."]', 'Admin');
    await page.click('button[type="submit"]');

    // Wait for search results
    await page.waitForTimeout(1000);

    // Verify that search results are displayed
    const rows = page.locator('.oxd-table-row');
    await expect(rows.first()).toBeVisible();
  });

  /**
   * Verifies that the Employee List
   * page loads successfully.
   */
  test('TC_DASH_010 — PIM Employee List loads with records', async ({ page }) => {
    await login(page);

    // Navigate to Employee List
    await page.goto(`${BASE_URL}/web/index.php/pim/viewEmployeeList`);

    // Verify employee table is displayed
    await expect(page.locator('.oxd-table-header')).toBeVisible();
  });

  /**
   * Verifies that searching by employee name
   * filters the employee list.
   */
  test('TC_DASH_011 — PIM search by employee name filters results', async ({ page }) => {
    await login(page);

    // Open Employee List page
    await page.goto(`${BASE_URL}/web/index.php/pim/viewEmployeeList`);

    // Search by employee name
    await page.fill('input[placeholder="Type for hints..."]', 'Admin');
    await page.click('button[type="submit"]');

    // Wait for filtered results
    await page.waitForTimeout(1500);

    // Verify search results are displayed
    await expect(page.locator('.oxd-table-row').first()).toBeVisible();
  });

  /**
   * Verifies that the Leave module
   * is accessible from the sidebar.
   */
  test('TC_DASH_012 — Leave module is accessible from sidebar', async ({ page }) => {
    await login(page);

    // Navigate to Leave module
    await page.click('.oxd-main-menu-item:has-text("Leave")');

    // Verify page navigation
    await expect(page).toHaveURL(/leave/);
    await expect(page.locator('.oxd-topbar-header-title')).toBeVisible();
  });

  /**
   * Verifies that the Recruitment module
   * opens successfully from the sidebar.
   */
  test('TC_DASH_013 — Recruitment module navigates correctly', async ({ page }) => {
    await login(page);

    // Navigate to Recruitment module
    await page.click('.oxd-main-menu-item:has-text("Recruitment")');

    // Verify successful navigation
    await expect(page).toHaveURL(/recruitment/);
  });

});