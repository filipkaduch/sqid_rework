import {describe, it, expect} from 'vitest';
import 'ts-jest';
import datasetsMock from '../dataMocks/datasets.json';
import {dataWidgets} from '@/util/consts/widgetTypes';
import widgetDataConfigurationAutomapper from '@/util/widgetDataConfigurationAutomapper';
import {widgetDataConfigurations} from './mockData';
import {objectCaseMapper, objectCaseStyles} from '@/util/objectCaseMapper';


describe('Automapper tests', () => {
	for (const [key, widgetType] of Object.entries(dataWidgets)) {
		const datasets = [
			objectCaseMapper(datasetsMock.covid, objectCaseStyles.CAMEL_CASE),
			objectCaseMapper(datasetsMock.default, objectCaseStyles.CAMEL_CASE)
		];
		// eslint-disable-next-line no-loop-func
		it(`Automapping chart: ${widgetType}`, async() => {
			const automappedConfig = await widgetDataConfigurationAutomapper(
				widgetDataConfigurations[widgetType]?.config.data,
				{catalogItems: [], datasets},
				// @ts-ignore
				widgetType
			);
			expect(automappedConfig).not.toBeNull();
			expect(automappedConfig).toEqual(widgetDataConfigurations[widgetType].correct);
		});
	}
});
