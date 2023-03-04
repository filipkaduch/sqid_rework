<template>
	<v-chart
		v-if="widgetData"
		ref="chart"
		class="w-100 h-100 widget-padding"
		:update-options="{notMerge: true}"
		:class="readOnly ? 'widget-padding-bottom' : ''"
		autoresize
		:option="widgetData"
		@finished="setFinishedRender(true)" />
</template>

<script>
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/spider/consts';
import {echartsDefaultControls, echartsLegendControls} from '@/modules/widget/echartsWidgetControls';
import {getEnum, getFormatter} from '@/util/formatingUtil';
import {chartConstants, MAX_COLORS} from '@/util/consts/chartsConstants';
import {dimensionLabel} from '@/util/widgetData';
import echartsMixin from '@/mixins/echartsMixin';
import {getAlias} from '@/util/echartsWidgetsUtil';
import selectionMixin from '@/mixins/selectionMixin';
import {CATEGORY_VISUAL} from '@/modules/widget/components/widget-controls/consts/categories';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

export default {
	name: 'EChartsSpider',
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
		return ['widget_spider_chart'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup,
			configuration: config,
			initialize,
			options: {
				...echartsDefaultControls(true),
				...echartsLegendControls,
				dataModeSwitch: {
					type: 'widget_control_single_switch',
					default: false,
					category: CATEGORY_VISUAL,
					props: {
						switchText: 't_switchIndicators',
						lastOption: true,
						showTextState: true
					}
				}
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
		// eslint-disable-next-line max-lines-per-function,max-statements,complexity
		dataTransformation(data, configuration, context) {
			const dimension1Index = data.columns.map((column) => column.reference).indexOf('Dimension1');
			const dimension2Index = data.columns.map((column) => column.reference).indexOf('Dimension2');
			const metricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');

			const arr = dimension2Index >= 0 ? [['_']] : [];
			const Dim2arr = [''];
			const indicators = [];
			let series = [];
			let tmpData = [];

			if (dimension1Index >= 0 && metricIndex >= 0) {
				if (dimension2Index >= 0) {
					// Make 2d array of combination of values from first and second dimension
					// First row contains second dimension values and first column first dimension values
					data.rows.map((item) => {
						if (!arr[0].includes(dimensionLabel(item[dimension2Index], data.columns[dimension2Index].dataType))) {
							arr[0].push(dimensionLabel(item[dimension2Index], data.columns[dimension2Index].dataType));
						}

						if (!arr.some((el) => el[0] === dimensionLabel(item[dimension1Index]))) {
							arr.push(['']);
							arr[Dim2arr.length][0] = dimensionLabel(item[dimension1Index], data.columns[dimension1Index].dataType);
							Dim2arr[Dim2arr.length] = dimensionLabel(item[dimension1Index], data.columns[dimension1Index].dataType);
						}
						const row = Dim2arr.indexOf(dimensionLabel(item[dimension1Index], data.columns[dimension1Index].dataType));
						const column = arr[0].indexOf(dimensionLabel(item[dimension2Index], data.columns[dimension2Index].dataType));
						arr[row][column] = dimensionLabel(item[metricIndex], data.columns[metricIndex].dataType);
						return null;
					});

					arr[0].shift();

					// Delete empty element in first row, so we could get graph indicators from remaining values
					arr[0].forEach((item) => {
						indicators.push({
							name: item
						});
					});

					// After setting indicators, delete first row, so we have only remaining data
					arr.shift();
				} else {
					if (configuration.options.dataModeSwitch) {
						// If dataModeSwitch is active make indicators from Metrics
						data.columns.forEach((value, index) => {
							if (value.reference.includes('Metric')) {
								indicators.push({
									name: getAlias(configuration?.data?.configuration?.metrics, index, configuration?.options?.enums, context)
								});
							}
						});
					}

					data.rows.forEach((item) => {
						const tmp = [...item];
						if (!configuration.options.dataModeSwitch) {
							// If data switch is not active make indicators from first dimension
							indicators.push({
								name: dimensionLabel(item[dimension1Index], data.columns[dimension1Index].dataType)
							});
							tmp.shift();
						}
						arr.push(tmp);
					});
				}

				if (arr.length > 0) {
					tmpData = configuration.options.dataModeSwitch || dimension2Index >= 0 ? arr : arr[0].map((item, i) => arr.map((x) => x[i]));
				}

				// Make serie from rows
				series = tmpData.map((item, index) => {
					const resultData = [...item];

					// Assign Metric as name
					let name = getAlias(configuration?.data?.configuration?.metrics, index + 1, configuration?.options?.enums, context);

					// If dataModeSwitch is active or we two dimensions assing first item in array as name then, delete from data
					if (configuration.options.dataModeSwitch || dimension2Index >= 0) {
						[name] = item;
						resultData.shift();
					}
					return {
						type: 'radar',
						data: [
							{
								value: resultData,
								name
							}
						]
					};
				});
			}
			const isWarning = !(dimension1Index >= 0 && metricIndex >= 0) || (data?.rows?.length ?? 0) === 0;

			const columnFormatter = getFormatter(
				data.columns[dimension1Index].dataType,
				'dimension0',
				'xAxis',
				configuration?.options?.enums,
				configuration?.options?.selectedFormat
			);

			const metricFormatter = getFormatter(
				data.columns[metricIndex].dataType,
				'metric',
				'metric',
				configuration?.options?.enums,
				configuration?.options?.selectedFormat
			);

			return {
				isWarning: isWarning ? isWarning : null,
				title: {
					text: configuration.options.title,
					left: chartConstants.chartConst.CENTER
				},
				grid: {
					top: configuration.options.title ? 35 : 20,
					bottom: 25,
					left: 30,
					right: 30
				},
				legend: {
					// TODO: Complete formeter
					formatter: (params) => columnFormatter(params),
					type: chartConstants.chartConst.SCROLL,
					show: configuration?.options?.showLegend,
					top: (configuration?.options?.legendPosition === chartConstants.chartConst.LEFT
						|| configuration?.options?.legendPosition === chartConstants.chartConst.RIGHT)
						? chartConstants.chartConst.MIDDLE
						: configuration?.options?.legendPosition,
					left: configuration?.options?.legendPosition === chartConstants.chartConst.BOTTOM
						? chartConstants.chartConst.CENTER
						: configuration?.options?.legendPosition,
					orient: configuration?.options?.legendPosition === chartConstants.chartConst.BOTTOM
						? chartConstants.chartConst.HORIZONTAL
						: chartConstants.chartConst.VERTICAL
				},
				tooltip: {
					show: true,
					formatter: dimension2Index === -1
						? (params) => `${params.name}<br>
							${params.value.map((item, index) => `${params.marker} ${columnFormatter(indicators[index].name)} - ${metricFormatter(item)}`)
						.join('<br>')}`
						: (params) => {
							if (params.componentType === 'series') {
								// Return name of indicator and list of every option with its values
								return `${columnFormatter(params.name)}<br>
								${params.value.map((item, index) => `${params.marker} ${getEnum(configuration?.options?.enums, 'dimension0', indicators[index].name)} - ${metricFormatter(item)}`)
								.join('<br>')}`;
							}
							return '';
						}
				},
				radar: {
					// indicators -> nodes of graph
					indicator: indicators.map((item) => {
						const dimIndex = dimension2Index >= 0 ? 'dimension1' : 'dimension0';
						const formatter = getFormatter(
							data.columns[dimension1Index].dataType,
							dimIndex,
							'xAxis',
							configuration?.options?.enums,
							configuration?.options?.selectedFormat
						);
						item.name = formatter(item.name);
						return item;
					})
				},
				xAxis: null,
				yAxis: null,
				series: series.map((item, index) => {
					item.data[0].itemStyle = {
						color: context.colors.coloring?.[`metric${index}`] ?? context.colors.theme[index % MAX_COLORS]
					};
					return item;
				})
			};
		}
	},
	computed: {
		widgetData() {
			let data = cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId));
			if (data) {
				data = merge(data, this.defaultThemeOptions);
			}
			return data;
		}
	}
};
</script>
