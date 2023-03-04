<!-- eslint-disable max-lines -->
<template>
	<ds-box flex-type="column" class="h-100 w-100" :class="{'widget-padding-bottom': readOnly, 'widget-padding-bottom-editor': editorTimeline}">
		<ds-box no-grow class="w-100 h-100">
			<axis-name-wrapper :widgetInstanceId="widgetInstanceId">
				<v-chart
					ref="chart"
					class="w-100 h-100 widget-padding"
					autoresize
					:update-options="{notMerge: true}"
					:option="timelineShow ? timelineDataOptions : widgetData"
					@finished="setFinishedRender(true)"
					@legendselectchanged="onLegendClicked"
					@timelinechanged="onTimelineStateChanged" />
			</axis-name-wrapper>
		</ds-box>
		<app-timeline-slider
			v-if="widgetData?.timeline"
			:values="widgetData?.timeline?.timelineData"
			:widgetInstanceId="widgetInstanceId"
			@update-timeline="updateTimeline" />
	</ds-box>
</template>

<script>
import {
	addAverageAll,
	addAverageBucketing, createSelectedLegend, getAlias,
	checkCumSum,
	getSelectedLegend,
	getSplitLineColors
} from '@/util/echartsWidgetsUtil';
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/line/consts';
import {
	echartsDefaultControls,
	echartsLegendControls,
	labelRotate,
	labelRotateHandle, xAxisNameControls, xAxisNumberOfCharacter, yAxisNameControls
} from '@/modules/widget/echartsWidgetControls';
import {getFormatter, tooltipFormatterLine} from '@/util/formatingUtil';
import AppTimelineSlider from '@/components/story/AppTimelineSlider.vue';
import box from '@/assets/box-icon.svg';
import {chartConstants} from '@/util/consts/chartsConstants';
import checkBox from '@/assets/checkbox-icon.svg';
import {dimensionLabel} from '@/util/widgetData';
import echartsMixin from '@/mixins/echartsMixin';
import echartsTimelineMixin from '@/mixins/echartsTimelineMixin';
import {mapTimeline} from '@/util/echartsTimelineUtil';
import selectionMixin from '@/mixins/selectionMixin';
import widgetMixin from '@/mixins/widgetMixin';
import {
	CATEGORY_AXIS,
	CATEGORY_GENERAL,
	CATEGORY_LEGEND,
	CATEGORY_VISUAL
} from '@/modules/widget/components/widget-controls/consts/categories';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import cloneDeep from 'lodash/cloneDeep';
import {getXYaxisGrid, mergeOptions} from '@/modules/widget/utils/widget';
import AxisNameWrapper from '@/modules/widget/components/axisNameWrapper.vue';

