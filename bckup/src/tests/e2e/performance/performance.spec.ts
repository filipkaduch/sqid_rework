// @ts-ignore
import {test} from '@playwright/test';
import {KeycloakPage} from '../../pages/keycloak.page';
import {sections} from './testSections';
// @ts-ignore
import {storyType} from '@/modules/story/consts/storyType';

/* eslint-disable no-await-in-loop */
// @ts-ignore
test.beforeEach(async({page}, workerInfo) => {
	const keycloakPage = new KeycloakPage(page);
	const fallbackUrl = process.env.CI ? 'http://localhost:80' : 'http://localhost:8080';
	await keycloakPage.goto(workerInfo.config.projects[0].use.baseURL || fallbackUrl);
	await keycloakPage.loginAsAdmin();
});

const testFilters = async(page: any) => {
	if (await page.locator('data-testid=show-filter-dataset-operation').isVisible()) {
		await page.locator('data-testid=show-filter-dataset-operation').click();
	}
	if (await page.locator('data-testid=filter-dataset-operation-0').isVisible()) {
		await page.locator('data-testid=filter-dataset-operation-0').click();
	}
	await page.locator('data-testid=show-filter-hints').click();

	if (await page.locator('data-testid=filter-hint-0').isVisible()) {
		await page.locator('data-testid=filter-hint-0').click();
	}
	if (await page.locator('data-testid=apply-filter-btn').isVisible()) {
		await page.locator('data-testid=apply-filter-btn').click();
	}
};

