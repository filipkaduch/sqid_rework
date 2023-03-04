<template>
	<!--TODO: add styles to classes-->
	<div
		class="mx-0 mb-0 mt-4 p-0 col-12"
		style="border-radius: 5px; box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15); background-color: white">
		<div class="mx-2">
			<button
				data-testid="show-data"
				class="btn btn-clean w-100 m-0 p-0 bg-white"
				style="border-radius: 5px;"
				@click="toggleCollapse">
				<span class="d-flex justify-content-between align-items-center">
					<span class="d-inline-flex align-items-center p-3" style="color: #2D3038; font-size: 17px; font-weight: bold;">
						<span
							style="border-radius: 50%;
								background-color: #D3E0FC;
								height: 35px;
								width: 35px;
								padding: 8px;
								justify-content: center;
								display: inline-flex;
								margin-right: 5px">
							<ds-icon
								class="inline-svg mt-0"
								fill="#1357e9"
								name="icon-datasets-blue"
								alt="icon" />
						</span>
						{{ $t('t_Data') }}
					</span>
					<span class="text-black">
						<fa-icon :icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']" class="m-2 mr-3" />
					</span>
				</span>
			</button>

			<ds-collapse :is-open="collapse" class="w-100 mt-1 pb-2 pl-3 pr-3 bg-white">
				<template v-if="widgetTypeMetadata.dimensions">
					<ds-col v-if="widgetTypeMetadata.mapType" cols="12" class="mx-0 mb-0 mt-2 p-0">
						<template v-for="(dimension, index) in dimensions" :key="`Dimension-${index}LatLon`">
							<column-select
								v-model:value="dimensions[index][0]"
								class="mb-0 mt-2"
								:widget-instance-id="widgetInstanceId"
								:hide-bucketing="widgetTypeMetadata.dimensions.hideBucketing ?? false"
								heading-text="t_Latitude"
								:name="`dimension${index}Lat`"
								:dimension-enums="null"
								@update:value="updateHandler" />
							<column-select
								v-model:value="dimensions[index][1]"
								class="mb-0 mt-2"
								:widget-instance-id="widgetInstanceId"
								:hide-bucketing="widgetTypeMetadata.dimensions.hideBucketing ?? false"
								heading-text="t_Longitude"
								:name="`dimension${index}Lon`"
								:dimension-enums="null"
								@update:value="updateHandler" />
						</template>
					</ds-col>
					<ds-col v-else cols="12" class="mx-0 mb-0 mt-2 p-0">
						<column-select
							v-for="(dimension, index) in dimensions"
							:key="`Dimension-${index}`"
							v-model:value="dimensions[index]"
							:type-filter="['INT', 'LONG', 'FLOAT', 'DATETIME', 'DATE', 'TEXT', 'BOOL']"
							class="mb-0 mt-2"
							:index-of-dimension="index"
							:widget-instance-id="widgetInstanceId"
							:hide-bucketing="widgetTypeMetadata.dimensions.hideBucketing ?? false"
							:noDimensionEnums="widgetTypeMetadata.dimensions.noDimensionEnums ?? false"
							:heading-text="getHeadingText(index)"
							:name="`dimension${index}`"
							:showTopValues="(widgetTypeMetadata?.dimensions?.showTopValues
								&& chartConstants.dataConfiguration.DIMENSION1 === `dimension${index}`
								&& widgetType !== widgetTypes.SPARKLINE_PIE)
								|| (widgetTypeMetadata?.dimensions?.showTopValues
									&& widgetType === widgetTypes.SPARKLINE_PIE
									&& chartConstants.dataConfiguration.DIMENSION0 === `dimension${index}`)
								&& dimensions.length > 1"
							:dimension-enums="[`dimension${index}`]"
							:showDeleteButton="(widgetTypeMetadata.dimensions?.min > 0 || !canAddDimension) && !hasOnlySecondDim"
							:disableCheck="dimensions.length === 1"
							:options="[`dimension${index}`, 'metric0']"
							dimension-column
							@update:value="updateHandler"
							@delete-column="deleteColumn(index, 'dimension')" />
					</ds-col>
					<button
						v-if="widgetTypeMetadata.dimensions?.min > 0
							|| (canAddDimension && widgetConfiguration?.data?.configuration?.metrics.length === 1)"
						class="btn btn-add-section border m-0 bg-white"
						style="color: #2D3038;"
						@click="addColumn('dimension')">
						<fa-icon :icon="['fas', 'plus']" style="color:#AAABAE;" />
						{{ $t('t_Category') }}
					</button>
				</template>

				<ds-col v-if="widgetTypeMetadata.metrics" cols="12" class="mx-0 mb-0 mt-2 p-0">
					<column-select
						v-for="(metric, index) in metrics"
						:key="`Metric-${index}`"
						v-model:custom-expression-enabled="metrics[index].customExpressionEnabled"
						v-model:value="metrics[index]"
						class="mb-4"
						:widget-instance-id="widgetInstanceId"
						filter-datasets-by-column-select="dimension0"
						:filter-dataset="datasetByDimension"
						function-select
						:show-c-sum="widgetTypeMetadata.metrics.cSum ?? false"
						:has-ordering="orderBy.length !== 0 && orderBy[0]?.columnAlias !== ''"
						:noMetricEnums="widgetTypeMetadata.metrics.noMetricEnums ?? false"
						:metric-enums="'metric'"
						:hide-bucketing="widgetTypeMetadata.metrics.hideBucketing ?? false"
						:showDeleteButton="widgetTypeMetadata.metrics?.min > 0 || canAddMetric"
						:disableCheck="metrics.length === 1"
						:heading-text="widgetTypeMetadata.metrics?.min > 0 && index === 0 ? 't_MetricMultiple' : (widgetTypeMetadata.metrics?.count ? 't_Metric' : '')"
						:name="`metric${index}`"
						:index-of-metric="index"
						:use-custom-expression="true"
						@update:value="updateHandler"
						@delete-column="deleteColumn(index, 'metric')" />
					<button
						v-if="widgetTypeMetadata.metrics?.min > 0 || canAddMetric"
						class="btn btn-add-section border m-0 bg-white"
						style="color: #2D3038;"
						@click="addColumn('metric')">
						<fa-icon :icon="['fas', 'plus']" style="color:#AAABAE;" />
						{{ $t('t_Metric') }}
					</button>
				</ds-col>

				<ds-col v-if="widgetTypeMetadata.showDate" cols="12" class="mx-0 mb-0 mt-2 p-0">
					<column-select
						v-model:value="date"
						:automap="false"
						disable-check
						filter-datasets-by-column-select="dimension0"
						:function-select="false"
						heading-text="t_Date"
						:hide-bucketing="false"
						class="mb-0 mt-2"
						:show-choose-button-section="false"
						:widget-instance-id="widgetInstanceId"
						:type-filter="[]"
						@update:value="updateHandler" />
				</ds-col>

				<ds-col v-if="!widgetTypeMetadata.hideOrdering" cols="12" class="mx-0 mb-0 mt-2 p-0">
					<ordering
						v-model:value="orderBy"
						:widget-instance-id="widgetInstanceId"
						heading-text="t_Ordering"
						name="ordering"
						filter-datasets-by-column-select="dimension0"
						@update:value="updateHandler" />
				</ds-col>

				<ds-col v-if="widgetTypeMetadata && (widgetTypeMetadata.limit || widgetTypeMetadata.buckets)" cols="12" class="mx-0 mb-0 mt-2 p-0">
					<slider
						v-if="widgetTypeMetadata && widgetTypeMetadata.limit && !histograms.includes(widgetType)"
						v-model:value="limit"
						:widget-instance-id="widgetInstanceId"
						heading-text="t_LimitSlider"
						:min-value="widgetTypeMetadata?.limit?.minValue ?? 1"
						:max-value="widgetTypeMetadata?.limit?.maxValue ?? 100"
						@update:value="updateHandler" />
					<slider
						v-if="widgetTypeMetadata && widgetTypeMetadata.buckets && histograms.includes(widgetType)"
						v-model:value="dimensions[0].numberOfBuckets"
						:widget-instance-id="widgetInstanceId"
						heading-text="t_BucketSlider"
						:min-value="widgetTypeMetadata?.buckets?.minValue ?? 1"
						:max-value="widgetTypeMetadata?.buckets?.maxValue ?? 30"
						@update:value="updateHandler" />
				</ds-col>

				<ds-col v-if="!widgetTypeMetadata.hideLastValueColumn" cols="12" class="mx-0 mb-0 mt-2 p-0">
					<column-select-with-switch
						v-model:value="lastValueColumn"
						:widget-instance-id="widgetInstanceId"
						name="lastValueColumn"
						:heading-icon="['fal', 'list']"
						heading-text="t_ExtractLastValueTitle"
						switch-text="t_ExtractLastValue"
						filter-datasets-by-column-select="dimension0"
						@update:value="updateHandler" />
				</ds-col>

				<ds-col v-if="!dataPreviewBlacklist[widgetType]" class="mx-0 px-0">
					<button class="btn btn-white mx-0 btn-block" @click="showDataGridModal = true">
						{{ $t('t_DataPreviewRows', {rows: rows(widgetInstanceId)}) }}
					</button>
				</ds-col>
			</ds-collapse>
		</div>
		<app-data-grid-modal
			v-if="!dataPreviewBlacklist[widgetType]"
			:show-modal="showDataGridModal"
			:widget-instance-id="widgetInstanceId"
			@close-modal="showDataGridModal = false" />
	</div>
