import {test, Page, expect} from '@playwright/test';
import {KeycloakPage} from '../../../pages/keycloak.page';
import {MockFactory} from '../../mockFactory';

const mockFactory = new MockFactory();
let page = {} as Page;
test.beforeAll(async() => {
	await mockFactory.initPolly('createExploration');
	page = mockFactory.getPage();
});
test.afterAll(async() => {
	// cleanup
	await mockFactory.pollyStop();
});

test.describe('create exploration', () => {
	test.describe.configure({mode: 'parallel'});
	test('explorer', async({context}, workerInfo) => {
		const keycloakPage = new KeycloakPage(page);
		await keycloakPage.goto('http://localhost:8080/create-story');
		await keycloakPage.loginAsAdmin();
		await page.click('data-testid=data-explore');
		await page.click('data-testid=Dataset');
		await page.locator('data-testid=search').locator('input').fill('1000');
		await page.waitForTimeout(1000);
		await page.locator('data-testid=datasetListTable', {has: page.locator('data-testid=tableRow').first()}).click();
		await page.click('data-testid=confirm-btn');
		await page.waitForSelector('data-testid=dataAssetList');
		await page.locator('data-testid=dataAssetList');
		await expect((await page.locator('data-testid=dataAssetList', {has: page.locator('data-testid=tableRow', {hasText: 'Azerbaijan'})}))).toHaveCount(1);
	});
});

