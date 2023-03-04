<template>
	<div class="h-100" :class="readOnly ? 'widget-padding-bottom' : ''">
		<ds-row class="w-100 d-flex justify-content-center">
			<h3>{{ title }}</h3>
		</ds-row>
		<ds-container ref="grid" class="align-items-center h-100 d-flex px-0">
			<ds-row class="h-100 w-100" :style="widgetData?.length > 16 ? 'overflow-y: scroll' : ''">
				<ds-col
					v-for="(item, index) in widgetData"
					:key="index"
					:cols="getColumnsCount(widgetData?.length, false)">
					<v-chart
						:key="index"
						:ref="'chart' + index"
						class="w-100"
						:style="getChartHeight(widgetData?.length)"
						autoresize
						:option="selectData(item, selected, true)"
						@finished="setFinishedRender(true)" />
				</ds-col>
			</ds-row>
		</ds-container>
	</div>
</template>

<script>
import {
	configuration as config,
	options,
	getChartHeight,
	initialize,
	widgetGroup
} from '@/modules/widget/components/widgets/sparkline/consts';
import {
	getColumnsCount,
	replaceUndefinedValues,
	selectData
} from '@/util/echartsWidgetsUtil';
import {chartConstants} from '@/util/consts/chartsConstants';
import {dimensionLabel} from '@/util/widgetData';
import echartsMixin from '@/mixins/echartsMixin';
import selectionMixin from '@/mixins/selectionMixin';
import SparklineService from '@/modules/widget/components/widgets/sparkline/utils';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import cloneDeep from 'lodash/cloneDeep';

export default {
	name: 'EChartsSparkline',
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
		return ['widget_sparkline'];
	},
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: {...config},
			options
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
		// eslint-disable-next-line max-lines-per-function,max-statements
		dataTransformation(data, configuration, context) {
			const dimension1Index = context.indexes.Dimension1.index;
			const dimension2Index = context.indexes.Dimension2.index;
			const metricIndex = context.indexes.Metric1.index;
			let tmpData = [['']];
			const Dim2arr = [''];
			const series = [];
			if (dimension1Index >= 0 && dimension2Index >= 0 && metricIndex >= 0) {
				for (const item of data.rows) {
					if (!tmpData[0].includes(dimensionLabel(item[dimension1Index], data.columns[dimension1Index].dataType))) {
						tmpData[0].push(dimensionLabel(item[dimension1Index], data.columns[dimension1Index].dataType));
					}

					if (!tmpData.some((el) => el[0] === dimensionLabel(item[dimension2Index]))) {
						tmpData.push(['']);
						tmpData[Dim2arr.length][0] = dimensionLabel(item[dimension2Index], data.columns[dimension2Index].dataType);
						Dim2arr[Dim2arr.length] = dimensionLabel(item[dimension2Index], data.columns[dimension2Index].dataType);
					}
					const row = Dim2arr.indexOf(dimensionLabel(item[dimension2Index], data.columns[dimension2Index].dataType));
					const column = tmpData[0].indexOf(dimensionLabel(item[dimension1Index], data.columns[dimension1Index].dataType));
					tmpData[row][column] = dimensionLabel(item[metricIndex], data.columns[metricIndex].dataType);
				}
				if (configuration.options.replaceUndefined) {
					tmpData = replaceUndefinedValues(tmpData);
				}

				for (let i = 1; i < tmpData.length; i++) {
					series.push({
						type: 'line',
						seriesLayoutBy: 'row',
						name: tmpData[i][0],
						data: tmpData[i],
						symbolSize: 4,
						markPoint: {
							itemStyle: {
								color: 'transparent'
							},
							label: {
								color: 'black'
							},
							data: [
								{
									name: 'Last',
									value: tmpData[i][tmpData[i].length - 1],
									coord: [
										tmpData[0][tmpData[0].length - 1],
										tmpData[i][tmpData[i].length - 1]
									]
								},
								{
									name: 'First',
									value: tmpData[i][1],
									coord: [
										tmpData[0][1],
										tmpData[i][1]
									]
								}
							]
						},
						itemStyle: {
							barBorderRadius: chartConstants.barBorderRadius
						}
					});
				}
			}

			const dataOptions = [];
			for (let i = 1; i < tmpData.length; i++) {
				dataOptions.push({
					dataset: {
						source: [
							tmpData[0],
							tmpData[i]
						]
					},
					xAxis: {
						data: tmpData[0]
					},
					series: series[i - 1]
				});
			}
			return this.applyOptions(data, configuration, context, dataOptions);
		},
		applyOptions(data, configuration, context, chartData = null) {
			const service = new SparklineService(data, configuration, context);
			let instanceData = chartData ? chartData : context.chartData;
			instanceData = instanceData.map((instance, index) => {
				const dimension = instance.series.name;
				let result = null;

				if (context.optionName) {
					const rest = service.changeOptions(configuration, context, dimension, index);
					result = {
						...rest
					};
				} else {
					result = {
						...instance,
						legend: service.getLegend(configuration, context, dimension, instance.dataset.source[1]),
						tooltip: service.getTooltip(),
						xAxis: {
							...instance.xAxis,
							...service.getXAxis(configuration)
						},
						yAxis: service.getYAxis(configuration),
						series: service.getSeries(configuration, context, instance.series, index)
					};
				}
				return {
					...result,
					...(instance.dataset ? {dataset: instance.dataset} : {})
				};
			});
			return instanceData;
		}
	},
	data() {
		return {
			getChartHeight,
			getColumnsCount,
			selectData
		};
	},
	computed: {
		widgetData() {
			return cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId));
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		stacked() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'stacked');
		},
		title() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'title');
		}
	},
	methods: {
		onLegendClicked(evt) {
			this.setOption(evt.selected, widgetOptionName.SELECTED_LEGEND);
		}
	}
};
</script>
