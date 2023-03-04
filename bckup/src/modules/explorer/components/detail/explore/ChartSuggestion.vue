<template>
	<div @click="seenSuggestion = true">
		<ds-icon fill="secondary-500" :class="{'blink': !seenSuggestion}" :name="chartIcon" />
	</div>
</template>
<!-- if the suggestions is not null, for loop in suggestion. Else "No recommendation." -->


<script lang="ts">
import {defineComponent, computed, ref, watch} from 'vue';
import isEqual from 'lodash/isEqual';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {dataTypes, isDataType} from '@/util/queryBuilder';

export default defineComponent({
	name: 'ChartSuggestion',
	props: {
		suggestionInput: {
			type: Object,
			required: true
		},
		chartIcon: {
			type: String,
			default: 'ds-icon-bulb'
		}
	},
	emits: ['newSuggestions'],
	setup(props, {emit}) {
		const seenSuggestion = ref(true);
		const isGeoValue = (value: any) => value === null || ((Number(value) >= -180 && Number(value) <= 180)
			&& value.toString().split('.')[1]?.length >= 0);
		// eslint-disable-next-line complexity
		const suggestions = computed(() => {
			const {dimensions, metrics} = props.suggestionInput;
			const datetimeDim = dimensions?.filter((dimension: any) => isDataType(dataTypes.DATE_TYPE, dimension.type));
			// try to map the geography dimension
			const geoDim = dimensions?.filter((dimension: any) => {
				if (dimension.type === dataTypes.FLOAT) {
					return dimension?.data?.every((value: any) => isGeoValue(value[0]));
				}
				return false;
			});
			const geoMetric = metrics?.filter((metric: any) => {
				if (metric.type === dataTypes.FLOAT) {
					return metric?.data?.every((value: any) => isGeoValue(value[0]));
				}
				return false;
			});
			const geoCount = geoDim.length + geoMetric.length;
			switch (true) {
				case (metrics.length === 0 && dimensions.length === 1):
					return [
						{type: widgetTypes.HISTOGRAM, name: 'widgetTypes.widget_histogram_chart_title'},
						{type: widgetTypes.HISTOGRAM_SELECTION, name: 'widgetTypes.widget_histogram_selection_chart_title'}
					];
				case (metrics.length === 1 && dimensions.length === 0):
					return [{type: widgetTypes.TEXT_FORMULA, name: 'widgetTypes.widget_text_formula_title'}];
				case (metrics.length === 1 && dimensions.length === 1 && datetimeDim.length === 1):
					return [
						{type: widgetTypes.LINE_CHART, name: 'widgetTypes.widget_line_chart_single_title'},
						{type: widgetTypes.LINE_COMPARISON, name: 'widgetTypes.widget_line_time_comparison_title'},
						{type: widgetTypes.CALENDAR_HEATMAP, name: 'widgetTypes.widget_calendar_heatmap_title'}
					];
				case (dimensions.length === 2 && metrics.length === 0):
					return [{type: widgetTypes.SCATTER_CHART, name: 'widgetTypes.widget_scatter_chart_title'}];
				case (metrics.length === 1 && dimensions.length === 2 && datetimeDim.length === 1):
					return [
						{
							type: widgetTypes.LINE_MULTISERIES,
							name: 'widgetTypes.widget_line_chart_multiseries_title'
						}
					];
				case (metrics.length === 1 && dimensions.length === 2 && geoCount === 2):
					return [
						{type: widgetTypes.HEATMAP_MAP, name: 'widgetTypes.widget_heatmap_chart_title'},
						{type: widgetTypes.SCATTER_MAP, name: 'widgetTypes.widget_map_scatter_title'},
						{type: widgetTypes.ARC_MAP, name: 'widgetTypes.widget_arc_map_title'},
						{type: widgetTypes.COUNTRY_MAP, name: 'widgetTypes.widget_country_map_title'},
						{type: widgetTypes.HEXAGON_MAP, name: 'widgetTypes.widget_hexagon_map_title'}
					];
				case (metrics.length === 1 && dimensions.length === 4 && geoCount === 4):
					return [{type: widgetTypes.ARC_MAP, name: 'widgetTypes.widget_arc_map_title'}];
				case (metrics.length === 1 && dimensions.length === 2):
					return [
						{type: widgetTypes.LINE_MULTISERIES, name: 'widgetTypes.widget_line_chart_multiseries_title'},
						{type: widgetTypes.SPARKLINE, name: 'widgetTypes.widget_sparkline_title'},
						{type: widgetTypes.HEATMAP_CHART, name: 'widgetTypes.widget_heatmap_chart_title'},
						{type: widgetTypes.BUBBLE_CHART, name: 'widgetTypes.widget_bubble_chart_title'}
					];
				case (metrics.length === 1 && dimensions.length === 1):
					return [
						{type: widgetTypes.BAR_CHART, name: 'widgetTypes.widget_column_chart_basic_title'},
						{type: widgetTypes.PIE_CHART, name: 'widgetTypes.widget_pie_chart_basic_title'},
						{type: widgetTypes.DOUGHNUT_CHART, name: 'widgetTypes.widget_pie_chart_doughnut_title'},
						{type: widgetTypes.SPARKLINE_PIE, name: 'widgetTypes.widget_sparkline_doughnut_title'},
						{type: widgetTypes.COMPARISON_CHART, name: 'widgetTypes.widget_comparison_chart_title'}
					];
				case (metrics.length > 1 && dimensions.length === 1):
					return [
						{type: widgetTypes.BAR_CHART, name: 'widgetTypes.widget_column_chart_basic_title'},
						{type: widgetTypes.SPARKLINE_PIE, name: 'widgetTypes.widget_sparkline_doughnut_title'}
					];
				default:
					return [{type: null, name: 't_noRecommendation'}];
			}
		});

		watch(suggestions, (newVal, oldVal) => {
			if (!isEqual(newVal, oldVal)) {
				seenSuggestion.value = false;
			}
			emit('newSuggestions', suggestions);
		}, {deep: true});

		watch(() => props.suggestionInput, (newVal, oldVal) => {
			// This means that we have loaded valid chart and we don't need any suggestions after opening
			if (oldVal.metrics.length === 0 && oldVal.dimensions.length === 0
				&& newVal.metrics.length >= 1 && newVal.dimensions.length >= 1) {
				seenSuggestion.value = true;
			}
		});

		return {
			suggestions,
			seenSuggestion
		};
	}
});
</script>

<style scoped lang="scss">

.blink {
	animation: blink 1.5s infinite;
}
@keyframes blink{
	0% {
		fill: map-get($ds-colors, 'separate-content-300');
	}
	50% {
		fill: map-get($ds-colors, 'secondary-500');
	}
	100% {
		fill: map-get($ds-colors, 'separate-content-300');
	}
}
</style>
