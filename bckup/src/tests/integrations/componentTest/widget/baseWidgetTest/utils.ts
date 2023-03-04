import {NON_CANVAS_WIDGETS, URL_DATA, URL_STORY} from './consts';
import {BrowserContext, expect, Page} from '@playwright/test';

export const baseRenderTest = async(page: Page, context: BrowserContext, chartName: string, story: Object, data: Object) => {
	const headers = {
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'text/plain; charset=utf-8'
	};
	await context.route(`${URL_STORY}${chartName}`, (route, request) => {
		// @ts-ignore
		route.fulfill({
			headers,
			status: 200,
			body: JSON.stringify({data: story})
		});
		request.response();
	});
	await context.route(`${URL_DATA}${chartName}`, (route, request) => {
		// @ts-ignore
		route.fulfill({
			headers,
			status: 200,
			body: JSON.stringify({data})
		});
		request.response();
	});
	await page.goto(`/baseWidgetTest/${chartName}`);
	const testWidget = page.locator('data-test-id=test-widget');
	if (NON_CANVAS_WIDGETS.includes(chartName)) {
		if (chartName === 'heroImage') {
			await page.waitForTimeout(2000);
		} else {
			await page.waitForTimeout(300);
		}
	} else {
		await page.waitForSelector('canvas');
		// Time for chart init rendering animation
		await page.waitForTimeout(5000);
	}
	expect(await testWidget.screenshot()).toMatchSnapshot();
};
