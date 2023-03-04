import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {dataMocks, mock} from '../consts';
import {createMock} from '../mockCombiner/mockCombiner';

// eslint-disable-next-line max-lines-per-function
test.describe('formulaChart complex test', () => {
	mock.baseRender = createMock(dataMocks.STOCKS, widgetsMock.baseRender, dataMock.baseRender);
	mock.StepProps = createMock(dataMocks.STOCKS, widgetsMock.StepProps1, dataMock.StepProps1);
	mock.StepPropsHigh = createMock(dataMocks.STOCKS, widgetsMock.StepProps2, dataMock.StepProps2);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'formulaChart', mock.baseRender.story, mock.baseRender.data);
	});
	test('StepProps 1', async({page, context}) => {
		await baseRenderTest(page, context, 'formulaChart', mock.StepProps.story, mock.StepProps.data);
	});
	test('StepProps 2', async({page, context}) => {
		await baseRenderTest(page, context, 'formulaChart', mock.StepPropsHigh.story, mock.StepPropsHigh.data);
	});
});
