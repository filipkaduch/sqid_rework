import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {createMock} from '../mockCombiner/mockCombiner';
import {dataMocks, mock} from '../consts';

// eslint-disable-next-line max-lines-per-function
test.describe('lineTimeComparison chart complex test', () => {
	mock.baseRender = createMock(dataMocks.STOCKS, widgetsMock.baseRender, dataMock.baseRender);
	mock.LatestEntry = createMock(dataMocks.STOCKS, widgetsMock.LatestEntry, dataMock.LatestEntry);
	mock.Extract = createMock(dataMocks.STOCKS, widgetsMock.Extract, dataMock.Extract);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'lineTimeComparisonChart', mock.baseRender.story, mock.baseRender.data);
	});
	test('LatestEntry', async({page, context}) => {
		await baseRenderTest(page, context, 'lineTimeComparisonChart', mock.LatestEntry.story, mock.LatestEntry.data);
	});
	test('Extract', async({page, context}) => {
		await baseRenderTest(page, context, 'lineTimeComparisonChart', mock.Extract.story, mock.Extract.data);
	});
});
