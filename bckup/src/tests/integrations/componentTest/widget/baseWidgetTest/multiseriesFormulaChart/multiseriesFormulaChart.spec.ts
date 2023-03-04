import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {dataMocks, mock} from '../consts';
import {createMock} from '../mockCombiner/mockCombiner';

// eslint-disable-next-line max-lines-per-function
test.describe('multiseriesFormulaChart complex test', () => {
	mock.baseRender = createMock(dataMocks.STOCKS, widgetsMock.baseRender, dataMock.baseRender);
	mock.MultiMetrics = createMock(dataMocks.STOCKS, widgetsMock.MultiMetrics, dataMock.MultiMetrics);
	mock.StepProps = createMock(dataMocks.STOCKS, widgetsMock.StepProps, dataMock.StepProps);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'multiseriesFormulaChart', mock.baseRender.story, mock.baseRender.data);
	});
	test('MultiMetrics', async({page, context}) => {
		await baseRenderTest(page, context, 'multiseriesFormulaChart', mock.MultiMetrics.story, mock.MultiMetrics.data);
	});
	test('StepProps', async({page, context}) => {
		await baseRenderTest(page, context, 'multiseriesFormulaChart', mock.StepProps.story, mock.StepProps.data);
	});
});
