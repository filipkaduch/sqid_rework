// @ts-ignore
import {chromium, FullConfig} from '@playwright/test';
import {ADMIN_LOGIN, ADMIN_PASSWORD} from '../../const';

// eslint-disable-next-line func-style
async function globalSetup(config: FullConfig) {
	// const browser = await chromium.launch({args: ['--disable-dev-shm-usage']});
	const browser = await chromium.launch({
		args: [
			'--no-sandbox',
			'--disable-gpu',
			'--disable-software-rasterizer',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage'
		]
	});

	const page = await browser.newPage();
	const fallbackUrl = process.env.CI ? 'http://localhost:80' : 'http://localhost:8080';
	const finalUrl = config.projects[0].use.baseURL || fallbackUrl;
	await page.goto(finalUrl);

	const userNameSelector = page.locator('input[name="username"]');
	if (await userNameSelector.isVisible()) {
		await page.fill('input[name="username"]', ADMIN_LOGIN);
	}
	const passwordSelector = page.locator('input[name="password"]');
	if (await passwordSelector.isVisible()) {
		await page.fill('input[name="password"]', ADMIN_PASSWORD);
	}

	const kcLoginSelector = page.locator('#kc-login');
	if (await kcLoginSelector.isVisible()) {
		await page.click('#kc-login');
	}
	// Save signed-in state to 'storageState.json'.
	// await page.context().storageState({path: 'tests/e2e/storageState.json'});
	await browser.close();
}

export default globalSetup;
