import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import widgetsMock from './mock.json';
import dataMock from './dataMock.json';
import {createMock} from '../mockCombiner/mockCombiner';
import {mock, dataMocks} from '../consts';

// eslint-disable-next-line max-lines-per-function
test.describe('scatterMap complex test', () => {
	mock.baseRender = createMock(dataMocks.DEFAULT, widgetsMock.baseRender, dataMock.baseRender);
	mock.StepProps = createMock(dataMocks.DEFAULT, widgetsMock.StepProps, dataMock.StepProps);
	mock.Average = createMock(dataMocks.DEFAULT, widgetsMock.StepProps, dataMock.Average);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'scatterMap', mock.baseRender.story, mock.baseRender.data);
	});
	test('StepProps', async({page, context}) => {
		await baseRenderTest(page, context, 'scatterMap', mock.StepProps.story, mock.StepProps.data);
	});
	test('Average', async({page, context}) => {
		await baseRenderTest(page, context, 'scatterMap', mock.Average.story, mock.Average.data);
	});
});
