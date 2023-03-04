<template>
	<v-chart
		v-if="widgetData"
		ref="chart"
		class="w-100 h-100 widget-padding"
		:class="readOnly ? 'widget-padding-bottom' : ''"
		autoresize
		:option="widgetData"
		@click="onItemClicked"
		@finished="setFinishedRender(true)"
		@datazoom="onDataZoom" />
</template>

<script>
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/histogram/consts';
import {chartConstants} from '@/util/consts/chartsConstants';
import colorMixin from '@/mixins/colorMixin';
import {dataTypes} from '@/util/queryBuilder';
import {dimensionLabel} from '@/util/widgetData';
import {echartsDefaultControls} from '@/modules/widget/echartsWidgetControls';
import echartsMixin from '@/mixins/echartsMixin';
import {getFormatter} from '@/util/formatingUtil';
import {selectData} from '@/util/echartsWidgetsUtil';
import selectionMixin from '@/mixins/selectionMixin';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import findIndex from 'lodash/findIndex';

export default {
	name: 'EChartsHistogram',
	mixins: [
		echartsMixin,
		selectionMixin,
		colorMixin
	],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		},
		zoom: {
			type: Boolean,
			default: false
		}
	},
	widgetTypes() {
		return [
			'widget_histogram_chart',
			'widget_histogram_selection_chart'
		];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata(widgetType) {
		return {
			props: {
				horizontal: widgetType === 'widget_histogram_chart'
			},
			widgetGroup,
			configuration: config,
			initialize,
			...(widgetType === 'widget_histogram_selection_chart' ? {renderOptions: {dragWithoutOverlay: false}} : {}),
			options: {
				...echartsDefaultControls(true)
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
		// eslint-disable-next-line max-lines-per-function,complexity
		dataTransformation(data, configuration, context) {
			const dimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1');
			let tempData = null;
			if (dimensionIndex >= 0) {
				tempData = data.rows.map((item) => ({
					value: [
						dimensionLabel(item[dimensionIndex], data.columns[dimensionIndex].dataType),
						item.length > 2 ? item[2] : item[1]
					]
				}));
			}
			const isWarning = !(dimensionIndex >= 0) || (data?.rows?.length ?? 0) === 0;

			const xAxisFormatter = getFormatter(
				data.columns[context.indexes.Dimension1?.index]?.dataType,
				'dimension0',
				'xAxis',
				configuration.options.enums,
				configuration.options.selectedFormat, {datatypeOverride: dataTypes.FLOAT}
			);

			return {
				isWarning: isWarning ? isWarning : null,
				title: {
					text: configuration.options.title,
					left: chartConstants.chartConst.CENTER
				},
				coloring: context.colors,
				grid: {
					top: configuration.options.title ? 35 : 10,
					bottom: 5
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					},
					formatter: (params) => {
						const yFormatter = getFormatter(
							'',
							'dimension0',
							'yAxis',
							configuration.options.enums,
							configuration.options.selectedFormat,
							{datatypeOverride: dataTypes.LONG}
						);
						return `${xAxisFormatter(params[0].name)}: ${yFormatter(params[0].data.value[1])}`;
					}
				},
				xAxis: {
					type: 'category',
					axisLabel: {
						formatter: xAxisFormatter,
						rotate: 90
					}
				},
				yAxis: {
					axisLabel: {
						formatter: getFormatter(
							'',
							'dimension1',
							'yAxis',
							configuration.options.enums,
							configuration.options.selectedFormat,
							{datatypeOverride: dataTypes.LONG}
						)
					}
				},
				dataZoom: [
					{
						type: 'slider',
						show: !context.props?.horizontal,
						top: 5
					},
					{
						type: 'inside',
						disabled: !context.props?.horizontal
					}
				],
				series: [
					{
						type: 'bar',
						barWidth: '82%',
						data: tempData?.map((item) => ({
							name: item.value[0],
							...item,
							selected: false,
							itemStyle: {
								color: context.colors.theme[0],
								borderColor: context.colors.theme[0]
							}
						}))
					}
				]
			};
		}
	},
	computed: {
		widgetData() {
			let data = merge(cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId)), this.defaultThemeOptions);
			if (data && data.series) {
				data = selectData(data, this.selected, data.coloring);
			}
			return data;
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		colors() {
			return this.$store.getters['storyDetail/graphColors'];
		}
	},
	methods: {
		onItemClicked(evt) {
			const index = findIndex(this.selected, (selected) => selected[0] === evt.value[0]);

			if (index === -1) {
				this.selected.push([evt.value[0]]);
			} else {
				this.selected.splice(index, 1);
			}
		},
		onDataZoom() {
			if (this.timer !== null) {
				clearTimeout(this.timer);
			}

			this.timer = setTimeout(() => {
				this.timer = null;

				const [{startValue, endValue}] = this.$refs.chart.chart.getOption().dataZoom;
				this.notHidden = this.widgetData?.series[0]?.data?.slice(startValue, endValue + 1)
					.map((entry) => [entry.value[0]]);
			}, 300);
		}
	}
};
</script>
