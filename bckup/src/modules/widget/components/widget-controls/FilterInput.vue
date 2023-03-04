<template>
	<div class="my-2">
		<div v-if="isNumber(dataType)">
			<div
				v-if="selectedOperation === logicConstants.IN_RANGE || selectedOperation === logicConstants.NOT_IN_RANGE"
				class="d-flex mt-2 justify-content-between">
				<div>
					Min:
					<div class="d-flex">
						<ds-input
							v-model:value="min"
							type="number"
							placeholder="Min" />
					</div>
				</div>
				<div>
					Max:
					<div class="d-flex">
						<ds-input
							v-model:value="max"
							type="number"
							placeholder="Max" />
					</div>
				</div>
			</div>
			<div v-else-if="selectedOperation === logicConstants.IN || selectedOperation === logicConstants.NOT_IN" class="d-flex">
				<div class="w-100">
					<bootstrap-tags v-model:value="value" />
				</div>
			</div>
			<div
				v-else-if="selectedOperation === logicConstants.IS_EMPTY || selectedOperation === logicConstants.IS_NOT_EMPTY"
				class="d-flex" />
			<div v-else class="d-flex">
				<div class="w-100">
					<autofill-multiselect
						class="w-100"
						:value="value.length > 0 ? value : filterValue"
						:multiple="false"
						:global="global"
						dataType="number"
						:column="filter.columnReference"
						@value-changed="changeValue" />
				</div>
			</div>
		</div>
		<div v-else-if="dataType === dataTypes.BOOL">
			<div class="w-100">
				<ds-input
					v-model:value="inputValue"
					type="text" />
			</div>
		</div>
		<div v-else-if="dataType === dataTypes.DATETIME || dataType === dataTypes.DATE">
			<div v-if="selectedOperation === logicConstants.IN_RANGE || selectedOperation === logicConstants.NOT_IN_RANGE" class="d-flex m-2 justify-content-between">
				<div>
					{{ $t('t_DateFrom') }}
					<div class="d-flex">
						<ds-datepicker
							v-model:value="dateFrom"
							class="mb-1" />
					</div>
				</div>
				<div>
					{{ $t('t_DateTo') }}
					<div class="d-flex">
						<ds-datepicker
							v-model:value="dateTo"
							class="mb-1" />
					</div>
				</div>
			</div>
			<div v-else-if="selectedOperation === logicConstants.IN || selectedOperation === logicConstants.NOT_IN" class="d-flex">
				<div class="w-100">
					<div v-for="(date, index) in value" :key="date" class="d-flex">
						<ds-datepicker
							v-model:value="value[index]"
							class="mb-1" />
						<button
							class="btn btn-white m-0 ml-2 p-0"
							@click="value.splice(index, 1)">
							<ds-icon class="mr-2 ml-2" name="icon bin" alt="Delete" />
						</button>
					</div>
					<button
						class="btn btn-action"
						@click="value.push(null)">
						{{ $t('t_AddDate') }}
					</button>
				</div>
			</div>
			<div v-else-if="selectedOperation === logicConstants.LAST || selectedOperation === logicConstants.NOT_IN_LAST" class="d-flex">
				<div class="w-100">
					<div class="d-flex">
						<ds-input
							v-model:value="inputValue"
							type="number"
							placeholder="0" />
						<bootstrap-select
							:value="unit"
							:options="timeUnits"
							value-field="value"
							text-field="text"
							@change="updateUnit" />
					</div>
				</div>
			</div>
			<div
				v-else-if="selectedOperation === logicConstants.IS_EMPTY || selectedOperation === logicConstants.IS_NOT_EMPTY"
				class="d-flex" />
			<div v-else class="d-flex">
				<div class="w-100">
					<div class="d-flex">
						<ds-datepicker
							v-model:value="inputValue"
							class="mb-1" />
					</div>
				</div>
			</div>
		</div>
		<div v-else-if="dataType === dataTypes.TEXT">
			<div v-if="selectedOperation !== logicConstants.IN && selectedOperation !== logicConstants.NOT_IN" class="d-flex">
				<div v-if="selectedOperation === logicConstants.LIKE || selectedOperation === logicConstants.NOT_LIKE" class="w-100">
					<ds-input
						v-model:value="inputValue"
						type="text" />
				</div>
				<div v-else class="w-100">
					<autofill-multiselect
						class="w-100"
						:value="inputValue === null ? '' : inputValue"
						:multiple="false"
						:global="global"
						dataType="text"
						:column="filter.columnReference"
						@value-changed="changeValue" />
				</div>
			</div>
			<div v-else class="d-flex">
				<div class="w-100">
					<autofill-multiselect
						class="w-100"
						:value="value"
						:multiple="true"
						:global="global"
						dataType="text"
						:column="filter.columnReference"
						@value-changed="changeValue" />
				</div>
			</div>
		</div>
		<hr role="separator" aria-orientation="horizontal" class="dropdown-divider w-100">
		<div class="d-flex mt-1" style="justify-content: space-between;">
			<button
				class="btn btn-action"
				data-testid="apply-filter-btn"
				@click="updateOption">
				{{ $t('t_Apply') }}
			</button>
			<button
				v-if="editable === false"
				class="btn btn-white"
				@click="$emit('filterDeleted')">
				{{ $t('t_Clear') }}
			</button>
			<button
				v-else
				class="btn btn-white"
				@click="$emit('filterReseted')">
				{{ $t('t_Reset') }}
			</button>
		</div>
	</div>
