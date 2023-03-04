<!-- eslint-disable max-lines -->
<template>
	<div class="mx-0" :style="editable ? 'background-color: white' : 'background-color:#FBFBFC;'">
		<div
			:class="preview ? 'w-100 align-items-center justify-content-center' : ''"
			:style="preview ? 'height: 36px;' : ''"
			class="d-flex rounded"
			style="background-color: white;">
			<div
				v-if="close === false && edit === false && editable === false && preview === false"
				class="d-xxl-flex d-block w-100"
				style="background-color:#FBFBFC;">
				<div
					class="w-100 d-flex align-items-center justify-content-between rounded border column-select-right m-0 p-0 algLeft bg-white">
					<span class="pl-2 pl-xxl-2 d-flex align-items-center">
						<span class="d-block d-xxl-inline-flex m-0 p-0 options-style">
							<app-hover-info
								:filter="columnsSelected"
								:dataType="columnsSelected[0].dataType"
								:value="inputValue"
								:filterMap="globalFilterMap"
								:logic="filter.logic"
								:index="filterIndex" />
						</span>
					</span>
					<fa-icon :icon="['fas', 'ellipsis-h']" class="mr-2 ml-1" style="color: #B5B5BA; cursor: pointer;" @click="clickEdit" />
				</div>
				<div v-if="editable === false" class="btn-group mt-xxl-0 mt-1">
					<button
						:id="`editable-${filterIndex}`"
						class="btn btn-white m-0 ml-xxl-2 ml-0 p-0 collapseBtnSize"
						@click="makeProtectedFilter">
						<ds-icon v-if="filter.editable === true" class="mr-2 ml-2" name="icon_edit" alt="Edit" />
						<fa-icon v-else :icon="['fas', 'lock']" class="ml-2 options-grey-style" />
					</button>
					<button
						class="btn btn-white m-0 p-0 collapseBtnSize"
						@click="closeFilter">
						<ds-icon class="mr-2 ml-2" name="icon bin" alt="Delete" />
					</button>
				</div>
			</div>
			<div
				v-else-if="preview === true"
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
				<fa-icon
					v-else
					:icon="['fas','lock']"
					size="lg"
					class="mr-2 cursor-pointer"
					alt="Filter locked" />
			</div>
			<button
				v-else
				style="border: 0;"
				data-testid="show-global-filter-columns"
				class="btn btn-clean w-100 d-flex justify-content-between rounded border btn-group align-items-center column-select-right m-0 p-0 algLeft bg-white"
				:disabled="editable"
				@click="collapseThis('column')">
				<span class="pl-1 pl-xxl-2 d-flex">
					<span class="d-inline-block d-xxl-flex align-items-xxl-center m-0 p-0 my-1 options-style">
						<template v-if="columnsSelected.length > 0">
							<div class="d-xxl-flex d-none">
								Columns
							</div>
							<span class="mx-1 filterLabel d-flex">
								{{ columnsSelected[0]?.displayName ?? columnsSelected[0].name }}
								<app-datatype-badge
									v-if="columnsSelected[0].dataType"
									:datatype="columnsSelected[0].dataType"
									:show-datatype-text="false"
									:filter-variant="true" />
								<fa-icon
									v-if="editable === false"
									:icon="['fas', 'times']"
									class="mx-xxl-2 mx-1 cursor-pointer"
									alt="Delete"
									size="sm"
									@click.stop.prevent="deleteColumn(0)" />
							</span>
							<div class="position-relative hovering d-flex h-100">
								<span
									v-if="columnsSelected.length > 1"
									class="mx-1 filterLabel d-flex align-items-center"
									style="right: -50px; top: -22px;"
									@click.stop.prevent="isHoverCols = !isHoverCols">
									<span class="d-flex align-items-center justify-content-center hoverCircle">
										{{ columnsSelected.length - 1 }}
									</span>
								</span>
								<div
									v-if="isHoverCols === true"
									class="mx-1 position-absolute filterLabel"
									style="right: -70px; top: 35px; z-index: 1000;">
									<div v-for="(colu, index) in columnsSelected" :key="index"><p v-if="index !== 0" class="mb-1 d-inline-flex">
										{{ colu.name }}
										<fa-icon
											v-if="editable === false"
											:icon="['fas', 'times']"
											class="mr-2 ml-2 cursor-pointer"
											alt="Delete"
											@click.stop.prevent="deleteColumn(index)" /></p>
									</div>
								</div>
							</div>
						</template>
						<template v-else>
							{{ $t('t_chooseColumns') }}
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

				<div v-for="(dataset, index) in datasetsFiltered" :key="'dataset' + index" class="my-0">
					<div :class="'cardBorderMiddle'">
						<button
							:data-testid="`global-filter-dataset-${index}`"
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
									v-for="(col, id) in columnsFiltered[dataset.id]"
									:key="'column-' + dataset.id + '-' + col.name"
									class="list-group-item border-0 p-0">
									<button
										v-if="col.visibilityState !== columnVisibilityState.INTERNAL"
										:data-testid="`global-filter-column-${id}`"
										class="btn btn-white w-100 d-flex justify-content-between align-items-center py-2 m-0 border-0"
										:class="{active: dataset.id === selectedColumn.dataset
											&& col.name === selectedColumn.column}"
										@click="updateColumn(dataset.id, col.name, col.dataType, col, null)">
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
			v-if="columnsSelected.length > 0 && (close || edit === true)"
			class="shadow-none border-0"
			body-class="my-0 p-0"
			:style="editable ? 'background-color-white' : 'background-color:#FBFBFC;'">
			<filter-operations
				:dataType="filter.datatype"
				:operation="typeof filter.logic === 'undefined' ? '' : filter.logic"
				:filterIndex="filterIndex"
				:filter="filter"
				:global="true"
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
import FilterOperations from '@/modules/widget/components/widget-controls/FilterOperations.vue';
import filterMixin from '@/mixins/filterMixin';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';

