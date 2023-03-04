import {test} from '@playwright/test';
import {baseRenderTest} from '../utils';
import {dataMocks, mock} from '../consts';
import widgetsMock from './mock.json';
import {createMock} from '../mockCombiner/mockCombiner';

// eslint-disable-next-line max-lines-per-function
test.describe('heroImage complex test', () => {
	mock.baseRender = createMock(dataMocks.STOCKS, widgetsMock.baseRender);
	mock.StepProps = createMock(dataMocks.STOCKS, widgetsMock.StepProps);

	test.describe.configure({mode: 'parallel'});
	test('base render', async({page, context}) => {
		await baseRenderTest(page, context, 'heroImage', mock.baseRender.story, mock.baseRender.data);
	});
	test('StepProps', async({page, context}) => {
		await baseRenderTest(page, context, 'heroImage', mock.StepProps.story, mock.StepProps.data);
	});
});
