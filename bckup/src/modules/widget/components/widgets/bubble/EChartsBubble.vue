<template>
	<v-chart
		v-if="widgetData"
		ref="chart"
		class="w-100 h-100 widget-padding"
		:class="readOnly ? 'widget-padding-bottom' : ''"
		autoresize
		:option="widgetData"
		@finished="setFinishedRender(true)"
		@click="onItemClicked" />
		<!-- TODO Add dynamic filter -->
		<!-- @click="onItemClicked" -->
</template>

<script>
import {
	configuration as config,
	initialize,
	options as opt
} from '@/modules/widget/components/widgets/bubble/consts';
import echartsMixin from '@/mixins/echartsMixin';
import selectionMixin from '@/mixins/selectionMixin';
import BubbleChartService from '@/modules/widget/components/widgets/bubble/utils';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import findIndex from 'lodash/findIndex';
import {chartConstants} from '@/util/consts/chartsConstants';

export default {
	name: 'EChartsBubble',
	mixins: [
		selectionMixin,
		echartsMixin
	],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	widgetTypes() {
		return ['widget_bubble_chart'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup: {
				group: 'chart',
				subGroup: 'chart_usecases'
			},
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
					count: data.rows?.length
				}
			};
		},
		// eslint-disable-next-line max-lines-per-function, max-statements
		dataTransformation(data, configuration, context) {
			const series = [];
			const metricIndexes = [];

			for (const key in context.indexes) {
				if (key.includes('Metric')) {
					metricIndexes.push(context.indexes[key].index);
				}
			}

			const datasetSource = data.rows;

			if (context.indexes.Dimension1.index >= 0 && context.indexes.Dimension2.index >= 0 && metricIndexes.every((el) => el >= 0)) {
				let max = null;
				let min = null;
				const types = new Set();
				for (const item of data.rows) {
					const res = metricIndexes.map((item2) => item[item2]);
					max = Math.max(max, res);
					min = Math.min(min, res);
					if (context.indexes.Dimension3) {
						types.add(item[context.indexes.Dimension3.index]);
					}
				}

				for (let i = 0; i < metricIndexes?.length; i++) {
					series.push({
						type: 'scatter',
						itemStyle: {
							color: (param) => {
								if (context.indexes.Dimension3) {
									const key = param.data[context.indexes.Dimension3.index];
									return context.colors.coloring?.[chartConstants.dataConfiguration.DIMENSION2]?.[key]
										?? context.colors.coloring?.[chartConstants.dataConfiguration.METRIC0] ?? context.colors.theme?.[0];
								}
								return context.colors.coloring?.[chartConstants.dataConfiguration.METRIC0] ?? context.colors.theme?.[0];
							}
						},
						// eslint-disable-next-line no-loop-func
						symbolSize: (params) => {
							const resizeParameter = 1200;
							const maxBubbleSize = (25 / 450) * resizeParameter;
							const minBubbleSize = (2 / 450) * resizeParameter;
							return (((maxBubbleSize - minBubbleSize) * (params[context.indexes.Metric1.index] - min)) / (max - min)) + 2;
						},
						clip: true
					});
				}
			}

			const isWarning = !(context.indexes.Dimension1.index >= 0 && context.indexes.Dimension2.index >= 0 && metricIndexes >= 0)
				|| (data?.rows?.length ?? 0) === 0;

			const options = this.applyOptions(data, configuration, context, series);
			return {
				coloring: context.colors,
				...options,
				isWarning: isWarning ? isWarning : null,
				dataset: {
					source: datasetSource
				}
			};
		},
		applyOptions(data, configuration, context, chartSeries = null) {
			const localSeries = chartSeries ? [...chartSeries] : [...context.chartData.series];
			const service = new BubbleChartService(data, configuration, context);

			if (context.optionName) {
				const rest = service.changeOptions(context.optionName, context.chartData, configuration, context);
				return {
					...rest,
					...(context?.chartData?.dataset ? {dataset: context.chartData.dataset} : {}),
					...(context?.chartData?.colors ? {colors: context.chartData.colors} : {})
				};
			}
			return {
				title: service.getTitle(configuration),
				tooltip: service.getTooltip(configuration, context),
				xAxis: service.getXAxis(configuration),
				yAxis: service.getYAxis(configuration),
				series: service.getSeries(localSeries),
				...(context?.chartData?.dataset ? {dataset: context.chartData.dataset} : {}),
				...(context?.chartData?.colors ? {colors: context.chartData.colors} : {})
			};
		}
	},
	computed: {
		widgetData() {
			let data = cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId));
			// eslint-disable-next-line max-len
			if (data && data.series) {
				data = merge({}, data, this.defaultThemeOptions);
			}
			return data;
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		xAxisShortLabel() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'xAxisShortLabel');
		}
	},
	methods: {
		onItemClicked(evt) {
			if (evt.componentType !== 'series') {
				return;
			}

			const index = findIndex(this.selected, (selected) => (selected[0] === evt.value[0] && selected[1] === evt.value[1]));

			if (index === -1) {
				this.selected.push([
					evt.value[0],
					evt.value[1]
				]);
			} else {
				this.selected.splice(index, 1);
			}
		}
	}
};
</script>
