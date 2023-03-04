<template>
	<v-chart
		v-if="widgetData"
		ref="chart"
		class="w-100 h-100 widget-padding"
		:class="readOnly ? 'widget-padding-bottom' : ''"
		autoresize
		:option="widgetData"
		@finished="setFinishedRender(true)" />
</template>

<script>
import {
	configuration as config,
	initialize,
	widgetGroup
} from '@/modules/widget/components/widgets/lineTimeComparison/consts';
import {chartConstants} from '@/util/consts/chartsConstants';
import {dimensionLabel} from '@/util/widgetData';
import {echartsDefaultControls} from '@/modules/widget/echartsWidgetControls';
import echartsMixin from '@/mixins/echartsMixin';
import {getFormatter} from '@/util/formatingUtil';
import {CATEGORY_GENERAL} from '@/modules/widget/components/widget-controls/consts/categories';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

export default {
	name: 'EChartsLineTimeComparison',
	mixins: [echartsMixin],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	widgetTypes() {
		return ['widget_line_time_comparison'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup,
			configuration: config,
			initialize,
			options: {
				...echartsDefaultControls(false),
				limitRange: {
					type: 'widget_control_single_switch',
					default: false,
					category: CATEGORY_GENERAL,
					props: {
						showTextState: true,
						border: true,
						switchText: 't_LimitDisplayedRange',
						lastOption: true
					}
				},
				gridBorder: {
					type: 'widget_control_grid_border',
					category: CATEGORY_GENERAL,
					props: {
						gridText: 't_visibleRange',
						leftValueName: 'gridLeft',
						rightValueName: 'gridRight',
						delimiter: true
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
		// eslint-disable-next-line max-lines-per-function, max-statements, complexity
		dataTransformation(data, configuration, context) {
			const Dimension1 = data.columns.map((column) => column.reference).indexOf('Dimension1');
			const Metric1 = data.columns.map((column) => column.reference).indexOf('Metric1');
			const categories = [
				[],
				[]
			];
			const series = new Array(2);

			if (Dimension1 >= 0 && Metric1 >= 0) {
				const metricsLength = 2;
				const half = Math.round(data.rows.length / 2);

				for (let i = 0; i < data.rows.length; i++) {
					const row = data.rows[i];
					if (i <= half - 1) {
						categories[0][i] = dimensionLabel(row[Dimension1], data.columns[Dimension1].dataType);
					} else {
						categories[1][i - half] = dimensionLabel(row[Dimension1], data.columns[Dimension1].dataType);
					}

					for (let j = 0; j < metricsLength; j++) {
						if (!series[j]) {
							series[j] = {
								type: 'line',
								name: String(Metric1),
								// eslint-disable-next-line no-unneeded-ternary
								showSymbol: true,
								data: [],
								itemStyle: {
									color: context.colors.theme[j]
								},
								xAxisIndex: j === 0 ? 1 : null
							};
						}
					}

					const val = row[Metric1];

					// TODO
					/*
					if (this.replaceUndefined && (val === null || isNaN(val))) {
						val = 0;
					}
					*/

					if (i <= half - 1) {
						series[1].data[i] = val;
					} else {
						series[0].data[i - half] = val;
					}
				}
			}
			const isWarning = !(Dimension1 >= 0 && Metric1 >= 0) || (data?.rows?.length ?? 0) === 0;

			const columnFormatter = getFormatter(
				data.columns[Dimension1].dataType,
				'dimension0',
				'xAxis',
				configuration?.options?.enums,
				configuration?.options?.selectedFormat
			);
			const metricFormatter = getFormatter(
				data.columns[Metric1].dataType,
				'metric',
				'yAxis',
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
				animationDuration: 10000,
				legend: {
					show: false
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'line'
					},
					formatter: (params) => `${params.map((param) => `${columnFormatter(param.name)}<br>
								${param.marker}: ${metricFormatter(param.value)}`).join('<br>')}`
				},
				xAxis: [
					{
						type: 'category',
						data: categories[0],
						axisLabel: {
							formatter: columnFormatter
						}
					},
					{
						type: 'category',
						data: categories[1],
						axisLabel: {
							formatter: columnFormatter
						}
					}
				],
				yAxis: {
					min: configuration.options?.gridBorder?.gridRight,
					max: configuration.options?.gridBorder?.gridRight
				},
				series
			};
		}
	},
	computed: {
		widgetData() {
			let data = cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId));
			if (data) {
				data = merge({}, cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId)), this.defaultThemeOptions);
				data.xAxis.forEach((axis, index) => {
					data.xAxis[index] = merge(data.xAxis[index], this.defaultThemeOptions.xAxis);
				});
			}
			return data;
		}
	}
};
</script>
