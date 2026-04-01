# LLM Prompts Used

This document records the prompts used with Claude (Anthropic) during the development of this test suite.

## Prompt 1 — Application Analysis

> "I have an interview exercise attached. Please analyze it first so you have the full context before we start."

Used to share the exercise document and establish full context of the requirements before starting implementation.

## Prompt 2 — Site Walkthrough

> "Before we start coding, go to SauceDemo and do a walkthrough analyzing the structure of each page."

Claude navigated through every page of SauceDemo (Login, Inventory, Product Detail, Cart, Checkout Step 1, Checkout Step 2, Checkout Complete, Burger Menu) using browser automation. This produced a complete map of the DOM structure, available selectors, and page flow — which informed the Page Object Model design.

## Prompt 3 — Implementation Plan

> "Given the context, design an implementation plan."

Generated a detailed implementation plan covering: directory structure, playwright.config.ts settings with justifications, Page Object Model with selector references, custom fixtures design, test case inventory (~26 tests), and a 5-phase implementation sequence.

## Prompt 4 — Implementation

> "Yes" (confirming to proceed with implementation)

Claude implemented the full suite: scaffolding (package.json, tsconfig, playwright.config, global-setup), 8 page objects, custom fixtures with test.extend, 8 test spec files covering all modules, and documentation (README with design decisions and onboarding section).

## Validation Approach

All LLM-generated code was validated by:
1. Running `npx playwright test` to verify all tests pass across Chromium and Firefox
2. Reviewing selector accuracy against the live SauceDemo DOM (inspected via browser automation)
3. Verifying Page Object Model correctly abstracts page interactions
4. Confirming storageState pattern works for auth reuse and test isolation
