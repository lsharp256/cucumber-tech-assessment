import { Before, After, Given, When, Then, DataTable } from "@cucumber/cucumber";
import { chromium, Browser, Page, expect } from "@playwright/test";

// Shared browser and page objects
let browser: Browser;
let page: Page;

// Before hook - runs before scenarios
Before(async function() {
    browser = await chromium.launch();
    page = await browser.newPage();
});

// After hook - runs after scenarios
After(async function() {
    await page.close();
    await browser.close();
});

Given("I am on the BBC Sport search page", async function() {
  await page.goto("https://www.bbc.co.uk/search?d=SPORT_GNL");
  await expect(page).toHaveTitle(/BBC - Search/);
});

When("I search for {string}", async function(searchTerm: string) {
    await page.getByText('Search BBC').click();
    const searchbar = page.getByPlaceholder('Search the BBC');
    await searchbar.fill(searchTerm);
    await searchbar.press('Enter');
});

Then("I should see at least {int} search results", async function(minCount: number) {
    // Get all the search result elements
    const resultItems = await page.locator('ul[role="list"] li >> div[data-testid="default-promo"]').all();

    expect(resultItems.length).toBeGreaterThanOrEqual(minCount);
});

Then("the search results should be relevant to the {string} search term", async function(searchTerm: string) {
    const resultItems = await page.locator('div ul li[data-testid="default-promo"]').all();

    // Check if each result contains the relevant keywords
    for (const result of resultItems) {
        const textContent = await result.textContent();

        // Skip results that contain "live" (optional)
        if (textContent && !textContent.toLowerCase().includes("live")) {
            await expect(result).toContainText(searchTerm);
        }
    }
});
