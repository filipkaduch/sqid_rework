import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {createMock} from '../mockCombiner/mockCombiner';
import {dataMocks, mock} from '../consts';

// eslint-disable-next-line max-lines-per-function
test.describe('arcMap complex test', () => {
	mock.baseRender = createMock(dataMocks.DEFAULT, widgetsMock.baseRender, dataMock.baseRender);
	mock.Limit = createMock(dataMocks.DEFAULT, widgetsMock.Limit, dataMock.Limit);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'arcMap', mock.baseRender.story, mock.baseRender.data);
	});
	test('Limit and Ordering', async({page, context}) => {
		await baseRenderTest(page, context, 'arcMap', mock.Limit.story, mock.Limit.data);
	});
});
