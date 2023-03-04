<template>
	<div class="position-relative chart-wrapper h-100 w-100">
		<ds-box v-if="showXAxisName" class="x-axis-name">
			<ds-text color="separate-content">
				{{ xAxisName }}
			</ds-text>
		</ds-box>
		<ds-box v-if="showYAxisName" class="y-axis-name">
			<ds-text color="separate-content" class="rotated">
				{{ yAxisName }} {{ yAxisformat ? `(${yAxisformat})` : '' }}
			</ds-text>
		</ds-box>
		<ds-box class="h-100">
			<slot />
		</ds-box>
	</div>
</template>

<script setup lang="ts">

import {computed} from 'vue';
import {useStore} from 'vuex';
import {dimensionDefinition} from '@/util/queryBuilder';
import {dateFormatOptions} from '@/modules/widget/components/widget-controls/consts/formatOptions';
import isEqual from 'lodash/isEqual';
import {chartConstants} from '@/util/consts/chartsConstants';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';

const props = defineProps({
	widgetInstanceId: String
});
const store = useStore();
const widgetConfiguration = computed(() => store.getters['widgetInstances/configuration'](props.widgetInstanceId));
const metrics = computed(() => widgetConfiguration.value?.data?.configuration?.metrics);
const dimensions = computed(() => widgetConfiguration.value?.data?.configuration?.dimensions);

const yAxisformat = computed(() => store.getters['widgetInstances/option'](props.widgetInstanceId, widgetOptionName.SELECTED_FORMAT)?.metric?.currency);

const groupedTypes: Array<string> = [dimensionDefinition.BUCKET_DATE, dimensionDefinition.BUCKET_VALUE, dimensionDefinition.EXTRACT_DATE];
const dimensionNames = computed(() => {
	const customName = store.getters['widgetInstances/option'](props.widgetInstanceId, isHorizontal.value ? widgetOptionName.Y_AXIS_NAME : widgetOptionName.X_AXIS_NAME);
	if (customName) {
		return customName;
	}
	const names: Array<string> = [];
	dimensions.value.forEach((dim: {function: string, column: string, bucketType?: string}) => {
		let name = dim.column;
		if (groupedTypes.includes(dim.function)) {
			const fncName = [];
			fncName.push(dim.bucketType);
			if (xDateMask.value) {
				fncName.push(xDateMask.value);
			}
			name += ` (${fncName.join(', ')})`;
		}
		names.push(name);
	});
	return names.join(', ');
});

const metricNames = computed(() => {
	const customName = store.getters['widgetInstances/option'](props.widgetInstanceId, isHorizontal.value ? widgetOptionName.X_AXIS_NAME : widgetOptionName.Y_AXIS_NAME);
	if (customName) {
		return customName;
	}
	const names: Array<string> = [];
	metrics.value.forEach((metric: {aggregation: string, column: string}, index: number) => {
		const key = `Metric${index + 1}`;
		let name = `${metric.aggregation}(${metric.column})`;
		if (enums.value?.metricAliases[key]) {
			name = enums.value?.metricAliases[key];
		}
		names.push(name);
	});
	return names.join(', ');
});

const xAxisformat = computed(() => store.getters['widgetInstances/option'](props.widgetInstanceId, widgetOptionName.SELECTED_FORMAT)?.xAxis);
const xDateMask = computed(() => dateFormatOptions.find((format: any) => isEqual(format.value, xAxisformat.value))?.short);
const enums = computed(() => store.getters['widgetInstances/option'](props.widgetInstanceId, widgetOptionName.ENUMS));

const isHorizontal = computed(() => store.getters['widgetInstances/option'](props.widgetInstanceId, chartConstants.chartConst.HORIZONTAL));
const xAxisName = computed(() => isHorizontal.value ? metricNames.value : dimensionNames.value);
const yAxisName = computed(() => isHorizontal.value ? dimensionNames.value : metricNames.value);

const showXAxisName = computed(() => store.getters['widgetInstances/option'](props.widgetInstanceId, widgetOptionName.SHOW_X_AXIS_NAME));
const showYAxisName = computed(() => store.getters['widgetInstances/option'](props.widgetInstanceId, widgetOptionName.SHOW_Y_AXIS_NAME));

</script>

<style scoped>
.x-axis-name{
	position: absolute;
	margin: 0;
	bottom: 10px;
	left: 50%;
	-ms-transform: translateX(-50%);
	transform: translateX(-50%);
}
.y-axis-name{
	left: 10px;
	position: absolute;
	margin: 0;
	top: 50%;
	-ms-transform: translateY(-50%);
	transform: translateY(-50%);
}
.rotated {
	writing-mode: tb-rl;
	transform: rotate(-180deg);
}
.chart-wrapper {
	padding-top: 16px;
	width: 100%;
	flex-grow: 1;
}
</style>
