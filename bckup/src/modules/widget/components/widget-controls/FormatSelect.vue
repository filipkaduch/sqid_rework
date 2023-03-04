<template>
	<div>
		<div>
			<div v-if="(getDimensionsLength === 1) && !hasMetric">
				<format-date-select
					v-if="isDataType(dataTypes.DATE_TYPE, xAxisDataType)"
					v-model:selectedFormat="selectedFormatXAxis"
					formatName="xAxis"
					:widgetInstanceId="widgetInstanceId"
					@set-date-format="updateFormat('xAxis', $event)" />
				<format-number-select
					v-else-if="isDataType(dataTypes.NUMBER, xAxisDataType)"
					v-model:selectedFormat="selectedFormatXAxis"
					formatName="xAxis"
					:widgetInstanceId="widgetInstanceId"
					@set-number-format="updateFormat('xAxis', $event)" />
			</div>

			<template v-if="dataBinding !== null && dataBinding.dimensions !== null">
				<div v-if="dataBinding.configuration.dimensions && dataBinding.configuration.dimensions.length === 1 && (getDimensionsLength > 1)">
					<format-number-select
						v-model:selectedFormat="selectedFormatYAxis"
						formatName="yAxis"
						:widgetInstanceId="widgetInstanceId"
						@set-number-format="updateFormat('yAxis', $event)" />
				</div>

				<div v-if="dataBinding.configuration.metrics && dataBinding.configuration.metrics.length !== 0 && hasMetric">
					<format-number-select
						v-if="isDataType(dataTypes.NUMBER, metricAxisDataType)"
						v-model:selectedFormat="selectedFormatYAxis"
						formatName="metric"
						:widgetInstanceId="widgetInstanceId"
						@set-number-format="updateFormat('metric', $event)" />
				</div>

				<div v-if="dataBinding.configuration.dimensions && dataBinding.configuration.dimensions.length === 2 && !hasMetric">
					<format-date-select
						v-if="isDataType(dataTypes.DATE_TYPE, xAxisDataType)"
						v-model:selectedFormat="selectedFormatXAxis"
						formatName="xAxis"
						:widgetInstanceId="widgetInstanceId"
						@set-date-format="updateFormat('xAxis', $event)" />
					<format-date-select
						v-if="isDataType(dataTypes.DATE_TYPE, yAxisDataType)"
						v-model:selectedFormat="selectedFormatYAxis"
						formatName="yAxis"
						:widgetInstanceId="widgetInstanceId"
						@set-date-format="updateFormat('yAxis', $event)" />
					<format-number-select
						v-else-if="isDataType(dataTypes.NUMBER, yAxisDataType)"
						v-model:selectedFormat="selectedFormatYAxis"
						formatName="yAxis"
						:widgetInstanceId="widgetInstanceId"
						@set-number-format="updateFormat('yAxis', $event)" />
				</div>
			</template>

			<div v-if="dataBinding && dataBinding.timeline && dataBinding.timeline[0]">
				<format-date-select
					v-if="isDataType(dataTypes.DATE_TYPE, timelineDataType)"
					v-model:selectedFormat="selectedFormatTimeline"
					formatName="Timeline"
					:widgetInstanceId="widgetInstanceId"
					@set-date-format="updateFormat('timeline', $event)" />
				<format-number-select
					v-else-if="isDataType(dataTypes.NUMBER, timelineDataType)"
					v-model:selectedFormat="selectedFormatTimeline"
					formatName="Timeline"
					:widgetInstanceId="widgetInstanceId"
					@set-number-format="updateFormat('timeline', $event)" />
			</div>
		</div>
	</div>
</template>

<script>
import * as dataTypeHelper from '@/util/queryBuilder';
import FormatDateSelect from '@/modules/widget/components/widget-controls/FormatDateSelect.vue';
import FormatNumberSelect from '@/modules/widget/components/widget-controls/FormatNumberSelect.vue';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import cloneDeep from 'lodash/cloneDeep';

export default {
	name: 'FormatSelect',
	components: {
		FormatDateSelect,
		FormatNumberSelect
	},
	mixins: [widgetControlComponentMixin],
	props: {
		dimensions: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			dataTypes: dataTypeHelper.dataTypes
		};
	},
	computed: {
		dataBinding() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId)?.data ?? null;
		},
		dataColumns() {
			return this.$store.getters['widgetData/rawData'](this.widgetInstanceId)?.columns ?? null;
		},
		hasMetric() {
			if (this.dimensions !== null && Array.isArray(this.dimensions)) {
				return this.dimensions?.[0]?.includes('metric');
			}
			return false;
		},
		getDimensionsLength() {
			return this.dataBinding?.configuration?.dimensions?.length;
		},
		xAxisDataType() {
			return this.dataColumns?.find((element) => element.reference === 'Dimension1')?.dataType;
		},
		yAxisDataType() {
			return this.dataColumns?.find((element) => element.reference === 'Dimension2')?.dataType;
		},
		metricAxisDataType() {
			return this.dataColumns?.find((element) => element.reference === 'Metric1')?.dataType;
		},
		timelineDataType() {
			return this.dataColumns?.find((element) => element.reference === 'Timeline')?.dataType;
		},
		selectedFormat() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'selectedFormat') ?? {};
		},
		selectedFormatXAxis() {
			return this.selectedFormat?.xAxis ?? null;
		},
		selectedFormatYAxis() {
			return this.selectedFormat?.yAxis ?? this.selectedFormat?.metric ?? null;
		},
		selectedFormatTimeline() {
			return this.selectedFormat?.timeline ?? null;
		}
	},
	methods: {
		isDataType(type, selected) {
			return dataTypeHelper.isDataType(type, selected);
		},
		updateFormat(axis, value) {
			const temp = cloneDeep(this.selectedFormat);
			temp[axis] = value;
			this.setOption(temp, 'selectedFormat');
		}
	}
};
</script>
