<!-- eslint-disable max-lines -->
<template>
	<div class="mx-0">
		<div v-if="headingText" class="d-flex options-grey-style">
			<span>
				{{ $t(headingText) }}
			</span>
		</div>
		<app-input-bar v-if="customExpressionEnabled" v-model:input="customColumnName" class="my-1" :placeholder="$t('t_CustomColumnName')" />
		<div class="d-flex rounded my-1">
			<button
				v-if="!customExpressionEnabled"
				class="btn btn-clean w-100 d-flex justify-content-between rounded border btn-group align-items-center column-select-right m-0 p-0 algLeft bg-white"
				@click="collapse = !collapse">
				<span class="pl-3 pl-xxl-3">
					<span class="d-inline-block m-0 p-0 options-style">
						<template v-if="selectedColumn.column">
							{{ selectedColumn.type === 'metric' ? `${selectedColumn.name} - ${selectedColumn.function}(${selectedColumn.column})` : selectedColumn.displayName }}
							<app-datatype-badge v-if="selectedColumnDatatype" :datatype="selectedColumnDatatype" :show-datatype-text="false" class="ml-1" />
						</template>
						<template v-else-if="selectedColumn.columnName">
							{{ selectedColumn.type === 'metric' ?
								`${selectedColumn.name} - ${selectedColumn.function}(${selectedColumn.columnName})` : selectedColumn.columnName }}
							<app-datatype-badge v-if="selectedColumnDatatype" :datatype="selectedColumnDatatype" :show-datatype-text="false" class="ml-1" />
						</template>
						<template v-else>
							Please choose column.
						</template>
					</span>
				</span>
				<fa-icon :icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']" class="mx-3 options-grey-style" />
			</button>
			<template v-else-if="datasetsFiltered[0]?.attributes || datasetsFiltered[0]?.columns ">
				<app-query-editor v-model:query="customExpression" :columns="datasetsFiltered[0]?.attributes ?? datasetsFiltered[0]?.columns" />
			</template>
			<div class="p-0">
				<button
					v-if="useCustomExpression"
					:class="{'active-btn': customExpressionEnabled}"
					class="btn btn-white m-0 ml-2 p-0 collapseBtnSize"
					@click="$emit('update:customExpressionEnabled', !customExpressionEnabled)">
					{{ $t('t_Fx') }}
				</button>
			</div>
			<div class="p-0">
				<button
					v-if="showDeleteButton"
					:disabled="disableCheck"
					class="btn btn-white m-0 ml-2 p-0 collapseBtnSize"
					@click="deleteColumn">
					<ds-icon class="mr-2 ml-2" name="icon bin" alt="Delete" fill="display-content-300" />
				</button>
			</div>
		</div>

		<ds-collapse v-if="!customExpressionEnabled" :is-open="collapse" class="w-100 mt-2 m-0">
			<ds-card class="shadow-none border-0 column-card-background" body-class="my-0 p-0">
				<app-input-bar
					v-model:input="search"
					:pill="false"
					:rounded="false"
					class="m-0 rounded-top"
					:widgetControlRightIcon="['far','search']"
					placeholder="Search" />

				<div v-if="metric" class="my-2">
					<button
						class="btn btn-secondary w-100 m-0"
						@click="metricCollapseCols = !metricCollapseCols">
						Metrics
					</button>

					<ds-collapse :is-open="metricCollapseCols">
						<div class="list-group">
							<div
								v-for="(col, i) in metric"
								:key="`column-${col.dataset}-${col.column}-${i}`"
								class="list-group-item border-0 p-0">
								<button
									class="btn btn-clean w-100 d-flex justify-content-between align-items-center py-2 px-2 m-0"
									:class="{active: col.dataset === selectedColumn.dataset
										&& col.column === selectedColumn.column && selectedColumn.type === 'metric'}"
									@click="updateMetric(col, i)">
									{{ `Metric${i + 1} - ${col.function}(${col.column})` }}
									<app-datatype-badge :datatype="dataTypes.INT" :show-datatype-text="false" />
								</button>
							</div>
						</div>
					</ds-collapse>
				</div>

				<div v-for="(dataset, index) in datasetsFiltered" :key="'dataset' + index" class="my-0">
					<div :class="index !== datasetsFiltered.length - 1 ? 'cardBorderMiddle' : 'cardBorderBottom'">
						<button
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
							:visible="((dataset.id) === selectedColumn.dataset) || search.length >= 1">
							<div class="list-group">
								<div
									v-for="col in columnsFiltered[(dataset.id)]"
									:key="'column-' + (dataset.id) + '-' + col.name"
									class="list-group-item border-0 p-0">
									<button
										v-if="col.visibilityState !== columnVisibilityState.INTERNAL"
										class="btn btn-white w-100 d-flex justify-content-between align-items-center py-2 m-0 noBorder"
										:class="{active: (dataset.id) === selectedColumn.dataset
											&& col.name === selectedColumn.column && selectedColumn.type !== 'metric'}"
										@click="updateColumn((dataset.id), col.name, col.dataType, dataset.databaseType, null, null, col.displayName)">
										{{ col.displayName }}
										<app-datatype-badge :datatype="col.dataType" :show-datatype-text="false" />
									</button>
								</div>
							</div>
						</ds-collapse>
					</div>
				</div>
			</ds-card>
		</ds-collapse>
		<div v-if="showChooseButtonSection" class="d-block d-xxl-flex rounded py-1">
			<button
				v-if="showBucketing"
				:class="{
					'disabled': isSelectedDatatype(dataTypes.TEXT),
					'btn-white': !(isSelectedDatatype(dataTypes.DATE_TYPE) && !isDateBucketValid),
					'btn-outline-warning': isSelectedDatatype(dataTypes.DATE_TYPE) && !isDateBucketValid,
					'font-italic': isSelectedDatatype(dataTypes.DATE_TYPE) && !isDateBucketValid,
					'btnSelected border': (isSelectedDatatype(dataTypes.DATE_TYPE) && isDateBucketValid)
						|| isSelectedDatatype(dataTypes.NUMBER) || isSelectedDatatype(dataTypes.TEXT)
				}"
				class="btn my-1 mr-1 ml-0"
				@click="collapseThis(collapsibleKeys.function)">
				{{ isDateBucketValid ? bucketingText : translateBucketingTypeText(selectedBucketType) }}
			</button>
			<button
				v-if="functionSelect && !customExpressionEnabled"
				:class="{
					'font-italic': !selectedColumn.function,
					'btnSelected border': collapseOptions && haveFunction,
					'btn-white': haveFunction,
					'btn-outline-warning': !haveFunction
				}"
				class="btn my-1 mr-1 ml-0"
				@click="collapseThis(collapsibleKeys.function)">
				{{ haveFunction ? functions[selectedColumn.function].caption : 'func' }}
			</button>
			<button
				v-if="customExpressionEnabled"
				class="btn btn-white my-1 mr-3 ml-0"
				@click="updateMetric({}, 0)">
				{{ $t('t_Apply') }}
			</button>
			<button
				v-if="(((metricEnums && isMultiSeries === false)
					|| (metricEnums && isFormula)) && isDisabledChart === false)
					&& !noMetricEnums && widgetTypes.MAPS.includes(widgetType) === false"
				:data-testid="`show-metric-enum-${indexOfMetric}`"
				:class="{'btnSelected': collapsible.metricEnums}"
				class="btn btn-white border my-1 ml-0 mr-1 px-0 collapseBtnSize"
				@click="collapseThis(collapsibleKeys.metricEnums)">
				<fa-icon class="mr-2 ml-2 fa-icon-btn-style" :icon="['fal', 'tag']" />
			</button>
			<button
				v-if="dimensionEnums && metricEnums === null && !noDimensionEnums"
				:data-testid="`show-dimension-enum-${indexOfDimension}`"
				:class="{'btnSelected': collapsible.dimensionEnums}"
				class="btn btn-white border my-1 ml-0 mr-1 px-0 collapseBtnSize"
				@click="collapseThis(collapsibleKeys.dimensionEnums)">
				<fa-icon class="mr-2 ml-2 fa-icon-btn-style" :icon="['fal', 'tag']" />
			</button>
			<button
				v-if="showFormattingButton && !hideFormattingButton"
				variant="white"
				:class="{'btnSelected': collapsible.formats}"
				class="btn btn-white border my-1 ml-0 mr-1 px-0 collapseBtnSize"
				@click="collapseThis(collapsibleKeys.formats)">
				<fa-icon class="mr-2 ml-2 fa-icon-btn-style" :icon="['fal', 'swatchbook']" />
			</button>
			<button
				v-if="timeComparison"
				:class="{'btnSelected': collapsible.timeComparison}"
				class="btn btn-white border my-1 ml-0 mr-1 px-0 collapseBtnSize"
				@click="collapseThis(collapsibleKeys.timeComparison)">
				<fa-icon class="mr-2 ml-2 fa-icon-btn-style" :icon="['fas', 'clock']" />
			</button>
			<button
				v-if="showTopValues"
				:class="{'btnSelected': collapsible.topValues}"
				class="btn btn-white border my-1 ml-0 mr-1 px-0 collapseBtnSize"
				@click="collapseThis(collapsibleKeys.topValues)">
				<fa-icon class="mr-2 ml-2 fa-icon-btn-style" :icon="['fal', 'arrow-to-top']" />
			</button>
		</div>

		<ds-collapse :is-open="collapsible.function" class="w-100 mt-1 mb-0">
			<ds-card v-if="functionSelect && collapseOptions && !customExpressionEnabled" class="shadow-none border-0" body-class="my-2 py-0 px-2">
				<template v-for="(btn, functionName) in functions">
					<button
						v-if="applicableFunctions.includes(functionName)"
						:key="functionName"
						class="btn btn-primary-inverse ml-0 mr-2 mb-1 px-2 py-1 fn-inv-span column-card-background"
						:class="{active: selectedColumn.function === functionName}"
						@click="updateFunction(functionName)">
						{{ btn.caption }}
					</button>
				</template>
				<ds-alert-banner
					v-if="showSumAlert"
					class="mt-1"
					variant="warning"
					:message="$t('t_orderingDefined')" />
			</ds-card>

			<ds-card
				v-if="showBucketing && selectedColumnDatatype && !isSelectedDatatype(dataTypes.TEXT)"
				class="shadow-none border-0 column-card-background"
				body-class="my-2 py-0 px-2">
				<column-select-number
					v-if="isSelectedDatatype(dataTypes.NUMBER)"
					:selected-column="selectedColumn"
					:force-bucketing="isSelectedDatatype(dataTypes.FLOAT)"
					@update="updateBucketing" />

				<column-select-date
					v-if="isSelectedDatatype(dataTypes.DATE_TYPE)"
					v-model:isDateBucketValid="isDateBucketValid"
					v-model:selectedBucketType="selectedBucketType"
					:selected-column="selectedColumn"
					@update="updateBucketing" />
			</ds-card>
		</ds-collapse>

		<ds-collapse v-if="metricEnums" :is-open="collapsible.metricEnums" class="w-100 mt-1 m-0">
			<ds-card v-if="collapseOptions" class="shadow-none border-0" body-class="my-2 py-0 px-2" style="background-color: #F3F6F7;">
				<enums
					:widgetInstanceId="widgetInstanceId"
					headingText="t_MetricEnums"
					:indexOfMetric="indexOfMetric"
					name="enums"
					:metric="metricEnums" />
			</ds-card>
		</ds-collapse>

		<ds-collapse v-if="dimensionEnums && metricEnums === null" :is-open="collapsible.dimensionEnums" class="w-100 mt-1 m-0">
			<ds-card v-if="collapseOptions" class="shadow-none border-0 column-card-background" body-class="my-2 py-0 px-2">
				<enums
					:widgetInstanceId="widgetInstanceId"
					headingText="t_Dimension enums"
					:indexOfDimension="indexOfDimension"
					name="enums"
					:dimensions="dimensionEnums" />
			</ds-card>
		</ds-collapse>

		<ds-collapse
			v-if="dimensionColumn || metricEnums !== null"
			:is-open="collapsible.formats"
			class="w-100 mt-1 m-0">
			<ds-card v-if="collapseOptions" class="shadow-none border-0 column-card-background" body-class="my-2 py-0 px-2">
				<format-select
					:dimensions="dimensionEnums === null ? [metricEnums] : dimensionEnums"
					:widgetInstanceId="widgetInstanceId"
					headingText="t_selectFormat"
					name="format" />
			</ds-card>
		</ds-collapse>

		<ds-collapse
			:is-open="collapsible.timeComparison"
			class="w-100 mt-1 m-0">
			<ds-card v-if="collapseOptions" class="shadow-none border-0 column-card-background" body-class="my-2 py-0 px-2">
				<range-date-picker
					:widgetInstanceId="widgetInstanceId" />
			</ds-card>
		</ds-collapse>

		<ds-collapse
			v-if="showTopValues"
			:is-open="collapsible.topValues"
			class="w-100 mt-1 m-0">
			<ds-card v-if="collapseOptions" class="shadow-none border-0 column-card-background" body-class="my-2 py-0 px-2">
				<div class="d-flex mt-1">
					<span class="options-grey-style">
						{{ $t('onlyTopValues') }}
					</span>
				</div>
				<div class="form-group my-2">
					<div class="btn-group-toggle btn-group bv-no-focus-ring">
						<button
							v-for="(val, index) in [10, 20, 30, 50, 100, null]"
							:key="val === null ? 'all' : val"
							:class="{
								active: (value?.topValues !== null && value?.topValues?.count === val)
									|| (value?.topValues === null && val === null),
								'no-left-border': index !== 0
							}"
							class="btn btn-white m-0 p-0 collapseBtnSize"
							@click="() => updateTopValues(
								val,
								value.topValues ? value.topValues.direction : ordering.ASC
							)">
							{{ val === null ? 'all' : val }}
						</button>
					</div>
					<div class="ml-2 btn-group-toggle btn-group bv-no-focus-ring">
						<button
							v-for="(val, index) in Object.values(ordering)"
							:key="val"
							:class="{
								active: value.topValues && value.topValues.direction === val,
								disabled: !value.topValues,
								'no-left-border': index !== 0
							}"
							class="btn btn-white m-0 p-0 collapseBtnSize"
							@click="updateTopValues(
								value.topValues ? value.topValues.count : 10,
								val
							)">
							<fa-icon :icon="['fal', val === ordering.ASC ? 'long-arrow-up' : 'long-arrow-down']" class="m-0" />
						</button>
					</div>
				</div>
				<ds-collapse :visible="selectedColumn.topValues !== null">
					<column-select
						v-model:value="topValuesMetric"
						:widget-instance-id="widgetInstanceId"
						:function-select="true"
						:filter-datasets-by-column-select="name"
						:hide-formatting-button="true"
						:show-top-values="false"
						@update:value="updateTopValues(
							value.topValues ? value.topValues.count : null,
							value.topValues ? value.topValues.direction : ordering.ASC,
							false,
							$event
						)" />
				</ds-collapse>
			</ds-card>
		</ds-collapse>

		<ds-modal
			:show="showAllValuesModal"
			:headerText="$t('modals.showAllValuesTitle')"
			@cancel="showAllValuesModal = false">
			<template #modal-text>
				{{ $t('modals.showAllValues') }}
			</template>
			<template #modal-footer>
				<ds-btn variant="primary" @click="callForceAll">{{ $t('modals.showAllValuesTitle') }}</ds-btn>
				<ds-btn variant="secondary" @click="showAllValuesModal = false">{{ $t('modals.cancel') }}</ds-btn>
			</template>
		</ds-modal>
	</div>
