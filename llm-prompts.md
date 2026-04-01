# LLM Prompts Used

This document records all prompts used with **Claude (Anthropic)** during the development of this Playwright automation suite. The workflow followed a deliberate four-phase approach: understand the requirements, explore the application, plan the architecture, then implement and validate.

---

## Prompt 1 — Requirement Analysis

**Goal:** Establish full context of the exercise before writing any code.

> I have an interview coding exercise document attached (Candidate Prompt - Playwright.docx). Before we start, I need you to:
>
> 1. Read and analyze the entire document
> 2. Identify all deliverables for Task A (Configuration & Tooling) and Task B (Lead Add-Ons)
> 3. List the test user accounts and their expected behaviors
> 4. Summarize the evaluation criteria and submission requirements
>
> Do not write any code yet — just confirm your understanding of the full scope.

**Outcome:** Claude extracted all requirements, user accounts, modules to test, and evaluation criteria. This ensured alignment before any implementation began.

---

## Prompt 2 — Application Walkthrough & DOM Analysis

**Goal:** Map every page of SauceDemo to inform the Page Object Model design.

> Before we start coding, navigate to https://www.saucedemo.com and perform a complete walkthrough of the application. For each page:
>
> 1. Log in as `standard_user` / `secret_sauce`
> 2. Visit every page in the user flow: Login, Inventory, Product Detail, Cart, Checkout Step 1, Checkout Step 2, Checkout Complete
> 3. Open the burger menu and document all sidebar options
> 4. Document the DOM structure: interactive elements, selectors, buttons, forms, and navigation links
> 5. Test the `locked_out_user` login to capture the error state
>
> Produce a structured summary of each page with its URL, key elements, and available actions.

**Outcome:** Claude navigated all 7 pages via browser automation and produced a complete selector map. Key findings included:
- All interactive elements use `[data-test]` attributes (ideal for stable selectors)
- The burger menu button requires clicking the parent `<button>` element, not the child `<img data-test="open-menu">`
- The cart badge only appears when items are added (null state must be handled)
- Checkout is a 3-step flow with distinct URLs for each step

---

## Prompt 3 — Architecture & Implementation Plan

**Goal:** Design a complete implementation plan before writing code to ensure a coherent architecture.

> Given the full context of the exercise requirements and the SauceDemo page structure analysis, design a comprehensive implementation plan. Include:
>
> 1. **Directory structure** — where each file lives and why
> 2. **playwright.config.ts** — all settings with justifications for timeout values, retries, reporters, and browser projects
> 3. **Page Object Model** — class hierarchy, which pages extend BasePage, selector strategy
> 4. **Custom fixtures** — how `test.extend` injects page objects
> 5. **storageState strategy** — how `globalSetup` handles auth reuse and which tests override it
> 6. **Test inventory** — every test case organized by module with expected assertions
> 7. **Implementation sequence** — phased approach with dependencies between phases
>
> This is for a Lead-level submission, so include Task B requirements (performance_glitch_user test + Onboarding a Junior Engineer section).

**Outcome:** Produced a 5-phase plan with 26 test cases across 8 spec files, 8 page objects with an abstract BasePage, and clear architectural decisions (selector strategy, auth reuse pattern, fixture injection).

---

## Prompt 4 — Implementation & Execution

**Goal:** Implement the full suite following the approved plan, then validate.

> Proceed with the implementation following the plan. Execute all 5 phases in order:
>
> 1. **Scaffolding** — package.json, tsconfig.json, playwright.config.ts, .gitignore, global-setup.ts
> 2. **Page Objects** — test-data.ts constants, BasePage, LoginPage, InventoryPage, ProductDetailPage, CartPage, CheckoutInfoPage, CheckoutOverviewPage, CheckoutCompletePage
> 3. **Fixtures** — auth.fixture.ts with test.extend, index.ts barrel export
> 4. **Tests** — all spec files for auth, inventory, cart, checkout, and performance modules
> 5. **Documentation** — README.md with all required sections, llm-prompts.md
>
> After implementation, run `npx playwright test` on both Chromium and Firefox and fix any failures.

**Outcome:** All files were created and tests executed. One failure was found and fixed: the burger menu selector needed to target the `<button>` parent instead of the `<img>` child (discovered during the DOM analysis in Prompt 2). Final result: **52/52 tests passing** (26 per browser).

---

## Validation Approach

All LLM-generated code was validated through:

1. **Execution** — `npx playwright test` confirmed 52/52 tests pass across Chromium and Firefox
2. **Selector verification** — every `[data-test]` selector was cross-referenced against the live SauceDemo DOM via browser automation
3. **Architecture review** — verified POM correctly abstracts page interactions, no selectors leak into test files
4. **Isolation testing** — confirmed `storageState` pattern enables `fullyParallel: true` without test interference
5. **Edge case handling** — validated error states (locked_out_user, empty form fields) and performance threshold (performance_glitch_user loads in ~5.5s, well under 7s threshold)

## Tools Used

- **Claude (Anthropic)** — code generation, architectural design, documentation
- **Claude in Chrome** — live browser automation for DOM inspection and page walkthrough
