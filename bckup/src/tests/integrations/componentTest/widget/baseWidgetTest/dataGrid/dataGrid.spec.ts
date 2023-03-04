import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {dataMocks, mock} from '../consts';
import {createMock} from '../mockCombiner/mockCombiner';

// eslint-disable-next-line max-lines-per-function
test.describe('dataGrid complex test', () => {
	mock.baseRender = createMock(dataMocks.DEFAULT, widgetsMock.baseRender, dataMock.baseRender);
	mock.TwoDimensions = createMock(dataMocks.DEFAULT, widgetsMock.TwoDimensions, dataMock.TwoDimensions);
	mock.StepProps = createMock(dataMocks.DEFAULT, widgetsMock.StepProps, dataMock.StepProps);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'dataGrid', mock.baseRender.story, mock.baseRender.data);
	});
	test('StepProps', async({page, context}) => {
		await baseRenderTest(page, context, 'dataGrid', mock.StepProps.story, mock.StepProps.data);
	});
	test('TwoDimensions', async({page, context}) => {
		await baseRenderTest(page, context, 'dataGrid', mock.TwoDimensions.story, mock.TwoDimensions.data);
	});
});
