# SauceDemo — Playwright Automation Suite

End-to-end test suite for [SauceDemo](https://www.saucedemo.com) built with Playwright and TypeScript.

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9

## Setup

```bash
npm install
npx playwright install --with-deps
```

> **Note:** If `--with-deps` fails due to unsupported browsers (e.g., WebKit on certain macOS versions), run `npx playwright install chromium firefox` instead.

## Running Tests

**Run all tests:**

```bash
npx playwright test
```

**Run a specific test file:**

```bash
npx playwright test tests/auth/login.spec.ts
```

**Run a specific test by name:**

```bash
npx playwright test --grep "should login successfully"
```

**Run tests for a single browser:**

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

**Run in headed mode (visible browser):**

```bash
npx playwright test --headed
```

**Run with Playwright UI mode (interactive debugging):**

```bash
npx playwright test --ui
```

## Viewing the HTML Report

After running the tests, open the HTML report with:

```bash
npx playwright show-report
```

The report is generated in the `playwright-report/` directory.

## Project Structure

```
├── src/
│   ├── fixtures/          # Custom test.extend with page object injection
│   ├── pages/             # Page Object Model (one per application page)
│   └── utils/             # Constants: users, product slugs, URLs
├── tests/
│   ├── auth/              # Login & logout tests
│   ├── inventory/         # Product display & sort tests
│   ├── cart/              # Add-to-cart & cart management tests
│   ├── checkout/          # End-to-end checkout flow tests
│   └── performance/       # Performance glitch user timing test
├── auth/                  # StorageState JSON files (gitignored)
├── playwright.config.ts   # Playwright configuration
└── global-setup.ts        # One-time login to generate storageState
```

## Design Decisions

The suite uses **`[data-test]` selectors exclusively** for resilience against CSS and structural changes, which is the most maintainable selector strategy for production test suites. An **abstract `BasePage` class** encapsulates the shared header, burger menu, and cart icon present on all authenticated pages, while `LoginPage` stands alone since it has a different layout. **`storageState` with `globalSetup`** performs a single login as `standard_user` and shares the session across all parallel workers, eliminating redundant login steps and enabling `fullyParallel: true` without test interference. Tests that need a different user (e.g., `locked_out_user`, `performance_glitch_user`) override with an empty `storageState` and log in explicitly. **Custom fixtures via `test.extend`** inject page object instances directly into test functions, keeping test code clean and centralizing object creation. Timeout values (`actionTimeout: 10s`, `navigationTimeout: 15s`) are calibrated for SauceDemo's lightweight nature while accommodating the `performance_glitch_user`'s artificial delays.

## Onboarding a Junior Engineer

When onboarding a junior team member to this suite, I would start with a **guided walkthrough of the Page Object Model pattern** — explaining that each page of the application has a corresponding class in `src/pages/` that encapsulates its selectors and actions. The key concept to internalize is that tests never interact with selectors directly; they call descriptive methods like `inventoryPage.addToCart()` or `checkoutInfoPage.fillInformation()`. I would pair-program their first test, walking through how fixtures inject page objects and how `storageState` eliminates the need to log in at the start of every test.

For documentation, I would add **JSDoc comments to each page object method** explaining what UI interaction it performs, and create a `CONTRIBUTING.md` with a step-by-step guide for adding a new test: (1) identify which page objects are needed, (2) check if the required methods already exist, (3) add methods to the page object if needed, (4) write the test using the custom fixtures. I would also document the naming convention for test files (`feature.spec.ts`) and the folder structure so they know where to place new specs.

To **prevent test data pollution** in a shared public environment like SauceDemo, I would emphasize three principles: first, each test must be self-contained — add its own items to cart, complete its own flow, and never depend on state left by another test. Second, the `storageState` pattern ensures each worker gets an isolated browser context with clean cookies. Third, for extra safety, tests that modify cart state should use `resetAppState()` from the burger menu in a `beforeEach` hook if needed. Since SauceDemo resets server-side state per session, the main risk is cookie/localStorage leakage, which Playwright's context isolation handles automatically. I would run through a live demo of `--ui` mode to show them how to visually debug test failures using traces and screenshots.
