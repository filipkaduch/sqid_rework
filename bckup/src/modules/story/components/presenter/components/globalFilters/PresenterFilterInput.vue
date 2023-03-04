<!-- eslint-disable max-lines -->
<template>
	<div>
		<div v-if="testDatatype(dataType)">
			<div v-if="selectedOperation === logicConstants.IN_RANGE || selectedOperation === logicConstants.NOT_IN_RANGE">
				<div v-if="editable" class="px-3 mb-3">
					<div class="d-flex mt-2 justify-content-between">
						<div>
							{{ $t('presenterFilter.t_min') }}
							<div class="d-flex">
								<ds-input
									v-model:value="min"
									class="mr-2"
									:debounce="true"
									:block-emit="isReset"
									type="number"
									placeholder="Min"
									@update:value="changeMinMaxValue($event, true)" />
							</div>
						</div>
						<div>
							{{ $t('presenterFilter.t_max') }}
							<div class="d-flex">
								<ds-input
									v-model:value="max"
									:block-emit="isReset"
									:debounce="true"
									type="number"
									placeholder="Max"
									@update:value="changeMinMaxValue($event)" />
							</div>
						</div>
					</div>
				</div>
				<div v-if="!isNaN(min) && !isNaN(max)" class="tag-container border-bottom-radius">
					<div class="p-3">
						<filter-tag :operation="getKeyByValue(selectedOperation)" :value="`(${min} - ${max})`" />
					</div>
				</div>
			</div>
			<div v-else-if="selectedOperation === logicConstants.IN || selectedOperation === logicConstants.NOT_IN" class="d-flex">
				<div class="w-100">
					<presenter-autofill-multiselect
						class="w-100"
						:value="value"
						:selected-operation="getKeyByValue(selectedOperation)"
						:multiple="true"
						:editable="editable"
						:global="global"
						dataType="number"
						:column="filter.columnReference"
						@value-changed="changeValue" />
				</div>
			</div>
			<div
				v-else-if="selectedOperation === logicConstants.IS_EMPTY || selectedOperation === logicConstants.IS_NOT_EMPTY"
				class="d-flex" />
			<div v-else class="d-flex">
				<div class="w-100">
					<div v-if="editable" class="mx-3 mb-3">
						<ds-input
							v-model:value="inputValue"
							:debounce="true"
							:block-emit="isReset"
							type="number"
							@update:value="changeValue" />
					</div>
					<div v-if="inputValue" class="tag-container border-bottom-radius">
						<div class="p-3">
							<filter-tag :operation="getKeyByValue(selectedOperation)" :value="`(${inputValue})`" />
						</div>
					</div>
					<!--<presenter-autofill-multiselect
						class="w-100"
						:value="inputValue"
						:selected-operation="getKeyByValue(selectedOperation)"
						:multiple="false"
						:global="global"
						dataType="number"
						:column="filter.columnReference"
						@value-changed="changeValue" />-->
				</div>
			</div>
		</div>
		<div v-else-if="dataType === dataTypes.BOOL">
			<div class="w-100">
				<div>
					<div v-if="editable" class="px-3 mb-3">
						<ds-input
							v-model:value="inputValue"
							:debounce="true"
							:block-emit="isReset"
							type="text"
							@update:value="updateOption" />
					</div>
					<div class="tag-container border-bottom-radius">
						<div class="p-3">
							<filter-tag :operation="getKeyByValue(selectedOperation)" :value="`${inputValue}`" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else-if="dataType === dataTypes.DATETIME || dataType === dataTypes.DATE">
			<div v-if="selectedOperation === logicConstants.IN_RANGE || selectedOperation === logicConstants.NOT_IN_RANGE" class="justify-content-between">
				<div v-if="editable" class="px-3 mb-3">
					<div>
						{{ $t('t_DateFrom') }}
						<div class="d-flex">
							<ds-datepicker
								:value="dateFrom"
								:placeholder="$t('t_noDate')"
								class="mb-1"
								@update:value="changeDateValue($event, true)" />
						</div>
					</div>
					{{ $t('t_DateTo') }}
					<div class="d-flex">
						<ds-datepicker
							:value="dateTo"
							:placeholder="$t('t_noDate')"
							class="mb-1"
							@update:value="changeDateValue($event)" />
					</div>
				</div>
				<div v-if="dateFrom && dateTo">
					<div class="p-3">
						<filter-tag :operation="getKeyByValue(selectedOperation)" :value="`(${dateFrom} - ${dateTo})`" />
					</div>
				</div>
			</div>
			<div v-else-if="selectedOperation === logicConstants.IN || selectedOperation === logicConstants.NOT_IN" class="d-flex">
				<div class="w-100">
					<div v-if="editable" class="px-3 mb-3">
						<div v-for="(date, index) in value" :key="date" class="d-flex">
							<ds-datepicker
								:value="value[index]"
								:placeholder="$t('t_noDate')"
								class="mb-1"
								@input="updateOption" />
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
					<div v-if="value.length > 0">
						<div class="tag-container border-bottom-radius d-flex flex-wrap flex-gap-8 p-3">
							<filter-tag
								v-for="(date, index) in value"
								v-show="date"
								:key="`${date}-${index}-tag`"
								class="my-1"
								:value="`${date}`" />
						</div>
					</div>
				</div>
			</div>
			<div
				v-else-if="selectedOperation === logicConstants.IS_EMPTY || selectedOperation === logicConstants.IS_NOT_EMPTY"
				class="d-flex" />
			<div v-else-if="selectedOperation === logicConstants.LAST">
				<div v-if="editable" class="w-100 px-3 mb-3">
					<div class="d-flex">
						<ds-input
							v-model:value="inputValue"
							:debounce="true"
							class="mr-2 w-100"
							type="number"
							placeholder="0"
							@update:value="updateOption" />
						<bootstrap-select
							:value="unit"
							value-field="value"
							text-field="text"
							:options="timeUnits"
							@change="updateUnit" />
					</div>
				</div>
				<div v-if="inputValue && unit" class="tag-container border-bottom-radius">
					<div class="p-3">
						<filter-tag :operation="getKeyByValue(selectedOperation)" :value="`${inputValue} ${unit}`" />
					</div>
				</div>
			</div>
			<div v-else class="d-flex">
				<div class="w-100">
					<div v-if="editable" class="d-flex px-3 mb-3">
						<ds-datepicker
							:value="inputValue"
							:placeholder="$t('t_noDate')"
							class="mb-1"
							@input="updateOption" />
					</div>
					<div v-if="inputValue" class="tag-container border-bottom-radius">
						<div class="p-3">
							<filter-tag :operation="getKeyByValue(selectedOperation)" :value="`${inputValue}`" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else-if="dataType === dataTypes.TEXT">
			<div v-if="selectedOperation !== logicConstants.IN && selectedOperation !== logicConstants.NOT_IN" class="d-flex">
				<div v-if="selectedOperation === logicConstants.LIKE || selectedOperation === logicConstants.NOT_LIKE" class="w-100">
					<div v-if="editable" class="px-3 mb-3">
						<ds-input
							v-model:value="inputValue"
							:debounce="true"
							:block-emit="isReset"
							type="text"
							:placeholder="`type ${filterColumnName}`"
							@update:value="updateOption" />
					</div>
					<div v-if="inputValue" class="tag-container border-bottom-radius">
						<div class="p-3">
							<filter-tag :operation="getKeyByValue(selectedOperation)" :value="`${inputValue}`" />
						</div>
					</div>
				</div>
				<div v-else class="w-100">
					<div>
						<div v-if="editable" class="px-3 mb-3">
							<ds-input
								v-model:value="inputValue"
								width="100%"
								:debounce="true"
								:block-emit="isReset"
								type="text"
								:placeholder="`type ${filterColumnName}`"
								@update:value="updateOption" />
						</div>
						<div v-if="inputValue" class="tag-container border-bottom-radius">
							<div class="p-3">
								<filter-tag :operation="getKeyByValue(selectedOperation)" :value="`${inputValue}`" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="d-flex">
				<div class="w-100">
					<presenter-autofill-multiselect
						class="w-100"
						:value="value"
						:selected-operation="getKeyByValue(selectedOperation)"
						:multiple="true"
						:editable="editable"
						:global="global"
						dataType="text"
						:placeholder="`type ${filterColumnName}`"
						:column="filter.columnReference"
						@value-changed="changeValue" />
				</div>
			</div>
		</div>
	</div>
