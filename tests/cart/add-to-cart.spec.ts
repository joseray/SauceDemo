import { test, expect } from '../../src/fixtures';
import { PRODUCT_SLUGS } from '../../src/utils/test-data';

test.describe('Add to Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('should add a product to cart from inventory page', async ({ inventoryPage, page }) => {
    await inventoryPage.addToCart(PRODUCT_SLUGS.BACKPACK);

    const badge = await inventoryPage.getCartBadgeCount();
    expect(badge).toBe(1);

    await inventoryPage.goToCart();
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
  });

  test('should add multiple products to cart', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(PRODUCT_SLUGS.BACKPACK);
    await inventoryPage.addToCart(PRODUCT_SLUGS.BIKE_LIGHT);

    const badge = await inventoryPage.getCartBadgeCount();
    expect(badge).toBe(2);
  });

  test('should toggle button text to Remove after adding', async ({ inventoryPage, page }) => {
    await inventoryPage.addToCart(PRODUCT_SLUGS.BACKPACK);

    await expect(page.locator(`[data-test="remove-${PRODUCT_SLUGS.BACKPACK}"]`)).toBeVisible();
  });

  test('should add product from product detail page', async ({ inventoryPage, productDetailPage }) => {
    await inventoryPage.openProduct('Sauce Labs Backpack');
    await productDetailPage.addToCart();

    const badge = await productDetailPage.getCartBadgeCount();
    expect(badge).toBe(1);
  });
});
