<template>
	<div>
		<div class="d-flex">
			<p v-if="textLayout" class="lead mb-2">
				<fa-icon class="mr-2 text-primary" :icon="headingIcon" />
				{{ $t(headingText) }}
			</p>
			<span v-else style="color: #000000">
				{{ $t(headingText) }}
			</span>
		</div>
		<div>
			<div v-for="(item, index) in value" :key="index" class="d-flex mb-4">
				<div class="flex-grow-1">
					<ds-component-wrapper
						component-name="WidgetControlColumnSelect"
						:widgetInstanceId="widgetInstanceId"
						:column="item"
						:filterDatasetsByColumnSelect="filterDatasetsByColumnSelect"
						:showDeleteButton="true"
						:indexOfDimension="index"
						:dimensionColumn="true"
						:functionSelect="false"
						:dimensionEnums="value.map((item, index) => `column${index}`)"
						:automap="false"
						:disableCheck="disableCheck"
						:noDimensionEnums="noDimensionEnums"
						:showTopValues="showTopValues.includes(index)"
						@delete-metric="deleteCategory(index)"
						@update:column="updateColumn(index, $event)" />
				</div>
			</div>
		</div>
		<div v-if="dimensionRestriction">
			<button
				v-show="options.metric.length === 1 && value.length < categoryLimit"
				class="btn btn-add-section border m-0 bg-white"
				style="color: #2D3038;"
				@click="addColumn">
				<fa-icon :icon="['fas', 'plus']" style="color:#AAABAE;" />
				Category
			</button>
		</div>
		<div v-else>
			<button
				v-show="value.length < categoryLimit"
				class="btn btn-add-section border m-0 bg-white"
				style="color: #2D3038;"
				@click="addColumn">
				<fa-icon :icon="['fas', 'plus']" style="color:#AAABAE;" />
				Category
			</button>
		</div>
	</div>
</template>

<script>
import {dimensionDefinition} from '@/util/queryBuilder';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import clone from 'lodash/clone';

export default {
	name: 'MultiColumnSelect',
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
		categoryLimit: {
			type: Number,
			default: 100
		},
		dimensionRestriction: {
			type: Boolean,
			default: false
		},
		noDimensionEnums: {
			type: Boolean,
			default: false
		},
		showTopValues: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		value() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, this.name) ?? [];
		},
		disableCheck() {
			return this.allowNone ? false : (clone(this.value).length <= 1);
		},
		options() {
			return this.$store.getters['widgetInstances/options'](this.widgetInstanceId);
		}
	},
	methods: {
		updateColumn(index, column) {
			const tmpValue = clone(this.value);
			column.pickFunction = null;
			column.pickLimit = null;
			tmpValue[index] = column;
			this.setOption(tmpValue);
		},
		addColumn() {
			this.setOption(this.value.concat([
				{
					name: `Dimension${this.value.length + 1}`,
					widgetInstanceId: this.widgetInstanceId,
					function: dimensionDefinition.NO_CHANGE,
					filterDatasetsByColumnSelect: this.filterDatasetsByColumnSelect,
					dataset: null,
					column: null,
					datatype: null,
					pickFunction: null,
					pickLimit: null
				}
			]));
		},
		deleteCategory(index) {
			const tmpValue = clone(this.value);
			tmpValue.splice(index, 1);
			this.setOption(tmpValue);
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


