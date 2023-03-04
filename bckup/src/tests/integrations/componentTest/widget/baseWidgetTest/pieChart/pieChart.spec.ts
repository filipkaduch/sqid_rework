import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {createMock} from '../mockCombiner/mockCombiner';
import {dataMocks, mock} from '../consts';

// eslint-disable-next-line max-lines-per-function
test.describe('pie chart complex test', () => {
	mock.baseRender = createMock(dataMocks.POKEMON, widgetsMock.baseRender, dataMock.baseRender);
	mock.Bucket = createMock(dataMocks.COVID, widgetsMock.Bucket, dataMock.Bucket);
	mock.FormattingEnums = createMock(dataMocks.COVID, widgetsMock.FormattingEnums, dataMock.FormattingEnums);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'pieChart', mock.baseRender.story, mock.baseRender.data);
	});
	test('Bucket', async({page, context}) => {
		await baseRenderTest(page, context, 'pieChart', mock.Bucket.story, mock.Bucket.data);
	});
	test('FormattingEnums', async({page, context}) => {
		await baseRenderTest(page, context, 'pieChart', mock.FormattingEnums.story, mock.FormattingEnums.data);
	});
});

