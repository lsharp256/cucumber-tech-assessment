import { Before, After, Given, When, Then, DataTable } from "@cucumber/cucumber";
import { Page, Browser, chromium, expect } from "@playwright/test";

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

Given('I am on the BBC Sport page', async function () {
    // Add this to the launch options to run the tests in headless mode: {headless: false}
    await page.goto('https://www.bbc.co.uk/sport', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/BBC Sport/);
    console.info('Navigated to BBC Sport page');
});

When('I navigate to the results table', async function () {
    await page.getByRole('link', { name: 'Formula 1' }).first().click();
    console.info('Clicked on Formula 1');
    await page.getByRole('link', { name: 'Results' }).click();
    console.info('Clicked on Results');
    await page.getByTestId('datepicker-date-value').getByText('2023').click();
    console.info('Selected year 2023');
}); 

Then('I should see the following drivers in the results:', async function (dataTable: DataTable) {
    // Extract driver names from the data table
    const drivers = dataTable.raw().map(row => row[0]);

    // Close open table for abu dhabi
    const abuDhabiButton = page.getByRole('button', { name: /Abu Dhabi Grand Prix, Yas Marina/ });
    await abuDhabiButton.click();

    const lasVegasSection = page.locator('section', { hasText: 'Las Vegas Grand Prix' });

    // Open Las Vegas results
    const lasVegasResultsButton = page.getByRole('button', { name: /Las Vegas Grand Prix/ });
    await lasVegasResultsButton.click();
    console.info('Clicked on Las Vegas results button');

    const resultsTable = lasVegasSection.locator('table[aria-label="Race result"]');
    await expect(resultsTable).toBeVisible();

    // Validate each driver in the table
    for (const driver of drivers) {
        const driverRow = resultsTable.locator('tbody tr', { hasText: driver });
        console.info(`Looking for driver: ${driver}`);
        await expect(driverRow).toBeVisible();
        console.info(`Verified driver: ${driver}`);
    }
});