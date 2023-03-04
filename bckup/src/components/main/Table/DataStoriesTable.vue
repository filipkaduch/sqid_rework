<template>
	<ds-box box-shadow="low" class="w-100 table-overflow">
		<div ref="tableWrapper" class="h-100 overflow-y-auto" @scroll.passive="onScroll">
			<table ref="tableTable" class="w-100">
				<thead ref="tableHeader" :class="headClasses">
					<tr :class="{'header-line': headerLine}" class="ds-bg-white-100">
						<th
							v-for="(column, index) in tableHeaderData"
							:key="index"
							:class="headerClasses"
							:style="'--header-height: ' + headerHeight + 'px'">
							<div class="d-flex flex-row align-items-center justify-content-between w-100">
								<div v-if="!column.hidden" :class="{'cursor-pointer': !dataTable}" @click="sortTable(column)">
									<ds-box
										align-y="center"
										flexType="row"
										padding-x="M">
										<ds-box v-if="dataTable || showIcons" padding-right="S">
											<ds-icon :name="getIcon(column.type)" />
										</ds-box>
										<ds-text
											class="text-nowrap"
											color="display-content-700"
											variant="bodyMedium">
											{{ column.name }}
										</ds-text>
										<ds-box v-if="(!dataTable && sortable)" class="cursor-pointer" padding-left="S">
											<ds-icon :name="getSortIcon(column.name)" />
										</ds-box>
									</ds-box>
								</div>
								<slot name="headerAction" />
							</div>
							<div class="d-flex flex-row align-items-center justify-content-between w-100">
								<slot name="headerLine2" />
							</div>
						</th>
					</tr>
				</thead>
				<tbody ref="tableBody">
					<template v-if="firstVisibleRow > 0">
						<tr>
							<td :colspan="tableHeaderData.length" :style="'padding-top:' + startHeight + 'px'" />
						</tr>
					</template>
					<tr
						v-for="(row, rowIndex) in dataLimited"
						:key="rowIndex"
						class="ds-bg-white tr-bottom-border"
						data-testid="tableRow"
						:class="{'cursor-pointer': rowSelect}"
						@click="rowSelect ? $emit('rowClicked', row) : null">
						<template v-for="(column, columnIndex) in tableHeaderData">
							<slot
								v-if="!wrapCells"
								:column="column"
								:columnIndex="columnIndex"
								:row="row" />
							<td
								v-else
								:key="columnIndex"
								:class="{
									'dynamic-width': dynamicWidth,
									'data-table': dataTable
								}">
								<ds-box
									align-y="center"
									padding-x="M">
									<ds-text
										:variant="dataTable ? 'data' : 'body'"
										class="text-nowrap"
										color="display-content-500">
										<slot :column="column" :columnIndex="columnIndex" :row="row">
											{{ row[column.name] ?? row[columnIndex] }}
										</slot>
									</ds-text>
								</ds-box>
							</td>
						</template>
					</tr>

					<template v-if="endHeight > 0">
						<tr>
							<td :colspan="tableHeaderData.length" :style="'padding-top:' + endHeight + 'px'" />
						</tr>
					</template>
				</tbody>
				<tfoot v-if="pagination" ref="tableFooter">
					<tr>
						<td colspan="100%">
							<table-pagination
								:numberOfItemsPerPage="numberOfItemsPerPage"
								:total-rows="totalRows"
								@update-current-page="updateCurrentPage" />
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</ds-box>
</template>

<script lang="ts">
import {
	computed,
	defineComponent,
	onMounted,
	PropType,
	reactive,
	ref,
	toRefs,
	watch,
	nextTick
} from 'vue';
import {TableHeader} from '@/components/main/consts/interfaces';
import useDataType from '@/components/main/Table/composables/useDataType';
import TablePagination from './Pagination.vue';

