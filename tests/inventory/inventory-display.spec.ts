import { test, expect } from '../../src/fixtures';

test.describe('Inventory Display', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('should display exactly 6 products', async ({ inventoryPage }) => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('should display product names, descriptions and prices', async ({ page }) => {
    const items = page.locator('[data-test="inventory-item"]');
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      await expect(item.locator('[data-test="inventory-item-name"]')).not.toBeEmpty();
      await expect(item.locator('[data-test="inventory-item-desc"]')).not.toBeEmpty();
      await expect(item.locator('[data-test="inventory-item-price"]')).toContainText('$');
    }
  });

  test('should navigate to product detail page when clicking product name', async ({ inventoryPage, page }) => {
    await inventoryPage.openProduct('Sauce Labs Backpack');

    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
  });
});
