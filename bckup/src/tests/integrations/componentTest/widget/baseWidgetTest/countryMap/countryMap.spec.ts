import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import {dataMocks, mock} from '../consts';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {createMock} from '../mockCombiner/mockCombiner';

// eslint-disable-next-line max-lines-per-function
test.describe('countryMap complex test', () => {
	mock.baseRender = createMock(dataMocks.DEFAULT, widgetsMock.baseRender, dataMock.baseRender);
	mock.Limit = createMock(dataMocks.DEFAULT, widgetsMock.Limit, dataMock.Limit);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'countryMap', mock.baseRender.story, mock.baseRender.data);
	});
	test('Limit', async({page, context}) => {
		await baseRenderTest(page, context, 'countryMap', mock.Limit.story, mock.Limit.data);
	});
});
