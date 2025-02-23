import { Given, When, Then } from "@cucumber/cucumber";
import { Page, Browser, chromium, expect } from "@playwright/test";
import { text } from "stream/consumers";

let browser: Browser;
let page: Page;

Given('I am on the BBC Sport page', async function () {
    // Add this to the launch options to run the tests in headless mode: {headless: false}
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto('https://www.bbc.co.uk/sport');
});

When('I navigate to the results table', async function () {
    await page.getByText('Formula 1').first().click();
    await page.getByText('Results').click();
    await page.getByTestId('datepicker-date-value').getByText('2023').click();
}); 

Then('I should see "Max Verstappen" in the results', async function () {
    const raceResult = page.getByLabel('Race result')
        .filter({ hasText: 'Las Vegas Grand Prix, Las Vegas Street Circuit' })
        .getByLabel('Race result');
    await expect(raceResult).toHaveText(/Max Verstappen/);
    await browser.close();
});