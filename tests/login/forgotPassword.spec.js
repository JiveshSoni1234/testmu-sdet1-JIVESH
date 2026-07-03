// tests/login/forgotPassword.spec.js
import { test, expect } from '../fixtures.js';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

test.describe('Login — Forgot Password Flow', () => {

  test('TC_LOGIN_012 — Forgot Password link is visible on login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    const forgotLink = page.locator('text=Forgot your password?');
    await expect(forgotLink).toBeVisible();
  });

  test('TC_LOGIN_013 — Clicking Forgot Password navigates to reset page', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    await page.click('text=Forgot your password?');
    await expect(page).toHaveURL(/requestPasswordResetCode/);
  });

  test('TC_LOGIN_014 — Reset page has username field and Reset button', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/requestPasswordResetCode`);
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('TC_LOGIN_015 — Submitting valid username on reset page shows success', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/requestPasswordResetCode`);
    await page.fill('input[name="username"]', 'Admin');
    await page.click('button[type="submit"]');

    // Should show confirmation message
    await expect(page.locator('.orangehrm-card-container')).toBeVisible();
  });

  test('TC_LOGIN_016 — Submitting empty username on reset page shows validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/requestPasswordResetCode`);
    await page.click('button[type="submit"]');
    await expect(page.locator('.oxd-input-field-error-message')).toContainText('Required');
  });

  test('TC_LOGIN_017 — Cancel button on reset page returns to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/requestPasswordResetCode`);
    await page.click('text=Cancel');
    await expect(page).toHaveURL(/auth\/login/);
  });

});
