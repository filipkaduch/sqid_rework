import {describe, it, expect} from 'vitest';
import 'ts-jest';
import {rankingData, globalFilterData, filtersData} from './mock/widgetDataConfigMapperMock';
import {mapFilters, mapRanking, prepareGlobalFilters} from '@/util/widgetDataConfigMapper';

export const configMapper = describe('Testing functions from widgetDataConfigMapper', () => {
	rankingData.forEach((item) => {
		it(`mapRanking -> ${item.testName}`, () => {
			const result = mapRanking(item.data.widgetConfiguration, item.data.metadataConfig);
			expect(result).not.toBeNull();
			expect(result).toEqual(item.correct);
		});
	});

	globalFilterData.forEach((item) => {
		it(`prepareGlobalFilters -> ${item.testName}`, () => {
			const result = prepareGlobalFilters(item.data.filters.globalFilter, item.data.widgetConfiguration);
			expect(result).not.toBeNull();
			expect(result).toEqual(item.correct);
		});
	});

	filtersData.forEach((item) => {
		it(`mapFilters -> ${item.testName}`, () => {
			const result = mapFilters(item.data.widgetConfiguration, item.data.filters, item.data.topValues);
			expect(result).not.toBeNull();
			expect(result).toEqual(item.correct);
		});
	});
});
