<!-- eslint-disable max-lines -->
<template>
	<ds-box flex-type="column" class="h-100 w-100" :class="{'widget-padding-bottom': readOnly, 'widget-padding-bottom-editor': !readOnly}">
		<axis-name-wrapper :widgetInstanceId="widgetInstanceId">
			<v-chart
				ref="chart"
				class="w-100 h-100 widget-padding"
				autoresize
				:option="widgetData"
				:update-options="{replaceMerge: ['series', 'xAxis', 'yAxis']}"
				@finished="setFinishedRender(true)"
				@legendselectchanged="onLegendClicked" />
		</axis-name-wrapper>
	</ds-box>
</template>

<script>
/* eslint-disable max-statements */
import {
	addAverageAllLineMultiseries,
	addAverageBucketingLineMultiseries,
	checkCumSum,
	selectDataMultiseries
} from '@/util/echartsWidgetsUtil';
import {configuration as config, initialize, options as opt, widgetGroup} from '@/modules/widget/components/widgets/lineMultiseries/consts';
import {dimensionLabel} from '@/util/widgetData';
import echartsMixin from '@/mixins/echartsMixin';
import selectionMixin from '@/mixins/selectionMixin';
import LineMultiSeriesService, {raceAnimationDataset} from './utils';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import cloneDeep from 'lodash/cloneDeep';
import AxisNameWrapper from '@/modules/widget/components/axisNameWrapper.vue';
import {mergeOptions} from '@/modules/widget/utils/widget';