</template>


<script>
/* eslint-disable max-depth, sort-imports */
import {dataTypes, isDataType} from '@/util/queryBuilder';
import {filterConsts, getDateMapping} from '@/util/filterUtils';
import {testUnits, timeUnits} from '@/util/consts/timeUnit';
import PresenterAutofillMultiselect from '@/modules/story/components/presenter/components/globalFilters/PresenterAutofillMultiselect.vue';
import filterMixin from '@/mixins/filterMixin';
import {logicConstants} from '@/util/consts/logicConstants';
import FilterTag from '@/modules/story/components/presenter/components/globalFilters/FilterTag.vue';
import cloneDeep from 'lodash/cloneDeep';
import clone from 'lodash/clone';
import BootstrapSelect from '@/components/temporary/BootstrapSelect.vue';

export default {
	name: 'PresenterFilterInput',
	components: {
		BootstrapSelect,
		FilterTag,
		PresenterAutofillMultiselect
	},
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
		isReset: {
			type: Boolean,
			default: false
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
				Array,
				String,
				Number
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
	emits: ['filterCreated'],
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
		filterColumnName() {
			const [filterKey] = Object.keys(this.filter.columnReference);
			return this.filter.columnReference[filterKey][0];
		}
	},
	watch: {
		selectedOperation() {
			this.inputValue = null;
			this.dateFrom = null;
			this.dateTo = null;
			this.value = [];
		},
		filterValue(val) {
			if (Array.isArray(val)) {
				this.value = val;
			} else {
				this.inputValue = val;
			}
			this.testDatatype(this.dataType, true);
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
		changeMinMaxValue(val, option = false) {
			if (option) {
				this.min = val;
			} else {
				this.max = val;
			}
			this.updateOption();
		},
		changeDateValue(val, option = false) {
			if (option) {
				this.dateFrom = val;
			} else {
				this.dateTo = val;
			}
			this.updateOption();
		},
		testDatatype(datatype, reset = false) {
			if (isDataType(dataTypes.NUMBER, datatype)) {
				this.formatNumber(reset);
				return true;
			} else if (isDataType(dataTypes.DATE_TYPE, datatype)) {
				this.formatDate(reset);
				return false;
			}
			return false;
		},
		changeValue(event) {
			if (event) {
				if (Array.isArray(event)) {
					this.value = cloneDeep(event);
				} else {
					this.inputValue = event;
				}
				this.updateOption();
			}
		},
		updateUnit(unit) {
			this.unit = unit;
			this.updateOption();
		},
		// eslint-disable-next-line max-lines-per-function, max-statements, complexity
		updateOption() {
			let tempValue = this.inputValue;
			const copiedFilter = cloneDeep(this.filter);
			if ((this.unit !== '' && this.selectedOperation === this.logicConstants.LAST) || this.filter?.type === this.filterConsts.METRIC) {
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
							} else {
								copiedFilterMap.push({
									unit: this.unit,
									operation: this.logicConstants.LAST,
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
							} else {
								copiedFilterMap[mapIndex] = {
									unit: this.unit,
									operation: this.logicConstants.LAST,
									column: this.filter.columnReference,
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
				if (this.dataType === dataTypes.DATETIME || this.dataType === dataTypes.DATE) {
					tempValue = getDateMapping(this.inputValue, this.unit);
				}
			}
			if (this.dateFrom !== null && this.dateTo !== null) {
				tempValue = `${this.dateFrom} – ${this.dateTo}`;
			}
			if (((this.min !== 0 || this.max !== 0) && parseInt(this.max, 10) > parseInt(this.min, 10))
				&& (this.selectedOperation === logicConstants.IN_RANGE || this.selectedOperation === logicConstants.NOT_IN_RANGE)) {
				tempValue = `${this.min} – ${this.max}`;
			}

			if (this.value.length > 0) {
				copiedFilter.value = this.value;
			} else {
				copiedFilter.value = tempValue;
			}

			const mappingTest = this.filterMap.find((el) => el.index === this.filterIndex);
			if (this.selectedOperation !== this.logicConstants.LAST && typeof mappingTest !== 'undefined' && this.global === false) {
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
				if (this.selectedOperation !== this.logicConstants.LAST && typeof globalMappingTest !== 'undefined' && this.global === true) {
					const globalIndex = newConfiguration.globalFilterMap.indexOf(globalMappingTest);
					const copiedGlobalMap = cloneDeep(newConfiguration.globalFilterMap);
					if (globalIndex > -1) {
						copiedGlobalMap.splice(globalIndex, 1);
					}
					newConfiguration.globalFilterMap = copiedGlobalMap;
					this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true});
				}
			}

			const eventObject = {
				filterIndex: this.filterIndex,
				operation: this.selectedOperation,
				value: this.value.length > 0 ? this.value : tempValue,
				filter: copiedFilter
			};
			this.$emit('filterCreated', eventObject);
		},
		formatDate(reset = false) {
			const filterMapping = this.filterMap.find((el) => el.index === this.filterIndex);
			if (filterMapping) {
				this.unit = filterMapping.unit;
				this.inputValue = parseInt(filterMapping.value, 10);
			}
			if ((this.dataType === dataTypes.DATETIME || this.dataType === dataTypes.DATE)
				&& (this.selectedOperation === this.logicConstants.IN_RANGE
					|| this.selectedOperation === this.logicConstants.NOT_IN_RANGE) && this.inputValue !== null) {
				if (typeof this.inputValue === 'string') {
					const testDateFrom = this.inputValue.split('–')[0].trim();
					const testDateTo = this.inputValue.split('–')[1].trim();
					if ((this.dateTo === null && this.dateFrom === null) || (testDateTo !== this.dateTo && testDateFrom !== this.dateFrom) || reset) {
						this.dateTo = testDateTo;
						this.dateFrom = testDateFrom;
					}
				}
			}
		},
		formatNumber(reset = false) {
			if ((this.selectedOperation === this.logicConstants.IN_RANGE
				|| this.selectedOperation === this.logicConstants.NOT_IN_RANGE) && this.inputValue !== null) {
				if (typeof this.inputValue === 'string') {
					const tempValue = this.inputValue.split('–');
					const testMin = parseInt(tempValue[0].trim(), 10);
					const testMax = parseInt(tempValue[1].trim(), 10);
					if ((this.min === 0 && this.max === 0) || (testMin !== this.min && testMax !== this.max) || reset) {
						this.min = testMin;
						this.max = testMax;
					}
				}
			}
		}
	}
};
</script>
