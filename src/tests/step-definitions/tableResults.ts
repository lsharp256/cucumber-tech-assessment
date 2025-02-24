import { Given, When, Then } from "@cucumber/cucumber";
import { Page, Browser, chromium, expect } from "@playwright/test";

let browser: Browser;
let page: Page;

Given('I am on the BBC Sport page', async function () {
    // Add this to the launch options to run the tests in headless mode: {headless: false}
    browser = await chromium.launch({headless: false});
    page = await browser.newPage();
    await page.goto('https://www.bbc.co.uk/sport', { waitUntil: 'domcontentloaded' });
    console.info('Navigated to BBC Sport page');
});

When('I navigate to the results table', async function () {
    await page.getByText('Formula 1').first().click();
    console.info('Clicked on Formula 1');
    await page.getByText('Results').click();
    console.info('Clicked on Results');
    // could also use getByTestId('datepicker-date-link-2023') to get the link for 2023
    await page.getByTestId('datepicker-date-value').getByText('2023').click();
    console.info('Selected year 2023');
}); 

Then('I should see {string} in the results', async function (driverName: string) {
    // Close Abu Dhabi results (since it's open by default)
    const abuDhabiResultsButton = page.getByRole('button', { name: "Abu Dhabi Grand Prix, Yas Marina" });
    await abuDhabiResultsButton.waitFor({ state: 'attached' }); // Ensure button exists
    console.info('Abu Dhabi results button found');
    await abuDhabiResultsButton.click();
    console.info('Clicked on Abu Dhabi results button');

    // Wait for Abu Dhabi section to collapse (observe any structural changes)
    await page.waitForTimeout(5000);
    console.info('Waited for Abu Dhabi section to collapse');

    // Open Las Vegas results
    const lasVegasResultsButton = page.getByRole('button', { name: "Las Vegas Grand Prix, Las Vegas Street Circuit" });
    await lasVegasResultsButton.waitFor({ state: 'attached' }); // Ensure button exists
    console.info('Las Vegas results button found');
    await lasVegasResultsButton.click();
    console.info('Clicked on Las Vegas results button');

    // Wait for the race results table to appear
    await page.waitForSelector('[aria-label="Race result"]', { timeout: 10000 });
    console.info('Race results table appeared');

    const lasVegasTable = page.locator('section:has-text("Las Vegas Grand Prix")').getByRole('table');
    await lasVegasTable.waitFor({ state: 'visible', timeout: 10000 });
    console.info('Las Vegas table is visible');

    const tableContent = await lasVegasTable.textContent();
    console.log("Table content: ", tableContent);

    const tableRows = await lasVegasTable.locator('tr');
    const rowTexts = await tableRows.allTextContents();
    console.log('Table row texts:', rowTexts);

    // Ensure driver name appears in the results
    const raceResultLocator = lasVegasTable.getByText(new RegExp(driverName, 'i'), { exact: false });

    // Ensure it's visible before asserting
    await raceResultLocator.waitFor({ state: 'visible' });
    console.info(`Driver name ${driverName} is visible in the results`);
    await expect(raceResultLocator).toBeVisible({ timeout: 15000 });
});
