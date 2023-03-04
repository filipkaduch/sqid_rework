import {test, expect} from '@playwright/test';

import {MockFactory} from '../../mockFactory';

test.describe('presenter test', () => {
	test('dataset', async({context}, workerInfo) => {
		const mockFactory = new MockFactory();
		await mockFactory.initPolly('presenterOpenStory');
		const page = mockFactory.getPage();
		await page.goto('/publish/public/4e8e5c74-7977-4bee-a81d-03a228ca7368');
		await page.click('data-testid=presenter-open-sidebar');
		await page.waitForSelector('data-testid=presenter-sidebar');
		await page.keyboard.press('ArrowDown');

		const testWidget = page.locator('data-testid=presenter-sections');
		await page.waitForSelector('canvas');
		// Time for chart init rendering animation
		await page.waitForTimeout(500);
		expect(await testWidget.screenshot()).toMatchSnapshot();
		// cleanup
		await mockFactory.pollyStop();
	});
});

