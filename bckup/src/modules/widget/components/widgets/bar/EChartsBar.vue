<!-- eslint-disable max-lines -->
<template>
	<ds-box flex-type="column" class="h-100 w-100" :class="{'widget-padding-bottom': readOnly, 'widget-padding-bottom-editor': editorTimeline}">
		<ds-box no-grow class="w-100 h-100">
			<ds-btn
				v-if="currentBucketing"
				icon-only
				variant="ghost"
				class="btn-filter-reset rounded-circle border-0"
				@click="resetDrillDown">
				<template #icon>
					<fa-layers fixed-width>
						<fa-icon :icon="['fas', 'filter']" transform="left-1" />
						<fa-icon :icon="['fas', 'times-circle']" transform="shrink-4 right-8 down-4" />
					</fa-layers>
				</template>
			</ds-btn>
			<axis-name-wrapper :widgetInstanceId="widgetInstanceId">
				<v-chart
					:key="key"
					ref="chart"
					class="widget-padding"
					autoresize
					:option="timelineShow ? timelineDataOptions : widgetData"
					:update-options="{notMerge: true}"
					@finished="setFinishedRender(true)"
					@legendselectchanged="onLegendClicked"
					@click="onItemClicked"
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
import {checkCumSum, selectDataDataset} from '@/util/echartsWidgetsUtil';
import {
	configuration as config,
	initialize,
	mapData,
	options as opt
} from '@/modules/widget/components/widgets/bar/consts';
import AppTimelineSlider from '@/components/story/AppTimelineSlider.vue';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import drillDownMixin from '@/mixins/drillDownMixin';
import echartsMixin from '@/mixins/echartsMixin';
import echartsTimelineMixin from '@/mixins/echartsTimelineMixin';
import {mapTimelineDataset, mapTimelineSeries} from '@/util/echartsTimelineUtil';
import selectionMixin from '@/mixins/selectionMixin';
import widgetMixin from '@/mixins/widgetMixin';
import BarChartService from '@/modules/widget/components/widgets/bar/utils';
import {
	CATEGORY_AXIS,
	CATEGORY_LABEL,
	CATEGORY_LEGEND,
	CATEGORY_VISUAL
} from '@/modules/widget/components/widget-controls/consts/categories';
import {
	echartsDefaultControls,
	echartsLegendControls,
	labelRotate, xAxisNameControls,
	xAxisNumberOfCharacter, yAxisNameControls
} from '@/modules/widget/echartsWidgetControls';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import AxisNameWrapper from '@/modules/widget/components/axisNameWrapper.vue';
import {mergeOptions} from '@/modules/widget/utils/widget';

