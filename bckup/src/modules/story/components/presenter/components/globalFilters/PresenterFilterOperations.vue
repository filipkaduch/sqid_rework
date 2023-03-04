<template>
	<div class="border-bottom-radius">
		<div>
			<div class="mx-3" :class="[editable ? 'mb-2' : 'mb-3']">
				<ds-btn
					variant="secondary"
					block
					:class="{'bg-disabled': !editable}"
					:disabled="!editable"
					@click="collapse = !collapse"
					@touchend="collapse = !collapse">
					<template
						v-if="getOperationObjectByValue(selectedOperation)?.icon"
						#icon>
						<ds-icon :name="getOperationObjectByValue(selectedOperation)?.icon" />
					</template>
					<template v-if="selectedOperation !== '' || operation !== ''">
						<template v-if="(showIcon.includes(selectedOperation))">
							{{ selectedOperationText === '' ? getKeyByValue(operation).substring(1) : selectedOperationText.substring(1) }}
						</template>
						<template v-else>
							{{ selectedOperationText === '' ? getKeyByValue(operation) : selectedOperationText }}
						</template>
					</template>
					<template v-else>
						{{ $t('presenterFilter.t_choose_operation') }}
					</template>
					<template #rightIcon>
						<ds-icon :class="{rotated: collapse}" name="icon-chevron" />
					</template>
				</ds-btn>
				<ds-collapse :is-open="collapse">
					<div class="list-group" style="border: 1px solid #C9D4DA; border-top: 0">
						<div
							v-for="(btn, functionName) in separatedFunctions"
							:key="functionName"
							class="list-group-item border-0 p-0">
							<button
								class="btn btn-dropdown w-100 d-flex justify-content-between align-items-center py-2 px-2 m-0 border-0"
								:class="{active: selectedOperation === btn.label}"
								@click="handleOperation(btn.label, btn.text)"
								@touchend="handleOperation(btn.label, btn.text)">
								<div v-if="(showIcon.includes(btn.label))">
									<span v-if="getOperationObjectByValue(btn.label)?.icon" class="ml-1 operation-circle d-inline-flex justify-content-center align-items-center">
										<ds-icon :name="getOperationObjectByValue(btn.label)?.icon" />
									</span>
									<span class="ml-1">
										{{ btn.text.substring(1) }}
									</span>
								</div>
								<div v-else>
									<span class="ml-1">
										{{ btn.text }}
									</span>
								</div>
							</button>
						</div>
					</div>
				</ds-collapse>
			</div>
		</div>
		<presenter-filter-input
			v-if="(selectedOperation !== '' || operation !== '')"
			:selectedOperation="selectedOperation === ''
				? typeof filterMap.find((el) => el.index === filterIndex) === 'undefined'
					|| filterMap.length === 0 || getLabelByValue(operation) !== logicConstants.LAST
					? getLabelByValue(operation)
					: filterMap.find((el) => el.index === filterIndex).operation
				: selectedOperation"
			:dataType="dataType"
			:filterMap="filterMap"
			:filter="filter"
			:isReset="isReset"
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
import PresenterFilterInput from '@/modules/story/components/presenter/components/globalFilters/PresenterFilterInput.vue';
import {dataTypes} from '@/util/queryBuilder';
import filterMixin from '@/mixins/filterMixin';
import {logicConstants} from '@/util/consts/logicConstants';

export default {
	name: 'PresenterFilterOperations',
	components: {PresenterFilterInput},
	mixins: [filterMixin],
	props: {
		dataType: {
			type: String,
			default: null
		},
		isReset: {
			type: Boolean,
			default: false
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
				Array,
				Number
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
			close: true,
			showIcon: [
				logicConstants.EQUAL,
				logicConstants.LESS_THAN,
				logicConstants.GREATER_THAN,
				logicConstants.NOT_EQUAL
			]
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
		},
		operation(val) {
			this.selectedOperation = val;
			this.selectedOperationText = this.getKeyByValue(val);
		}
	},
	mounted() {
		this.selectedOperation = this.operation;
	},
	methods: {
		handleOperation(label, text) {
			this.selectedOperation = label;
			this.selectedOperationText = text;
			this.collapse = !this.collapse;
			// this.filter.logic = label;
		},
		saveFilter(event) {
			this.close = false;
			this.$emit('filterSaved', event);
		}
	}
};
</script>

<style lang="scss">
.btn-dropdown {
		background-color: transparent;
		color: #36363A;
	}
.btn-dropdown:hover {
	background-color: #F6F8F9;
	color: #36363A;
}
.btn-elevate {
		border-radius: 0.25rem;
	}
	.btn-elevate:focus {
		outline: none!important;
		box-shadow: 0 0 0 4px #AABFF8!important;
 }
	.rotated {
		transform: rotate(180deg);
	}
	.operation-circle {
		border-radius: 50%;
		width: 18px;
		height: 18px;
		background-color: map-get($ds-colors, 'separate-content-100');
	}
	.bg-disabled {
		background-color: map-get($ds-colors, 'separate-content-0')!important;
	}
	.column-select-right, .custom-select, .form-control {
		height: 36px;
		border-color: map-get($ds-colors, 'separate-content-400')!important;
	}
	label {
		display: flex!important;
		align-items: center!important;
	}
	ul > li > div {
		display: flex!important;
		align-items: center!important;
	}
</style>