export default defineComponent({
	components: {
		TablePagination
	},
	props: {
		showIcons: {
			type: Boolean,
			default: false
		},

		/**
		 * Table header
		 * example: [{name: 'Name', type: 'NUMBER'}]
		 * TODO: Add type TableHeader after vue3
		 */
		tableHeader: {
			type: Array as PropType<TableHeader[]>,
			default: () => []
		},
		tableHeaderClass: {
			type: String,
			default: null
		},
		rowSelect: {
			type: Boolean,
			default: false
		},
		stickyHeader: {
			type: Boolean,
			default: false
		},
		wrapCells: {
			type: Boolean,
			default: true
		},
		headerLine: {
			type: Boolean,
			default: false
		},

		/**
		 * Table rows can have two different formats based on the source:
		 *
		 * Array of {} which contains column properties names and their values
		 * example: [{name: 'Jozko', gender: 'Male', age: 18, ...}, {}]
		 *
		 * Array of [] with values that are
		 * example: [['Jozko', 'Male', 18, ...], []]
		 */
		tableRows: {
			type: Array,
			default: () => []
		},

		// Add bottom bar with pagination
		pagination: {
			type: Boolean,
			default: false
		},

		// Number of items in pagination, applicable only when pagination is true
		numberOfItemsPerPage: {
			type: Number,
			default: 10
		},

		totalRows: {
			type: Number,
			default: 0
		},

		// Set table style
		dataTable: {
			type: Boolean,
			default: false
		},

		dynamicWidth: {
			type: Boolean,
			default: false
		},

		sortable: {
			type: Boolean,
			default: true
		},
		rowHeight: {
			type: Number,
			default: 44
		},
		headerHeight: {
			type: Number,
			default: 44
		}
	},
	emits: ['getMoreData', 'scroll', 'rowClicked'],
	// eslint-disable-next-line max-statements
	setup(props, {emit}) {
		const tableWrapper = ref(null);
		const sortProperties = reactive({
			sortByRow: null as string | null,
			sorted: false as boolean
		});

		const state = reactive({
			currentPage: 1
		});

		const tableRowsData: any = ref(props.tableRows);

		watch(() => props.tableRows, (value) => {
			tableRowsData.value = value;
		}, {deep: true});

		const tableData = computed(() => {
			if (props.pagination) {
				const from = (state.currentPage - 1) * props.numberOfItemsPerPage;
				const to = from + props.numberOfItemsPerPage;
				return tableRowsData.value.slice(from, to);
			}
			return tableRowsData.value;
		});

		const tableHeaderData: any = ref(props.tableHeader);

		watch(() => props.tableHeader, (value) => {
			tableHeaderData.value = value;
		}, {deep: true});

		const sortTable = (col: TableHeader) => {
			// If it is data table then 'disable' sorting
			if (props.dataTable) {
				return;
			}
			let arrayToSort = [...tableRowsData.value];
			let property = null as any;

			// get index or col.name, so we can access correct value based on data format
			if (Array.isArray(arrayToSort[0])) {
				property = tableHeaderData.value.findIndex((item: TableHeader) => item.name === col.name);
			} else {
				property = col.name;
			}

			// if we sort first time or switch between rows we are sorting
			if (sortProperties.sortByRow === null || col.name !== sortProperties.sortByRow) {
				// desc sorting
				arrayToSort.sort((row1: any, row2: any) => {
					if (row1[property] > row2[property]) {
						return -1;
					} else if (row1[property] < row2[property]) {
						return 1;
					}
					return 0;
				});
				sortProperties.sorted = true;
				sortProperties.sortByRow = col.name;
			// if we sort same column
			} else if (col.name === sortProperties.sortByRow) {
				// if we already sorted once just reverse it
				if (sortProperties.sorted) {
					arrayToSort.reverse();
					sortProperties.sorted = false;
					// if we sorted 2 times, reverse it to original data
				} else {
					arrayToSort = props.tableRows;
					sortProperties.sortByRow = null;
				}
			}
			tableRowsData.value = arrayToSort;
		};

		const {getIcon} = useDataType();
		const getSortIcon = (columnName: string) => {
			if (sortProperties.sortByRow && sortProperties.sortByRow === columnName) {
				if (sortProperties.sorted) {
					return 'icon-sort-desc';
				}
				return 'icon-sort-asc';
			}
			return 'ds-icon-unsorted';
		};

		const updateCurrentPage = (value: number) => {
			state.currentPage = value;
		};

		watch(() => state.currentPage, (value) => {
			// Check if we need to load more data
			if (value * props.numberOfItemsPerPage >= tableRowsData.value.length) {
				emit('getMoreData');
			}
		});

		const headerClasses = computed(() => ({
			'data-table': props.dataTable,
			'sticky-header-data': props.stickyHeader && props.dataTable,
			...(props.tableHeaderClass ? {[props.tableHeaderClass]: true} : null)
		}));

		const headClasses = computed(() => ({
			'sticky-header': props.stickyHeader
		}));

		let timeout: any = null;
		const firstVisibleRow = ref(0);
		const tableWrap: any = ref(null);
		const rowsVisible = ref(0);

		onMounted(() => {
			tableWrap.value = tableWrapper.value;
		});

		const tw: any = computed(() => tableWrap.value ?? {});

		watch(() => tw.value?.offsetHeight, () => {
			rowsVisible.value = Math.min(Math.ceil((tableWrap.value?.offsetHeight ?? 0) / props.rowHeight), tableData.value.length);
		});

		rowsVisible.value = Math.min(Math.ceil((tableWrap.value?.offsetHeight ?? 0) / props.rowHeight), tableData.value.length);

		const onScroll = () => {
			clearTimeout(timeout);
			rowsVisible.value = Math.min(Math.ceil((tableWrap.value?.offsetHeight ?? 0) / props.rowHeight), tableData.value.length);

			timeout = setTimeout(() => {
				const {scrollTop} = tableWrap.value;
				const startRow = Math.floor((scrollTop) / props.rowHeight);

				firstVisibleRow.value = startRow + rowsVisible.value > tableData.value.length
					? tableData.value.length - rowsVisible.value
					: startRow;
				if (startRow + rowsVisible.value >= tableData.value.length) {
					emit('getMoreData');
				}
				nextTick(() => {
					tw.value.scrollTop = scrollTop;
				});
			}, 20);
		};

		const dataLimited = computed(() => {
			if (firstVisibleRow.value > 0) {
				return tableData.value.slice(firstVisibleRow.value, rowsVisible.value + firstVisibleRow.value);
			}
			return tableData.value.slice(0, rowsVisible.value + (props.numberOfItemsPerPage ?? 10));
		});

		const startHeight = computed(() => {
			const height = (firstVisibleRow.value * props.rowHeight) - props.headerHeight + props.headerHeight;
			return Math.max(height, 0);
		});

		const endHeight = computed(() => firstVisibleRow.value ? (props.rowHeight * (tableData.value.length - rowsVisible.value - firstVisibleRow.value)) : 0);

		return {
			...toRefs(state),
			tableRowsData,
			tableHeaderData,
			sortTable,
			getIcon,
			getSortIcon,
			tableData,
			updateCurrentPage,
			headerClasses,
			headClasses,
			onScroll,
			dataLimited,
			firstVisibleRow,
			startHeight,
			endHeight,
			tableWrapper
		};
	}
});
</script>

