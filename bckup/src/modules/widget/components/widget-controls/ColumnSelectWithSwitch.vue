<template>
	<div>
		<div class="d-flex">
			<span class="text-black">
				{{ $t(headingText) }}
			</span>
		</div>
		<div>
			<single-switch
				:widgetInstanceId="widgetInstanceId"
				:switchText="switchText"
				:value="!!value"
				@update:value="update($event)" />
			<column-select
				v-if="!!value"
				:widgetInstanceId="widgetInstanceId"
				:value="value"
				:filterDatasetsByColumnSelect="filterDatasetsByColumnSelect"
				:hideBucketing="true"
				:dimensionColumn="true"
				:functionSelect="false"
				:automap="false"
				:type-filter="typeFilter"
				@update:value="update" />
		</div>
	</div>
</template>

<script>
import ColumnSelect from '@/modules/widget/components/widget-controls/ColumnSelect.vue';
import SingleSwitch from '@/modules/widget/components/widget-controls/SingleSwitch.vue';
import {dimensionDefinition} from '@/util/queryBuilder';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';

export default {
	name: 'ColumnSelectWithSwitch',
	components: {
		SingleSwitch,
		ColumnSelect
	},
	mixins: [widgetControlComponentMixin],
	props: {
		widgetInstanceId: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		value: {
			type: [
				Boolean,
				Object
			],
			default: null
		},
		headingText: {
			type: String,
			required: true
		},
		switchText: {
			type: String,
			required: true
		},
		filterDatasetsByColumnSelect: {
			type: String,
			default: null
		},
		typeFilter: {
			type: Array,
			default: null
		},
		textLayout: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:value'],
	data() {
		return {
			dimensionDefinition
		};
	},
	methods: {
		update(value) {
			let valueToEmit = value;

			if (value === true) {
				valueToEmit = {
					column: null,
					databaseType: null,
					dataset: null,
					datatype: null,
					function: dimensionDefinition.NO_CHANGE,
					pickFunction: null,
					pickLimit: null
				};
			}
			this.$emit('update:value', valueToEmit);
		}
	}
};
</script>
