<!-- eslint-disable max-lines -->
<template>
	<div class="mx-0">
		<div
			:class="preview ? 'w-100 align-items-center justify-content-center' : ''"
			:style="preview ? 'height: 36px;' : ''"
			class="d-flex rounded"
			style="background-color: white;">
			<div
				v-if="preview === true"
				style="height: 36px;"
				class="overflow-hidden w-100 d-flex align-items-center justify-content-between rounded border column-select-right m-0 p-0 algLeft bg-white">
				<span class="pl-1 pl-xxl-1 d-flex align-items-center justify-content-between">
					<span class="d-block d-xxl-inline-flex m-0 p-0 options-style align-items-center m-xxl-1 justify-content-between">
						<app-hover-info
							:filter="columnsSelected"
							:dropDirection="dropDirection"
							:dataType="typeof columnsSelected[0] === 'undefined' ? 'INT' : columnsSelected[0].dataType"
							:value="inputValue"
							:filterMap="globalFilterMap"
							:logic="filter.logic"
							:index="filterIndex" />
					</span>
				</span>
				<fa-icon
					v-if="filter.editable"
					:icon="['fal','chevron-down']"
					size="lg"
					class="mr-2 cursor-pointer"
					alt="Edit filter" />
			</div>
		</div>

		<ds-collapse
			:is-open="collapsible.column"
			class="w-100 mt-2 m-0"
			style="border-radius: 4px; border: 1px solid rgb(200, 212, 218);">
			<app-input-bar
				v-model:input="search"
				:pill="false"
				:rounded="false"
				:border="false"
				style="border: 0; border-bottom: 1px;"
				class="m-0 rounded-top border-0"
				:widgetControlRightIcon="['far','search']"
				placeholder="Search" />

			<div v-for="(dataset, index) in datasetsFiltered" :key="'dataset' + index" class="my-0">
				<div :class="'cardBorderMiddle'">
					<button
						style="border: 0;"
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
								v-for="col in columnsFiltered[dataset.id]"
								:key="'column-' + dataset.id + '-' + col.name"
								class="list-group-item border-0 p-0">
								<button
									v-if="col.visibilityState !== columnVisibilityState.INTERNAL"
									class="btn btn-white w-100 d-flex justify-content-between align-items-center py-2 m-0 border-0"
									:class="{active: dataset.id === selectedColumn.dataset
										&& col.name === selectedColumn.column}"
									@click="updateColumn(dataset.id, col.name, col.dataType, col, null)"
									@touchend="updateColumn(dataset.id, col.name, col.dataType, col, null)">
									{{ col.displayName }}
									<app-datatype-badge :datatype="col.dataType" :show-datatype-text="false" :filter-variant="true" />
								</button>
							</div>
						</div>
					</ds-collapse>
				</div>
			</div>
		</ds-collapse>
		<ds-card
			v-if="columnsSelected.length > 0 && (close || edit === true)"
			class="shadow-none border-0"
			body-class="my-0 p-0">
			<presenter-filter-operations
				:dataType="filter.datatype"
				:operation="typeof filter.logic === 'undefined' ? '' : filter.logic"
				:filterIndex="filterIndex"
				:filter="filter"
				:global="true"
				:isReset="isReset"
				:editable="editable"
				:filterValue="filterValue"
				@filter-update="updateFilter"
				@filter-reseted="$emit('filterReseted', filterIndex)"
				@filter-deleted="closeFilter"
				@filter-saved="passFilter" />
		</ds-card>
	</div>
</template>

<script>
/* eslint-disable no-unused-vars */
import {columnVisibilityState, dataTypes} from '@/util/queryBuilder';
import AppDatatypeBadge from '@/components/design/AppDatatypeBadge.vue';
import AppHoverInfo from '@/components/design/AppHoverInfo.vue';
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import PresenterFilterOperations from '@/modules/story/components/presenter/components/globalFilters/PresenterFilterOperations.vue';
import filterMixin from '@/mixins/filterMixin';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import has from 'lodash/has';

const collapsibleKeys = Object.freeze({
	column: 'column',
	options: 'options',
	operations: 'operations'
});

