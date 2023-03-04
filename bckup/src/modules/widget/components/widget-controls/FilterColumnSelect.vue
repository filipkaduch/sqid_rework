<!-- eslint-disable max-lines -->
<template>
	<div class="mx-0" style="background-color:#FBFBFC;">
		<div v-if="custom" class="d-flex">
			<textarea
				id="textarea"
				v-model="customInput"
				class="form-control"
				placeholder="Enter your WHERE clause here..."
				rows="4" />
			<button
				class="btn btn-white m-0 ml-2 p-0 collapseBtnSize"
				@click="closeFilter">
				<ds-icon class="mr-2 ml-2" name="icon bin" alt="Delete" />
			</button>
		</div>
		<div v-else class="d-flex rounded bar-resize bg-white">
			<div v-if="close === false && edit === false && keepOpened === false" class="d-xxl-flex d-block w-100" style="background-color:#FBFBFC;">
				<div
					class="w-100 d-flex justify-content-between rounded border btn-group align-items-center column-select-right m-0 p-0 algLeft bg-white">
					<span class="pl-2 pl-xxl-2 d-flex align-items-center">
						<span class="d-block d-xxl-inline-flex m-0 p-0 options-style">
							<app-hover-info
								:filter="filterName"
								:dataType="selectedColumn.datatype"
								:value="typeof inputValue === 'number' ? inputValue.toString() : inputValue"
								:single="true"
								:filterMap="filterMap"
								:logic="filter.logic"
								:index="filterIndex" />
						</span>
					</span>
					<fa-icon :icon="['fas', 'ellipsis-h']" class="mr-2 ml-1" style="color: #B5B5BA; cursor: pointer;" @click="clickEdit" />
				</div>
				<button
					class="btn btn-white m-0 ml-xxl-2 ml-0 p-0 collapseBtnSize"
					@click="closeFilter">
					<ds-icon class="mr-2 ml-2" name="icon bin" alt="Delete" />
				</button>
			</div>
			<button
				v-else
				data-testid="show-filter-datasets"
				style="border: 0; height: 36px;"
				class="btn btn-clean w-100 d-flex justify-content-between rounded border btn-group align-items-center column-select-right m-0 p-0 algLeft bg-white"
				@click="collapseThis('column')">
				<span class="pl-1 pl-xxl-2">
					<span class="d-inline-block m-0 p-0 options-style">
						<template v-if="filter.columnReference">
							{{ $t('t_Column') }}
							<span class="filterLabel">
								{{ filter.type === 'metric'
									? `Metric: ${filterName}`
									: `${filterName}` }}
								<app-datatype-badge v-if="filter.datatype" :datatype="filter.datatype" :show-datatype-text="false" :filter-variant="true" />
							</span>
						</template>
						<template v-else>
							Please choose column.
						</template>
					</span>
				</span>
				<fa-icon :icon="collapsible.column ? ['fal','chevron-up'] : ['fal','chevron-down']" class="mx-3 options-grey-style" />
			</button>
		</div>

		<ds-collapse
			:is-open="collapsible.column"
			class="w-100 mt-2 m-0"
			style="border-radius: 4px; border: 1px solid rgb(200, 212, 218);">
			<ds-card class="shadow-none border-0" body-class="my-0 p-0" style="background-color: white;">
				<app-input-bar
					v-model:input="search"
					:pill="false"
					:rounded="false"
					:border="false"
					style="border: 0; border-bottom: 1px;"
					class="m-0 rounded-top border-0"
					:widgetControlRightIcon="['far','search']"
					placeholder="Search" />

				<div v-if="metric" class="my-2">
					<button
						variant="secondary"
						class="btn btn-secondary w-100 m-0"
						@click="metricsCollapseCols = !metricsCollapseCols">
						Metrics
					</button>

					<ds-collapse :is-open="metricsCollapseCols">
						<div class="list-group">
							<div
								v-for="(col, i) in metric"
								:key="`column-${col.dataset}-${col.column}-${i}`"
								class="list-group-item border-0 p-0">
								<button
									class="btn btn-clean w-100 d-flex justify-content-between align-items-center py-2 px-2 m-0"
									:class="{active: col.dataset === selectedColumn.dataset
										&& col.column === selectedColumn.column && selectedColumn.type === 'metric'}"
									@click="updateMetric(col, i, dataTypes.INT, col.displayName)">
									{{ `Metric${i + 1} - ${col.aggregation}(${col.column})` }}
									<app-datatype-badge :datatype="dataTypes.INT" :show-datatype-text="false" :filter-variant="true" />
								</button>
							</div>
						</div>
					</ds-collapse>
				</div>
				<div v-for="(dataset, index) in datasetsFiltered" :key="'dataset' + index" class="my-0">
					<div class="cardBorderMiddle">
						<button
							style="border: 0;"
							:data-testid="`filter-dataset-${index}`"
							class="btn btn-white w-100 d-flex justify-content-between align-items-center m-0 p-3 noBorder"
							@click="collapsibleDatasets[dataset.id] = !collapsibleDatasets[dataset.id]">
							<span class="dataset-name">
								{{ dataset.name }}
							</span>
							<fa-icon
								v-if="!collapsibleDatasets[dataset.id]"
								:icon="['fal','chevron-down']"
								class="mx-3 options-grey-style when-closed" />
							<fa-icon
								v-else
								:icon="['fal','chevron-up']"
								class="mx-3 options-grey-style when-open" />
						</button>
						<ds-collapse
							:is-open="collapsibleDatasets[dataset.id]"
							:visible="(dataset.id === selectedColumn.dataset) || search.length >= 1">
							<div class="list-group" style="border-top-left-radius: 0; border-top-right-radius: 0;">
								<div
									v-for="(col, id) in columnsFiltered[dataset.id]"
									:key="'column-' + dataset.id + '-' + col.name"
									class="list-group-item border-0 p-0">
									<button
										v-if="col.visibilityState !== columnVisibilityState.INTERNAL"
										:data-testid="`filter-dataset-column-${id}`"
										class="btn btn-white w-100 d-flex justify-content-between align-items-center py-2 m-0 border-0"
										:class="{active: dataset.id === selectedColumn.dataset
											&& col.name === selectedColumn.column && selectedColumn.type !== 'metric'}"
										@click.prevent="updateColumn(dataset.id, col.name, col.dataType, col.displayName)">
										{{ col.displayName }}
										<app-datatype-badge :datatype="col.dataType" :show-datatype-text="false" :filter-variant="true" />
									</button>
								</div>
							</div>
						</ds-collapse>
					</div>
				</div>
			</ds-card>
		</ds-collapse>
		<ds-card
			v-if="!isEmpty(filter) && (close || edit || keepOpened) && !custom"
			class="shadow-none border-0"
			body-class="my-0 p-0"
			style="background-color:#FBFBFC;">
			<filter-operations
				:dataType="filter.datatype"
				:widgetInstanceId="widgetInstanceId"
				:operation="typeof filter.logic === 'undefined' ? '' : filter.logic"
				:filterIndex="filterIndex"
				:filter="filter"
				:filterValue="filterValue"
				@filter-update="updateFilter"
				@filter-deleted="closeFilter"
				@filter-saved="passFilter" />
		</ds-card>
	</div>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties, no-unused-vars */