<style lang="scss" scoped>
.table-overflow {
	overflow-x: auto;
}

thead th {
	display: table-cell;
	height: var(--header-height);
	vertical-align: middle;
}

tr {
	height: 44px;
}

.header-line {
	border-bottom: 1px solid map-get($ds-colors, 'separate-content-100');
	border-radius: 4px 4px 0 0;
}

:deep(td:not(.icon)) {
	width: fit-content;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

:deep(td.icon) {
	padding-left: 0;
	padding-right: 0;
}

.tr-bottom-border {
	border-bottom: 1px solid map-get($ds-colors, 'separate-content-100');
}

.sticky-header {
	position: sticky;
	top: 0;
	background-color: map-get($ds-colors, 'white-100');
	border-bottom: none !important;
	box-shadow: inset 0 -1px 0 map-get($ds-colors, 'separate-content-100');
}

.sticky-header-data {
	box-shadow: inset 0 -2px 0 map-get($ds-colors, 'separate-content-200');
}

.data-table {
	border-right: 1px solid map-get($ds-colors, 'separate-content-100');
	border-left: 1px solid map-get($ds-colors, 'separate-content-100');
}

td:first-child, td:last-child, th:first-child, th:last-child {
	border-left: none;
	border-right: none;
}

.active-color {
	fill: map-get($ds-colors, 'display-content');
}

.overflow-y-auto {
	overflow-y: auto;
}
</style>