</template>

<script>
import {
	bucketing,
	columnVisibilityState,
	dataTypes,
	dimensionDefinition,
	isDataType,
	numberTypes,
	ordering
} from '@/util/queryBuilder';
import AppDatatypeBadge from '@/components/design/AppDatatypeBadge.vue';
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import {chartConstants} from '@/util/consts/chartsConstants';
import ColumnSelectDate from '@/components/datatypes/ColumnSelectDate.vue';
import ColumnSelectNumber from '@/components/datatypes/ColumnSelectNumber.vue';
import Enums from '@/modules/widget/components/widget-controls/Enums.vue';
import FormatSelect from '@/modules/widget/components/widget-controls/FormatSelect.vue';
import RangeDatePicker from '@/modules/widget/components/widget-controls/RangeDatePicker.vue';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {aggregations, allowedAggregations, safeAggregation} from '@/util/aggregations';
import {mapActions} from 'vuex';
import AppQueryEditor from '@/components/AppQueryEditor.vue';
import merge from 'lodash/merge';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

const collapsibleKeys = Object.freeze({
	function: 'function',
	options: 'options',
	metricEnums: 'metricEnums',
	dimensionEnums: 'dimensionEnums',
	formats: 'formats',
	timeComparison: 'timeComparison',
	topValues: 'topValues'
});