</template>

<script>
import {getColumn, getMetric} from '@/util/widgetDataUtil';
import {mapDimensionAxes, mapLonLatAxes, mapMetricAxes} from '@/util/widgetDataBinding';
import ColumnSelect from '@/modules/widget/components/widget-controls/ColumnSelect.vue';
import ColumnSelectWithSwitch from '@/modules/widget/components/widget-controls/ColumnSelectWithSwitch.vue';
import Ordering from '@/modules/widget/components/widget-controls/Ordering.vue';
import Slider from '@/modules/widget/components/widget-controls/Slider.vue';
import {chartConstants} from '@/util/consts/chartsConstants';
import dataPreviewBlacklist from '@/util/consts/dataPreviewBlacklist';
import {dimensionDefinition} from '@/util/queryBuilder';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import {widgetTypes} from '@/util/consts/widgetTypes';
import isEmpty from 'lodash/isEmpty';
import AppDataGridModal from '@/modules/story/components/editor/AppDataGridModal.vue';

export default {
	name: 'AppDataSectionControls',
	components: {
		ColumnSelectWithSwitch,
		Ordering,
		ColumnSelect,
		Slider,
		AppDataGridModal
	},
	mixins: [widgetControlComponentMixin],
	data() {
		return {
			chartConstants,
			dataPreviewBlacklist,
			collapse: false,
			dimensions: null,
			metrics: null,
			orderBy: null,
			limit: null,
			buckets: null,
			lastValueColumn: false,
			date: null,
			timeline: null,
			version: null,
			widgetTypes,
			histograms: [
				widgetTypes.HISTOGRAM,
				widgetTypes.HISTOGRAM_SELECTION
			],
			showDataGridModal: false
		};
	},
	computed: {
		widgetTypeMetadata() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType)?.configuration?.data;
		},
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
		},
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		dataConfiguration() {
			return this.widgetConfiguration?.data?.configuration ?? {};
		},
		catalogItems() {
			return this.$store.getters['storyDetail/catalogItems'] ?? [];
		},
		datasetId() {
			// TODO: to func make more readable
			return this.dimensions && this.dimensions.length > 0
				? (Array.isArray(this.dimensions[0]) ? this.dimensions[0][0].dataset : this.dimensions[0].dataset)
				: (this.metrics ? this.metrics[0].dataset : null);
		},
		datasetByDimension() {
			return (this.dimensions && this.dimensions.length > 0) || widgetTypes.FORMULA_WIDGETS.includes(this.widgetType) ? this.datasetId : null;
		},
		areDimensionsValid() {
			return !this.dimensions || (this.dimensions && this.dimensions.every((dimension) => Array.isArray(dimension)
				? dimension.every((mapDimension) => this.isColumnValid(mapDimension))
				: this.isColumnValid(dimension)));
		},
		areMetricsValid() {
			return this.metrics && this.metrics.every((metric) => this.isColumnValid(metric));
		},
		isLastValueColumnValid() {
			return this.widgetTypeMetadata.hideLastValueColumn || (this.lastValueColumn === false || (this.isColumnValid(this.lastValueColumn)));
		},
		canAddMetric() {
			if (this.showMultiColumns) {
				return this.widgetConfiguration?.data?.configuration?.dimensions.length === 1;
			}
			return false;
		},
		canAddDimension() {
			if (this.showMultiColumns) {
				return this.widgetConfiguration?.data?.configuration?.metrics.length === 1
					&& this.widgetConfiguration?.data?.configuration?.dimensions.length < (this.widgetTypeMetadata.dimensions.max ?? 2);
			}
			return false;
		},
		hasOnlySecondDim() {
			return [widgetTypes.LINE_MULTISERIES, widgetTypes.BAR_MULTISERIES].includes(this.widgetType);
		},
		showMultiColumns() {
			return widgetTypes.SPARKLINE_PIE === this.widgetType
				|| widgetTypes.SPIDER_CHART === this.widgetType
				|| widgetTypes.BUBBLE_CHART === this.widgetType;
		}
	},
	watch: {
		dataConfiguration: {
			handler() {
				if (this.dataConfiguration.dimensions) {
					this.dimensions = this.dataConfiguration.dimensions.map((dimension, index) => {
						if (this.widgetTypeMetadata.mapType) {
							return [
								{
									dataset: this.widgetConfiguration.data.datasetId,
									column: this.widgetConfiguration.data.configuration?.dimensions[index].latitudeColumnName
								},
								{
									dataset: this.widgetConfiguration.data.datasetId,
									column: this.widgetConfiguration.data.configuration?.dimensions[index].longitudeColumnName
								}
							];
						}
						return getColumn(this.widgetConfiguration, index);
					});
				} else {
					this.dimensions = null;
				}

				if (this.dataConfiguration.metrics) {
					this.metrics = this.dataConfiguration.metrics.map((metrics, index) => getMetric(this.widgetConfiguration, index));
				}

				if (isEmpty(this.dataConfiguration) && this.widgetTypeMetadata?.default) {
					this.metrics = [];
				}
				this.orderBy = this.dataConfiguration.orderBy ?? [];
				this.timeline = this.dataConfiguration.timeline;
				this.limit = this.dataConfiguration.limit;
				this.date = this.dataConfiguration.date;

				this.lastValueColumn = this.dataConfiguration.lastValueColumn === null ? false : this.dataConfiguration.lastValueColumn;
				this.version = this.dataConfiguration.version;
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		toggleCollapse() {
			this.collapse = !this.collapse;
		},
		rows(id) {
			return this.$store.getters['widgetData/rawData'](id)?.rows.length || 0;
		},
		addColumn(type) {
			switch (type) {
				case 'dimension':
					this.dimensions.push({
						name: `dimension${this.dimensions.length + 1}`,
						widgetInstanceId: this.widgetInstanceId,
						function: dimensionDefinition.NO_CHANGE,
						filterDatasetsByColumnSelect: 'dimension0',
						dataset: null,
						column: null,
						datatype: null,
						pickFunction: null,
						pickLimit: null
					});
					break;
				case 'metric':
					this.metrics.push({
						name: 'metric',
						widgetInstanceId: this.widgetInstanceId,
						filterDatasetsByColumnSelect: 'dimension0',
						functionSelect: true,
						customExpressionEnabled: false
					});
			}
		},
		deleteColumn(index, type) {
			switch (type) {
				case 'dimension':
					this.dimensions.splice(index, 1);
					break;
				case 'metric':
					this.metrics.splice(index, 1);
			}
			this.updateHandler();
		},
		// eslint-disable-next-line complexity
		updateHandler() {
			// TODO: refactor!!!!
			if ((this.areDimensionsValid
				&& this.areMetricsValid
				&& (this.limit !== null)
				&& (this.orderBy && this.orderBy.every((item) => item.columnAlias !== null))
				&& this.isLastValueColumnValid
			) || this.histograms.includes(this.widgetType)
			) {
				this.saveConfiguration();
			}
		},
		isColumnValid(column) {
			return column && ((column.dataset && column.column) || (column.customExpression && column.customExpressionEnabled));
		},
		saveConfiguration() {
			const catalog = this.catalogItems.find((catalogItem) => catalogItem.id === this.datasetByDimension);
			this.$store.dispatch('widgetInstances/setConfiguration', {
				widgetInstanceId: this.widgetInstanceId,
				configuration: {
					data: {
						configuration: {
							...(this.widgetTypeMetadata.dimensions
								? {
									dimensions: this.dimensions.map((dimension, index) => ({
										// eslint-disable-next-line no-negated-condition
										...(dimension.topValues === null
											? dimension
											: this.dataConfiguration?.dimensions[index]),
										...(Array.isArray(dimension) ? mapLonLatAxes(dimension[1], dimension[0]) : mapDimensionAxes(dimension))
									}))
								}
								: {}),
							metrics: this.metrics.map((metric) => mapMetricAxes(metric)),
							limit: this.histograms.includes(this.widgetType) ? 10000 : this.limit,
							...(this.widgetTypeMetadata.hideOrdering ? {} : {orderBy: this.orderBy}),
							...(this.widgetTypeMetadata.hideLastValueColumn ? {} : {lastValueColumn: this.lastValueColumn === false ? null : this.lastValueColumn}),
							...(this.widgetTypeMetadata.showDate ? {date: this.date} : {}),
							timeline: this.timeline,
							version: this.version
						},
						...(catalog ? {catalogItemId: this.datasetId} : {datasetId: this.datasetId}),
						id: this.widgetConfiguration.data.id
					}
				}
			});
		},
		getHeadingText(index) {
			if (index === 0) {
				return 't_Categories';
			} else if (this.widgetType === widgetTypes.BUBBLE_CHART && index === 2) {
				return 't_TypesCategories';
			}
			return 't_Subcategories';
		}
	}
};
</script>

<style scoped>

</style>
