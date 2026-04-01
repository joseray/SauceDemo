import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutCompletePage extends BasePage {
  private readonly completeContainer: Locator;
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeContainer = page.locator('[data-test="checkout-complete-container"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async getCompleteHeader(): Promise<string> {
    return (await this.completeHeader.textContent()) ?? '';
  }

  async getCompleteText(): Promise<string> {
    return (await this.completeText.textContent()) ?? '';
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