export default {
	name: 'EChartsLineMultiseries',
	components: {
		AxisNameWrapper
	},
	mixins: [
		echartsMixin,
		selectionMixin
	],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	widgetTypes() {
		return ['widget_line_chart_multiseries'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: config,
			options: {
				...opt
			}
		};
	},
	widgetHooks: {
		dataAnalyze(data) {
			return {
				colors: {
					count: data.rows.length
				}
			};
		},
		// eslint-disable-next-line max-lines-per-function,complexity
		dataTransformation(data, configuration, context) {
			let tmpData = [['_']];
			const Dim2arr = [''];
			const series = [];
			const source = [];
			const datasetWithFilters = [];
			const raceDataset = configuration.options.raceAnimation ? raceAnimationDataset(data, configuration, context) : [];
			if (context.indexes.Dimension1.index >= 0 && context.indexes.Dimension2.index >= 0 && context.indexes.Metric1?.index >= 0) {
				for (const item of data.rows) {
					if (!tmpData[0].includes(dimensionLabel(item[context.indexes.Dimension1.index], data.columns[context.indexes.Dimension1.index].dataType))) {
						tmpData[0].push(dimensionLabel(item[context.indexes.Dimension1.index], data.columns[context.indexes.Dimension1.index].dataType));
					}

					if (!tmpData.some((el) => el[0] === dimensionLabel(item[context.indexes.Dimension2.index]))) {
						tmpData.push(['']);
						tmpData[Dim2arr.length][0] = dimensionLabel(item[context.indexes.Dimension2.index], data.columns[context.indexes.Dimension2.index].dataType);
						Dim2arr[Dim2arr.length] = dimensionLabel(item[context.indexes.Dimension2.index], data.columns[context.indexes.Dimension2.index].dataType);
					}
					const row = Dim2arr.indexOf(dimensionLabel(item[context.indexes.Dimension2.index], data.columns[context.indexes.Dimension2.index].dataType));
					const column = tmpData[0].indexOf(dimensionLabel(item[context.indexes.Dimension1.index], data.columns[context.indexes.Dimension1.index].dataType));
					tmpData[row][column] = dimensionLabel(item[context.indexes.Metric1.index], data.columns[context.indexes.Metric1.index].dataType);
				}

				if (configuration.options.averageLineAll) {
					tmpData = addAverageAllLineMultiseries(tmpData);
				}

				if (configuration.options.averageLineBucketing) {
					tmpData = addAverageBucketingLineMultiseries(tmpData, configuration);
				}

				for (let i = 1; i < tmpData[0].length; i++) {
					const tempArr = {subdimension: tmpData[0][i]};
					for (let k = 1; k < tmpData.length; k++) {
						const val = tmpData[k][i];
						// eslint-disable-next-line max-depth
						if (val !== '' && typeof val !== 'undefined' && val !== null) {
							tempArr[tmpData[k][0]] = val;
						} else if (configuration.options.replaceUndefined) {
							tempArr[tmpData[k][0]] = 0;
						}
					}
					if (!source.includes(tempArr)) {
						source.push(tempArr);
					}
				}

				for (let i = 1; i < tmpData.length; i++) {
					if (configuration.options.raceAnimation) {
						datasetWithFilters.push({
							id: `dataset_${tmpData[i][0]}`,
							fromDatasetId: 'dataset_raw',
							transform: {
								type: 'filter',
								config:
									{
										dimension: configuration.data.configuration.dimensions[1].column,
										'=': tmpData[i][0]
									}
							}
						});
					}
					series.push({
						type: 'line',
						...(configuration.options.raceAnimation ? {} : {seriesLayoutBy: 'row'}),
						name: tmpData[i][0],
						lineStyle: {
							width: 3
						},
						emphasis: {
							focus: 'series',
							lineStyle: {
								width: 6
							}
						},
						symbolSize: 6,
						...(configuration.options.raceAnimation
							? {
								datasetId: `dataset_${tmpData[i][0]}`,
								animationDuration: 20000,
								endLabel: {
									align: 'right',
									show: true,
									valueAnimation: true,
									formatter: (params) => `${params.value[1]}: ${params.value[2]}`
								},
								showSymbol: false,
								encode: {
									x: configuration.data.configuration.dimensions[0].column,
									y: configuration.data.configuration.metrics[0].column,
									label: [
										configuration.data.configuration.dimensions[1].column,
										configuration.data.configuration.metrics[0].column
									],
									itemName: configuration.data.configuration.dimensions[1].column
								},
								labelLayout: {
									moveOverlap: 'shiftY'
								}
							}
							: {})
					});
				}
			}

			const options = this.applyOptions(data, configuration, context, series);

			const isWarning = !(
				context.indexes.Dimension1.index >= 0
				&& context.indexes.Dimension2.index >= 0
				&& context.indexes.Metric1?.index >= 0)
				|| (data?.rows?.length ?? 0) === 0
				|| checkCumSum(configuration);

			return {
				isWarning: isWarning ? isWarning : null,
				dataset:
					[
						{
							...(configuration.options.raceAnimation ? {id: 'dataset_raw'} : {}),
							source: configuration.options.raceAnimation ? raceDataset : tmpData
						},
						...datasetWithFilters
					],
				...options
			};
		},
		// eslint-disable-next-line max-lines-per-function,complexity,max-statements
		applyOptions(data, configuration, context, chartSeries = null) {
			const localSeries = chartSeries ? [...chartSeries] : [...context.chartData.series];
			const dimensions = localSeries.map((item) => item.name);

			const service = new LineMultiSeriesService(data, configuration, context);
			let result = null;

			if (context.optionName) {
				const rest = service.changeOptions(configuration, context, dimensions);
				result = {
					...rest
				};
			} else {
				result = {
					animationDuration: 20000,
					grid: service.getGrid(configuration),
					title: service.getTitle(configuration),
					legend: service.getLegend(configuration, context, dimensions),
					tooltip: service.getTooltip(configuration),
					xAxis: service.getXAxis(configuration),
					yAxis: service.getYAxis(configuration),
					series: service.getSeries(configuration, context, localSeries)
				};
			}
			result = {
				...result,
				...(context?.chartData?.dataset ? {dataset: context.chartData.dataset} : {})
			};
			return result;
		}
	},
	computed: {
		widgetData() {
			let data = cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId));
			if (data) {
				data = mergeOptions(data, this.defaultThemeOptions, this.widgetInstanceId);
			}
			return selectDataMultiseries(data, this.selected, true);
		},
		selectedLegend() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.SELECTED_LEGEND);
		}
	},
	methods: {
		onLegendClicked(evt) {
			this.setOptionLegend(widgetOptionName.SELECTED_LEGEND, evt.selected);
		}
	}
};
</script>
