import {describe, it, expect} from 'vitest';
import 'ts-jest';
import {
	addAverageAll,
	addAverageAllLineMultiseries,
	addAverageBucketing,
	addAverageBucketingLineMultiseries,
	stackToMax, stackToMaxMultiseries, selectData,
	selectDataComparison
} from '@/util/echartsWidgetsUtil';
import {echartsContext, echartsOptions, transformedSeries, coloring, selected} from './mockData';
import series from '../dataMocks/series.json';

// eslint-disable-next-line max-lines-per-function
describe('Echarts utils tests', () => {
	it('Stack to max: ', () => {
		const stacked = stackToMax(series.barStacked);
		expect(stacked).not.toBeNull();
		expect(stacked).toEqual(transformedSeries.stackedToMax);
	});
	it('Stack to max multiseries: ', () => {
		const stackedMulti = stackToMaxMultiseries(series.barStackedMulti);
		expect(stackedMulti).not.toBeNull();
		expect(stackedMulti).toEqual(transformedSeries.stackedToMaxMultiseries);
	});

	it('Average all: ', () => {
		const averageAll = addAverageAll(series.averageAll, echartsContext, echartsOptions.options);
		expect(averageAll).not.toBeNull();
		expect(averageAll).toEqual(transformedSeries.averageAll);
	});
	it('Average all multiseries: ', () => {
		const stackedMulti = addAverageAllLineMultiseries(series.averageAllMultiseries);
		expect(stackedMulti).not.toBeNull();
		expect(stackedMulti).toEqual(transformedSeries.averageAllMultiseries);
	});

	it('Average bucketing: ', () => {
		const averageBucketing = addAverageBucketing(series.averageBucketing, echartsContext, echartsOptions.options);
		expect(averageBucketing).not.toBeNull();
		expect(averageBucketing).toEqual(transformedSeries.averageBucket);
	});
	it('Average bucketing multiseries: ', () => {
		const averageBucketing = addAverageBucketingLineMultiseries(series.averageBucketingMultiseries, echartsOptions);
		expect(averageBucketing).not.toBeNull();
		expect(averageBucketing).toEqual(transformedSeries.averageBucketMultiseries);
	});

	it('Select data: ', () => {
		const selectDataPieChart = selectData(series.selectDataPieChart, selected, coloring);
		expect(selectDataPieChart).not.toBeNull();
		expect(selectDataPieChart).toEqual(transformedSeries.selectDataPieChart);
	});

	it('Select data comparison: ', () => {
		const selectedDataComparison = selectDataComparison(series.selectComparison, selected);
		expect(selectedDataComparison).not.toBeNull();
		expect(selectedDataComparison).toEqual(transformedSeries.selectDataComparison);
	});
});
