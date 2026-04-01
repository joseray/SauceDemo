import { test, expect } from '../../src/fixtures';

test.describe('Logout', () => {
  test('should logout successfully via burger menu', async ({ inventoryPage, page }) => {
    await inventoryPage.goto();
    await inventoryPage.logout();

    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
