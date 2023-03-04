import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {dataMocks, mock} from '../consts';
import {createMock} from '../mockCombiner/mockCombiner';

// eslint-disable-next-line max-lines-per-function
test.describe('hexagonMap complex test', () => {
	mock.baseRender = createMock(dataMocks.DEFAULT, widgetsMock.baseRender, dataMock.baseRender);
	mock.StepPropsHigh = createMock(dataMocks.DEFAULT, widgetsMock.StepPropsHigh, dataMock.StepPropsHigh);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'hexagonMap', mock.baseRender.story, mock.baseRender.data);
	});
	test('StepPropsHigh', async({page, context}) => {
		await baseRenderTest(page, context, 'hexagonMap', mock.StepPropsHigh.story, mock.StepPropsHigh.data);
	});
});
