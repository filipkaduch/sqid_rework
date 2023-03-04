<template>
	<div>
		<template v-for="(column, index) in filters" :key="`FilterColumn${index}-${column.columnReference}`">
			<div>
				<div
					v-if="hasRelation && index !== 0"
					class="d-flex justify-content-center p-3"
					style="background: linear-gradient(#AABFF8, #AABFF8) no-repeat center/2px 100%;">
					<ds-dropdown
						variant="clean"
						style="background: white; min-width: 0;"
						class="w-auto p-1 border-0 text-center">
						<template #triggerContent>
							<button class="btn btn-clean">
								{{ typeof filterClauses[index - 1] === 'undefined' ? operationConstants.OR : filterClauses[index - 1] }}
							</button>
						</template>
						<template #dropdownContent>
							<div class="dropdown-item" @click="setfilterClause(operationConstants.AND, index)">AND</div>
							<div class="dropdown-item" @click="setfilterClause(operationConstants.OR, index)">OR</div>
						</template>
					</ds-dropdown>
				</div>
				<div class="p-3" style="background-color:#FBFBFC;" :style="isNotFirst ? 'border-bottom: 1px solid #AABFF8; border-top: 1px solid #AABFF8;' : ''">
					<filter-column-select
						v-model:filter="filters[index]"
						:widgetInstanceId="widgetInstanceId"
						:dataset-id="datasetId"
						:catalog-item-id="catalogItemId"
						:selected-operation="getFilterOperation(index)"
						:filterValue="getFilterValue(index)"
						metric-column="metric"
						:filterIndex="index"
						:keep-opened="keepOpenedFilters[index]"
						:automap="false"
						@filter-value-updated="updateFilterValue(index)"
						@filter-deleted="deleteFilter(index)"
						@filter-created="saveConfiguration(index, $event)" />
				</div>
			</div>
		</template>
		<div
			v-if="isNotFirst"
			class="d-block justify-content-center p-3"
			:style="filters.length > 0 ? 'background: linear-gradient(#AABFF8, #AABFF8) no-repeat top/2px 20%;' : ''">
			<div class="d-flex">
				<button
					class="btn btn-add-section btn-block border bg-white m-0"
					style="color: #2D3038; border-bottom-right-radius: 0;"
					data-testid="add-filter"
					@click="addFilterColumn">
					{{ $t('t_AddFilter') }}
				</button>
				<button
					v-if="rawFiltersEnabled"
					class="btn btn-add-section btn-block border bg-white m-0"
					style="color: #2D3038; border-bottom-left-radius: 0;"
					@click="addCustomFilterColumn">
					{{ $t('t_AddCustomFilter') }}
				</button>
			</div>
			<div class="d-flex">
				<button
					v-if="filters.length > 0"
					class="btn btn-secondary btn-block border bg-white m-0 mt-2"
					style="color: #2D3038;"
					@click="removeAllFilters">
					<ds-icon name="icon bin" alt="Delete filter" />
					{{ $t('t_RemoveFilters') }}
				</button>
			</div>
		</div>
	</div>
</template>


<script>
import FilterColumnSelect from '@/modules/widget/components/widget-controls/FilterColumnSelect.vue';
import filterMixin from '@/mixins/filterMixin';
import {filterTypes} from '@/util/queryBuilder';
import {recursiveFilters} from '@/util/widgetDataConfigMapper';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import clone from 'lodash/clone';
import reject from 'lodash/reject';

