<template>
	<div class="h-100 overflow-auto">
		<ds-row class="h-100 d-flex" no-gutter @scroll="handleScroll">
			<ds-col
				class="position-relative"
				:class="{'h-100': !metricAttributes.length || draggedAttribute}"
				cols="6">
				<ds-box
					v-if="metricAttributes.length"
					border="disabled"
					class="drop-zone sticky-top ds-bg-interaction-0 border-top-radius"
					style="border-top-right-radius: 0"
					:class="{'border-bottom-0': draggingState.metricAllowed && draggedAttribute}"
					padding="M">
					<ds-text color="display-content-600" variant="subheadline">{{ $t('explorer.dropZone.metrics') }}</ds-text>
				</ds-box>
				<div v-else class="empty-text text-center" :style="{'margin-top': scrollPosition + 'px'}">
					<ds-box padding-bottom="S">
						<ds-text :color="draggingState.metricAllowed ? 'white' : 'display-content-800'" variant="subheadlineMedium">{{ $t('explorer.dropZone.metric') }}</ds-text>
						<ds-text :color="draggingState.metricAllowed ? 'white' : 'separate-content-300'" variant="caption">{{ $t('explorer.dropZone.recommendedAttributeTypes') }}</ds-text>
					</ds-box>
					<ds-inline align="center">
						<ds-icon class="icon-large" :fill="draggingState.metricAllowed ? 'white' : 'separate-content-200'" name="icon-number-datatype" />
						<ds-box padding-left="M">
							<ds-icon class="icon-large" :fill="draggingState.metricAllowed ? 'white' : 'separate-content-200'" name="icon-text-datatype" />
						</ds-box>
					</ds-inline>
				</div>
				<template v-if="draggedAttribute && draggingState.metricAllowed && metricAttributes.length">
					<div class="position-absolute highlight-border highlight-left" :style="{top: (61 + scrollPosition) + 'px'}" />
					<div class="position-absolute highlight-border highlight-right" :style="{top: (61 + scrollPosition) + 'px'}" />
					<div class="position-absolute highlight-border w-100" :style="{top: (61 + scrollPosition) + 'px'}" />
					<div class="position-absolute highlight-border w-100" :style="{bottom: scrollPosition + 'px'}" />
				</template>
				<ds-box border-left="disabled">
					<draggable
						id="metric-table"
						v-model="metricAttributes"
						class="w-100 d-flex drop-zone-table"
						:class="[
							isMetricZoneDisabled ? 'drop-zone-disabled' : '',
							!metricAttributes.length ? 'drop-zone-empty  border-left-radius position-absolute ' + metricZoneBg : ''
						]"
						:style="{top: scrollPosition + 'px'}"
						:disabled="isMetricZoneDisabled"
						animation="200"
						group="attributes"
						direction="horizontal"
						ghost-class="dropzone-dragging"
						item-key="name"
						@change="handle($event, chartConstants.dataConfiguration.METRIC)">
						<template #item="{element, index}">
							<ds-inline-item class="w-100" flex-grow="1">
								<drop-zone-column
									:attribute="element"
									:index="index"
									@aggregation="selectedAggregation($event, element, index)"
									@formatting="selectedFormat(element, $event)"
									@ordering="updateOrdering($event)"
									@remove="removeAttribute(index, chartConstants.dataConfiguration.METRIC, element.displayName)"
									@rename-metric="renameMetricAction(index)">
									<template #displayName>
										<ds-text
											:id="`displayNameMetrics${index}`"
											:key="`displayNameMetrics${reloadMetricKey}`"
											variant="bodyMedium"
											is-editable
											:contenteditable="metricNameFocused"
											:font-style="getEntryData(element, element.displayName).fontStyle"
											:tooltip="getEntryData(element, element.displayName).tooltip"
											@keydown.enter.prevent="changeMetricName($event, index)"
											@blur="changeMetricName($event, index)"
											@focusout="changeMetricName($event, index)">
											{{ getEntryData(element, element.displayName).textToDisplay }}
										</ds-text>
									</template>
									<template #header>
										<ds-box v-if="element.aggregations && element.aggregations.length > 0" class="selected-data__header">
											<ds-box padding-right="S">
												<ds-select
													:items="formatAggregations(element.aggregations, element.aggregation)"
													:groups="[$t('explorer.dropZone.aggregation')]"
													checker
													max-width
													:clear-btn="false"
													placement="bottom-end"
													@input="selectedAggregation($event, element, index)">
													<template #triggerContent>
														<ds-tooltip>
															<template #icon>
																<ds-box align-y="center" border-radius="basic" class="cursor-pointer" flex-type="row">
																	<ds-box
																		border="separate"
																		border-radius="basic"
																		class="cursor-pointer ds-bg-separate-content-0"
																		flex-type="row"
																		padding-x="S">
																		<ds-text class="pl-1" color="display-content-700" variant="body">
																			{{ element.aggregation }}
																		</ds-text>
																		<ds-icon name="ds-icon-chevron-down" />
																	</ds-box>
																</ds-box>
															</template>
															<template #tooltip>
																<ds-inline>
																	<ds-text variant="bodyMedium" color="white">{{ `${$t('explorer.dropZone.aggregation')}` }}</ds-text>
																	<ds-text white-space="pre-wrap" color="white">{{ ` - ${element.aggregation}` }}</ds-text>
																</ds-inline>
															</template>
														</ds-tooltip>
													</template>
													<template #groupItem="{item, group, selectedValue, checker, selectValue}">
														<ds-box v-if="item.value === metricDefinition.C_SUM">
															<cum-sum
																v-if="item.group === group"
																:item="item"
																:selectedValue="selectedValue"
																:checker="checker"
																:selectValue="selectValue" />
														</ds-box>
													</template>
												</ds-select>
											</ds-box>
											<column-format
												v-if="element.selectedFormat && index === 0 && isFormattable(element.selected, element.type)"
												:dimensions="metricAttributes"
												:attribute="element"
												:widgetInstanceId="selectedWidgetInstanceId"
												:headingText="$t('t_selectFormat')"
												name="format"
												@changed="selectedFormat" />
										</ds-box>
									</template>
								</drop-zone-column>
							</ds-inline-item>
						</template>
					</draggable>
				</ds-box>
			</ds-col>
			<ds-col class="position-relative" :class="{'h-100': !dimensionAttributes.length || draggedAttribute}" cols="6">
				<ds-box v-if="dimensionAttributes.length" border="disabled" class="w-100 border-top-radius drop-zone sticky-top ds-bg-interaction-0" style="border-top-left-radius: 0">
					<ds-inline align="space-between" align-y="center" no-wrap>
						<ds-box padding="M">
							<ds-text color="display-content-600" variant="subheadline">{{ $t('explorer.dropZone.dimensions') }}</ds-text>
						</ds-box>
						<template v-if="dimensionAttributes.length">
							<limit :limit="dataConfiguration.limit" @update:value="updateLimit($event)" />
						</template>
					</ds-inline>
				</ds-box>
				<div
					v-else
					class="empty-text text-center" :style="{'margin-top': scrollPosition + 'px'}">
					<ds-box padding-bottom="S">
						<ds-text :color="draggingState.dimensionAllowed ? 'white' : 'display-content-800'" variant="subheadlineMedium">{{ $t('explorer.dropZone.dimension') }}</ds-text>
						<ds-text :color="draggingState.dimensionAllowed ? 'white' : 'separate-content-300'" variant="caption">
							{{ $t('explorer.dropZone.recommendedAttributeTypes') }}
						</ds-text>
					</ds-box>
					<ds-inline align="center">
						<ds-icon class="icon-large" :fill="draggingState.dimensionAllowed ? 'white' : 'separate-content-200'" name="icon-text-datatype" />
						<ds-box padding-left="M">
							<ds-icon class="icon-large" :fill="draggingState.dimensionAllowed ? 'white' : 'separate-content-200'" name="icon-date-datatype" />
						</ds-box>
					</ds-inline>
				</div>
				<template v-if="draggedAttribute && draggingState.dimensionAllowed && dimensionAttributes.length">
					<div class="position-absolute highlight-border highlight-right" :style="{top: (61 + scrollPosition) + 'px'}" />
					<div v-if="!draggingState.metricAllowed" class="position-absolute highlight-border highlight-left" :style="{top: (61 + scrollPosition) + 'px'}" />
					<div class="position-absolute highlight-border w-100" :style="{top: (61 + scrollPosition) + 'px'}" />
					<div class="position-absolute highlight-border w-100" :style="{bottom: scrollPosition + 'px'}" />
				</template>
				<draggable
					v-model="dimensionAttributes"
					animation="200"
					class="w-100 d-flex drop-zone-table"
					:class="[
						isDimensionZoneDisabled ? 'drop-zone-disabled' : '' ,
						!dimensionAttributes.length ? 'drop-zone-empty border-right-radius position-absolute ' + dimensionZoneBg : ''
					]"
					:style="{top: scrollPosition + 'px'}"
					:disabled="isDimensionZoneDisabled"
					group="attributes"
					direction="horizontal"
					ghost-class="dropzone-dragging"
					item-key="name"
					@change="handle($event, chartConstants.dataConfiguration.DIMENSION)">
					<template #item="{element, index}">
						<ds-inline-item class="h-100 w-100 dropzone-column" flex-grow="1">
							<drop-zone-column
								:key="`dimensionsColumn${reloadDimensionsKey}`"
								class="h-100"
								:attribute="element"
								:dimensionAliases="dimensionAliases"
								:index="index"
								:is-last="index === (dimensionAttributes.length - 1)"
								@number-of-buckets="selectedNumber($event, element)"
								@function="selectedFunction($event, element)"
								@formatting="selectedFormat(element, $event)"
								@ordering="updateOrdering($event)"
								@remove="removeAttribute(index, chartConstants.dataConfiguration.DIMENSION, element.displayName)"
								@rename-dimension="renameDimensionAction(index, $event)"
								@change-dimension-name="changeDimensionName($event)">
								<template #header>
									<ds-inline class="selected-data__header">
										<column-select-date
											v-if="isSelectedDatatype(dataTypes.DATE_TYPE, element.type) && element.function"
											:selected-column="element"
											component-type="explorer"
											@update="selectedFunction($event, element)" />
										<column-select-number
											v-if="isSelectedDatatype(dataTypes.NUMBER, element.type) && element.numberOfBuckets"
											:selected-column="element"
											:min="0"
											:force-bucketing="isSelectedDatatype(dataTypes.FLOAT, element.type)"
											component-type="explorer"
											@update="selectedNumber($event, element)" />
										<column-format
											v-if="element.selectedFormat && isFormattable(element.selected, element.type) && !element.numberOfBuckets"
											:dimensions="dimensionAttributes"
											:attribute="element"
											:widgetInstanceId="selectedWidgetInstanceId"
											:headingText="$t('t_selectFormat')"
											name="format"
											@changed="selectedFormat($event, element)" />
										<top-n-values v-if="index === 1" @update-top-values="updateTopNValues($event)" />
									</ds-inline>
								</template>
							</drop-zone-column>
						</ds-inline-item>
					</template>
				</draggable>
			</ds-col>
		</ds-row>
	</div>
