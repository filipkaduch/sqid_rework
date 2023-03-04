<template>
	<div>
		<button
			:style="collapse
				? 'border-bottom-left-radius: 0px; border-bottom-right-radius: 0px; border-top-left-radius: 0.25rem; border-top-right-radius: 0.25rem;'
				: 'border-radius: 0.25rem;'"
			data-testid="show-filter-dataset-operation"
			class="btn btn-white w-100 d-flex justify-content-between border btn-group align-items-center column-select-right m-0 p-0 algLeft mt-2"
			@click="collapse = !collapse">
			<span class="pl-1 pl-xxl-2">
				<span class="d-inline-block d-xxl-flex align-items-xxl-center m-0 p-0 my-1 options-style">
					<template v-if="selectedOperation !== '' || operation !== ''">
						<div class="d-xxl-block d-none">
							{{ $t('t_Operation') }}
						</div>
						<span class="filterLabel ml-1">
							{{ selectedOperationText === ''
								? getKeyByValue(operation)
								: selectedOperationText }}
						</span>
					</template>
					<template v-else>
						Please choose operation.
					</template>
				</span>
			</span>
			<fa-icon :icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']" class="mx-3 options-grey-style" />
		</button>
		<ds-collapse :is-open="collapse">
			<div class="list-group" style="border: 1px solid #C9D4DA; border-top-left-radius: 0; border-top-right-radius: 0;">
				<div
					v-for="(btn, functionName, index) in separatedFunctions"
					:key="functionName"
					class="list-group-item border-0 p-0">
					<button
						:data-testid="`filter-dataset-operation-${index}`"
						class="btn btn-clean w-100 d-flex justify-content-between align-items-center py-2 px-2 m-0"
						:class="{active: selectedOperation === btn.label}"
						@click="handleOperation(btn.label, btn.text)">
						<p class="m-0" v-text="btn.text" />
					</button>
				</div>
			</div>
		</ds-collapse>
		<filter-input
			v-if="(selectedOperation !== '' || operation !== '') && close"
			:selectedOperation="selectedOperation === ''
				? typeof filterMap.find((el) => el.index === filterIndex) === 'undefined'
					|| filterMap.length === 0
					? getLabelByValue(operation)
					: filterMap.find((el) => el.index === filterIndex).operation
				: selectedOperation"
			:dataType="dataType"
			:filterMap="filterMap"
			:filter="filter"
			:global="global"
			:widget-instance-id="widgetInstanceId"
			:editable="editable"
			:filterIndex="filterIndex"
			:filterValue="filterValue"
			@filter-reseted="$emit('filterReseted')"
			@filter-deleted="$emit('filterDeleted')"
			@filter-created="saveFilter" />
	</div>
</template>
<script>
import FilterInput from '@/modules/widget/components/widget-controls/FilterInput.vue';
import {dataTypes} from '@/util/queryBuilder';
import filterMixin from '@/mixins/filterMixin';

export default {
	name: 'FilterOperations',
	components: {FilterInput},
	mixins: [filterMixin],
	props: {
		dataType: {
			type: String,
			default: null
		},
		operation: {
			type: String,
			default: ''
		},
		filterIndex: {
			type: Number,
			default: 0
		},
		filter: {
			type: Object,
			default: null
		},
		global: {
			type: Boolean,
			default: false
		},
		editable: {
			type: Boolean,
			default: false
		},
		widgetInstanceId: {
			type: String,
			default: null,
			required: false
		},
		filterValue: {
			type: [
				String,
				Array
			],
			default: null
		}
	},
	emits: ['filterReseted', 'filterDeleted', 'filterSaved'],
	data() {
		return {
			selectedOperation: '',
			selectedOperationText: '',
			dataTypes,
			collapse: false,
			close: true
		};
	},
	computed: {
		separatedFunctions() {
			return Object.keys(this.functionOperations)
				.filter((key) => this.functionOperations[key].dataType.includes(this.dataType))
				.reduce((obj, key) => {
					obj[key] = this.functionOperations[key];
					return obj;
				}, {});
		},
		filterMap() {
			if (this.global === false && this.widgetInstanceId) {
				return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'filterMap') ?? [];
			}
			return this.$store.getters['storyDetail/story'].configuration?.globalFilterMap ?? [];
		}
	},
	watch: {
		dataType() {
			this.selectedOperation = '';
		}
	},
	methods: {
		handleOperation(label, text) {
			this.selectedOperation = label;
			this.selectedOperationText = text;
			this.collapse = !this.collapse;
			// eslint-disable-next-line vue/no-mutating-props
			this.filter.logic = label;
		},
		saveFilter(event) {
			this.close = false;
			this.$emit('filterSaved', event);
		}
	}
};
</script>
