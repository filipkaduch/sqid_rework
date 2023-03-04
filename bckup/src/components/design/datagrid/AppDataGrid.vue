<template>
	<div>
		<div class="toolbar d-flex">
			<div class="left">
				<ds-dropdown placement="bottom-start">
					<template #triggerContent>
						<button class="btn btn-secondary">Filter</button>
					</template>
					<template #dropdownContent>
						<draggable v-model="filters" handle=".handle-test">
							<template #item="{element, index}">
								<div class="dd-item pl-2">
									<filter-item
										:filter="element"
										:columns="columns"
										:functions="filterOptions[getColumnFilterType(rawTypes[element.key])]"
										:type="rawTypes[element.key]"
										@filter:remove="removeFilter(index)"
										@filter:update="updateFilter(index, $event)" />
								</div>
							</template>
						</draggable>
						<button class="btn btn-secondary" @click="addFilter(widgetInstanceId)">Add filter</button>
					</template>
				</ds-dropdown>
			</div>
			<div class="flex-grow-1" />
			<div class="right" />
		</div>
		<div>
			<div class="modal-table-height overflow-auto">
				<table class="table b-table table-striped table-hover">
					<thead>
						<tr>
							<th v-for="column in columns" :key="column">
								<div class="w-100 align-items-center d-flex">
									<span>
										<app-datatype-badge v-if="rawTypes[column]" :datatype="rawTypes[column]" :showDatatypeText="false" />{{ getColumnName(column) }}
									</span>
									<span class="flex-grow-1" />
									<button class="btn btn-clean btn-sm" @click="toggleSorting(column)">
										<span v-if="sorting && sorting.key === column">
											<fa-icon v-if="sorting.type === ordering.ASC" icon="sort-amount-up" />
											<fa-icon v-else icon="sort-amount-down" />
										</span>
										<fa-icon v-else icon="sort-amount-up" style="opacity: 0.5" />
									</button>
									<filter-dropdown
										:field="column"
										:types="rawTypes"
										:filter-functions="filterFunctions"
										:filter-options="filterOptions"
										:current-filter="findFilter(column)"
										:current-index="findFilterIndex(column)"
										@filter="updateFilter($event.index, $event.filter)" />
								</div>
							</th>
						</tr>
					</thead>
					<tbody v-if="itemsFilteredSorted">
						<tr v-for="index in Math.min(100, itemsFilteredSorted.length)" :key="index">
							<td v-for="(column, columnIndex) in columns" :key="`${column}-${index - 1}`">
								<div class="d-flex align-items-center">
									<span>{{ getFormattedValue(itemsFilteredSorted[index - 1][columnIndex], getColumnFilterType(rawTypes[column])) }}</span>
									<div class="flex-grow-1" />
									<save-cell
										:name="getSavedCellName(column, index - 1)"
										@cell:save="saveCell($event, column, index - 1, null, getSavedCellName(column, index - 1))"
										@cell:remove="removeCell(getSavedCellName(column, index - 1))" />
								</div>
							</td>
						</tr>
						<tr v-if="itemsFilteredSorted.length > 100">
							<td :colspan="columns.length" class="text-center">
								{{ itemsFilteredSorted.length - 100 }} more items not shown
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td v-for="column in columns" :key="column">
								<div class="d-flex">
									<div class="d-flex">
										<bootstrap-select
											:value="aggregates[column]"
											:options="aggregateOptions[getColumnFilterType(rawTypes[column])]"
											@update:value="updateAggregate(column, $event)" />

										<div class="d-flex align-items-center ml-2 font-italic">
											<span v-if="aggregates[column] === 'percentEmpty' || aggregates[column] === 'percentNotEmpty'">
												{{ getFormattedValue(aggregateValues[column], 'percent') }}
											</span>
											<span v-else>{{ getFormattedValue(aggregateValues[column], 'number') }}</span>
										</div>
									</div>

									<div class="flex-grow-1" />

									<div class="d-flex align-items-center">
										<save-cell
											:disabled="!aggregates[column] || aggregates[column] === 'none'"
											:name="getSavedCellName(column)"
											@cell:save="saveCell($event, column, null, aggregates[column], getSavedCellName(column))"
											@cell:remove="removeCell(getSavedCellName(column))" />
									</div>
								</div>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
		<hr>
		<div v-if="savedFacts.length > 0" class="custom-footer">
			<h4 class="ml-2"><strong>Saved facts</strong></h4>
			<div>
				<div class="modal-table-height">
					<table class="table b-table table-striped table-hover">
						<tbody>
							<tr v-for="item in savedFacts" :key="item">
								<td>{{ item.fact }}</td>
								<td>{{ item.value }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {aggregateFunctions, aggregateOptions, filterFunctions, filterOptions, format, getType} from '@/util/dataGrid';
import {dataTypes, isDataType, ordering} from '@/util/queryBuilder';
import AppDatatypeBadge from '@/components/design/AppDatatypeBadge.vue';
import FilterDropdown from './AppDataGridFilterDropdown.vue';
import FilterItem from './AppDataGridFilterItem.vue';
import SaveCell from './AppDataGridSaveCell.vue';
import draggable from 'vuedraggable';
import {mapActions} from 'vuex';
import BootstrapSelect from '@/components/temporary/BootstrapSelect.vue';

export default {
	name: 'AppDataGrid',
	components: {
		BootstrapSelect,
		FilterDropdown,
		FilterItem,
		SaveCell,
		draggable,
		AppDatatypeBadge
	},
	filters: {format},
	props: {
		widgetInstanceId: {
			type: String,
			required: true
		}
	},
	data: () => ({
		types: {},
		rawTypes: {},
		aggregates: {},
		ordering,
		aggregateOptions,
		filterFunctions,
		filterOptions,
		computedColumns: [],
		computedExpression: '',
		computedName: '',
		text: ''
	}),
	computed: {
		data() {
			return this.$store.getters['widgetData/rawData'](this.widgetInstanceId);
		},
		facts() {
			return this.$store.getters['widgetFacts/facts'](this.widgetInstanceId);
		},
		savedCells() {
			return this.facts?.savedCells ?? {};
		},
		filters() {
			return this.facts?.filters ?? [];
		},
		sorting() {
			return this.facts?.sorting ?? null;
		},
		itemsFilteredSorted() {
			return this.$store.getters['widgetFacts/widgetItemsFilteredSorted'](this.widgetInstanceId);
		},
		datasets() {
			return this.$store.getters['storyDetail/story']?.datasets ?? [];
		},
		catalogItems() {
			return this.$store.getters['storyDetail/catalogItems'] ?? [];
		},
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		selectedDataset() {
			return this.widgetConfiguration.data?.catalogItemId ?? this.widgetConfiguration.data?.datasetId ?? null;
		},
		aggregateValues() {
			const temp = {};
			this.columns.forEach((column) => {
				const fn = this.aggregates[column];
				if (fn && fn !== 'none') {
					const columnIndex = this.data.columns.map((col) => col.reference).indexOf(column);
					const items = this.itemsFilteredSorted.map((row) => row[columnIndex]);
					if (items.length > 0) {
						temp[column] = aggregateFunctions[fn](items, {
							type: getType(this.rawTypes[columnIndex])
						});
					} else {
						temp[column] = null;
					}
				}
			});
			return temp;
		},
		savedCellTransformed() {
			const result = {};
			Object.keys(this.savedCells ?? []).forEach((name) => {
				const savedCell = this.savedCells[name];
				if (!result[savedCell.column]) {
					result[savedCell.column] = {
						indexed: [],
						aggregated: []
					};
				}
				if (Number.isInteger(savedCell.index)) {
					result[savedCell.column].indexed[savedCell.index] = name;
				} else {
					result[savedCell.column].aggregated.push(name);
				}
			});
			return result;
		},
		items() {
			if (!this.data) {
				return [];
			}
			const newArray = new Array(this.data.rows.length);
			const types = this.data.columns.map((column) => column.dataType);
			const header = this.dataHeaders;
			const {computedColumns} = this;

			for (let i = 0; i < this.data.rows.length; i++) {
				const temp = {};
				const row = this.data.rows[i];

				for (let j = 0; j < row.length; j++) {
					const value = row[j];
					if (isDataType(dataTypes.DATE_TYPE, types[j])) {
						temp[header[j]] = new Date(value[0] * 1000);
					} else {
						temp[header[j]] = Array.isArray(value)
							? `${value[0]} - ${value[1]}`
							: (typeof value === 'string' ? value.trim() : value);
					}
				}

				if (computedColumns && computedColumns.length > 0) {
					computedColumns.forEach((prop) => {
						temp[prop.id] = prop.fn ? prop.fn(temp) : null;
					});
				}

				newArray[i] = temp;
			}

			return newArray;
		},
		computedColumnsHeader() {
			return this.computedColumns.map((prop) => prop.id);
		},
		dataHeaders() {
			return this.data.columns.map((column) => column.reference);
		},
		columns() {
			if (!this.data?.columns) {
				return [];
			}
			return this.dataHeaders.concat(this.computedColumnsHeader);
		},
		savedFacts() {
			return Object.keys(this.savedCells).map((key) => ({
				fact: `$${key}`,
				value: this.$store.getters['widgetFacts/value'](key)
			}));
		}
	},
	watch: {
		items(data) {
			if (this.computedColumnsHeader && this.computedColumnsHeader.length > 0) {
				this.computedColumnsHeader.forEach((id) => {
					if (!this.types[id]) {
						const value = data?.[0][id];
						this.types[id] = typeof value;
					}
				});
			}
		},
		data: {
			immediate: true,
			handler(data) {
				if (data) {
					this.initialize(data);
				}
			}
		},
		savedCells: {
			immediate: true,
			handler() {
				const result = {};
				Object.keys(this.savedCells).forEach((column) => {
					const cell = this.savedCells[column];
					if (cell.aggregation) {
						result[cell.column] = cell.aggregation;
					}
				});
				this.aggregates = result;
			}
		}
	},
	methods: {
		...mapActions('widgetFacts', ['addFilter']),
		getFormattedValue(value, columnType) {
			return format(value, this.getColumnFilterType(columnType));
		},
		initialize(data) {
			data.columns.forEach((column) => {
				this.rawTypes[column.reference] = Array.isArray(column.dataType) ? column.dataType[0] : column.dataType;
			});
		},
		getColumnName(column) {
			let columnIndex = null;
			const options = this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId).data.configuration;
			let cols = null;
			if (this.widgetConfiguration?.data?.catalogItemId) {
				cols = this.catalogItems.find((catalog) => catalog.id === this.widgetConfiguration.data.catalogItemId).attributes;
			} else if (this.widgetConfiguration?.data?.datasetId) {
				cols = this.datasets.find((dataset) => dataset.id === this.widgetConfiguration.data.datasetId).columns;
			}

			if (column.startsWith('Dimension')) {
				columnIndex = parseInt(column.substring(9), 10) - 1;

				const name = cols?.find((col) => col.name === options.dimensions[columnIndex].column).displayName ?? null;
				return name;
			}
			if (column.startsWith('Metric')) {
				columnIndex = parseInt(column.substring(6), 10) - 1;
				const metricConfiguration = options.metrics[columnIndex];
				const name = cols?.find((col) => col.name === metricConfiguration.column)?.displayName ?? null;

				return metricConfiguration.aggregation ? `${metricConfiguration.aggregation}(${name ?? metricConfiguration.column})` : name ?? metricConfiguration.column;
			}
			return column;
		},
		getSavedCellName(column, index = null) {
			let name = null;
			if (index !== null) {
				name = this.savedCellTransformed[column] && this.savedCellTransformed[column].indexed[index]
					? this.savedCellTransformed[column].indexed[index]
					: null;
				return name;
			}
			name = this.savedCellTransformed[column] && this.savedCellTransformed[column].aggregated[0]
				? this.savedCellTransformed[column].aggregated[0]
				: null;
			return name;
		},
		getColumnFilterType(type) {
			return getType(type);
		},
		findFilter(key) {
			return this.filters.find((filter) => filter.key === key);
		},
		findFilterIndex(key) {
			return this.filters.findIndex((filter) => filter.key === key);
		},
		updateFilter(index, filter) {
			this.$store.dispatch('widgetFacts/updateFilter', {
				widgetInstanceId: this.widgetInstanceId,
				index,
				filter
			});
		},
		removeFilter(index) {
			this.$store.dispatch('widgetFacts/removeFilter', {
				widgetInstanceId: this.widgetInstanceId,
				index
			});
		},
		toggleSorting(column) {
			this.$store.dispatch('widgetFacts/toggleSorting', {
				widgetInstanceId: this.widgetInstanceId,
				label: column
			});
		},
		saveCell(newName, column, index = null, aggregation = null, oldName = null) {
			this.$store.dispatch('widgetFacts/saveCell', {
				widgetInstanceId: this.widgetInstanceId,
				newName,
				column,
				index,
				aggregation,
				oldName
			});
		},
		removeCell(factName) {
			this.$store.dispatch('widgetFacts/saveCell', {
				widgetInstanceId: this.widgetInstanceId,
				factName
			});
		},
		updateAggregate(column, value) {
			const temp = {...this.aggregates};
			temp[column] = value;
			if (this.savedCellTransformed[column]?.aggregated[0]) {
				this.saveCell(this.savedCellTransformed[column]?.aggregated[0], column, null, value);
			}
			this.aggregates = temp;
		}
	}
};
</script>

<style>
.modal-table-height {
	min-height: 18vh;
	max-height: 35vh!important;
}
</style>
