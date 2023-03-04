<template>
	<div>
		<div class="d-flex">
			<p v-if="textLayout" class="lead mb-2">
				<fa-icon class="mr-2 text-primary" :icon="headingIcon" />
				{{ $t(headingText) }}
			</p>
			<span v-else class="options-grey-style">
				{{ $t(headingText) }}
			</span>
		</div>
		<div>
			<div v-for="(item, index) in value" :key="index" class="d-flex mb-4">
				<div class="flex-grow-1">
					<ds-component-wrapper
						component-name="WidgetControlColumnSelect"
						:widgetInstanceId="widgetInstanceId"
						:value="value[index]"
						:filterDatasetsByColumnSelect="filterDatasetsByColumnSelect"
						:functionSelect="functionSelect"
						:showDeleteButton="true"
						:indexOfMetric="index"
						:metricEnums="metricEnums"
						:dimensionColumn="true"
						:dimensionEnums="dimensionEnums"
						:disableCheck="disableCheck"
						@delete-metric="deleteMetric(index)"
						@update:value="updateColumn(index, $event)" />
				</div>
			</div>
		</div>
		<div v-if="dimensionRestriction">
			<button
				v-show="showDimensionRestriction"
				class="btn btn-add-section border m-0 bg-white"
				style="color: #2D3038;"
				@click="addMetric">
				<fa-icon :icon="['fas', 'plus']" style="color:#AAABAE;" />
				{{ $t('t_Metric') }}
			</button>
		</div>
		<div v-else>
			<button
				class="btn btn-add-section border m-0 bg-white"
				style="color: #2D3038;"
				@click="addMetric">
				<fa-icon :icon="['fas', 'plus']" style="color:#AAABAE;" />
				{{ $t('t_Metric') }}
			</button>
		</div>
	</div>
</template>

<script>
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import {widgetTypes} from '@/util/consts/widgetTypes';
import clone from 'lodash/clone';

export default {
	name: 'MultiseriesSelect',
	mixins: [widgetControlComponentMixin],
	props: {
		widgetInstanceId: {
			type: String,
			required: true
		},
		value: {
			type: Array,
			default: null
		},
		name: {
			type: String,
			required: true
		},
		metricEnums: {
			type: String,
			default: null
		},
		dimensionEnums: {
			type: Array,
			default: null
		},
		headingIcon: {
			type: Array,
			required: true
		},
		buttonAddIcon: {
			type: Array,
			required: true
		},
		buttonDeleteIcon: {
			type: Array,
			required: true
		},
		headingText: {
			type: String,
			required: true
		},
		filterDatasetsByColumnSelect: {
			type: String,
			default: null
		},
		functionSelect: {
			type: Boolean,
			default: false
		},
		filterItself: {
			type: Boolean,
			default: false
		},
		allowNone: {
			type: Boolean,
			default: false
		},
		textLayout: {
			type: Boolean,
			default: false
		},
		dimensionRestriction: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:value'],
	computed: {
		disableCheck() {
			return this.allowNone ? false : (clone(this.value).length <= 1);
		},
		options() {
			return this.$store.getters['widgetInstances/options'](this.widgetInstanceId);
		},
		showDimensionRestriction() {
			return this.options?.columns?.length === 1 && this.widgetType !== widgetTypes.LINE_COMPARISON;
		}
	},
	methods: {
		updateColumn(index, column) {
			const tmpValue = clone(this.value);
			tmpValue[index] = column;
			this.$emit('update:value', tmpValue);
		},
		addMetric() {
			this.$emit('update:value', this.value.concat([
				{
					name: this.name,
					widgetInstanceId: this.widgetInstanceId,
					filterDatasetsByColumnSelect: this.filterDatasetsByColumnSelect,
					functionSelect: this.functionSelect
				}
			]));
		},
		deleteMetric(index) {
			const tmpValue = clone(this.value);
			tmpValue.splice(index, 1);
			this.$emit('update:value', tmpValue);
		},
		filterBy(index) {
			if (this.filterItself && index !== 0) {
				return this.name;
			}

			return this.filterDatasetsByColumnSelect;
		}
	}
};
</script>