export default {
	name: 'EChartsBar',
	components: {
		AxisNameWrapper,
		AppTimelineSlider
	},
	mixins: [
		drillDownMixin,
		selectionMixin,
		echartsTimelineMixin,
		echartsMixin,
		widgetMixin
	],
	props: {
		horizontal: {
			type: Boolean,
			default: false
		},
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			key: 1
		};
	},
	computed: {
		widgetData() {
			let data = cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId));
			if (data) {
				data = mergeOptions(data, this.defaultThemeOptions, this.widgetInstanceId);
				data = selectDataDataset(data, this.selected, data.coloring);
			}
			return data;
		},
		parentId() {
			return this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		parent() {
			return this.$store.getters['widgetInstances/configuration'](this.parentId);
		}
	},
	widgetTypes() {
		return [
			'widget_column_chart_basic',
			'widget_category_chart_basic'
		];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata(widgetType) {
		return {
			widgetGroup: {
				group: 'chart',
				subGroup: widgetType === 'widget_category_chart_basic' ? 'chart_usecases' : 'chart_column'
			},
			props: {
				horizontal: widgetType === 'widget_category_chart_basic'
			},
			initialize,
			configuration: config,
			options: {
				...echartsDefaultControls(false),
				...echartsLegendControls,
				...xAxisNameControls,
				...yAxisNameControls,
				horizontal: {
					type: 'widget_control_button_group',
					default: widgetType === 'widget_category_chart_basic',
					category: CATEGORY_VISUAL,
					order: 2,
					props: {
						headingText: 't_chartOrientation',
						options: [{value: true, text: 'chartOrientation.horizontal'}, {value: false, text: 'chartOrientation.vertical'}],
						delimiter: true
					}
				},
				tickAlignWithLabel: {
					type: 'widget_control_single_switch',
					default: true,
					category: CATEGORY_AXIS,
					needReload: false,
					props: {
						showTextState: true,
						switchText: 'tickAlignWithLabel'
					}
				},
				stackedLabelSum: {
					type: 'widget_control_single_switch',
					default: false,
					category: CATEGORY_LABEL,
					props: {
						showTextState: true,
						switchText: 'stackedLabelSum'
					}
				},
				...opt,
				labelPosition: {
					type: 'widget_control_button_group',
					default: widgetType === 'widget_category_chart_basic' ? 'right' : 'top',
					props: {
						headingText: 't_LabelPosition'
					},
					category: CATEGORY_LABEL
				},
				labelRotate,
				xAxisNumberOfCharacter: xAxisNumberOfCharacter(2),
				selectedLegend: {
					type: 'widget_control_hidden',
					default: {},
					needReload: true,
					needSaveConfiguration: false,
					needFetch: false,
					category: CATEGORY_LEGEND
				}
			}
		};
	},
	widgetHooks: {
		dataAnalyze(data) {
			return {
				colors: {
					singleMetric: data.columns.map((column) => column.reference).indexOf('Metric2') === -1,
					forceRecolor: data.columns.map((column) => column.reference).indexOf('Metric2') > -1,
					count: data.rows?.length + 1
				}
			};
		},
		// eslint-disable-next-line max-lines-per-function,complexity,max-statements
		dataTransformation(data, configuration, context) {
			const isTimeline = context.indexes?.Timeline?.index > -1;
			const categories = [];
			for (const item of data.rows) {
				categories.push(item[context.indexes.Dimension1?.index]);
			}

			let transformedData = {};
			if (isTimeline === false) {
				transformedData = (context.indexes.Dimension1?.index < 0 || context.indexes.Metric1?.index < 0) ? null : mapData(cloneDeep(data), context, configuration);
			} else {
				transformedData = mapTimelineDataset(data, configuration, context, context.indexes.Metric1?.index);
			}
			// eslint-disable-next-line no-unused-vars
			const isWarning = !(context.indexes.Dimension1?.index >= 0 && context.indexes.Metric1?.index >= 0) || (data?.rows?.length ?? 0) === 0
				|| checkCumSum(configuration);

			const options = {
				...this.applyOptions(data, configuration, context, isTimeline ? transformedData.timelineSeries : transformedData.series),
				...(isTimeline
					? {
						series: transformedData.timelineSeries,
						options: transformedData.timelineDatasets
					}
					: {
						dataset: {
							source: transformedData.datasetSource
						}
					})
			};
			return {
				coloring: context.colors,
				...options,
				isWarning: isWarning ? isWarning : null,
				...(isTimeline ? {timeline: transformedData} : {})
			};
		},
		applyOptions(data, configuration, context, chartSeries = null) {
			const isTimeline = context.indexes?.Timeline?.index > -1;
			const localSeries = chartSeries ? [...chartSeries] : [...context.chartData.series];
			const service = new BarChartService(data, configuration, context);
			if (context.optionName) {
				const rest = service.changeOptions(context.optionName, context.chartData, configuration, context);
				return {
					...rest,
					...(context?.chartData?.dataset ? {dataset: context.chartData.dataset} : {}),
					...(context?.chartData?.colors ? {colors: context.chartData.colors} : {})
				};
			}

			return {
				animationDuration: 0,
				animationDurationUpdate: 300,
				animationEasing: 'linear',
				animationEasingUpdate: 'linear',
				title: service.getTitle(),
				tooltip: service.getTooltip(configuration, context),
				grid: service.getGrid(configuration),
				legend: service.getLegend(configuration, context),
				label: service.getLabel(configuration),
				xAxis: service.getXAxis(configuration),
				yAxis: service.getYAxis(configuration),
				...(isTimeline ? {series: mapTimelineSeries(configuration, context)} : {series: service.getSeries(configuration, context, localSeries)}),
				...(context?.chartData?.dataset ? {dataset: context.chartData.dataset} : {}),
				...(context?.chartData?.colors ? {colors: context.chartData.colors} : {})
			};
		}
	},
	methods: {
		onItemClicked(evt) {
			if (evt.componentType !== 'series') {
				return;
			}
			const {name} = evt;
			if (this.isDrillDown) {
				this.setDrillDownFilter(name);
			} else {
				const index = findIndex(this.selected, (selected) => selected[0] === name);
				if (index === -1) {
					this.selected.push([name]);
				} else {
					this.selected.splice(index, 1);
				}
			}
		},
		onLegendClicked(evt) {
			this.setOptionLegend(widgetOptionName.SELECTED_LEGEND, evt.selected);
		}
	}
};
</script>