import {columnVisibilityState, dataTypes, filterTypes} from '@/util/queryBuilder';
import AppDatatypeBadge from '@/components/design/AppDatatypeBadge.vue';
import AppHoverInfo from '@/components/design/AppHoverInfo.vue';
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import FilterOperations from '@/modules/widget/components/widget-controls/FilterOperations.vue';
import filterMixin from '@/mixins/filterMixin';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import clone from 'lodash/clone';

const collapsibleKeys = Object.freeze({
	column: 'column',
	options: 'options',
	operations: 'operations'
});

export default {
	name: 'FilterColumnSelect',
	components: {
		AppDatatypeBadge,
		AppHoverInfo,
		AppInputBar,
		FilterOperations
	},
	mixins: [
		filterMixin,
		widgetControlComponentMixin
	],
	props: {
		selectedOperation: {
			type: String,
			default: null
		},
		keepOpened: {
			type: Boolean,
			default: false
		},
		filterValue: {
			type: [
				String,
				Array
			],
			default: null
		},
		filterIndex: {
			type: Number,
			default: 0
		},
		datasetId: {
			type: String,
			default: null
		},
		catalogItemId: {
			type: String,
			default: null
		},
		column: {
			type: Object,
			default: null
		},
		filter: {
			type: Object,
			default: null
		},
		metricColumn: {
			type: String,
			default: null
		}
	},
	emits: ['filterValueUpdated', 'filterDeleted', 'filterCreated', 'update:filter'],
	// eslint-disable-next-line max-lines-per-function
	data() {
		return {
			metricsCollapseCols: false,
			search: '',
			dataTypes,
			selOperation: this.selectedOperation,
			inputValue: '',
			close: true,
			canContinue: false,
			edit: false,
			filterTypes,
			custom: typeof this.filter.custom === 'undefined' ? this.filter.type === filterTypes.RAW_FILTER : this.filter.custom,
			customInput: this.filter.type === filterTypes.RAW_FILTER ? this.filter.value : '',
			columnVisibilityState,
			collapseOptions: true,
			collapsibleKeys,
			collapsible: {
				column: false,
				options: false,
				operations: false
			},
			isEmpty,
			collapsibleDatasets: {}
		};
	},
	computed: {
		configuration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		datasetFilterByColumnSelectGuid() {
			if (this.filterDatasetsByColumnSelect === null) {
				return null;
			}
			const column = this.$store.getters['widgetInstances/option'](this.widgetInstanceId, this.filterDatasetsByColumnSelect);
			return (Array.isArray(column) && column.length > 0 ? column[0].dataset : column?.dataset) ?? null;
		},
		datasets() {
			return this.$store.getters['storyDetail/story']?.datasets ?? [];
		},
		catalogItems() {
			return this.$store.getters['storyDetail/catalogItems'] ?? [];
		},
		datasetsFiltered() {
			const selectedDataset = this.datasets.find((dataset) => dataset.id === this.datasetId) ?? null;
			if (selectedDataset) {
				return [selectedDataset];
			}
			return [this.catalogItems.find((dataset) => dataset.id === this.catalogItemId)];
		},
		columnsFiltered() {
			const columns = {};
			this.datasetsFiltered.forEach((dataset) => {
				// If dataset use columns if catalog item use attributes
				columns[dataset.id] = dataset.columns ?? dataset.attributes
					.filter((column) => column.name.toLowerCase().includes(this.search.toLowerCase()));
			});
			return columns;
		},
		// eslint-disable-next-line max-lines-per-function
		selectedColumn() {
			const tmpFilter = cloneDeep(this.filter);
			if ((!isEmpty(tmpFilter) && typeof tmpFilter.logic !== 'undefined')
				|| typeof tmpFilter.dataType === 'undefined') {
				this.datasetsFiltered.forEach((dataset) => {
					const findFd = this.filterDatasets.find((dat) => dat.column === tmpFilter.columnReference
						&& dat.dataset === dataset.id);
					let columns = null;
					if (dataset?.columns) {
						// eslint-disable-next-line prefer-destructuring
						columns = dataset.columns;
					} else {
						columns = dataset.attributes;
					}
					const findColDatatype = columns.find((col) => col.name === tmpFilter.columnReference
						&& typeof findFd !== 'undefined');
					if (typeof findColDatatype !== 'undefined') {
						tmpFilter.datatype = findColDatatype.dataType;
					}
				});
			}

			return tmpFilter;
		},
		selectedColumnDatatype() {
			if (this.selectedColumn.datatype) {
				return this.selectedColumn.datatype ?? '';
			}
			return this.selectedColumn.dataType;
		},
		selectedColumnName() {
			return this.selectedColumn.column === null ? (this.selectedColumn.columnReference ?? this.selectedColumn.name) : this.selectedColumn.column;
		},
		metric() {
			if (this.metricColumn) {
				const metric = this.configuration?.data?.configuration.metrics;

				if (metric) {
					return Array.isArray(metric) ? metric : [metric];
				}
			}
			return null;
		},
		filterMap() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'filterMap') ?? [];
		},
		filterDatasets() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'filterDatasets') ?? [];
		},
		filterName() {
			const id = this.datasetId ?? this.catalogItemId;
			if (this.selectedColumn.columnReference === this.filter.columnReference) {
				return this.columnsFiltered?.[id].find((column) => column.name === this.filter.columnReference)?.displayName
					?? this.filter.columnReference;
			}
			return this.filter.columnReference;
		}
	},
	watch: {
		custom(newValue, oldValue) {
			if ((!oldValue && newValue) && ((this.selectedColumn.columnReference) && this.selOperation && this.inputValue)) {
				this.customInput = `"${this.selectedColumn.columnReference}" ${this.getLabelByValue(this.selOperation)} '${this.inputValue}'`;
			}
		},
		datasetsFiltered: {
			immediate: true,
			handler(value) {
				for (const dataset in value) {
					this.collapsibleDatasets[dataset.id] = false;
				}
			}
		},
		customInput(value) {
			const tempFilter = clone(this.filter);
			tempFilter.custom = true;
			tempFilter.value = value;
			const eventObject = {
				filterIndex: this.filterIndex,
				operation: '',
				value,
				filter: tempFilter
			};
			this.$emit('filterCreated', eventObject);
		},
		selectedColumn: {
			immediate: true,
			handler(val) {
				if (!isEmpty(val) && typeof val !== 'undefined') {
					this.close = false;
					this.inputValue = this.filterValue;
					this.selOperation = this.getKeyByValue(this.filter.logic);
				}
			}
		},
		filter: {
			deep: true,
			handler(value) {
				if (isEmpty(value) && this.edit === false) {
					this.close = true;
				}
			}
		}
	},
	methods: {
		closeFilter() {
			this.setOption(null);
			this.close = true;
			this.edit = false;
			this.collapseThis(this.collapsibleKeys.operations);
			this.$emit('filterDeleted');
		},
		updateFilter(value) {
			const updateFilter = cloneDeep(value);
			this.$emit('update:filter', updateFilter);
		},
		collapseThis(collapseKey) {
			Object.keys(this.collapsible).forEach((key) => {
				this.collapsible[key] = collapseKey === key ? !this.collapsible[key] : false;
			});
		},
		clickEdit() {
			this.close = false;
			this.edit = true;
		},
		// eslint-disable  no-unused-vars
		passFilter(event) {
			this.close = false;
			this.edit = false;
			this.inputValue = event.filter.value ?? event.filter.values;
			this.selOperation = event.filter.logic;
			this.$emit('filterCreated', event);
			this.collapseThis(this.collapsibleKeys.operations);
		},
		setDatasetMapping(filterDataset) {
			const item = this.filterDatasets.find((dat) => dat.index === filterDataset.index);
			let copiedFilterDatasets = null;
			if (typeof item === 'undefined') {
				copiedFilterDatasets = cloneDeep(this.filterDatasets);
				copiedFilterDatasets.push(filterDataset);
			} else {
				const index = this.filterDatasets.indexOf(item);
				copiedFilterDatasets = cloneDeep(this.filterDatasets);
				if (index !== -1) {
					copiedFilterDatasets[index] = cloneDeep(filterDataset);
				}
			}
			this.setOption(copiedFilterDatasets, 'filterDatasets');
		},
		updateColumn(dataset, column, datatype, displayName) {
			if (this.edit) {
				this.canContinue = true;
			}
			const filterDataset = {
				index: this.filterIndex,
				column,
				dataset,
				displayName
			};

			this.setDatasetMapping(filterDataset);
			const tempFilter = cloneDeep(this.filter);
			tempFilter.columnReference = column;
			tempFilter.displayName = displayName;
			tempFilter.datatype = datatype;
			tempFilter.type = 'dimension';
			this.$emit('update:filter', tempFilter);
			this.$emit('filterValueUpdated', this.filterIndex);
			this.collapseThis(this.collapsibleKeys.operations);
		},
		updateMetric(value, index, datatype, displayName) {
			const filterDataset = {
				index: this.filterIndex,
				column: value.column,
				dataset: this.configuration.data.datasetId,
				displayName
			};

			this.setDatasetMapping(filterDataset);
			const tempFilter = cloneDeep(this.filter);
			tempFilter.columnReference = value.column;
			tempFilter.displayName = displayName;
			tempFilter.datatype = datatype;
			tempFilter.type = 'metric';
			this.$emit('update:filter', tempFilter);
			this.$emit('filterValueUpdated', this.filterIndex);
			this.collapseThis(this.collapsibleKeys.operations);
		}
	}
};
</script>

<style scoped lang="scss">
.dataset-name {
	text-overflow: ellipsis;
	overflow: hidden;
	word-wrap: normal;
}
</style>

