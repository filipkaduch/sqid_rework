import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import {createMock} from '../mockCombiner/mockCombiner';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {mock, dataMocks} from '../consts';

// eslint-disable-next-line max-lines-per-function
test.describe('bar chart complex test', () => {
	mock.baseRender = createMock(dataMocks.STOCKS, widgetsMock.baseRender, dataMock.baseRender);
	mock.FormattingEnums = createMock(dataMocks.STOCKS, widgetsMock.FormattingEnums, dataMock.FormattingEnums);
	mock.Bucket = createMock(dataMocks.BAR_BUCKET, widgetsMock.Bucket, dataMock.Bucket);

	test.describe.configure({mode: 'parallel'});

	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'barChart', mock.baseRender.story, mock.baseRender.data);
	});
	test('Bucket', async({page, context}) => {
		await baseRenderTest(page, context, 'barChart', mock.Bucket.story, mock.Bucket.data);
	});
	test('FormattingEnums', async({page, context}) => {
		await baseRenderTest(page, context, 'barChart', mock.FormattingEnums.story, mock.FormattingEnums.data);
	});
});

