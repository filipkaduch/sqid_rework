import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {createMock} from '../mockCombiner/mockCombiner';
import {mock, dataMocks} from '../consts';

// eslint-disable-next-line max-lines-per-function
test.describe('line chart complex test', () => {
	mock.baseRender = createMock(dataMocks.POKEMON, widgetsMock.baseRender, dataMock.baseRender);
	mock.FormattingEnums = createMock(dataMocks.COVID, widgetsMock.FormattingEnums, dataMock.FormattingEnums);
	mock.Bucket = createMock(dataMocks.STOCKS, widgetsMock.Bucket, dataMock.Bucket);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'lineChart', mock.baseRender.story, mock.baseRender.data);
	});
	test('Bucket', async({page, context}) => {
		await baseRenderTest(page, context, 'lineChart', mock.Bucket.story, mock.Bucket.data);
	});
	test('FormattingEnums', async({page, context}) => {
		await baseRenderTest(page, context, 'lineChart', mock.FormattingEnums.story, mock.FormattingEnums.data);
	});
});

