import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {createMock} from '../mockCombiner/mockCombiner';
import {mock, dataMocks} from '../consts';

// eslint-disable-next-line max-lines-per-function
test.describe('sparklinePie chart complex test', () => {
	mock.baseRender = createMock(dataMocks.STOCKS, widgetsMock.baseRender, dataMock.baseRender);
	mock.FormattingEnums = createMock(dataMocks.STOCKS, widgetsMock.FormattingEnums, dataMock.FormattingEnums);
	mock.TwoDimensions = createMock(dataMocks.STOCKS, widgetsMock.TwoDimensions, dataMock.TwoDimensions);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'sparklinePieChart', mock.baseRender.story, mock.baseRender.data);
	});
	test('Two dimensions', async({page, context}) => {
		await baseRenderTest(page, context, 'sparklinePieChart', mock.TwoDimensions.story, mock.TwoDimensions.data);
	});
	test('FormattingEnums', async({page, context}) => {
		await baseRenderTest(page, context, 'sparklinePieChart', mock.FormattingEnums.story, mock.FormattingEnums.data);
	});
});
