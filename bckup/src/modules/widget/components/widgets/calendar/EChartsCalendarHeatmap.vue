<template>
	<v-chart
		ref="chart"
		class="w-100 h-100 widget-padding"
		:class="readOnly ? 'widget-padding-bottom' : ''"
		autoresize
		:option="widgetData"
		@finished="setFinishedRender(true)"
		@legendselectchanged="onLegendClicked" />
</template>

<script>
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/calendar/consts';
import {chartConstants} from '@/util/consts/chartsConstants';
import {dataTypes, isDataType} from '@/util/queryBuilder';
import {dimensionLabel} from '@/util/widgetData';
import {echartsDefaultControls} from '@/modules/widget/echartsWidgetControls';
import echartsMixin from '@/mixins/echartsMixin';
import {getFormatter} from '@/util/formatingUtil';
import {CATEGORY_VISUAL} from '@/modules/widget/components/widget-controls/consts/categories';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

export default {
	name: 'EChartsCalendarHeatmap',
	mixins: [echartsMixin],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	widgetTypes() {
		return ['widget_calendar_heatmap'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: {...config},
			options: {
				...echartsDefaultControls,
				calendarType: {
					type: 'widget_control_single_switch',
					category: CATEGORY_VISUAL,
					default: false,
					props: {
						switchText: 't_Scatter',
						showTextState: true,
						lastOption: true
					}
				}
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
		// eslint-disable-next-line max-lines-per-function,complexity,max-statements
		dataTransformation(data, configuration) {
			const Dimension1 = data.columns.map((column) => column.reference).indexOf('Dimension1');
			const Metric1 = data.columns.map((column) => column.reference).indexOf('Metric1');
			const dim1DataType = data.columns[Dimension1].dataType;
			let series = null;
			let calendar = null;

			const calendarRange = data?.rows.map((item) => ({
				date: dimensionLabel(item[0], data.columns[0].dataType),
				data: item[1]
			})) ?? [];


			if (Dimension1 >= 0 && Metric1 >= 0 && isDataType(dataTypes.DATE_TYPE, dim1DataType)) {
				let max = null;
				let min = null;

				const seriesData = data.rows.map((row, index) => {
					max = Math.max(max, row[Metric1]);
					min = index === 1 ? row[Metric1] : Math.min(min, row[Metric1]);
					return [
						row[Dimension1],
						row[Metric1]
					];
				});

				series = {
					type: configuration.options?.calendarType ? 'scatter' : 'heatmap',
					name: String(Metric1),
					coordinateSystem: 'calendar',
					data: seriesData,
					symbolSize: (val) => {
						const maxBubbleSize = (25 / 500) * 1000;
						const minBubbleSize = (2 / 500) * 1000;
						return (((maxBubbleSize - minBubbleSize) * (val[1] - min)) / (max - min)) + 2;
					}
				};

				calendar = {
					left: chartConstants.chartConst.CENTER,
					top: chartConstants.chartConst.MIDDLE,
					range: [
						Math.min.apply(null, calendarRange.map((item) => new Date(item.date))),
						Math.max.apply(null, calendarRange.map((item) => new Date(item.date)))
					],
					orient: chartConstants.chartConst.VERTICAL,
					cellSize: 40,
					dayLabel: {
						firstDay: 1
					},
					yearLabel: {
						show: false
					}
				};
			}
			const isWarning = !(Dimension1 >= 0 && Metric1 >= 0 && isDataType(dataTypes.DATE_TYPE, dim1DataType)) || (data?.rows?.length ?? 0) === 0;
			return {
				isWarning: isWarning ? isWarning : null,
				grid: {
					top: 10,
					bottom: 20,
					left: 10,
					right: 20
				},
				tooltip: {
					position: chartConstants.chartConst.TOP,
					formatter: (params) => {
						const columnFormatter = getFormatter(
							data.columns[Dimension1].dataType,
							'dimension0',
							'xAxis',
							configuration.options.enums,
							configuration.options.selectedFormat,
							{tooltip: true}
						);
						const metricFormatter = getFormatter(
							data.columns[Metric1].dataType,
							'metric',
							'yAxis',
							configuration.options.enums,
							configuration.options.selectedFormat,
							{tooltip: true}
						);

						return `${params.marker}${columnFormatter(params.value[0])}:${metricFormatter(params.value[1])}`;
					}
				},
				legend: {
					show: false
				},
				visualMap: {
					show: false,
					min: Math.min.apply(null, Object.keys(calendarRange).map((key) => calendarRange[key].data)),
					max: Math.max.apply(null, Object.keys(calendarRange).map((key) => calendarRange[key].data))
				},
				calendar,
				series
			};
		}
	},
	data() {
		return {
			series: [],
			categories: [],
			calendar: null
		};
	},
	computed: {
		widgetData() {
			let data = cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId));
			if (data) {
				data = merge(data, this.defaultThemeOptions);
			}
			return data;
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		showLegend() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'showLegend');
		},
		size() {
			return this.preview ? null : this.$store.getters['widgetInstances/layoutConfiguration'](this.widgetInstanceId).size;
		}
	},
	methods: {
		onLegendClicked(evt) {
			this.setOption(evt.selected, widgetOptionName.SELECTED_LEGEND);
		}
	}
};
</script>