</template>


<script>
/* eslint-disable max-depth */
import {dataTypes, isDataType} from '@/util/queryBuilder';
import {filterConsts, getDateMapping} from '@/util/filterUtils';
import {testUnits, timeUnits} from '@/util/consts/timeUnit';
import AutofillMultiselect from '@/components/design/AppAutofillMultiselect.vue';
import filterMixin from '@/mixins/filterMixin';
import {logicConstants} from '@/util/consts/logicConstants';
import cloneDeep from 'lodash/cloneDeep';
import clone from 'lodash/clone';
import BootstrapSelect from '@/components/temporary/BootstrapSelect.vue';
import BootstrapTags from '@/components/temporary/BootstrapTags.vue';

export default {
	name: 'FilterInput',
	components: {BootstrapTags, BootstrapSelect, AutofillMultiselect},
	mixins: [filterMixin],
	props: {
		selectedOperation: {
			type: String,
			default: null
		},
		widgetInstanceId: {
			type: String,
			default: null,
			required: false
		},
		dataType: {
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
		filterValue: {
			type: [
				String,
				Array
			],
			default: null
		},
		filterMap: {
			type: Array,
			default: () => []
		},
		global: {
			type: Boolean,
			default: false
		},
		editable: {
			type: Boolean,
			default: false
		}
	},
	emits: ['filterReseted', 'filterDeleted', 'filterCreated'],
	data() {
		return {
			// eslint-disable-next-line max-len
			inputValue: Array.isArray(this.filterValue)
				? ''
				: typeof this.filterMap.find((el) => el.index === this.filterIndex) === 'undefined' || this.filterMap.length === 0
					? this.filterValue
					: parseInt(this.filterMap.find((el) => el.index === this.filterIndex).value, 10),
			unit: typeof this.filterMap.find((el) => el.index === this.filterIndex) === 'undefined'
				|| this.filterMap.length === 0
				? ''
				: this.filterMap.find((el) => el.index === this.filterIndex).unit,
			min: 0,
			max: 0,
			operation: this.selectedOperation,
			dateFrom: null,
			dateTo: null,
			dateCompare: null,
			last: typeof this.filterMap.find((el) => el.index === this.filterIndex) === 'undefined' || this.filterMap.length === 0
				? 0
				: parseInt(this.filterMap.find((el) => el.index === this.filterIndex).value, 10),
			value: Array.isArray(this.filterValue)
				&& (this.filter.logic === logicConstants.IN
					|| this.filter.logic === logicConstants.NOT_IN)
				? clone(this.filterValue)
				: [],
			timeUnits,
			testUnits,
			dataTypes,
			filterConsts
		};
	},
	computed: {
		rawData() {
			this.formatDate();
			return this.$store.getters['widgetData/rawData'](this.widgetInstanceId);
		},
		storyConfig() {
			return this.$store.getters['storyDetail/story'].configuration ?? {};
		},
		isEmptyOrNotEmpty() {
			return ((this.logicConstants.EQUAL === this.selectedOperation
				|| this.logicConstants.NOT_EQUAL === this.selectedOperation
				|| this.logicConstants.IS_EMPTY === this.selectedOperation
				|| this.logicConstants.IS_NOT_EMPTY === this.selectedOperation)
				&& (this.dataType === dataTypes.DATETIME || this.dataType === dataTypes.DATE || this.isNumber(this.dataType)) && this.inputValue === null);
		}
	},
	watch: {
		selectedOperation() {
			this.inputValue = null;
			this.dateFrom = null;
			this.dateTo = null;
			this.value = [];
		}
	},
	mounted() {
		if (this.dataType === dataTypes.DATETIME || this.dataType === dataTypes.DATE) {
			this.formatDate();
		}
	},
	methods: {
		setOption(value, name = 'filterMap') {
			this.$store.commit('widgetInstances/setOption', {
				widgetInstanceId: this.widgetInstanceId,
				optionName: name,
				value
			});
		},
		isNumber(datatype) {
			if (isDataType(dataTypes.NUMBER, datatype)) {
				this.formatNumber();
				return true;
			}
			return false;
		},
		changeValue(event) {
			if (Array.isArray(event)) {
				this.value = cloneDeep(event);
			} else {
				this.inputValue = event;
			}
		},
		updateUnit(unit) {
			this.unit = unit;
		},
		// eslint-disable-next-line max-lines-per-function, max-statements, complexity
		updateOption() {
			if (this.selectedOperation === logicConstants.IS_EMPTY || this.selectedOperation === logicConstants.IS_NOT_EMPTY) {
				this.inputValue = null;
			}
			let tempValue = this.inputValue;
			const copiedFilter = cloneDeep(this.filter);
			if (this.unit !== '' || this.filter?.type === this.filterConsts.METRIC
				|| this.isEmptyOrNotEmpty) {
				if (this.filterMap !== null) {
					const copiedFilterMap = cloneDeep(this.filterMap);
					const filterMapping = this.filterMap.find((el) => el.index === this.filterIndex);
					if (typeof filterMapping === 'undefined') {
						if (this.widgetInstanceId !== null || this.global === true) {
							if (this.filter?.type === this.filterConsts.METRIC) {
								copiedFilterMap.push({
									index: this.filterIndex,
									value: this.inputValue,
									column: this.filterConsts.METRIC,
									operation: this.selectedOperation
								});
							} else if (this.isEmptyOrNotEmpty) {
								copiedFilterMap.push({
									operation: this.selectedOperation,
									column: this.filter.columnReference,
									index: this.filterIndex,
									value: this.inputValue
								});
							} else {
								copiedFilterMap.push({
									unit: this.unit,
									operation: this.selectedOperation,
									...(this.selectedOperation === this.logicConstants.NOT_IN_LAST ? {negate: true} : {negate: false}),
									column: this.filter.columnReference,
									index: this.filterIndex,
									value: this.inputValue
								});
							}
							if (this.global === false) {
								this.setOption(copiedFilterMap, 'filterMap');
							}
						}
					} else {
						// eslint-disable-next-line no-lonely-if
						if (this.widgetInstanceId !== null || this.global === true) {
							const mapIndex = this.filterMap.findIndex((el) => el.index === this.filterIndex);
							if (filterMapping.column === this.filterConsts.METRIC) {
								copiedFilterMap.push({
									index: this.filterIndex,
									value: this.inputValue,
									column: this.filterConsts.METRIC,
									operation: this.selectedOperation
								});
							} else if (this.isEmptyOrNotEmpty) {
								copiedFilterMap[mapIndex] = {
									operation: this.selectedOperation,
									column: this.filter.columnReference,
									index: this.filterIndex,
									value: this.inputValue
								};
							} else {
								copiedFilterMap[mapIndex] = {
									unit: this.unit,
									operation: this.selectedOperation,
									column: this.filter.columnReference,
									...(this.selectedOperation === this.logicConstants.NOT_IN_LAST ? {negate: true} : {negate: false}),
									index: this.filterIndex,
									value: this.inputValue
								};
							}
							if (this.global === false) {
								this.setOption(copiedFilterMap, 'filterMap');
							}
						}
					}
					if (this.global === true) {
						const newConfiguration = cloneDeep(this.storyConfig);
						newConfiguration.globalFilterMap = copiedFilterMap;
						this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true});
					}
				}
				if (isDataType(dataTypes.DATE_TYPE, this.dataType) && this.selectedOperation !== this.logicConstants.IS_EMPTY
					&& this.selectedOperation !== this.logicConstants.IS_NOT_EMPTY && this.inputValue !== null) {
					tempValue = getDateMapping(this.inputValue, this.unit);
				}
			}
			if (this.dateFrom !== null && this.dateTo !== null) {
				tempValue = `${this.dateFrom} – ${this.dateTo}`;
			}
			if ((this.min !== 0 || this.max !== 0) && parseInt(this.max, 10) > parseInt(this.min, 10)) {
				tempValue = `${this.min} – ${this.max}`;
			}

			if (this.value.length > 0) {
				copiedFilter.value = this.value;
			} else {
				copiedFilter.value = tempValue;
			}

			const mappingTest = this.filterMap.find((el) => el.index === this.filterIndex);
			if (this.selectedOperation !== this.logicConstants.LAST && this.selectedOperation !== this.logicConstants.NOT_IN_LAST
				&& !this.isEmptyOrNotEmpty && typeof mappingTest !== 'undefined' && this.global === false) {
				const index = this.filterMap.indexOf(mappingTest);
				const copiedMap = cloneDeep(this.filterMap);
				if (index > -1) {
					copiedMap.splice(index, 1);
				}
				this.setOption(copiedMap, 'filterMap');
			}

			const newConfiguration = cloneDeep(this.storyConfig);
			if (typeof newConfiguration.globalFilterMap !== 'undefined') {
				const globalMappingTest = newConfiguration.globalFilterMap.find((el) => el.index === this.filterIndex);
				if (this.selectedOperation !== this.logicConstants.LAST && this.selectedOperation !== this.logicConstants.NOT_IN_LAST
					&& typeof globalMappingTest !== 'undefined' && this.global === true) {
					const globalIndex = newConfiguration.globalFilterMap.indexOf(globalMappingTest);
					const copiedGlobalMap = cloneDeep(newConfiguration.globalFilterMap);
					if (globalIndex > -1) {
						copiedGlobalMap.splice(globalIndex, 1);
					}
					newConfiguration.globalFilterMap = copiedGlobalMap;
					this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true});
				}
			}

			if (tempValue?.toLowerCase() === 'null') {
				tempValue = null;
				copiedFilter.value = null;
			}

			const eventObject = {
				filterIndex: this.filterIndex,
				operation: this.selectedOperation,
				value: this.value.length > 0 ? this.value : tempValue,
				filter: copiedFilter
			};
			this.$emit('filterCreated', eventObject);
		},
		formatDate() {
			const filterMapping = this.filterMap.find((el) => el.index === this.filterIndex);
			if (filterMapping) {
				this.unit = filterMapping.unit;
				this.inputValue = parseInt(filterMapping.value, 10);
			}
			if ((this.dataType === dataTypes.DATETIME || this.dataType === dataTypes.DATE)
				&& (this.selectedOperation === this.logicConstants.IN_RANGE
					|| this.selectedOperation === this.logicConstants.NOT_IN_RANGE) && this.inputValue !== null) {
				this.dateFrom = this.inputValue.split('–')[0].trim();
				this.dateTo = this.inputValue.split('–')[1].trim();
			}
		},
		formatNumber() {
			if ((this.selectedOperation === this.logicConstants.IN_RANGE
				|| this.selectedOperation === this.logicConstants.NOT_IN_RANGE) && this.inputValue !== null) {
				const tempValue = this.inputValue.split('–');
				this.min = parseInt(tempValue[0].trim(), 10);
				this.max = parseInt(tempValue[1].trim(), 10);
			}
		}
	}
};
</script>
