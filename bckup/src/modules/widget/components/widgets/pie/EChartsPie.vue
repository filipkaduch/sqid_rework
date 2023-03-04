<!-- eslint-disable max-lines -->
<template>
	<div class="w-100 h-100">
		<v-chart
			v-if="widgetData"
			ref="chart"
			class="w-100 h-100 widget-padding"
			:class="readOnly ? 'widget-padding-bottom' : ''"
			:option="timelineShow ? timelineDataOptions : widgetData"
			autoresize
			@click="onItemClicked"
			@finished="setFinishedRender(true)"
			@legendselectchanged="onLegendSelectChanged"
			@timelinechanged="onTimelineStateChanged" />
		<app-timeline-slider
			v-if="widgetData?.timeline"
			:values="widgetData?.timeline?.timelineData"
			:widgetInstanceId="widgetInstanceId"
			@update-timeline="updateTimeline" />
	</div>
</template>

<script>
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/pie/consts';
import {createSelectedLegend, getSelectedLegend, selectData} from '@/util/echartsWidgetsUtil';
import {echartsDefaultControls, echartsLegendControls} from '@/modules/widget/echartsWidgetControls';
import AppTimelineSlider from '@/components/story/AppTimelineSlider.vue';
import box from '@/assets/box-icon.svg';
import checkBox from '@/assets/checkbox-icon.svg';
import {dimensionLabel} from '@/util/widgetData';
import echartsMixin from '@/mixins/echartsMixin';
import echartsTimelineMixin from '@/mixins/echartsTimelineMixin';
import {getFormatter} from '@/util/formatingUtil';
import {mapTimeline} from '@/util/echartsTimelineUtil';
import selectionMixin from '@/mixins/selectionMixin';
import widgetMixin from '@/mixins/widgetMixin';
import {CATEGORY_AXIS, CATEGORY_LEGEND} from '@/modules/widget/components/widget-controls/consts/categories';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import findIndex from 'lodash/findIndex';
import {chartConstants} from '@/util/consts/chartsConstants';