export default {
	name: 'ColumnSelect',
	components: {
		AppQueryEditor,
		AppDatatypeBadge,
		AppInputBar,
		ColumnSelectDate,
		ColumnSelectNumber,
		Enums,
		FormatSelect,
		RangeDatePicker
	},
	mixins: [widgetControlComponentMixin],
	props: {
		functionSelect: {
			type: Boolean,
			default: false
		},
		metricEnums: {
			type: String,
			default: null
		},
		dimensionEnums: {
			type: Array,
			default: null
		},
		filterDataset: {
			type: String,
			default: null
		},
		value: {
			type: Object,
			default: null
		},
		typeFilter: {
			type: Array,
			default: null
		},
		hideBucketing: {
			type: Boolean,
			default: false
		},
		metricColumn: {
			type: String,
			default: null
		},
		showChooseButtonSection: {
			type: Boolean,
			default: true
		},
		dimensionColumn: {
			type: Boolean,
			default: false
		},
		showDeleteButton: {
			type: Boolean,
			default: false
		},
		showTopValues: {
			type: Boolean,
			default: false
		},
		indexOfMetric: {
			type: Number,
			default: 0
		},
		disableCheck: {
			type: Boolean,
			default: false
		},
		options: {
			type: Array,
			default: null
		},
		automap: {
			type: Boolean,
			default: true
		},
		availableFunctions: {
			type: Array,
			default: null
		},
		timeComparison: {
			type: Boolean,
			default: false
		},
		indexOfDimension: {
			type: Number,
			default: null
		},
		noDimensionEnums: {
			type: Boolean,
			default: false
		},
		noMetricEnums: {
			type: Boolean,
			default: false
		},
		hideFormattingButton: {
			type: Boolean,
			default: false
		},
		hasOrdering: {
			type: Boolean,
			default: false
		},
		showCSum: {
			type: Boolean,
			default: false
		},
		useCustomExpression: {
			type: Boolean,
			default: false
		},
		customExpressionEnabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:value', 'update:customExpressionEnabled', 'deleteColumn'],
	data() {
		return {
			metricCollapseCols: false,
			search: '',
			tempFunction: null,
			dimensionDefinition,
			dataTypes,
			chartConstants,
			numberTypes,
			widgetTypes,
			columnVisibilityState,
			ordering,
			showSumAlert: false,
			applicableFunctions: [],
			functions: aggregations,
			forceAll: false,
			collapse: false,
			collapseOptions: true,
			collapsibleKeys,
			collapsible: {
				function: false,
				metricEnums: false,
				dimensionEnums: false,
				formats: false,
				timeComparison: false,
				topValues: false
			},
			isDateBucketValid: false,
			selectedBucketType: '',
			topValues: null,
			showAllValuesModal: false,
			topValuesMetric: {},
			customExpression: '',
			customColumnName: '',
			collapsibleDatasets: {}
		};
	},
	computed: {
		configuration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		datasets() {
			return this.$store.getters['storyDetail/story']?.datasets ?? [];
		},
		catalogItems() {
			return this.$store.getters['storyDetail/catalogItems'] ?? [];
		},
		selectedMetric() {
			if (widgetTypes.MULTISERIES_CHARTS.includes(this.widgetType)
				|| this.widgetType === widgetTypes.SPARKLINE_PIE) {
				const metric = cloneDeep(this.configuration.data?.configuration?.metrics[0]);
				metric.dataset = this.configuration.data?.catalogItemId ?? this.configuration.data?.datasetId;
				return metric;
			}
			return null;
		},
		datasetsFiltered() {
			const datasetFilter = this.datasets.filter((dataset) => (
				(this.filterDataset === null || (dataset.id === this.filterDataset))
				&& dataset.columns.some((column) => column.name.toLowerCase().includes(this.search.toLowerCase()))
			));
			const catalogFilter = this.catalogItems.filter((catalog) => (
				(this.filterDataset === null || (catalog.id === this.filterDataset))
				&& catalog.attributes.some((column) => column.name.toLowerCase().includes(this.search.toLowerCase()))
			));
			return datasetFilter.concat(catalogFilter);
		},
		columnsFiltered() {
			const columns = {};
			let tempCols = [];
			this.datasetsFiltered.forEach((dataset) => {
				// If dataset use columns if catalog item use attributes
				tempCols = dataset?.columns ?? dataset.attributes;
				columns[dataset.id] = tempCols.filter((column) => {
					if (this.typeFilter && this.typeFilter.length > 0) {
						return this.typeFilter.includes(column.dataType) && column.displayName.toLowerCase().includes(this.search.toLowerCase());
					}
					return column.displayName.toLowerCase().includes(this.search.toLowerCase());
				});
			});
			return columns;
		},
		selectedColumn() {
			const column = this.value;
			const columnFromDataset = this.columnsFiltered[column.dataset]?.find((tmpColumn) => tmpColumn.name === column.column);
			return merge(
				{
					dataset: null,
					column: null,
					displayName: columnFromDataset?.displayName ?? null,
					function: null,
					datatype: column && column.dataset && column.column
						? (columnFromDataset?.dataType ?? null)
						: null,
					pickFunction: null,
					pickLimit: null
				},
				column
			);
		},
		selectedColumnDatatype() {
			return this.selectedColumn.datatype ?? '';
		},
		selectedColumnDimension() {
			if (this.dimensionEnums !== null || this.metricEnums !== null) {
				if (this.metricEnums === null && !this.dimensionEnums.includes('dimension1')) {
					return true;
				} else if (this.metricEnums !== null) {
					return true;
				}
			}
			return false;
		},
		selectedColumnLegend() {
			if (this.dimensionEnums !== null) {
				if (this.metricEnums === null && this.dimensionEnums.includes('dimension1')) {
					return true;
				}
			}
			return false;
		},
		showBucketing() {
			return !this.functionSelect && !this.hideBucketing;
		},
		metric() {
			if (this.metricColumn !== null) {
				const metric = this.configuration?.data?.configuration.metrics;
				if (metric) {
					return Array.isArray(metric) ? metric : [metric];
				}
			}
			return null;
		},
		bucketingText() {
			return this.translateBucketingTypeText(this.selectedColumn?.function);
		},
		isExtract() {
			return this.selectedColumn?.function === dimensionDefinition.EXTRACT_DATE
				|| (!this.isDateBucketValid && this.selectedBucketType === dimensionDefinition.EXTRACT_DATE);
		},
		isMultiSeries() {
			return this.dimensionEnums?.includes('metric') ?? false;
		},
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
		},
		isFormulaFormatted() {
			if (this.widgetType === widgetTypes.MULTISERIES_FORMULA) {
				return true;
			} else if (this.widgetType === widgetTypes.TEXT_FORMULA) {
				return false;
			}
			return false;
		},
		canFormatTable() {
			const tableColumns = this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'columns');
			let intCount = 0;
			let dateCount = 0;
			if (tableColumns && this.widgetType === widgetTypes.DATA_TABLE) {
				tableColumns.forEach((col) => {
					if (isDataType(dataTypes.NUMBER, col.datatype)) {
						intCount += 1;
					} else if (isDataType(dataTypes.DATE_TYPE, col.datatype)) {
						dateCount += 1;
					}
				});
				if ((dateCount === 1 && intCount === 0) || (dateCount === 0 && intCount === 1)) {
					return true;
				}
			}
			return false;
		},
		isFormula() {
			return this.widgetType === widgetTypes.MULTISERIES_FORMULA;
		},
		isDisabledChart() {
			return this.widgetType === widgetTypes.PIE_CHART
				|| this.widgetType === widgetTypes.DOUGHNUT_CHART
				|| this.widgetType === widgetTypes.COMPARISON_CHART
				|| this.widgetType === widgetTypes.TEXT_FORMULA
				|| this.widgetType === widgetTypes.NOTIFICATION_FORMULA;
		},

		/*
		 Show formatting button condition: the first line is a general case when we want to display formatting button for relevant data types,
		 the second one handles formulas formatting, the third one data tables and the last line handles basic line chart
		*/
		// eslint-disable-next-line complexity
		showFormattingButton() {
			if ((this.selectedColumn.function === dimensionDefinition.BUCKET_VALUE && (this.name === chartConstants.dataConfiguration.DIMENSION0
				|| this.name === chartConstants.dataConfiguration.DIMENSION1) && this.isSelectedDatatype(dataTypes.NUMBER))) {
				return false;
			}
			return ((this.dimensionColumn && (this.selectedColumnDimension || this.selectedColumnLegend || this.noDimensionEnums)
				&& (!this.isSelectedDatatype(dataTypes.TEXT) || isDataType(dataTypes.DATE_TYPE, this.selectedColumnDatatype))
				&& !this.isExtract && this.widgetType !== widgetTypes.DATA_TABLE && this.widgetType !== widgetTypes.LINE_CHART)
				|| (this.metricEnums !== null && this.isFormulaFormatted)
				|| (this.metricEnums !== null && this.indexOfMetric !== null)
				|| (this.dimensionColumn && this.selectedColumnDimension && this.canFormatTable && !this.isSelectedDatatype(dataTypes.TEXT))
				|| (((!this.isExtract && !this.isSelectedDatatype(dataTypes.NUMBER)) && !this.isSelectedDatatype(dataTypes.TEXT))
					|| ((this.isSelectedDatatype(dataTypes.NUMBER) && this.metricEnums !== null) && (this.widgetType === widgetTypes.LINE_CHART
						|| this.widgetType === widgetTypes.BAR_CHART)))) && (widgetTypes.MAPS.includes(this.widgetType) === false);
		},
		haveFunction() {
			return this.selectedColumn.function && this.functions[this.selectedColumn.function];
		},
		storyCatalogItemIds() {
			return this.$store.getters['storyDetail/story']?.catalogItems ?? [];
		}
	},
	watch: {
		value: {
			immediate: true,
			handler(column) {
				if (column?.topValues?.metric) {
					this.topValuesMetric = {
						column: column?.topValues?.metric?.column,
						function: column?.topValues?.metric?.aggregation,
						dataset: column?.dataset
					};
				} else if (this.topValuesMetric === null || isEmpty(this.topValuesMetric)) {
					this.topValuesMetric = {
						column: this.selectedMetric?.column,
						function: this.selectedMetric?.aggregation,
						dataset: this.selectedMetric?.dataset
					};
				}
				if (this.selectedMetric !== null && typeof column.topValues === 'undefined') {
					if (this.forceAll) {
						this.forceAll = false;
					} else {
						this.topValues = {
							direction: ordering.ASC,
							count: 10,
							metric: {
								column: this.selectedMetric.column,
								aggregation: this.selectedMetric.aggregation
							}
						};
					}
				}
				if (this.customExpressionEnabled) {
					this.customExpression = column.customExpression ?? '';
					this.customColumnName = column.customColumnName;
				}
			}
		},
		hasOrdering: {
			immediate: true,
			handler(val) {
				const isCSum = this.tempFunction === aggregations['C-SUM'].caption
					|| this.haveFunction?.caption === aggregations['C-SUM'].caption;
				if (val && isCSum) {
					this.showSumAlert = false;
					this.updateFunction(aggregations['C-SUM'].caption);
					this.tempFunction = null;
				} else if (isCSum && !val) {
					this.showSumAlert = true;
				}
			}
		},
		selectedColumn: {
			immediate: true,
			handler(data) {
				this.applicableFunctions = allowedAggregations(data?.datatype, this.showCSum);
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
		...mapActions('widgetInstances', ['setOption']),
		translateBucketingTypeText(source) {
			return (source === dimensionDefinition.EXTRACT_DATE
				? this.$t('t_Extract')
				: this.$t('t_Bucket')
			).toUpperCase();
		},
		deleteColumn() {
			this.$emit('deleteColumn');
		},
		collapseThis(collapseKey) {
			Object.keys(this.collapsible).forEach((key) => {
				this.collapsible[key] = collapseKey === key ? !this.collapsible[key] : false;
			});
		},
		updateTopValues(count, direction, force = false, event = null) {
			this.topValues = count === null
				? null
				: {
					count,
					direction,
					metric: event && event.column
						? {
							column: event.column,
							aggregation: event.function ? event.function : this.functions.COUNT.caption
						}
						: this.topValues === null ? null : this.topValues.metric
				};

			if (this?.topValues?.metric === null && this?.value?.topValues?.metric) {
				this.topValues.metric = this.value.topValues.metric;
			}

			if (!isEqual(this.topValues, this.value?.topValues)) {
				if (this.topValues === null && !force) {
					this.showAllValuesModal = true;
				} else {
					this.showAllValuesModal = false;
					this.updateColumn(
						this.value.dataset,
						this.value.column,
						this.selectedColumnDatatype,
						null
					);
				}
			}
		},
		callForceAll() {
			this.forceAll = true;
			this.updateTopValues(null, null, true);
		},
		// eslint-disable-next-line max-params,no-unused-vars
		updateColumn(dataset, column, datatype, bucketingValue, pickFunction, pickLimit, displayName) {
			const value = {
				dataset,
				datatype,
				column,
				displayName,
				function: this.value?.function,
				customExpressionEnabled: this.customExpressionEnabled,
				...(this.customExpressionEnabled && this.customExpression.length ? {customExpression: this.customExpression} : {})
			};

			if (this.showBucketing && bucketingValue) {
				merge(value, bucketingValue);
			}

			if (!this.functionSelect && (value.datatype === dataTypes.TEXT && value.function !== dimensionDefinition.NO_CHANGE)) {
				value.function = dimensionDefinition.NO_CHANGE;
			}

			if (isDataType(dataTypes.DATE_TYPE, value.datatype) && this.dimensionColumn) {
				if (!value.function || value.function === dimensionDefinition.NO_CHANGE) {
					value.function = dimensionDefinition.BUCKET_DATE;
				}
				if (!value.bucketsDatetime) {
					value.bucketsDatetime = bucketing.DAYS;
				}
			}

			if (this.showTopValues) {
				value.topValues = this.topValues;
			}

			if (this.functionSelect) {
				this.applicableFunctions = allowedAggregations(value.datatype);

				if (value.datatype !== this.selectedColumn.datatype) {
					const [fallbackFunction] = this.applicableFunctions;
					value.function = fallbackFunction;
				}
				if (!this.applicableFunctions.includes(value.function)) {
					value.function = safeAggregation;
				}
			}

			this.$emit('update:value', value);
		},
		updateFunction(functionName) {
			this.tempFunction = functionName;
			const isCumSum = functionName === aggregations['C-SUM'].caption;
			let saveFunctionName = functionName;
			if (this.hasOrdering === false && isCumSum) {
				this.showSumAlert = true;
			} else if (!isCumSum || (this.hasOrdering === true && isCumSum)) {
				if (this.showSumAlert && isCumSum) {
					saveFunctionName = aggregations['C-SUM'].caption;
				}
				this.showSumAlert = false;
				this.$emit('update:value', {
					dataset: this.selectedColumn.dataset,
					column: this.selectedColumn.column,
					function: saveFunctionName,
					databaseType: this.selectedColumn.databaseType,
					displayName: this.selectedColumn.displayName
				});
			}
		},
		updateBucketing(value) {
			this.updateColumn(this.selectedColumn.dataset, this.selectedColumn.column, this.selectedColumnDatatype, value);
		},
		updateMetric(value, index) {
			if (this.customExpressionEnabled) {
				this.$emit('update:value', {
					type: 'metric',
					dataset: this.datasetsFiltered[0].id,
					name: 'custom-metric',
					column: this.customColumnName,
					customExpressionEnabled: true,
					customExpression: this.customExpression,
					customColumnName: this.customColumnName
				});
			} else {
				this.$emit('update:value', {
					type: 'metric',
					dataset: value.dataset,
					column: value.column,
					function: value.function,
					name: `Metric${index + 1}`,
					databaseType: value.databaseType,
					displayName: value.displayName
				});
			}
		},
		isSelectedDatatype(type) {
			return isDataType(type, this.selectedColumnDatatype);
		},
		updateSelectedTopN(count) {
			this.updateTopValues(
				count,
				this.value.topValues ? this.value.topValues.direction : ordering.ASC
			);
		}
	}
};
</script>

<style scoped>
.cardBorderBottom {
	border: 1px solid #CFD8DD;
	border-top: none;
	border-radius: 0 0 4px 4px;
}

.cardBorderMiddle {
	border: 1px solid #CFD8DD;
	border-top: none;
	border-radius: 0;
}
.column-card-background {
	background-color: #F3F6F7;
}
.fn-span {
	width: 5.5rem;
	background-color: #F7F8FA;
}

.fn-inv-span {
	width: 5.5rem;
	background-color: #D9E7FC;
}

.column-select-left {
	border-right-width: 1px;
	border-radius: .25rem 0 0 .25rem;
}

.column-select-right {
	border-radius: 0 0 0 0;
}

.disabled {
	cursor: not-allowed;
}

.btn-group {
	height: 36px;
}

.algLeft {
	text-align: left;
}

.btnSelected > .svg-inline--fa,
.btnSelected {
	color: #6B6E74 !important;
	fill: #6B6E74 !important;
	border-color: #CFD8DD !important;
	background-color: #F3F6F7 !important;
}

.collapsed > .when-open,
.not-collapsed > .when-closed {
	display: none;
}

.a, .b {
	fill: #6B6E74 !important;
}

.noBorder {
	border: 0 none !important;
	border-radius: 0;
	padding-left: 32px;
}
.btn-white.active {
	background-color: #F3F6F7 !important;
}
.btn-outline-warning:hover {
	color: white;
}
.dataset-name {
	text-overflow: ellipsis;
	overflow: hidden;
	word-wrap: normal;
}
</style>
<style>
.btnSelected > .svg-inline--fa,
.btnSelected {
	color: #1357E9 !important;
	fill: #1357E9 !important;
	border-color: #1357E9 !important;
	background-color: white !important;
}
</style>
