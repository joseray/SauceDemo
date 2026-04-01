import { type Page, type Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;
  private readonly burgerMenuButton: Locator;
  private readonly closeMenuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly allItemsLink: Locator;
  private readonly resetAppStateLink: Locator;
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('[data-test="close-menu"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  async openBurgerMenu(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.closeMenuButton.waitFor({ state: 'visible' });
  }

  async closeBurgerMenu(): Promise<void> {
    await this.closeMenuButton.click();
    await this.closeMenuButton.waitFor({ state: 'hidden' });
  }

  async logout(): Promise<void> {
    await this.openBurgerMenu();
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.openBurgerMenu();
    await this.resetAppStateLink.click();
    await this.closeBurgerMenu();
  }

  async goToAllItems(): Promise<void> {
    await this.openBurgerMenu();
    await this.allItemsLink.click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartBadgeCount(): Promise<number | null> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.textContent();
      return text ? parseInt(text, 10) : null;
    }
    return null;
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }
}