const collapsibleKeys = Object.freeze({
	column: 'column',
	options: 'options',
	operations: 'operations'
});

export default {
	name: 'MultiFilterColumnSelect',
	components: {
		AppDatatypeBadge,
		AppHoverInfo,
		AppInputBar,
		FilterOperations
	},
	mixins: [filterMixin],
	props: {
		selectedOperation: {
			type: String,
			default: null
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
	emits: ['filterReseted', 'update:filter', 'filterDeleted', 'filterCreated'],
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
			collapsible: {
				column: false,
				options: false,
				operations: false
			},
			collapsibleDatasets: {}
		};
	},
	computed: {
		globalFilterMap() {
			return this.$store.getters['storyDetail/story'].configuration.globalFilterMap ?? [];
		},
		datasets() {
			return this.$store.getters['storyDetail/story']?.datasets ?? [];
		},
		catalogItems() {
			return this.$store.getters['storyDetail/catalogItems'] ?? [];
		},
		concatedDatasets() {
			return this.datasets.concat(this.catalogItems);
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
								if (findCol && (find(this.columnsSelected, findCol) === false
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
		columnsSelected: {
			handler(columns) {
				if (columns.length === 1) {
					this.isHoverCols = false;
				}
			},
			deep: true
		},
		selectedColumn: {
			immediate: true,
			handler(val) {
				if (!isEmpty(val) && typeof val.logic !== 'undefined') {
					this.close = false;
					this.inputValue = this.filterValue;
					this.selOperation = this.getKeyByValue(this.filter.logic);
				}
			}
		},
		datasetsFiltered: {
			immediate: true,
			deep: true,
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
			this.collapseThis(this.collapsibleKeys.operations);
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
		collapseThis(collapseKey) {
			Object.keys(this.collapsible).forEach((key) => {
				this.collapsible[key] = collapseKey === key ? !this.collapsible[key] : false;
			});
		},
		clickEdit() {
			this.close = !this.close;
			this.edit = true;
		},
		passFilter(event) {
			this.close = false;
			this.edit = false;
			this.inputValue = event.filter.value ?? event.filter.values;
			this.selOperation = event.filter.logic;
			this.$emit('filterCreated', event);
			this.collapseThis(this.collapsibleKeys.operations);
		},
		updateColumn(dataset, column, datatype, col) {
			const tempColumn = cloneDeep(col);
			tempColumn.dataset = dataset;
			tempColumn.datasetName = this.datasetsFiltered.find((el) => el.id === dataset).name;
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
