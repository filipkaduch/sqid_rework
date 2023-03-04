import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {dataMocks, mock} from '../consts';
import {createMock} from '../mockCombiner/mockCombiner';

// eslint-disable-next-line max-lines-per-function
test.describe('heatmapCalendar chart complex test', () => {
	mock.baseRender = createMock(dataMocks.STOCKS, widgetsMock.baseRender, dataMock.baseRender);
	mock.Bucket = createMock(dataMocks.STOCKS, widgetsMock.Bucket, dataMock.Bucket);
	mock.Descending = createMock(dataMocks.STOCKS, widgetsMock.Descending, dataMock.Descending);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'heatmapCalendarChart', mock.baseRender.story, mock.baseRender.data);
	});
	test('Bucket', async({page, context}) => {
		await baseRenderTest(page, context, 'heatmapCalendarChart', mock.Bucket.story, mock.Bucket.data);
	});
	test('Descending', async({page, context}) => {
		await baseRenderTest(page, context, 'heatmapCalendarChart', mock.Descending.story, mock.Descending.data);
	});
});