export default {
	name: 'EChartsLine',
	components: {
		AppTimelineSlider,
		AxisNameWrapper
	},
	mixins: [
		echartsTimelineMixin,
		echartsMixin,
		selectionMixin,
		widgetMixin
	],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	widgetTypes() {
		return ['widget_line_chart_single'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: {...config},
			options: {
				...echartsDefaultControls(false),
				...echartsLegendControls,
				legendGridWidth: {
					type: 'widget_control_number_input',
					category: CATEGORY_LEGEND,
					props: {
						numberInputText: 't_maxLegendWidth',
						step: 5,
						unit: '%',
						minValue: 0,
						default: 30,
						maxValue: 50
					}
				},
				...xAxisNameControls,
				...yAxisNameControls,
				stacked: {
					type: 'widget_control_single_switch',
					category: CATEGORY_VISUAL,
					order: 0,
					default: false,
					props: {
						showTextState: true,
						switchText: 't_Filled'
					}
				},
				graphSymbols: {
					type: 'widget_control_single_switch',
					category: CATEGORY_VISUAL,
					default: false,
					order: 1,
					props: {
						showTextState: true,
						switchText: 't_showPoints'
					}
				},
				connectUndefined: {
					type: 'widget_control_single_switch',
					default: false,
					category: CATEGORY_VISUAL,
					order: 2,
					props: {
						showTextState: true,
						switchText: 't_ConnectPoints'
					}
				},
				averageLineBucketing: {
					type: 'widget_control_single_switch',
					default: false,
					category: CATEGORY_VISUAL,
					order: 3,
					props: {
						showTextState: true,
						border: true,
						switchText: 't_averageLineBucketing'
					}
				},
				averageLineAll: {
					type: 'widget_control_single_switch',
					default: false,
					category: CATEGORY_VISUAL,
					order: 4,
					props: {
						showTextState: true,
						switchText: 't_GlobalAverageLine'
					}
				},
				replaceUndefined: {
					type: 'widget_control_single_switch',
					default: false,
					category: CATEGORY_VISUAL,
					order: 5,
					props: {
						showTextState: true,
						border: true,
						switchText: 't_ReplaceUndefinedZero'
					}
				},
				switchToLog: {
					type: 'widget_control_single_switch',
					default: false,
					category: CATEGORY_AXIS,
					props: {
						showTextState: true,
						switchText: 't_linearLogarithmic',
						delimiter: true
					}
				},
				limitRange: {
					type: 'widget_control_single_switch',
					default: false,
					category: CATEGORY_GENERAL,
					props: {
						showTextState: true,
						switchText: 't_LimitDisplayedRange',
						border: true,
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
				},
				xAxisNumberOfCharacter: xAxisNumberOfCharacter(3),
				labelRotate,
				selectedLegend: {
					type: 'widget_control_hidden',
					default: {},
					category: CATEGORY_LEGEND,
					needReload: true,
					needSaveConfiguration: false,
					needFetch: false
				}
			}
		};
	},
	widgetHooks: {
		dataAnalyze(data) {
			return {
				colors: {
					// + 2 for possible average/metric average lines calculated on frontend
					count: data.columns.length + 2
				}
			};
		},
		// eslint-disable-next-line max-lines-per-function,complexity, max-statements
		dataTransformation(data, configuration, context) {
			const {metrics} = configuration.data.configuration;
			// eslint-disable-next-line max-lines-per-function,max-statements,complexity
			const mapData = (rawData, widgetContext, widgetConfiguration) => {
				const metricsMap = widgetConfiguration.data.configuration.metrics;

				let selectedLegendMap = null;
				if (configuration.options.selectedLegend
					&& Object.keys(widgetConfiguration.options.selectedLegend).length !== 0
					&& metricsMap.length === Object.keys(widgetConfiguration.options.selectedLegend).length) {
					// eslint-disable-next-line prefer-destructuring
					selectedLegendMap = widgetConfiguration.options.selectedLegend;
				} else {
					selectedLegendMap = createSelectedLegend(metricsMap, true, true);
				}

				const dimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1');
				let metricsLength = rawData.columns.filter((column) => column.reference.startsWith('Metric')).length;
				const timelineDimensionIndex = data.columns.map((column) => column.reference).indexOf('Timeline');
				const isTimeline = timelineDimensionIndex > -1;
				let series = new Array(metricsLength);
				const categories = new Array(rawData.rows.length);
				const {options} = widgetConfiguration;

				for (let i = 0; i < rawData.rows.length; i++) {
					const row = rawData.rows[i];
					categories[i] = dimensionLabel(row[dimensionIndex], rawData.columns[dimensionIndex].dataType);

					let metricIndex = 0;
					for (let j = 0; j < row.length; j++) {
						if (rawData.columns[j].reference.startsWith('Metric')) {
							if (!series[metricIndex]) {
								series[metricIndex] = {
									type: 'line',
									name: String(metricIndex + 1),
									stack: options?.stacked ?? null,
									areaStyle: options?.stacked ? {} : null,
									smooth: options?.smoothLine ?? false,
									itemStyle: {
										color: widgetContext.colors?.coloring?.[`metric${metricIndex}`] ?? context.colors.theme[metricIndex]
									},
									lineStyle: {
										width: 3
									},
									emphasis: {
										focus: 'series',
										lineStyle: {
											width: 6
										}
									},
									connectNulls: options?.connectUndefined ?? null,
									showSymbol: options.graphSymbols === true ? true : categories.length === 1,
									symbolSize: categories.length === 1 ? 10 : 4,
									data: new Array(rawData.rows.length)
								};
							}
							let val = row[j];

							if (options?.replaceUndefined && (val === null || isNaN(val))) {
								val = 0;
							}

							series[metricIndex].data[i] = val;
							series[metricIndex].legendHoverLink = Boolean(selectedLegendMap[Object.keys(selectedLegendMap)[metricIndex]]);
							if (configuration.options.markLines) {
								series[metricIndex].markLine = {
									symbol: [
										'none',
										'none'
									],
									label: {show: false},
									data: rawData.rows.map((ro, id) => {
										let step = Math.floor(rawData.rows.length / 10);
										if (step < 1) {
											step = 1;
										}
										if ((id % step === 0 || id === data.rows.length - 1) && id !== 0) {
											return {
												xAxis: id,
												lineStyle: {
													type: 'dashed',
													color: i === 0 ? chartConstants.colors.axis : chartConstants.colors.split,
													width: 1
												}
											};
										}
										return {
											xAxis: 0,
											lineStyle: {
												type: 'solid',
												color: chartConstants.colors.axis,
												width: 1
											}
										};
									})
								};
							}
							metricIndex += 1;
						}
					}
				}
				if (options?.averageLineAll) {
					metricsLength += 1;
					series = addAverageAll(series, context, configuration);
				}
				if (options?.averageLineBucketing) {
					metricsLength += 1;
					series = addAverageBucketing(series, context, configuration);
				}

				if (isTimeline) {
					return {
						numColors: metricsLength,
						xAxis: {
							data: categories
						},
						series
					};
				}
				return series;
			};
			const dimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1');
			const firstMetricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');
			const timelineDimensionIndex = data.columns.map((column) => column.reference).indexOf('Timeline');
			const isTimeline = timelineDimensionIndex > -1;
			let transformedData = {};

			if (isTimeline === false) {
				transformedData = (dimensionIndex < 0 || firstMetricIndex < 0) ? null : mapData(cloneDeep(data), context, configuration);
			} else {
				transformedData = mapTimeline(data, configuration, context, firstMetricIndex, timelineDimensionIndex, mapData);
				transformedData.timelineSeries = transformedData.timelineSeries.map((item) => ({
					...item.series,
					title: item.title
				}));
			}


			let selectedLegend = null;
			if (configuration.options.selectedLegend
				&& Object.keys(configuration.options.selectedLegend).length !== 0
				&& transformedData.length === Object.keys(configuration.options.selectedLegend).length) {
				// eslint-disable-next-line prefer-destructuring
				selectedLegend = configuration.options.selectedLegend;
			} else {
				selectedLegend = createSelectedLegend(transformedData, true, true);
			}

			const selectedIndex = getSelectedLegend(selectedLegend);
			const columnFormatter = getFormatter(
				data.columns[dimensionIndex].dataType,
				'dimension0',
				'xAxis',
				configuration.options.enums,
				configuration.options.selectedFormat,
				{
					shortLabel: configuration?.options?.xAxisShortLabel,
					maxLength: configuration?.options?.xAxisNumberOfCharacter
				}
			);
			const metricFormatter = getFormatter(
				data.columns[firstMetricIndex].dataType,
				'metric',
				'metric',
				configuration.options.enums,
				configuration.options.selectedFormat
			);
			const splitLineColors = getSplitLineColors(configuration, configuration.options.markLines);
			const splitLinesVertical = getSplitLineColors(configuration);

			const {enums} = configuration.options;
			const grid = getXYaxisGrid(configuration.options, isTimeline);
			const options = {
				textStyle: {
					color: '#8988AA'
				},
				title: {
					text: configuration.options.title,
					left: chartConstants.chartConst.CENTER,
					textStyle: {
						color: '#36363A',
						fontSize: 32
					}
				},
				grid,
				legend: {
					type: chartConstants.chartConst.SCROLL,
					itemHeight: 16,
					itemWidth: 16,
					...(configuration?.options?.legendPosition === chartConstants.chartConst.BOTTOM && {padding: [0, 0, 25, 0]}),
					formatter: (params) => getAlias(configuration?.data?.configuration?.metrics, params, configuration?.options?.enums, context),
					// eslint-disable-next-line no-negated-condition
					data: !isTimeline
						? transformedData.map((metric, index) => ({
							name: String(isTimeline ? index : metric.name === 't_Average' || metric.name === 't_MetricAverage' ? metric.name : index + 1),
							icon: `image://${window.location.protocol}//${window.location.host}${selectedIndex.includes(String(isTimeline
								? index
								: metric.name === 't_Average' || metric.name === 't_MetricAverage'
									? metric.name
									: index + 1))
								? checkBox
								: configuration?.options.selectedLegend === null
									? checkBox
									: box}`,
							textStyle: {
								color: context.colors?.coloring?.[`metric${index}`] ?? context.colors.theme[index]
							}
						}))
						: {},
					selected: selectedLegend,
					itemGap: 32,
					show: configuration.options.showLegend,
					pageIconColor: '#6B6E74',
					top: configuration.options.legendPosition === chartConstants.chartConst.BOTTOM
						? configuration.options.legendPosition
						: chartConstants.chartConst.MIDDLE,
					left: configuration.options.legendPosition === chartConstants.chartConst.BOTTOM
						? chartConstants.chartConst.CENTER
						: configuration.options.legendPosition,
					orient: configuration.options.legendPosition === chartConstants.chartConst.BOTTOM
						? chartConstants.chartConst.HORIZONTAL
						: chartConstants.chartConst.VERTICAL,
					textStyle: {
						color: '#8988AA'
					}
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'line'
					},
					formatter: (name) => tooltipFormatterLine(name, metrics, enums, columnFormatter, metricFormatter, context)
				},
				xAxis: {
					type: chartConstants.chartConst.CATEGORY,
					axisTick: false,
					axisLine: false,
					data: isTimeline ? [] : data.rows.map((row) => dimensionLabel(row[dimensionIndex], data.columns[dimensionIndex].dataType)),
					axisLabel: {
						color: '#67686F',
						margin: isTimeline ? 12 : 24,
						fontSize: 28,
						// for backward compatibility, when old verticalLabel exist and labelRotate is not used
						rotate: labelRotateHandle(configuration?.options?.verticalLabel && !configuration?.options?.labelRotate
							? configuration?.options?.verticalLabel
							: configuration?.options?.labelRotate),
						formatter: columnFormatter
					},
					boundaryGap: false,
					splitLine: {
						show: true,
						lineStyle: {
							type: chartConstants.chartConst.DASHED,
							color: splitLineColors,
							width: 1
						}
					}
				},
				yAxis: {
					axisTick: false,
					type: configuration.options.switchToLog ? 'log' : 'value',
					scale: true,
					...(configuration.options.switchToLog ? {min: 1} : {}),
					splitLine: {
						show: true,
						lineStyle: {
							type: chartConstants.chartConst.DASHED,
							color: splitLinesVertical,
							width: 1
						}
					},
					axisLabel: {
						color: '#808189',
						margin: 24,
						fontSize: 28,
						formatter: (params) => metricFormatter(params)
					},
					...(configuration?.options?.limitRange
						? {
							max: configuration?.options?.gridBorder?.gridRight,
							min: configuration?.options?.gridBorder?.gridLeft
						}
						: {})
				},
				series: isTimeline ? [] : transformedData
			};
			const isWarning = !(dimensionIndex >= 0 && firstMetricIndex >= 0) || (data?.rows?.length ?? 0) === 0
				|| checkCumSum(configuration);

			return {
				isWarning: isWarning ? isWarning : null,
				...options,
				...(isTimeline
					? {
						timeline: transformedData,
						options: transformedData.timelineSeries
					}
					: {})
			};
		}
	},
	computed: {
		widgetData() {
			let data = cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId));
			if (data) {
				data = mergeOptions(data, this.defaultThemeOptions, this.widgetInstanceId);
			}
			return data;
		},
		colors() {
			return this.$store.getters['storyDetail/graphColors'];
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