export default {
	name: 'PresenterMultiFilterColumnSelect',
	components: {
		AppDatatypeBadge,
		AppHoverInfo,
		AppInputBar,
		PresenterFilterOperations
	},
	mixins: [filterMixin],
	props: {
		selectedOperation: {
			type: String,
			default: null
		},
		isReset: {
			type: Boolean,
			default: false
		},
		filterValue: {
			type: [
				String,
				Array,
				Number
			],
			default: null
		},
		filterIndex: {
			type: Number,
			default: 0
		},
		column: {
			type: Object,
			default: null
		},
		filter: {
			type: Object,
			default: null
		},
		editable: {
			type: Boolean,
			default: false
		},
		preview: {
			type: Boolean,
			default: false
		},
		dropDirection: {
			type: String,
			default: 'bottom'
		}
	},
	emits: ['update:filter', 'filterReseted', 'filterDeleted', 'filterCreated'],
	data() {
		return {
			search: '',
			dataTypes,
			selOperation: this.selectedOperation,
			inputValue: '',
			close: true,
			edit: this.editable,
			isHover: false,
			isHoverCols: false,
			columnsSelected: [],
			custom: typeof this.filter.custom === 'undefined' ? false : this.filter.custom,
			columnVisibilityState,
			collapsibleKeys,
			collapsibleDatasets: {},
			collapsible: {
				column: false,
				options: false,
				operations: false
			}
		};
	},
	computed: {
		globalFilterMap() {
			return this.$store.getters['storyDetail/story'].configuration.globalFilterMap ?? [];
		},
		catalogItems() {
			return this.$store.getters['storyDetail/catalogItems'] ?? [];
		},
		concatedDatasets() {
			return this.datasets.concat(this.catalogItems);
		},
		datasets() {
			return this.$store.getters['storyDetail/story']?.datasets ?? [];
		},
		datasetsFiltered() {
			return this.concatedDatasets.filter((dataset) => dataset[dataset.columns ? 'columns' : 'attributes']
				.some((column) => column.displayName.toLowerCase()
					.includes(this.search.toLowerCase())));
		},
		columnsFiltered() {
			const columns = {};
			this.datasetsFiltered.forEach((dataset) => {
				columns[dataset.id] = dataset[dataset.columns ? 'columns' : 'attributes']
					.filter((column) => column.name.toLowerCase().includes(this.search.toLowerCase())
						&& this.columnsSelected.length > 0
						? this.columnsSelected.some((colSel) => colSel.name === column.name) === false && column.dataType === this.columnsSelected[0].dataType
						: column.name.toLowerCase().includes(this.search.toLowerCase()));
			});
			return columns;
		},
		// eslint-disable-next-line max-lines-per-function
		selectedColumn() {
			if (!isEmpty(this.filter) && typeof this.filter.logic !== 'undefined') {
				for (const [
					key,
					value
				] of Object.entries(this.filter.columnReference)) {
					if (Array.isArray(value)) {
						value.forEach((val) => {
							this.datasetsFiltered.forEach((dataset) => {
								const findCol = cloneDeep(dataset[dataset.columns ? 'columns' : 'attributes'].find((el) => el.name === val));
								if (typeof findCol !== 'undefined' && (find(this.columnsSelected, findCol) === false
									|| this.columnsSelected.findIndex((findInd) => findInd.name === findCol.name) === -1)) {
									findCol.datasetId = dataset.id;
									this.columnsSelected.push(findCol);
								}
							});
						});
					}
				}

				this.datasetsFiltered.some((dataset) => {
					if (typeof this.filter.datatype === 'undefined') {
						const findValue = dataset[dataset.columns ? 'columns' : 'attributes'].find((col) => col.name === this.filter.columnReference.find((el) => el === col.name));
						if (typeof findValue !== 'undefined') {
							const updateDatatype = cloneDeep(this.filter);
							updateDatatype.datatype = findValue.dataType;
							this.$emit('update:filter', updateDatatype);
							return true;
						}
						return false;
					}
					return false;
				});
			}
			return this.filter;
		},
		selectedColumnDatatype() {
			if (this.selectedColumn.datatype) {
				return this.selectedColumn.datatype ?? '';
			}
			return this.selectedColumn.dataType;
		},
		selectedColumnName() {
			return this.selectedColumn.column === null ? (this.selectedColumn.columnReference ?? this.selectedColumn.name) : this.selectedColumn.column;
		}
	},
	watch: {
		columnsSelected(columns) {
			if (columns.length === 1) {
				this.isHoverCols = false;
			}
		},
		selectedColumn: {
			immediate: true,
			handler(val) {
				if (!isEmpty(val) && typeof val.logic !== 'undefined') {
					this.close = true;
					this.inputValue = this.filterValue;
					this.selOperation = this.getKeyByValue(this.filter.logic);
				}
			}
		},
		datasetsFiltered: {
			immediate: true,
			handler(value) {
				for (const dataset in value) {
					this.collapsibleDatasets[dataset.id] = false;
				}
			}
		}
	},
	methods: {
		deleteColumn(index) {
			if (index > -1) {
				const datasetId = typeof this.columnsSelected[index].datasetId === 'undefined'
					? this.columnsSelected[index].dataset
					: this.columnsSelected[index].datasetId;
				const tempFilter = cloneDeep(this.filter);
				const indexOf = tempFilter.columnReference[datasetId].indexOf(this.columnsSelected[index].name);
				if (this.filter.columnReference[datasetId].length === 1) {
					delete tempFilter.columnReference[datasetId];
				} else {
					tempFilter.columnReference[datasetId].splice(indexOf, 1);
				}
				this.$emit('update:filter', tempFilter);
				this.columnsSelected.splice(index, 1);
			}
		},
		closeFilter() {
			this.close = true;
			this.edit = false;
			this.$emit('filterDeleted');
		},
		updateFilter(value) {
			const updateFilter = cloneDeep(value);
			this.$emit('update:filter', updateFilter);
		},
		makeProtectedFilter() {
			const tmpFilter = cloneDeep(this.filter);
			tmpFilter.editable = !tmpFilter.editable;
			const eventObject = {
				filterIndex: this.filterIndex,
				filter: tmpFilter
			};

			this.$emit('filterCreated', eventObject);
		},
		clickEdit() {
			this.close = true;
			this.edit = true;
		},
		passFilter(event) {
			this.inputValue = event.filter.value ?? event.filter.values;
			this.selOperation = event.filter.logic;
			this.$emit('filterCreated', event);
		},
		updateColumn(dataset, column, datatype, col) {
			const tempColumn = cloneDeep(col);
			tempColumn.dataset = dataset;
			tempColumn.datasetName = this.datasets.find((el) => el.id === dataset).name;
			this.columnsSelected.push(tempColumn);
			const tempFilter = cloneDeep(this.filter);
			if (has(this.filter.columnReference, dataset)) {
				tempFilter.columnReference[dataset].push(column);
			} else {
				tempFilter.columnReference[dataset] = [];
				tempFilter.columnReference[dataset].push(column);
			}
			tempFilter.datatype = datatype;
			tempFilter.type = 'SIMPLE-ARRAY-COLUMN-VALUE';
			this.$emit('update:filter', tempFilter);
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