// eslint-disable-next-line max-lines-per-function
test.describe('End to end performance', () => {
	// eslint-disable-next-line max-statements
	test('Create story, generate all widgets, add global filter, change theme colors', async({page}) => {
		await page.goto('/create-story');
		await page.locator('data-testid=story-type').click();
		await page.locator('data-testid=list-item').click();
		await page.locator('data-testid=confirm-btn').click();

		let sectionsIterator = 0;
		for (const section of sections) {
			let widgetsIterator = 0;
			for (const btn of section.buttons) {
				const addWidgetBtn = page.locator('data-testid=add-widget-btn');
				if (await addWidgetBtn.isVisible()) {
					await addWidgetBtn.click();
				}
				const startTime = Date.now();
				const widgetBtn = page.locator(`data-testid=widget-btn-${sectionsIterator}-${widgetsIterator}`);
				if (await widgetBtn.isVisible()) {
					await widgetBtn.click();
				}

				console.log(`Generated ${btn.name}: ${Date.now() - startTime} miliseconds`);
				await page.waitForTimeout(3000);
				widgetsIterator += 1;
			}
			sectionsIterator += 1;
		}
		await page.locator('data-testid=deselect-section').click();
		await page.locator('data-testid=story-section').click();
		await page.locator('data-testid=show-global-filters').click();
		await page.locator('data-testid=add-global-filter').click();
		await page.locator('data-testid=show-global-filter-columns').click();
		await page.locator('data-testid=global-filter-dataset-0').click();
		await page.locator('data-testid=global-filter-column-0').click();
		await testFilters(page);

		await page.locator('data-testid=show-themes').click();
		await page.locator('data-testid=theme-1').click();
		await page.locator('.btn-white >> text=No').click();
		await page.waitForTimeout(2000);
	});

	// @ts-ignore
	// eslint-disable-next-line max-lines-per-function, max-statements
	test('2. Create story, generate all widgets one by one, change color, add filter', async({page}) => {
		await page.goto('/create-story');
		await page.locator('data-testid=story-type').click();
		await page.locator('data-testid=list-item').click();
		await page.locator('data-testid=confirm-btn').click();
		let sectionsIterator = 0;

		for (const section of sections) {
			let widgetsIterator = 0;

			for (const btn of section.buttons) {
				const addWidgetBtn = page.locator('data-testid=add-widget-step');
				await addWidgetBtn.click();
				const startTime = Date.now();
				const widgetBtn = page.locator(`data-testid=widget-btn-${sectionsIterator}-${widgetsIterator}`);
				await widgetBtn.click();

				console.log(`Generated ${btn.name}: ${(Date.now()) - startTime} miliseconds`);
				await page.waitForTimeout(2000);
				const filtersSection = page.locator('data-testid=filters-section');
				if (await filtersSection.isVisible()) {
					await filtersSection.click();
					await page.locator('data-testid=add-filter').click();
					await page.locator('data-testid=show-filter-datasets').click();
					await page.locator('data-testid=filter-dataset-0').click();
					await page.locator('data-testid=filter-dataset-column-0').click();
					await testFilters(page);
				}
				await page.waitForTimeout(2000);
				const dataSection = page.locator('data-testid=show-data');
				if (await dataSection.isVisible()) {
					await dataSection.click();

					const dimension1Enum = page.locator('data-testid=show-dimension-enum-0');
					const dimension2Enum = page.locator('data-testid=show-dimension-enum-1');
					const metric1Enum = page.locator('data-testid=show-metric-enum-0');
					const colorPicker = page.locator('data-testid=color-picker-0-dimension');
					const colorPickerMetric = page.locator('data-testid=color-picker-0-metric');
					if (await dimension1Enum.isVisible()) {
						await dimension1Enum.click();
						// eslint-disable-next-line max-depth
						if (await colorPicker.isVisible()) {
							await colorPicker.click();
							await page.locator('[aria-label="color:RGB(0,0,0)"]').click();
						}
					}
					if (await dimension2Enum.isVisible()) {
						await dimension2Enum.click();
						// eslint-disable-next-line max-depth
						if (await colorPicker.isVisible()) {
							await colorPicker.click();
							await page.locator('[aria-label="color:RGB(0,0,0)"]').click();
						}
					}

					if (await metric1Enum.isVisible()) {
						await metric1Enum.click();
						// eslint-disable-next-line max-depth
						if (await colorPickerMetric.isVisible()) {
							await colorPickerMetric.click();
							await page.locator('[aria-label="color:RGB(0,0,0)"]').click();
						}
					}
				}
				await page.locator('data-testid=remove-widget-step').click();

				widgetsIterator += 1;
			}
			sectionsIterator += 1;
		}
	});

	// @ts-ignore
	// eslint-disable-next-line max-lines-per-function, max-statements
	test('3. Create dashboard, generate all widgets, change color, add filter', async({page}) => {
		await page.goto('/create-story');
		await page.locator(`data-testid=${storyType.DATA_DASHBOARD}`).click();
		await page.locator('data-testid=list-item').click();
		await page.locator('data-testid=confirm-btn').click();

		for (const section of sections) {
			for (const btn of section.buttons) {
				const widgetType = page.locator(`data-testid=dashboard-widget-${btn.widgetType}`);
				const subGroup = page.locator(`data-testid=subgroup-${btn.subGroup}`);

				await page.locator(`data-testid=menu-item-${section.testTitle}`).click();
				if (!await widgetType.isVisible()) {
					await subGroup.click();
				}

				const startTime = Date.now();

				if (await widgetType.isVisible()) {
					await widgetType.click();
				}

				console.log(`Generated ${btn.name}: ${(Date.now()) - startTime} miliseconds`);
				await page.waitForTimeout(2000);

				const filtersSection = page.locator('data-testid=filters-section');
				if (await filtersSection.isVisible()) {
					await filtersSection.click();
					await page.locator('data-testid=add-filter').click();
					await page.locator('data-testid=show-filter-datasets').click();
					await page.locator('data-testid=filter-dataset-0').click();
					await page.locator('data-testid=filter-dataset-column-0').click();
					await testFilters(page);
				}
				await page.waitForTimeout(2000);
				const dataSection = page.locator('data-testid=show-data');
				if (await dataSection.isVisible()) {
					await dataSection.click();

					const dimension1Enum = page.locator('data-testid=show-dimension-enum-0');
					const dimension2Enum = page.locator('data-testid=show-dimension-enum-1');
					const metric1Enum = page.locator('data-testid=show-metric-enum-0');
					const colorPicker = page.locator('data-testid=color-picker-0-dimension');
					const colorPickerMetric = page.locator('data-testid=color-picker-0-metric');
					if (await dimension1Enum.isVisible()) {
						await dimension1Enum.click();
						// eslint-disable-next-line max-depth
						if (await colorPicker.isVisible()) {
							await colorPicker.click();
							await page.locator('[aria-label="color:RGB(0,0,0)"]').click();
						}
					}
					if (await dimension2Enum.isVisible()) {
						await dimension2Enum.click();
						// eslint-disable-next-line max-depth
						if (await colorPicker.isVisible()) {
							await colorPicker.click();
							await page.locator('[aria-label="color:RGB(0,0,0)"]').click();
						}
					}

					if (await metric1Enum.isVisible()) {
						await metric1Enum.click();
						// eslint-disable-next-line max-depth
						if (await colorPickerMetric.isVisible()) {
							await colorPickerMetric.click();
							await page.locator('[aria-label="color:RGB(0,0,0)"]').click();
						}
					}
				}
				await page.waitForTimeout(2000);
			}
		}
	});
});
