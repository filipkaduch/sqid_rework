import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {dataMocks, mock} from '../consts';
import {createMock} from '../mockCombiner/mockCombiner';

// eslint-disable-next-line max-lines-per-function
test.describe('heatmap chart complex test', () => {
	mock.baseRender = createMock(dataMocks.STOCKS, widgetsMock.baseRender, dataMock.baseRender);
	mock.Bucket = createMock(dataMocks.STOCKS, widgetsMock.Bucket, dataMock.Bucket);
	mock.FormattingEnums = createMock(dataMocks.STOCKS, widgetsMock.FormattingEnums, dataMock.FormattingEnums);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'heatmapChart', mock.baseRender.story, mock.baseRender.data);
	});
	test('Bucket', async({page, context}) => {
		await baseRenderTest(page, context, 'heatmapChart', mock.Bucket.story, mock.Bucket.data);
	});
	test('FormattingEnums', async({page, context}) => {
		await baseRenderTest(page, context, 'heatmapChart', mock.FormattingEnums.story, mock.FormattingEnums.data);
	});
});