export default {
	name: 'FilterSelect',
	components: {
		FilterColumnSelect
	},
	mixins: [
		widgetControlComponentMixin,
		filterMixin
	],
	inject: ['appConfig'],
	props: {
		datasetId: {
			type: String,
			default: null
		},
		catalogItemId: {
			type: String,
			default: null
		},
		value: {
			type: Object,
			default: null
		}
	},
	emits: ['update:value'],
	data() {
		return {
			filters: [],
			filterClauses: [],
			filterValues: [],
			filterOperations: [],
			filterCount: 0,
			keepOpenedFilters: [],
			filterTypes
		};
	},
	computed: {
		filter() {
			return this.value ?? {
				preAggregation: [],
				postAggregation: []
			};
		},
		hasRelation() {
			return this.filters.length >= this.filterClauses.length && this.filters.length > 1;
		},
		filterMap() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'filterMap') ?? [];
		},
		filterDatasets() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'filterDatasets') ?? [];
		},
		rawFiltersEnabled() {
			return this.appConfig?.filter?.raw;
		}
	},
	watch: {
		filter: {
			immediate: true,
			// eslint-disable-next-line max-lines-per-function
			handler(newValue) {
				if ((typeof newValue.preAggregation !== 'undefined'
					&& newValue?.preAggregation?.length > 0)
					|| newValue?.postAggregation) {
					this.filters = [];
					this.filterClauses = [];
					this.filterValues = [];
					this.filterOperations = [];
					const condition = typeof newValue.preAggregation === 'undefined';
					this.recursiveLoad(condition ? newValue?.postAggregation : newValue?.preAggregation);
					this.filters.forEach(() => {
						this.keepOpenedFilters.push(false);
					});
				} else {
					this.filters = [];
					this.filterClauses = [];
					this.filterValues = [];
					this.filterOperations = [];
				}
			}
		}
	},
	methods: {
		isNotFirst() {
			return !(this.filters.length <= 1 && isEmpty(this.filters[0]));
		},
		updateFilterValue(index) {
			this.keepOpenedFilters[index] = true;
			this.keepOpenedFilters = cloneDeep(this.keepOpenedFilters);
			if (typeof this.filters[index]?.values === 'undefined') {
				this.filters[index].value = '';
			} else if (typeof this.filters[index]?.value === 'undefined') {
				this.filters[index].values = [];
			}
			this.filterValues[index] = null;
		},
		// eslint-disable-next-line max-lines-per-function
		recursiveLoad(filters, negate = false) {
			// eslint-disable-next-line max-statements, max-lines-per-function, complexity
			filters.forEach((filter, index) => {
				const findByColumn = this.filters.find((el) => el.columnReference === filter.columnReference);
				if ((filter.logic === this.logicConstants.EGREATER_THAN && this.filters.find((el) => el.logic === this.logicConstants.IN_RANGE)
					&& findByColumn)
					|| (filter.logic === this.logicConstants.ELESS_THAN && this.filters.find((el) => el.logic === this.logicConstants.IN_RANGE)
						&& findByColumn)) {
					return;
				}

				if ((filter.logic === this.logicConstants.EGREATER_THAN && this.filters.find((el) => el.logic === this.logicConstants.NOT_IN_RANGE)
					&& findByColumn)
					|| (filter.logic === this.logicConstants.ELESS_THAN && this.filters.find((el) => el.logic === this.logicConstants.NOT_IN_RANGE)
						&& findByColumn)) {
					return;
				}

				if (filter.type === filterTypes.GROUP) {
					let rangeCheck = false;
					if (this.isRangeFilter(filter.clauses) === false) {
						this.filterClauses.unshift(filter.operator);
					} else if (filter?.negate === true) {
						rangeCheck = true;
					}
					this.recursiveLoad(filter.clauses, rangeCheck);
				} else {
					const tempFilter = clone(filter);
					if (filter.logic) {
						if (filter.logic === this.logicConstants.ELESS_THAN || filter.logic === this.logicConstants.EGREATER_THAN) {
							if (negate === true) {
								this.filterOperations.unshift(this.logicConstants.NOT_IN_RANGE);
								tempFilter.logic = this.logicConstants.NOT_IN_RANGE;
							} else {
								this.filterOperations.unshift(this.logicConstants.IN_RANGE);
								tempFilter.logic = this.logicConstants.IN_RANGE;
							}
						} else {
							const testFilterMap = this.filterMap.find((el) => el.column === filter.columnReference);

							if (this.filterMap.length > 0
								&& typeof testFilterMap !== 'undefined') {
								this.filterOperations.unshift(testFilterMap.operation);
								if (testFilterMap.operation === this.logicConstants.NOT_IN_LAST && testFilterMap?.negate) {
									this.filterOperations.unshift(testFilterMap.operation);
									tempFilter.logic = this.logicConstants.NOT_IN_LAST;
								} else {
									this.filterOperations.unshift(testFilterMap.operation);
									tempFilter.logic = testFilterMap.operation;
								}
								if (testFilterMap.column === 'metric') {
									tempFilter.type = 'metric';
								}
							} else {
								this.filterOperations.unshift(filter.logic);
							}
						}
					} else if (filter.type === this.filterTypes.SIMPLE_ARRAY_COLUMN_VALUE) {
						if (filter.negate) {
							this.filterOperations.unshift(this.logicConstants.NOT_IN);
							tempFilter.logic = this.logicConstants.NOT_IN;
						} else {
							this.filterOperations.unshift(this.logicConstants.IN);
							tempFilter.logic = this.logicConstants.IN;
						}
					}
					if (filter.value && (filter.logic === this.logicConstants.ELESS_THAN || filter.logic === this.logicConstants.EGREATER_THAN)) {
						if (typeof filters[index + 1] !== 'undefined') {
							tempFilter.value = `${filter.value} – ${filters[index + 1].value}`;
							this.filterValues.unshift(`${filter.value} – ${filters[index + 1].value}`);
						}
					} else if (filter.value) {
						this.filterValues.unshift(filter.value);
					} else {
						this.filterValues.unshift(filter.values);
					}
					this.filters.unshift(tempFilter);
				}
			});
		},
		isRangeFilter(clauses) {
			const testClause = clauses.find((element) => element.logic === this.logicConstants.ELESS_THAN || element.logic === this.logicConstants.EGREATER_THAN);
			return Boolean(testClause);
		},
		countFilters(filters) {
			return Object(filters) === filters ? 1 + Math.max(-1, ...Object.values(filters).map(this.countFilters)) : 0;
		},
		getFilterOperation(index) {
			return typeof this.filters[index] === 'undefined'
				? ''
				: (typeof this.filters[index].logic === 'undefined' ? this.filterOperations[index] : this.getKeyByValue(this.filters[index].logic));
		},
		getFilterValue(index) {
			return typeof this.filterValues[index] === 'undefined'
				? typeof this.filters[index]?.value === 'undefined'
					? this.filters[index]?.values
					: this.filters[index]?.value
				: this.filterValues[index];
		},
		addFilterColumn() {
			this.chooseType = false;
			if (this.filters.length > 0) {
				this.filterClauses.push(this.operationConstants.AND);
			}
			this.keepOpenedFilters.push(true);
			this.filters.push({});
		},
		addCustomFilterColumn() {
			this.chooseType = false;
			if (this.filters.length > 0) {
				this.filterClauses.push(this.operationConstants.AND);
			}
			this.keepOpenedFilters.push(true);
			this.filters.push({custom: true});
		},
		removeAllFilters() {
			this.$emit('update:value', null);
			this.setOption([], 'filterMap');
			this.setOption([], 'filterDatasets');
			this.filters = [];
			this.filterClauses = [];
			this.filterOperations = [];
			this.filterValues = [];
		},
		deleteFilter(index) {
			this.filters.splice(index, 1);
			if (this.filterClauses.length >= index && typeof this.filterClauses[index - 1] !== 'undefined' && this.filterClauses.length > 0) {
				this.filterClauses.splice(index - 1, 1);
			}
			if (this.filterValues.length >= index) {
				this.filterValues.splice(index, 1);
			}
			if (this.filterOperations.length >= index) {
				this.filterOperations.splice(index, 1);
			}
			if (this.filters.length === 0) {
				this.filters = [];
			}
			if (this.filterMap.findIndex((el) => el.index === index) > -1) {
				const tempMap = this.filterMap.filter((item) => item.index !== index);
				this.setOption(tempMap, 'filterMap');
			}

			if (this.filterDatasets.findIndex((el) => el.index === index) > -1) {
				let tempDatasets = cloneDeep(this.filterDatasets);
				tempDatasets = reject(tempDatasets, (item) => item.index === index);
				this.setOption(tempDatasets, 'filterDatasets');
			}
			this.saveConfiguration(index);
		},
		setfilterClause(operation, index) {
			if (index - 1 > this.filterClauses.length) {
				this.filterClauses.push(operation);
			} else {
				this.filterClauses[index - 1] = operation;
			}
			this.saveConfiguration();
		},
		// eslint-disable-next-line max-lines-per-function, max-statements
		saveConfiguration(index, event = null) {
			this.keepOpenedFilters[index] = false;
			this.keepOpenedFilters = cloneDeep(this.keepOpenedFilters);
			if (event !== null) {
				if (event.filterIndex >= this.filters.length) {
					this.filters.push(event.filter);
				} else {
					this.filters[index] = event.filter;
				}

				if (event.filterIndex >= this.filterValues.length) {
					this.filterValues.push(event.value);
					this.filterOperations.push(event.operation);
				} else {
					this.filterValues[event.filterIndex] = event.value;
					this.filterOperations[event.filterIndex] = event.operation;
				}
			}

			const condition = this.filters[index]?.type === 'metric' || this.filters[index]?.column?.toLowerCase().includes('metric');
			const value = {
				[condition ? 'preAggregation' : 'postAggregation']:
					this.filters.map((element) => {
						if (typeof element.custom === 'undefined' || element.custom === false) {
							const filterPreMapping = this.filterMap.find((item) => item.index === index);
							return {
								type: this.filterTypes.SIMPLE_COLUMN_VALUE,
								logic: element.logic === this.logicConstants.LAST || element.logic === this.logicConstants.NOT_IN_LAST
									? this.logicConstants.GREATER_THAN
									: this.getLabelByValue(
										element.logic,
										(element.logic === this.logicConstants.IS_EMPTY || element.logic === this.logicConstants.IS_NOT_EMPTY)
									),
								columnReference: (typeof element.name === 'undefined' && typeof element.column === 'undefined')
									? element.columnReference
									: element.name ?? element.column,
								negate: typeof filterPreMapping?.negate === 'undefined' ? false : filterPreMapping.negate,
								values: typeof element.value === 'undefined'
									? element.values
									: element.value
							};
						}
						return {
							type: this.filterTypes.RAW_FILTER,
							value: typeof element.value === 'undefined'
								? element.values
								: element.value,
							custom: element.custom
						};
					})
			};
			const check = recursiveFilters(condition ? value?.preAggregation : value?.postAggregation, this.filterClauses, this.filterValues);
			if (value?.preAggregation?.length > 0 || value?.postAggregation?.length > 0) {
				this.$emit('update:value', check);
			} else {
				this.$emit('update:value', null);
			}
		}
	}
};
</script>
