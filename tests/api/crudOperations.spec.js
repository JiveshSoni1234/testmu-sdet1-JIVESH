// tests/api/crudOperations.spec.js

// Import custom Playwright test fixture and assertion library
import { test, expect } from '../fixtures.js';

// Base URL of the OrangeHRM demo application
const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

/**
 * Creates an authenticated browser session.
 * Logs into the application and returns the
 * authenticated browser context and page.
 */
async function getAuthenticatedContext(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the login page
  await page.goto(`${BASE_URL}/web/index.php/auth/login`);

  // Enter valid admin credentials
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');

  // Submit the login form
  await page.click('button[type="submit"]');

  // Wait until the dashboard is loaded
  await page.waitForURL(/dashboard/);

  return { context, page };
}

// Test suite for CRUD operation validation
test.describe('API — CRUD Operations via UI', () => {

  /**
   * CREATE Operation
   * Verifies that a new job title can be created successfully.
   */
  test('TC_API_006 — CREATE: Add new job title successfully', async ({ page, browser }) => {
    const { page: authPage } = await getAuthenticatedContext(browser);

    // Open Job Titles page
    await authPage.goto(`${BASE_URL}/web/index.php/admin/viewJobTitleList`);

    // Click Add button
    await authPage.click('button:has-text("Add")');

    // Create a unique job title using the current timestamp
    const timestamp = Date.now();
    await authPage.fill('input[name="jobTitle"]', `Test Engineer ${timestamp}`);

    // Save the new job title
    await authPage.click('button[type="submit"]');

    // Verify success notification
    await expect(authPage.locator('.oxd-toast-content')).toBeVisible({ timeout: 5000 });
  });

  /**
   * READ Operation
   * Verifies that the employee list is displayed successfully.
   */
  test('TC_API_007 — READ: Employee list displays records', async ({ browser }) => {
    const { page: authPage } = await getAuthenticatedContext(browser);

    // Navigate to Employee List
    await authPage.goto(`${BASE_URL}/web/index.php/pim/viewEmployeeList`);

    // Verify table header and employee records are visible
    await expect(authPage.locator('.oxd-table-header')).toBeVisible();
    await expect(authPage.locator('.oxd-table-row').first()).toBeVisible();
  });

  /**
   * READ Operation
   * Verifies that an employee profile can be opened.
   */
  test('TC_API_008 — READ: Single employee profile is accessible', async ({ browser }) => {
    const { page: authPage } = await getAuthenticatedContext(browser);

    // Open Employee List page
    await authPage.goto(`${BASE_URL}/web/index.php/pim/viewEmployeeList`);

    // Wait until employee records are loaded
    await authPage.waitForSelector('.oxd-table-row', { timeout: 5000 });

    // Open the first employee profile
    const editBtn = authPage.locator('.oxd-table-row .oxd-icon-button').first();
    await editBtn.click();

    // Verify navigation to Personal Details page
    await expect(authPage).toHaveURL(/viewPersonalDetails/);
  });

  /**
   * READ Operation
   * Verifies that the Admin User list contains records.
   */
  test('TC_API_009 — READ: Admin user list is not empty', async ({ browser }) => {
    const { page: authPage } = await getAuthenticatedContext(browser);

    // Navigate to Admin User List
    await authPage.goto(`${BASE_URL}/web/index.php/admin/viewSystemUsers`);

    // Wait until table data is loaded
    await authPage.waitForSelector('.oxd-table-row');

    // Verify at least one record exists
    const rows = authPage.locator('.oxd-table-row');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  /**
   * DELETE Operation
   * Verifies that cancelling the delete action
   * does not remove any existing record.
   */
  test('TC_API_010 — DELETE: Cancel delete operation keeps record', async ({ browser }) => {
    const { page: authPage } = await getAuthenticatedContext(browser);

    // Navigate to Admin User List
    await authPage.goto(`${BASE_URL}/web/index.php/admin/viewSystemUsers`);

    // Wait until records are displayed
    await authPage.waitForSelector('.oxd-table-row', { timeout: 10000 });

    // Store the number of records before deletion
    const beforeCount = await authPage.locator('.oxd-table-row').count();

    // Click the delete button for the first record
    const deleteBtn = authPage.locator('.oxd-table-row .oxd-icon-button:last-child').first();
    await deleteBtn.click();

    // Cancel the delete confirmation dialog
    const cancelBtn = authPage.locator('button:has-text("No, Cancel")');
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    }

    // Verify the record count remains unchanged
    const afterCount = await authPage.locator('.oxd-table-row').count();
    expect(afterCount).toBe(beforeCount);
  });

});