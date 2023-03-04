<template>
	<v-chart
		ref="chart"
		class="w-100 h-100 widget-padding"
		:class="readOnly ? 'widget-padding-bottom' : ''"
		autoresize
		:option="widgetData"
		@finished="setFinishedRender(true)" />
</template>

<script>
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/heatmap/consts';
import {chartConstants} from '@/util/consts/chartsConstants';
import {dataTypes} from '@/util/queryBuilder';
import {
	echartsDefaultControls,
	labelRotate,
	labelRotateHandle,
	xAxisNumberOfCharacter
} from '@/modules/widget/echartsWidgetControls';
import echartsMixin from '@/mixins/echartsMixin';
import {findNewIndexes} from '@/util/widgetDataUtil';
import {getColorRanage} from '@/util/echartsWidgetsUtil';
import {getFormatter} from '@/util/formatingUtil';
import {getMetricAlias} from '@/util/widgetData';
import selectionMixin from '@/mixins/selectionMixin';
import {
	CATEGORY_GENERAL,
	CATEGORY_LABEL,
	CATEGORY_VISUAL
} from '@/modules/widget/components/widget-controls/consts/categories';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

export default {
	name: 'EChartsHeatmap',
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
		// from old manifest
		return ['widget_heatmap_chart'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		// from old manifest
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
						switchText: 't_LimitDisplayedRange',
						lastOption: true,
						border: true
					}
				},
				gridBorder: {
					type: 'widget_control_grid_border',
					needReload: false,
					category: CATEGORY_GENERAL,
					props: {
						gridText: 't_visibleRange',
						leftValueName: 'gridLeft',
						rightValueName: 'gridRight',
						delimiter: true
					}
				},
				invertColors: {
					type: 'widget_control_single_switch',
					category: CATEGORY_VISUAL,
					default: false,
					props: {
						showTextState: true,
						switchText: 't_invertColors'
					}
				},
				setGreenColorScale: {
					type: 'widget_control_single_switch',
					category: CATEGORY_VISUAL,
					default: false,
					props: {
						showTextState: true,
						switchText: 't_redGreenScale'
					}
				},
				setPlasmaColorScale: {
					type: 'widget_control_single_switch',
					category: CATEGORY_VISUAL,
					default: false,
					props: {
						showTextState: true,
						switchText: 't_plasmaScale'
					}
				},
				showColorScale: {
					type: 'widget_control_single_switch',
					category: CATEGORY_VISUAL,
					default: false,
					props: {
						showTextState: true,
						switchText: 't_showColorScale'
					}
				},
				colorScalePosition: {
					type: 'widget_control_button_group',
					category: CATEGORY_VISUAL,
					default: 'bottom',
					props: {
						options: [
							'left',
							'bottom',
							'right'
						]
					}
				},
				showLabel: {
					type: 'widget_control_single_switch',
					category: CATEGORY_LABEL,
					default: false,
					props: {
						main: true,
						showTextState: true,
						switchText: 't_showLabel'
					}
				},
				xAxisNumberOfCharacter: xAxisNumberOfCharacter(2),
				labelRotate
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
		// eslint-disable-next-line max-lines-per-function, complexity
		dataTransformation(data, configuration, context) {
			const {Dimension1, Dimension2, Metric1} = findNewIndexes(data.columns);
			const {metrics} = configuration.data.configuration;
			const {enums} = configuration.options;
			const tooltipFormatter = () => (params) => {
				const categoryXFormatter = getFormatter(
					data.columns[Dimension1].dataType,
					'dimension0',
					'xAxis',
					enums,
					configuration?.options?.selectedFormat,
					{
						tooltip: true
					}
				);
				const categoryYFormatter = getFormatter(
					data.columns[Dimension2].dataType,
					'dimension1',
					'yAxis',
					enums,
					configuration?.options?.selectedFormat,
					{
						tooltip: true
					}
				);

				const metric = getMetricAlias(params.seriesIndex, metrics, enums, context);
				const catX = categoryXFormatter(params.name);
				const catY = categoryYFormatter(params.value[1]);
				return `${params.marker} ${catX}, ${catY}: ${metric} => ${params.value[2]}`;
			};
			let max = 0;
			let min = 0;
			data.rows.forEach((item, index) => {
				min = index === 0 ? item[Metric1] : Math.min(min, item[Metric1]);
				max = Math.max(max, item[Metric1]);
			});
			const columnFormat = {
				dimensionColumn: data.columns[Dimension1],
				selectedFormat: configuration.options.selectedFormat,
				enums: configuration.options.enums
			};
			const isWarning = !(Dimension1 >= 0 && Dimension2 >= 0 && Metric1 >= 0) || (data?.rows?.length ?? 0) === 0;
			return {
				isWarning: isWarning ? isWarning : null,
				coloring: context.colors,
				tooltip: {
					confine: false,
					formatter: tooltipFormatter(columnFormat)
				},
				grid: {
					bottom: configuration?.options?.showColorScale && configuration?.options?.colorScalePosition === chartConstants.chartConst.BOTTOM ? '10%' : 0,
					right: configuration?.options?.showColorScale ? configuration?.options?.colorScalePosition === chartConstants.chartConst.RIGHT ? 75 : 5 : 5,
					left: configuration?.options?.showColorScale ? configuration?.options?.colorScalePosition === chartConstants.chartConst.LEFT ? 75 : 5 : 5
				},
				xAxis: {
					type: data.columns[Dimension1].dataType === dataTypes.NUMBER ? chartConstants.chartConst.VALUE : chartConstants.chartConst.CATEGORY,
					axisLabel: {
						rotate: labelRotateHandle(configuration?.options?.labelRotate),
						formatter: getFormatter(
							data.columns[Dimension1].dataType,
							'dimension0',
							'xAxis',
							configuration?.options?.enums,
							configuration?.options?.selectedFormat
						)
					}
				},
				yAxis: {
					type: data.columns[Dimension2].dataType === dataTypes.NUMBER ? chartConstants.chartConst.VALUE : chartConstants.chartConst.CATEGORY,
					axisLabel: {
						formatter: getFormatter(
							data.columns[Dimension2].dataType,
							'dimension1',
							'yAxis',
							configuration?.options?.enums,
							configuration?.options?.selectedFormat,
							{
								shortLabel: configuration?.options?.xAxisShortLabel,
								maxLength: configuration?.options?.xAxisNumberOfCharacter
							}
						)
					}
				},
				visualMap: {
					show: configuration?.options?.showColorScale,
					min: parseInt(configuration.options?.gridBorder?.rangeMin ?? min, 10),
					max: parseInt(configuration.options?.gridBorder?.rangeMax ?? max, 10),
					itemHeight: 500,
					align: 'auto',
					text: [
						configuration.options?.gridBorder?.rangeMax ?? max,
						configuration.options?.gridBorder?.rangeMin ?? min
					],
					orient: configuration.options.colorScalePosition === chartConstants.chartConst.BOTTOM
						? chartConstants.chartConst.HORIZONTAL
						: chartConstants.chartConst.VERTICAL,
					inRange: {
						color: configuration.options?.invertColors
							? getColorRanage(configuration, context).slice(0)
								.reverse()
							: getColorRanage(configuration, context)
					},
					left: configuration.options.colorScalePosition === chartConstants.chartConst.BOTTOM
						? chartConstants.chartConst.CENTER
						: configuration.options.colorScalePosition,
					bottom: 0,
					top: configuration.options.colorScalePosition === chartConstants.chartConst.BOTTOM ? null : chartConstants.chartConst.MIDDLE
				},
				series: [
					{
						type: 'heatmap',
						data: data.rows.map((item) => [...item]),
						label: {
							show: configuration.options.showLabel
						}
					}
				]
			};
		}
	},
	computed: {
		widgetData() {
			// TODO selection when chart is fixed
			return merge({}, cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId)), this.defaultThemeOptions);
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		colors() {
			return this.$store.getters['storyDetail/graphColors'];
		}
	}
};
</script>

<style scoped>

</style>
