import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {dataMocks, mock} from '../consts';
import {createMock} from '../mockCombiner/mockCombiner';

// eslint-disable-next-line max-lines-per-function
test.describe('heatMap complex test', () => {
	mock.baseRender = createMock(dataMocks.GERMANY, widgetsMock.baseRender, dataMock.baseRender);
	mock.RadiusDetailLow = createMock(dataMocks.GERMANY, widgetsMock.RadiusDetailLow, dataMock.RadiusDetailLow);
	mock.RadiusDetailHigh = createMock(dataMocks.GERMANY, widgetsMock.RadiusDetailHigh, dataMock.RadiusDetailHigh);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'heatMap', mock.baseRender.story, mock.baseRender.data);
	});
	test('RadiusDetailLow', async({page, context}) => {
		await baseRenderTest(page, context, 'heatMap', mock.RadiusDetailLow.story, mock.RadiusDetailLow.data);
	});
	test('RadiusDetailHigh', async({page, context}) => {
		await baseRenderTest(page, context, 'heatMap', mock.RadiusDetailHigh.story, mock.RadiusDetailHigh.data);
	});
});