</template>
<script lang="ts">
// @ts-ignore
import draggable from 'vuedraggable';
// eslint-disable-next-line no-unused-vars
import {computed, defineComponent, nextTick, onMounted, reactive, Ref, ref, watch} from 'vue';
import {actionType, Attribute, useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import useAttributes from '@/modules/explorer/composables/useAttributes';
import {chartConstants} from '@/util/consts/chartsConstants';
import {CUSTOM_METRIC, dataTypes, dimensionDefinition, isDataType, isFormattable, metricDefinition} from '@/util/queryBuilder';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import {
	axisDataMap,
	formatAggregations,
	getDropzoneBg,
	getOrderingToRemove,
	isDimensionDragAllowed,
	isDropzoneDisabled,
	isMetricDragAllowed,
	mapAttributesToLists,
	mapFormattingToData,
	moveIndexes,
	removeFormattingOnAttribute
} from '@/modules/explorer/utils/dropZoneUtils';
import useChartTypes from '@/modules/explorer/composables/useChartTypes';
import ColumnSelectDate from '@/components/datatypes/ColumnSelectDate.vue';
import ColumnSelectNumber from '@/components/datatypes/ColumnSelectNumber.vue';
import Limit from '@/modules/explorer/components/detail/explore/dropZone/Limit.vue';
import TopNValues from '@/modules/explorer/components/detail/explore/dropZone/TopNValues.vue';
import DropZoneColumn from '@/modules/explorer/components/detail/explore/dropZone/DropZoneColumn.vue';
import isEqual from 'lodash/isEqual';
import ColumnFormat from '@/modules/widget/components/widget-controls/ColumnFormat.vue';
import cloneDeep from 'lodash/cloneDeep';
import {setOption, setupEnums, updateEnumName} from '@/modules/widget/utils/widget';
import {removeOldFormat} from '@/util/formatingUtil';
import {getWidgetFlowType} from '@/modules/explorer/utils/widgetFlowsUtils';
import CumSum from '@/modules/explorer/components/detail/explore/dropZone/CumSum.vue';
import {useStore} from 'vuex';

export default defineComponent({
	components: {
		DropZoneColumn,
		ColumnSelectDate,
		ColumnSelectNumber,
		ColumnFormat,
		Limit,
		TopNValues,
		draggable,
		CumSum
	},
	props: {
		usableHeight: {
			type: Number,
			default: 500
		}
	},
	emits: ['suggestionInput'],
	// eslint-disable-next-line max-statements
	setup(props, {emit}) {
		const store = useStore();
		const dataExploreStore = useDataExploreStore();
		const {
			loadData,
			getDataConfigFromAttributes,
			saveConfiguration,
			explore,
			selectedWidgetInstanceId,
			dataConfiguration,
			widgetRawData,
			widgetDataConfiguration
		} = useExplorerChart();
		const {switchComponent, swapSelectedFormat, selectedWidgetType} = useChartTypes();
		const {getFormatting} = useAttributes();
		const storyDetailConfiguration = computed(() => store.getters['storyDetail/story']?.configuration ?? {});
		const {dataSourceId} = useExplorerChart();
		const savedCustomMetrics = computed(() => storyDetailConfiguration.value?.customMetrics?.[dataSourceId.value] ?? []);

		const dimensionAttributes: Ref<Attribute[]> = ref([]);
		const metricAttributes: Ref<Attribute[]> = ref([]);

		const metricAliases: any = ref({});
		const dimensionAliases: any = ref({});
		const reloadMetricKey = ref(0);
		const reloadDimensionsKey = ref(0);
		const metricNameFocused = ref(false);

		const scrollPosition = ref(0);
		const handleScroll = (event: any) => {
			scrollPosition.value = event.target.scrollTop;
		};

		// watch if there was change in currently used custom metric and respond to this change
		watch(savedCustomMetrics, async(newVal, oldVal) => {
			if (newVal) {
				for (let i = 0; i < metricAttributes.value.length; i++) {
					const currentMetric = metricAttributes.value[i];
					if (currentMetric.type === CUSTOM_METRIC) {
						const newValMetric = newVal.find((item: any) => metricAttributes.value[i].id === item.id);
						const oldValMetric = oldVal.find((item: any) => metricAttributes.value[i].id === item.id);
						// if there was a change in currently used custom metric update changes
						if (newValMetric && !isEqual(newValMetric, oldValMetric)
							&& (!isEqual(currentMetric.customExpression, newValMetric.customExpression)
								|| currentMetric.customColumnName !== newValMetric.customColumnName)
						) {
							const columnIndex = currentMetric.index + moveIndexes(dimensionAttributes.value);
							metricAttributes.value[i].customColumnName = newValMetric.customColumnName;
							metricAttributes.value[i].name = newValMetric.customColumnName;
							metricAttributes.value[i].displayName = newValMetric.customColumnName;
							metricAttributes.value[i].customExpression = newValMetric.customExpression;
							// eslint-disable-next-line require-atomic-updates
							metricAttributes.value[i].data = await updateAttributesData(
								columnIndex,
								dataTypes.INT,
								chartConstants.dataConfiguration.METRIC,
								getFormatting.value
							);
							break;
						}
					}
				}
			}
		}, {deep: true});
		const oldAttributesCount: Ref<number[]> = ref([]);
		const attributeLengthChanged = computed(() => {
			const isNewDimension = (dimensionAttributes.value.length !== oldAttributesCount.value[0])
				&& dimensionAttributes.value.length !== widgetDataConfiguration.value?.dimensions?.length;
			const isNewMetric = (metricAttributes.value.length !== oldAttributesCount.value[1])
				&& metricAttributes.value.length !== widgetDataConfiguration.value?.metrics?.length;
			return isNewDimension || isNewMetric;
		});
		watch(attributeLengthChanged, async(newVal) => {
			if (newVal) {
				const widgetToUse = getWidgetFlowType(selectedWidgetType.value, dimensionAttributes.value.length, metricAttributes.value.length);
				if (widgetToUse === selectedWidgetType.value) {
					await saveConfiguration(metricAttributes.value, dimensionAttributes.value);
				} else {
					dataExploreStore.isChangingWidget = true;
					const {dimensions, metrics} = getDataConfigFromAttributes(metricAttributes.value, dimensionAttributes.value);
					await switchComponent(metrics, dimensions, widgetToUse, dataConfiguration.value.orderBy);
					// TODO CHECK IF WE REALLY NEED TO RELOAD DATA FOR STORYDETAIL AFTER SWITCHING CHART
					await store.dispatch('storyDetail/reloadData', {
						id: explore.value.id,
						setInstances: false
					});
					const list: Attribute[] = mapAttributesToLists(dataConfiguration.value);
					await generateAttributesList(list);
					// eslint-disable-next-line require-atomic-updates
					dataExploreStore.isChangingWidget = false;
				}
			}
		});
		watch([dimensionAttributes, metricAttributes], (newVal) => {
			oldAttributesCount.value = cloneDeep([newVal[0].length, newVal[1].length]);
			dataExploreStore.setUsedAttributes([...newVal[0], ...newVal[1]]);
		}, {deep: true});

		const handle = async(event: any, type: string) => {
			// drag and drop event add
			if (event.added) {
				if ((type === chartConstants.dataConfiguration.DIMENSION && (getFormatting.value?.xAxis || getFormatting?.value?.yAxis))) {
					// swap format when you are moving already formatted attribute
					if (event.added.newIndex === 0) {
						swapSelectedFormat(dimensionAttributes.value.length, getFormatting.value);
					}
				}
			} else if (event.moved) {
				if (event.moved.element.selected === chartConstants.dataConfiguration.DIMENSION && (getFormatting.value?.xAxis || getFormatting?.value?.yAxis)) {
					swapSelectedFormat(dimensionAttributes.value.length, getFormatting.value);
				}
				await saveConfiguration(metricAttributes.value, dimensionAttributes.value);
			} else if (event.removed) {
				await removeAttribute(event?.removed?.oldIndex, event?.removed?.element?.selected, event?.removed?.element?.displayName);
			}
		};

		const updateAttributesData = async(columnIndex: number, dataType: string, option: string, selectedFormat: any, metricIndex: number = 0) => {
			await saveConfiguration(metricAttributes.value, dimensionAttributes.value, null);
			const mappedWidgetRaw = widgetRawData.value?.rows?.map((row: any) => [row[columnIndex]]) ?? [];
			let isNumberOfBuckets = false;
			if (option === chartConstants.dataConfiguration.DIMENSION && dimensionAttributes.value[columnIndex].numberOfBuckets) {
				isNumberOfBuckets = true;
			}
			return mapFormattingToData(mappedWidgetRaw, dataType, option, columnIndex, selectedFormat, isNumberOfBuckets);
		};

		const removeAttribute = (index: any, type: string, colname: string) => {
			// cleans up formatting option for current dimension
			removeFormattingOnAttribute(getFormatting.value, selectedWidgetInstanceId.value, type, index);
			if (type === chartConstants.dataConfiguration.DIMENSION && index === 0) {
				swapSelectedFormat(dimensionAttributes.value.length, getFormatting.value);
			}

			const {orderIndex, orderByType} = getOrderingToRemove(dataConfiguration.value);
			if (dataConfiguration.value.orderBy && orderIndex === index && orderByType === type) {
				dataConfiguration.value.orderBy = [];
			}
			if (type === chartConstants.dataConfiguration.METRIC && metricAttributes.value.some((attr: Attribute) => attr.displayName === colname)) {
				metricAttributes.value.splice(index, 1);
			}
			if (type === chartConstants.dataConfiguration.DIMENSION && dimensionAttributes.value.some((attr: Attribute) => attr.displayName === colname)) {
				dimensionAttributes.value.splice(index, 1);
			}
		};

		// eslint-disable-next-line max-statements
		const updateAttributeList = async(
			column: Attribute, type: string|null, action: string, aggregation: any,
			orderBy: any = null, selectedFormat: any = null, index: any = null
		// eslint-disable-next-line max-params
		) => {
			// TODO: Possibly add actions_ ADD, REMOVE
			if (action === actionType.UPDATE) {
				if (type === chartConstants.dataConfiguration.METRIC) {
					const colIndex = metricAttributes.value.findIndex((elm) => elm.name === column.name && elm.index === index);
					const columnIndex = column.index + moveIndexes(dimensionAttributes.value);
					metricAttributes.value[colIndex].aggregation = aggregation;
					metricAttributes.value[colIndex].selectedFormat = selectedFormat ?? column?.selectedFormat;
					// eslint-disable-next-line require-atomic-updates
					metricAttributes.value[colIndex].data = await updateAttributesData(columnIndex, column.type, type, selectedFormat, colIndex);
				}
				if (type === chartConstants.dataConfiguration.DIMENSION) {
					const colIndex = dimensionAttributes.value.findIndex((elm) => elm.name === column.name);
					const columnIndex = column.index;
					const isValidNumberBucket = dimensionDefinition.BUCKET_VALUE === aggregation?.function && aggregation?.numberOfBuckets > 0;
					const isDateBucket = (aggregation?.function === dimensionDefinition.BUCKET_DATE
						|| aggregation?.function === dimensionDefinition.EXTRACT_DATE)
						&& aggregation.bucketsDatetime;
					dimensionAttributes.value[colIndex].bucketsDatetime = isDateBucket ? aggregation.bucketsDatetime : null;
					dimensionAttributes.value[colIndex].function = isValidNumberBucket || isDateBucket ? aggregation?.function : dimensionDefinition.NO_CHANGE;
					dimensionAttributes.value[colIndex].numberOfBuckets = isValidNumberBucket ? aggregation.numberOfBuckets : null;
					dimensionAttributes.value[colIndex].orderBy = orderBy;
					dimensionAttributes.value[colIndex].selectedFormat = selectedFormat ?? column?.selectedFormat;
					// eslint-disable-next-line require-atomic-updates
					dimensionAttributes.value[colIndex].data = await updateAttributesData(columnIndex, column.type, type, selectedFormat ?? column?.selectedFormat);
				}
			}
		};

		const generateAttributesList = (list: Attribute[] | undefined) => {
			if (list?.length) {
				metricAttributes.value = [];
				dimensionAttributes.value = [];

				for (const attribute of list) {
					if (attribute.selected === chartConstants.dataConfiguration.DIMENSION) {
						dimensionAttributes.value.push(attribute);
					}
					if (attribute.selected === chartConstants.dataConfiguration.METRIC) {
						metricAttributes.value.push(attribute);
					}
				}
			} else {
				metricAttributes.value = [];
				dimensionAttributes.value = [];
			}
		};

		const selectedAggregation = async(aggregation: any, column: Attribute, index: any) => {
			await updateAttributeList(column, chartConstants.dataConfiguration.METRIC, actionType.UPDATE, aggregation, null, null, index);
		};

		const draggingState = reactive({
			metricAllowed: false,
			dimensionAllowed: false
		});
		// value that is currently dragged from attribute list
		const draggedAttribute = computed(() => dataExploreStore.getDraggedAttribute);
		const isMetricZoneDisabled = computed(() => isDropzoneDisabled(draggedAttribute.value, draggingState.metricAllowed));
		const isDimensionZoneDisabled = computed(() => isDropzoneDisabled(draggedAttribute.value, draggingState.dimensionAllowed));
		const metricZoneBg = computed(() => getDropzoneBg(draggedAttribute.value, draggingState.metricAllowed));
		const dimensionZoneBg = computed(() => getDropzoneBg(draggedAttribute.value, draggingState.dimensionAllowed));
		const realValue = computed(() => store.getters['widgetInstances/option'](selectedWidgetInstanceId.value, 'enums') ?? {});

		watch(draggedAttribute, (newVal) => {
			draggingState.metricAllowed = false;
			draggingState.dimensionAllowed = false;
			if (newVal) {
				const currentAttributes = {metrics: metricAttributes.value, dimensions: dimensionAttributes.value};
				draggingState.metricAllowed = isMetricDragAllowed(newVal, currentAttributes);
				draggingState.dimensionAllowed = isDimensionDragAllowed(newVal, currentAttributes);
			}
		});

		onMounted(async() => {
			await loadData(selectedWidgetInstanceId.value);
		});

		// TODO: find some effective way how to check widget data are different
		watch(selectedWidgetInstanceId, (val) => {
			if (store.getters['widgetData/rawData'](val) === null) {
				const list: Attribute[] = mapAttributesToLists(dataConfiguration.value);
				generateAttributesList(list);
			}
		});

		watch(widgetRawData, () => {
			const list: Attribute[] = mapAttributesToLists(dataConfiguration.value);
			generateAttributesList(list);

			const {dimensions, metrics} = getDataConfigFromAttributes(metricAttributes.value, dimensionAttributes.value);

			// aliases code
			const dimension = dimensions?.map((elm: any, idx: number) => `dimension${idx}`) ?? [];
			const enums = setupEnums(realValue?.value, true, dimension, metrics, widgetRawData.value);
			metricAliases.value = enums ? enums.metricAliases : {};
			dimensionAliases.value = enums;
		}, {immediate: true});

		watch(dimensionAttributes, (newVal: Attribute[]) => {
			const {dimensions, metrics} = getDataConfigFromAttributes(metricAttributes.value, dimensionAttributes.value);

			// aliases code
			const dimension = dimensions?.map((elm: any, idx: number) => `dimension${idx}`) ?? [];
			dimensionAliases.value = setupEnums(realValue?.value, true, dimension, metrics, widgetRawData.value);

			// suggestions code
			if (newVal) {
				emit('suggestionInput', {dimensions: newVal, metrics: metricAttributes});
			}
		}, {deep: true});

		watch(metricAttributes, (newVal: Attribute[]) => {
			const {dimensions, metrics} = getDataConfigFromAttributes(metricAttributes.value, dimensionAttributes.value);

			// aliases code
			const dimension = dimensions?.map((elm: any, idx: number) => `dimension${idx}`) ?? [];
			const enums = setupEnums(realValue?.value, newVal?.length, dimension, metrics, widgetRawData.value);
			metricAliases.value = enums?.metricAliases ?? {};

			// suggestions code
			if (newVal) {
				emit('suggestionInput', {dimensions: dimensionAttributes, metrics: newVal});
			}
		}, {deep: true});

		const updateTopNValues = async(topVal: any) => {
			await saveConfiguration(metricAttributes.value, dimensionAttributes.value, topVal);
		};

		const updateLimit = async(topNVal: number) => {
			dataConfiguration.value.limit = topNVal;
			await saveConfiguration(metricAttributes.value, dimensionAttributes.value);
		};

		const selectedFunction = (data: any, column: Attribute) => {
			updateAttributeList(column, chartConstants.dataConfiguration.DIMENSION, actionType.UPDATE, data);
		};

		const selectedFormat = async(column: Attribute|null = null, saveFormat: any = null) => {
			const temp = cloneDeep(getFormatting.value);
			const indexedOption = `${column?.selected}${column?.index}`;
			// @ts-ignore
			const axis = axisDataMap?.[column?.selected === chartConstants.dataConfiguration.METRIC ? column?.selected : indexedOption] ?? '';
			temp[axis] = saveFormat;
			await setOption(selectedWidgetInstanceId.value, 'selectedFormat', temp);

			await saveConfiguration(metricAttributes.value, dimensionAttributes.value);
			const list: Attribute[] = mapAttributesToLists(dataConfiguration.value);
			generateAttributesList(list);
		};

		const updateOrdering = async(ordering: any) => {
			dataConfiguration.value.orderBy = ordering;
			await saveConfiguration(metricAttributes.value, dimensionAttributes.value);
			const list: Attribute[] = mapAttributesToLists(dataConfiguration.value);
			generateAttributesList(list);
		};

		const selectedNumber = (data: any, column: Attribute) => {
			data.function = data.function ?? dimensionDefinition.BUCKET_VALUE;
			if (data?.numberOfBuckets >= 0) {
				updateAttributeList(column, chartConstants.dataConfiguration.DIMENSION, actionType.UPDATE, data);
			}
		};

		const isSelectedDatatype = (type: string, dataType: string) => isDataType(type, dataType);

		const renameMetricAction = (index: number) => {
			metricNameFocused.value = true;
			nextTick(() => {
				const toFocus: any = document.getElementById(`displayNameMetrics${index}`);
				toFocus.focus();
			});
		};

		const changeMetricName = (event: any, index: number) => {
			metricNameFocused.value = false;
			let newName = (event.target.innerText || '').trim();

			const originalName = metricAttributes.value[index].displayName;
			const key = `Metric${index + 1}`;
			if (!realValue?.value?.metricAliases || newName !== realValue?.value?.metricAliases[key]) {
				if (newName === originalName) {
					newName = '';
				}

				const cleanedValue = removeOldFormat(realValue.value, 'metricAliases', key);
				const updatedEnumName = updateEnumName('metricAliases', key, newName, cleanedValue);
				setOption(selectedWidgetInstanceId.value, 'enums', updatedEnumName);
			}

			if (newName === '') {
				metricAliases.value[key] = originalName;
			} else {
				metricAliases.value[key] = newName;
			}
			reloadMetricKey.value += 1;
		};

		const renameDimensionAction = (dimensionIndex: number, data: any) => {
			const rowIndex: number = data.index;
			const domId = `displayNameDimension${dimensionIndex}_r${rowIndex}`;
			nextTick(() => {
				const toFocus: any = document.getElementById(domId);
				toFocus.focus();
			});
		};

		const changeDimensionName = async(evt: any) => {
			const {dimensionIndex, rowIndex, elm} = evt;

			let newName = (elm.target.innerText || '').trim();
			let [originalName] = dimensionAttributes.value[dimensionIndex].data[rowIndex];
			// reset dimension's custom name

			if (newName === originalName?.toString()) {
				newName = '';
			}

			// handle null value
			if (originalName === null) {
				originalName = '<NULL>';
			}
			const cleanedValue = removeOldFormat(realValue?.value, `dimension${dimensionIndex}`, null);
			const updatedEnumName = updateEnumName(`dimension${dimensionIndex}`, originalName?.toString(), newName, cleanedValue);

			await setOption(selectedWidgetInstanceId.value, 'enums', updatedEnumName);

			// eslint-disable-next-line require-atomic-updates
			dimensionAliases.value = updatedEnumName;
			reloadDimensionsKey.value += 1;
		};

		const getEntryData = (attribute: Attribute, textValue: string) => {
			const data: any = {
				textToDisplay: textValue,
				tooltip: '',
				fontStyle: 'normal'
			};

			if (attribute.selected === chartConstants.dataConfiguration.METRIC && realValue?.value?.metricAliases) {
				const newValue = realValue?.value?.metricAliases[`Metric${attribute.index + 1}`];
				const isDefined = typeof newValue !== 'undefined' && newValue !== null;

				data.textToDisplay = newValue && isDefined ? newValue : textValue;
				data.tooltip = newValue && isDefined ? textValue.toString() : '';
				data.fontStyle = newValue && isDefined ? 'italic' : 'normal';
			}

			return data;
		};

		return {
			chartConstants,
			metricDefinition,
			dataTypes,
			dimensionDefinition,
			dimensionAttributes,
			metricAttributes,
			handle,
			removeAttribute,
			selectedAggregation,
			selectedFunction,
			selectedNumber,
			isSelectedDatatype,
			getFormatting,
			draggingState,
			draggedAttribute,
			getDropzoneBg,
			isDropzoneDisabled,
			isMetricZoneDisabled,
			isDimensionZoneDisabled,
			dimensionZoneBg,
			metricZoneBg,
			selectedFormat,
			isFormattable,
			formatAggregations,
			dataConfiguration,
			selectedWidgetInstanceId,
			updateTopNValues,
			updateLimit,
			updateOrdering,
			handleScroll,
			scrollPosition,
			getEntryData,
			reloadMetricKey,
			reloadDimensionsKey,
			metricAliases,
			dimensionAliases,
			renameMetricAction,
			renameDimensionAction,
			changeMetricName,
			changeDimensionName,
			metricNameFocused
		};
	}
});
</script>

<style lang="scss" scoped>
.icon-large {
	height: 36px;
	width: 36px
}
.drop-zone-table {
	min-height: 100%;
}
.drop-zone-empty  {
	transition: all 400ms ease;
	transition-property: background-color, color;
	border: 1px dashed map-get($ds-colors, 'separate-content-200');
}

.drop-zone-disabled {
	opacity: 0.6;
}
.empty-text {
	position: absolute;
	z-index: 1;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.highlight-border {
	border: 1px dashed map-get($ds-colors, 'interaction-300');
	z-index: 1022;
}
.highlight-left {
	height: calc(100% - 61px);
}
.highlight-right {
	height: calc(100% - 61px);
	right: 0;
}
</style>

<style lang="scss">
.selected-data__header {
	align-items: center;
	display: flex;
	padding-right: 5px;
}

.disabled {
	pointer-events: none;
}
</style>