export default {
	name: 'EChartsPie',
	components: {
		AppTimelineSlider
	},
	mixins: [
		selectionMixin,
		echartsTimelineMixin,
		echartsMixin,
		widgetMixin
	],
	props: {
		doughnut: {
			type: Boolean,
			default: false
		},
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	widgetTypes() {
		return [
			'widget_pie_chart_basic',
			'widget_pie_chart_doughnut'
		];
	},
	widgetTypeMetadata(widgetType) {
		return {
			props: {
				doughnut: widgetType === 'widget_pie_chart_doughnut'
			},
			widgetGroup,
			initialize,
			configuration: config,
			options: {
				...echartsDefaultControls(true),
				...echartsLegendControls,
				labelPosition: {
					type: 'widget_control_button_group',
					default: chartConstants.chartConst.OUTSIDE,
					order: 0,
					category: CATEGORY_AXIS,
					props: {
						headingText: 't_LabelPosition',
						options: [
							{value: chartConstants.chartConst.INSIDE, text: 't_inside'},
							{value: chartConstants.chartConst.OUTSIDE, text: 't_outside'}
						]
					}
				},
				selectedLegend: {
					type: 'widget_control_hidden',
					default: {},
					needReload: true,
					category: CATEGORY_LEGEND,
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
					count: data.rows?.length
				}
			};
		},
		// eslint-disable-next-line max-lines-per-function,complexity,max-statements
		dataTransformation(data, configuration, context) {
			const mapData = (rawData, widgetContext) => {
				const dimensionIndex = rawData.columns.map((column) => column.reference).indexOf('Dimension1');
				const metricIndex = rawData.columns.map((column) => column.reference).indexOf('Metric1');
				return (dimensionIndex < 0 || metricIndex < 0)
					? null
					: rawData.rows.map((item, index) => ({
						value: item[metricIndex],
						name: dimensionLabel(item[dimensionIndex], rawData.columns[dimensionIndex].dataType),
						selected: false,
						itemStyle: {
							color: widgetContext.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION0]?.[item[dimensionIndex]] ?? context.colors.theme[index],
							borderColor: widgetContext.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION0]?.[item[dimensionIndex]] ?? context.colors.theme[index]
						}
					}));
			};

			const dimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1');
			const metricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');
			const timelineDimensionIndex = data.columns.map((column) => column.reference).indexOf('Timeline');
			const isTimeline = timelineDimensionIndex > -1;
			let transformedData = {};
			if (isTimeline === false) {
				transformedData = (dimensionIndex < 0 || metricIndex < 0) ? null : mapData(data, context);
			} else {
				transformedData = mapTimeline(data, configuration, context, metricIndex, timelineDimensionIndex, mapData);
				transformedData.timelineSeries = transformedData.timelineSeries.map((item) => ({
					series: [{data: item.series}],
					title: item.title
				}));
			}

			const cleanDim = [];
			data.rows.forEach((row) => {
				cleanDim.push(row[dimensionIndex]);
			});

			let selectedLegend = null;
			if (configuration.options.selectedLegend
				&& Object.keys(configuration.options.selectedLegend).length !== 0
				&& cleanDim.length === Object.keys(configuration.options.selectedLegend).length) {
				// eslint-disable-next-line prefer-destructuring
				selectedLegend = configuration.options.selectedLegend;
			} else {
				selectedLegend = createSelectedLegend(cleanDim);
			}

			const selectedIndex = getSelectedLegend(selectedLegend);
			const getMetricFormatter = getFormatter(
				data.columns[metricIndex].dataType,
				'metric',
				'metric',
				configuration.options.enums,
				configuration.options.selectedFormat
			);
			const getColumnFormatter = getFormatter(
				data.columns[dimensionIndex].dataType,
				'dimension0',
				'xAxis',
				configuration.options.enums,
				configuration.options.selectedFormat
			);
			const outSideLabel = {
				alignTo: 'edge',
				position: 'outside',
				formatter: (params) => {
					if (params.componentType === 'series') {
						return `${getColumnFormatter(params.name)} (${params.percent}%)\n${getMetricFormatter(params.value)}`;
					}
					return '';
				},
				minMargin: 4,
				edgeDistance: '12%',
				lineHeight: 25,
				color: '#999'
			};
			const outsideLabelLine = {
				length: 10,
				length2: 0,
				maxSurfaceAngle: 65
			};
			const labelLayout = (params) => {
				const isLeft = params.labelRect.x < 600;
				const points = params.labelLinePoints;
				// Update the end point.
				if (points) {
					points[2][0] = isLeft
						? params.labelRect.x
						: params.labelRect.x + params.labelRect.width;
					return {
						labelLinePoints: points
					};
				}
				return {};
			};
			const insideLabel = {
				position: 'inside',
				color: '#fff',
				formatter: getFormatter(
					data.columns[dimensionIndex].dataType,
					'dimension0',
					'xAxis',
					configuration.options.enums,
					configuration.options.selectedFormat,
					{transformValue: (value) => value.data.name}
				)
			};
			const options = {
				tooltip: {
					trigger: 'item',
					formatter: (params) => {
						if (params.componentType === 'series') {
							return `${params.marker} ${getColumnFormatter(params.name)}: ${getMetricFormatter(params.value)} (${params.percent}%)`;
						}
						return '';
					}
				},
				grid: {
					top: configuration.options.title || configuration.data.configuration.timeline ? 45 : 10,
					bottom: configuration.options.legendPosition === chartConstants.chartConst.BOTTOM ? 50 : 0
				},
				legend: {
					show: configuration.options.showLegend,
					formatter: getFormatter(
						data.columns[dimensionIndex].dataType,
						'dimension0',
						'xAxis',
						configuration.options.enums,
						configuration.options.selectedFormat
					),
					itemGap: 32,
					itemHeight: 16,
					itemWidth: 16,
					data: data?.rows.map((row, index) => ({
						name: row[dimensionIndex],
						icon: `image://${window.location.protocol}//${window.location.host}${selectedIndex.includes(String(row[dimensionIndex]))
							? checkBox
							: configuration?.options.selectedLegend === null
								? checkBox
								: box}`,
						textStyle: {
							color: context.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION0]?.[row[dimensionIndex]] ?? context.colors.theme[index]
						}
					})),
					selected: selectedLegend,
					type: 'scroll',
					pageIconColor: '#6B6E74',
					top: (configuration.options.legendPosition === chartConstants.chartConst.LEFT || configuration.options.legendPosition === chartConstants.chartConst.RIGHT)
						? 'middle'
						: configuration.options.legendPosition,
					left: (configuration.options.legendPosition === chartConstants.chartConst.BOTTOM) ? chartConstants.chartConst.CENTER : configuration.options.legendPosition,
					orient: configuration.options.legendPosition === chartConstants.chartConst.BOTTOM ? chartConstants.chartConst.HORIZONTAL : chartConstants.chartConst.VERTICAL
				},
				label: {
					show: false,
					position: 'top'
				}
			};
			const dataConfiguration = (dimensionIndex < 0 || metricIndex < 0)
				? null
				: {
					series: [
						{
							id: 'data',
							type: 'pie',
							data: isTimeline ? [] : transformedData,
							selectedMode: 'multiple',
							minShowLabelAngle: 10,
							radius: [
								context.props.doughnut ? '40%' : 0,
								'80%'
							],
							label: configuration.options?.labelPosition === chartConstants.chartConst.OUTSIDE ? {...outSideLabel} : {...insideLabel},
							...(configuration.options?.labelPosition === chartConstants.chartConst.OUTSIDE && {labelLine: outsideLabelLine}),
							...(configuration.options?.labelPosition === chartConstants.chartConst.OUTSIDE && {labelLayout})
						}
					]
				};
			const isWarning = !(dimensionIndex >= 0 && metricIndex >= 0) || (data?.rows?.length ?? 0) === 0;
			return {
				...options,
				...dataConfiguration,
				coloring: context.colors,
				isWarning: isWarning ? isWarning : null,
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
			let data = merge(cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId)), this.defaultThemeOptions);
			if (data) {
				data = merge(data, this.defaultThemeOptions);
				data = selectData(data, this.selected, data.coloring);
			}
			return data;
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		}
	},
	methods: {
		onItemClicked(evt) {
			const i = findIndex(this.selected, (selected) => selected[0] === evt.name);
			if (i === -1) {
				this.selected.push([evt.name]);
			} else {
				this.selected.splice(i, 1);
			}
		},
		onLegendSelectChanged(evt) {
			const temp = [];
			this.setOptionLegend(widgetOptionName.SELECTED_LEGEND, evt.selected);
			for (const name in evt.selected) {
				if (Object.hasOwn(evt.selected, name) && evt.selected[name]) {
					const index = findIndex(this.selected, (selected) => selected[0] === name);
					if (index !== -1) {
						this.selected.splice(index, 1);
					}
					temp.push([name]);
				}
			}

			this.notHidden = temp;
		}
	}
};
</script>
