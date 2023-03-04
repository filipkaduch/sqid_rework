<template>
	<ds-box flex-type="column" class="h-100 w-100" :class="{'widget-padding-bottom': readOnly, 'widget-padding-bottom-editor': !readOnly}">
		<axis-name-wrapper :widgetInstanceId="widgetInstanceId">
			<v-chart
				ref="chart"
				class="w-100 h-100 widget-padding"
				:update-options="{replaceMerge: ['series']}"
				autoresize
				:option="widgetData"
				@click="onItemClicked"
				@finished="setFinishedRender(true)"
				@legendselectchanged="onLegendClicked" />
		</axis-name-wrapper>
	</ds-box>
</template>

<script>
import {configuration as config, initialize, options as opt, widgetGroup} from '@/modules/widget/components/widgets/barMultiseries/consts';
import {
	checkCumSum,
	selectDataBarMultiseries,
	stackToMaxMultiseries
} from '@/util/echartsWidgetsUtil';
import {dimensionLabel} from '@/util/widgetData';
import echartsMixin from '@/mixins/echartsMixin';
import selectionMixin from '@/mixins/selectionMixin';
import BarMultiSeriesService from './utils';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import findIndex from 'lodash/findIndex';
import AxisNameWrapper from '@/modules/widget/components/axisNameWrapper.vue';

export default {
	name: 'EChartsBarMultiseries',
	components: {
		AxisNameWrapper
	},
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
		return ['widget_column_chart_multiseries'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata(widgetType) {
		return {
			widgetGroup,
			props: {
				horizontal: widgetType === 'widget_category_chart_basic'
			},
			initialize,
			configuration: {...config},
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
		// eslint-disable-next-line max-lines-per-function,complexity,max-statements
		dataTransformation(data, configuration, context) {
			const series = [];
			let tmpData = [['_']];
			const dim2arr = [''];
			if (context.indexes.Dimension1?.index >= 0 && context.indexes.Dimension2?.index >= 0 && context.indexes.Metric1?.index >= 0) {
				data.rows.map((item) => {
					if (!tmpData[0].includes(dimensionLabel(item[context.indexes.Dimension1.index], data.columns[context.indexes.Dimension1.index].dataType))) {
						tmpData[0].push(dimensionLabel(item[context.indexes.Dimension1.index], data.columns[context.indexes.Dimension1.index].dataType));
					}

					if (!tmpData.some((el) => el[0] === dimensionLabel(item[context.indexes.Dimension2.index]))) {
						tmpData.push(['']);
						tmpData[dim2arr.length][0] = dimensionLabel(item[context.indexes.Dimension2.index], data.columns[context.indexes.Dimension2.index].dataType);
						dim2arr[dim2arr.length] = dimensionLabel(item[context.indexes.Dimension2.index], data.columns[context.indexes.Dimension2.index].dataType);
					}
					const row = dim2arr.indexOf(dimensionLabel(item[context.indexes.Dimension2.index], data.columns[context.indexes.Dimension2.index].dataType));
					const column = tmpData[0].indexOf(dimensionLabel(item[context.indexes.Dimension1.index], data.columns[context.indexes.Dimension1.index].dataType));
					tmpData[row][column] = dimensionLabel(item[context.indexes.Metric1.index], data.columns[context.indexes.Metric1.index].dataType);
					return null;
				});

				if (configuration?.options?.stackedToMax && configuration?.options?.stacked) {
					tmpData = stackToMaxMultiseries(tmpData);
				}

				for (let i = 1; i < tmpData.length; i++) {
					series.push({
						type: 'bar',
						seriesLayoutBy: 'row',
						name: tmpData[i][0],
						itemStyle: {
							color: null
						}
					});
				}
			}

			const isWarning = !(
				context.indexes.Dimension1?.index >= 0
				&& context.indexes.Dimension2?.index >= 0
				&& context.indexes.Metric1?.index >= 0
			)
				|| (data?.rows?.length ?? 0) === 0
				|| checkCumSum(configuration);

			const options = this.applyOptions(data, configuration, context, series);

			return {
				isWarning: isWarning ? isWarning : null,
				colors: context.colors,
				dataset: {
					source: tmpData
				},
				...options
			};
		},
		// eslint-disable-next-line max-lines-per-function,complexity,max-statements
		applyOptions(data, configuration, context, chartSeries = null) {
			const localSeries = chartSeries ? [...chartSeries] : [...context.chartData.series];
			const dimensions = localSeries.map((item) => item.name);

			const service = new BarMultiSeriesService(data, configuration, context);
			let result = null;

			if (context.optionName) {
				const rest = service.changeOptions(configuration, context, dimensions);
				result = {
					...rest
				};
			} else {
				result = {
					title: service.getTitle(),
					tooltip: service.getTooltip(configuration),
					grid: service.getGrid(configuration),
					legend: service.getLegend(configuration, context, dimensions),
					label: service.getLabel(configuration),
					xAxis: service.getXAxis(configuration),
					yAxis: service.getYAxis(configuration),
					series: service.getSeries(configuration, context, localSeries)
				};
			}
			result = {
				...result,
				...(context?.chartData?.dataset ? {dataset: context.chartData.dataset} : {}),
				...(context?.chartData?.colors ? {colors: context.chartData.colors} : {})
			};
			return result;
		}
	},
	computed: {
		widgetData() {
			const data = merge(cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId)), this.defaultThemeOptions);
			return selectDataBarMultiseries(data, this.selected);
		},
		configuration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		selectedLegend() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.SELECTED_LEGEND);
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		colors() {
			return this.$store.getters['storyDetail/graphColors'];
		}
	},
	methods: {
		onLegendClicked(evt) {
			this.setOptionLegend(widgetOptionName.SELECTED_LEGEND, evt.selected);
		},
		onItemClicked(evt) {
			// First dimension
			const {name} = evt;
			// Second dimension
			const {seriesName} = evt;
			const index = findIndex(this.selected, (selected) => selected[0] === name);
			const secondDimIndex = findIndex(this.selected, (selected) => selected[0] === seriesName);
			const removeIndexes = [index, secondDimIndex];
			if (index === -1 && secondDimIndex === -1) {
				this.selected.push([name]);
				this.selected.push([seriesName]);
			} else {
				// Pop out both first and second dimension
				for (let i = this.selected.length - 1; i >= 0; i--) {
					this.selected.splice(removeIndexes[i], 1);
				}
			}
		}
	}
};
</script>
