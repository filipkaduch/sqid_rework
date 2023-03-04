import {test, Page, expect} from '@playwright/test';
import {KeycloakPage} from '../../../pages/keycloak.page';
import {MockFactory} from '../../mockFactory';

const mockFactory = new MockFactory();
let page = {} as Page;
test.beforeAll(async() => {
	await mockFactory.initPolly('openDatasetList');
	page = mockFactory.getPage();
});
test.afterAll(async() => {
	// cleanup
	await mockFactory.pollyStop();
});

test.describe('open dataset list', () => {
	test.describe.configure({mode: 'parallel'});
	test('dataset', async({context}, workerInfo) => {
		const keycloakPage = new KeycloakPage(page);
		await keycloakPage.goto(workerInfo.config.projects[0].use.baseURL);
		await keycloakPage.loginAsAdmin();
		await page.click('data-testid=dataset-list');
		const datasetListTable = await page.locator('data-testid=datasetListTable');
		await page.waitForTimeout(500);
		expect(await datasetListTable.screenshot()).toMatchSnapshot();
	});
});

