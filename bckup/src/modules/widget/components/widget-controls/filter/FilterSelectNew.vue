<template>
	<ds-box class="h-100" flex-type="column">
		<ds-box flex-type="column" padding-x="L" :class="{'filter-bar-height': visualizationType === storyType.DATA_EXPLORE}">
			<ds-box v-for="filter, index in filters" :key="index" padding-bottom="M">
				<ds-box
					class="ds-bg-separate-content-0"
					padding="M"
					border-radius="basic">
					<ds-box flex-type="row" align="space-between" padding-bottom="M">
						<ds-text variant="bodyMedium">{{ $t('filters.where') }}</ds-text>
						<ds-close-button small fill="display-content-400" @close="removeFilter(index)" />
					</ds-box>
					<ds-box>
						<ds-select
							:items="selectAttributeList"
							:initialValue="filter.columnReference"
							placement="bottom"
							max-height
							:placeholder="$t('filters.selectAttribute')"
							@selected-item="updateAttributeValue($event, index)">
							<template v-if="filter.dataType" #triggerContentIcon>
								<ds-box padding-right="S" align-y="center" no-grow>
									<ds-icon :name="getIconNameFromDataType(filter.dataType)" fill="display-content" />
								</ds-box>
							</template>
						</ds-select>
					</ds-box>
					<ds-box padding-top="M">
						<ds-select
							:items="operationsBasedOnAttribute(filter.dataType)"
							:initialValue="filter?.metadata?.selectLabel ?? null"
							placement="bottom"
							:placeholder="$t('filters.selectOperation')"
							@selected-item="updateOperationValue($event, index)" />
					</ds-box>
					<ds-box v-if="filter.columnReference && filter.operationSelected && !filter.metadata?.noPicker">
						<ds-box :padding-top="propsToBind(filter, source) ? 'M' : 'NONE'">
							<component
								v-bind="propsToBind(filter, source)"
								:is="useComponent(filter)"
								@update:selected="updateValue($event, index)"
								@update="updateValue($event, index)"
								@update:value="updateValue($event, index)"
								@selected-item="updateValue($event, index)" />
						</ds-box>
						<ds-box v-if="useMultiselect(filter)" padding-top="M">
							<filter-multi-select
								:filter="filter"
								:source="source"
								:initialValues="getInitialValues(filter)"
								placement="bottom"
								@update-selected="updateValue($event, index)" />
						</ds-box>
						<ds-box v-if="useRangeNumberInput(filter)" padding-top="M" flex-type="row" align="space-between">
							<ds-box padding-right="M" class="w-100">
								<ds-input
									:value="filter?.value?.[0] ?? null"
									:debounce="true"
									type="number"
									class="w-100"
									hide-number-buttons
									@update="updateRangeValue($event, index, 0, filter.dataType)" />
							</ds-box>
							<ds-input
								:value="filter?.value?.[1] ?? null"
								:debounce="true"
								type="number"
								class="w-100"
								hide-number-buttons
								@update="updateRangeValue($event, index, 1, filter.dataType)" />
						</ds-box>
						<ds-box v-if="useRangeDatePicker(filter)" padding-top="M" flex-type="column" align="space-between">
							<ds-datepicker
								:value="filter?.value?.[0] ?? null"
								placeholder="filters.t_DateFrom"
								@update:value="updateRangeValue($event, index, 0, filter.dataType)" />
							<ds-box padding-top="M">
								<ds-datepicker
									:value="filter?.value?.[1] ?? null"
									placeholder="filters.t_DateTo"
									@update:value="updateRangeValue($event, index, 1, filter.dataType)" />
							</ds-box>
						</ds-box>
					</ds-box>
					<ds-box v-if="useNumberInput(filter)" flex-type="row" padding-top="M">
						<ds-box padding-right="S">
							<ds-icon name="ds-icon-info" fill="interaction-500" />
						</ds-box>
						<ds-text variant="caption" color="display-content">
							{{ $t('filters.filterNonAggregated') }}
						</ds-text>
					</ds-box>
					<ds-box v-if="useTextInput(filter)" flex-type="row" padding-top="M">
						<ds-box padding-right="S">
							<ds-icon name="ds-icon-info" fill="interaction-500" />
						</ds-box>
						<ds-text variant="caption" color="display-content">
							{{ $t('filters.useSymbolAsWildcard') }}
						</ds-text>
					</ds-box>
				</ds-box>
				<ds-box v-if="index < filters.length - 1" padding-top="M">
					<group-operation-select :filter="filter" :index="index" @update-group-operation="updateGroupOperation" />
				</ds-box>
			</ds-box>
		</ds-box>
		<ds-box
			padding-x="L" padding-y="GROUP"
			flex-type="row" align="space-between" no-grow>
			<ds-btn variant="ghost" small @click="addCondition">
				<template #icon>
					<ds-icon name="icon-plus-sign" fill="display-content-700" />
				</template>
				<ds-text variant="bodyMedium" color="display-content-700">
					{{ $t('filters.addCondition') }}
				</ds-text>
			</ds-btn>
			<ds-btn variant="ghost" small :disabled="isClearButtonDisabled" @click="showWarningModal = true">
				<template #icon>
					<ds-icon name="ds-icon-cross" :fill="isClearButtonDisabled ? 'display-content-400' : 'display-content-700'" />
				</template>
				<ds-text
					variant="bodyMedium"
					:color="isClearButtonDisabled ? 'display-content-400' : 'display-content-700'">
					{{ $t('filters.clearAll') }}
				</ds-text>
			</ds-btn>
		</ds-box>
		<ds-box
			align="center" padding-x="L" padding-y="M"
			no-grow class="ds-bg-separate-content-0">
			<ds-btn block center :disabled="!filtersHaveCorrectConfiguration" @click="applyFilters">
				<ds-text variant="bodyMedium" color="white">
					{{ $t('filters.applyFilters') }}
				</ds-text>
			</ds-btn>
		</ds-box>
		<ds-modal
			:show="showWarningModal"
			confirm-text="filters.clearAll"
			header-text="filters.clearFilter"
			@ok="resetFilters"
			@cancel="showWarningModal = false">
			<template #modal-text>
				<ds-text variant="body">
					{{ $t('filters.clearAllModalWarningMsg') }}
				</ds-text>
			</template>
		</ds-modal>
	</ds-box>
</template>

<script setup lang="ts">
import {computed, onMounted, PropType, ref, watch} from 'vue';
import {DATASOURCE_TYPES} from '@/modules/dataset/utils/datasetUtils';
import {numberTypes, filterTypes, filterLogic} from '@/util/queryBuilder';
import {loadFilters} from '@/modules/widget/components/widget-controls/filter/utils';
import useFilters from '@/modules/widget/components/widget-controls/filter/useFilters';
import cloneDeep from 'lodash/cloneDeep';
import {useStore} from 'vuex';
import {storyType} from '@/modules/story/consts/storyType';
import DsCloseButton from '@/components/main/button/DsCloseButton.vue';
import GroupOperationSelect from '@/modules/widget/components/widget-controls/filter/components/GroupOperationSelect.vue';
import FilterMultiSelect from '@/modules/widget/components/widget-controls/filter/components/FilterMultiSelect.vue';
import {FilterMetadataType} from '@/modules/widget/components/widget-controls/filter/consts';

const props = defineProps({
	widgetInstanceId: {
		type: String,
		default: null
	},
	source: {
		type: Object as PropType<{type: any, id: string}>,
		default: null
	},
	columns: {
		type: Array,
		default: () => []
	}
});

const store = useStore();
const {
	useRangeNumberInput, useRangeDatePicker, useComponent, useMultiselect,
	propsToBind, widgetConfiguration, visualizationType, useNumberInput,
	getIconNameFromDataType, operationsBasedOnAttribute, getInitialValues,
	useTextInput
} = useFilters();

const filters = ref([] as any);
const showWarningModal = ref(false);

onMounted(() => {
	loadInitialFilters();
});

const removeFilter = (index: number) => {
	filters.value.splice(index, 1);

	const configuration = cloneDeep(widgetConfiguration.value.data.configuration);
	const toSave = {
		postAggregation: [],
		preAggregation: cloneDeep(filters.value),
		version: 'default/v1'
	};
	configuration.staticFilter = toSave;
	store.dispatch('widgetInstances/setConfiguration', {
		widgetInstanceId: props.widgetInstanceId,
		configuration,
		id: widgetConfiguration.value.data.id,
		datasetId: props.source.type === DATASOURCE_TYPES.DATASET ? props.source.id : null,
		catalogItemId: props.source.type === DATASOURCE_TYPES.CATALOG_ITEM ? props.source.id : null
	});
	if (!filters.value.length) {
		filters.value = [{columnReference: null, operationSelected: false, dataType: null, logic: null, value: null, metadata: null, groupOperation: null}];
	}
};

const resetFilters = () => {
	const configuration = cloneDeep(widgetConfiguration.value.data.configuration);

	const toSave = {
		postAggregation: [],
		preAggregation: []
	};

	configuration.staticFilter = toSave;
	filters.value = [{columnReference: null, operationSelected: false, dataType: null, logic: null, value: null, metadata: null, groupOperation: null}];
	store.dispatch('widgetInstances/setConfiguration', {
		widgetInstanceId: props.widgetInstanceId,
		configuration,
		id: widgetConfiguration.value.data.id,
		datasetId: props.source.type === DATASOURCE_TYPES.DATASET ? props.source.id : null,
		catalogItemId: props.source.type === DATASOURCE_TYPES.CATALOG_ITEM ? props.source.id : null
	});

	showWarningModal.value = false;
};

const loadInitialFilters = () => {
	filters.value = [];
	let savedFilters = null;
	if (widgetConfiguration.value.staticFilter.version === 'default/v1') {
		savedFilters = loadFilters(widgetConfiguration.value.staticFilter?.preAggregation ?? []);
	} else {
		savedFilters = loadFilters(widgetConfiguration.value.staticFilter?.preAggregation ?? [], selectAttributeList.value, cloneDeep(widgetConfiguration.value.options));
	}
	if (savedFilters.length) {
		filters.value = savedFilters;
	} else {
		filters.value.push({columnReference: null, operationSelected: false, dataType: null, logic: null, value: null, metadata: null, groupOperation: null});
	}
};

watch(() => props.widgetInstanceId, () => {
	loadInitialFilters();
});

const selectAttributeList = computed(() => props.columns.map((item: any) => ({value: item.name, selectLabel: item.displayName, dataType: item?.type ?? item.dataType})));

const addCondition = () => {
	filters.value[filters.value.length - 1].groupOperation = filterLogic.AND;
	filters.value.push({columnReference: null, operationSelected: false, dataType: null, logic: null, value: null, metadata: null, groupOperation: null});
};

const updateAttributeValue = (value: {dataType: string, selectLabel: string, value: string}, index: number) => {
	filters.value[index].columnReference = value.value;
	filters.value[index].dataType = value.dataType;

	// After updating attribute we need to reset other values;
	filters.value[index].metadata = null;
	filters.value[index].logic = null;
	filters.value[index].operationSelected = false;
	filters.value[index].value = null;
};

const updateOperationValue = (value: FilterMetadataType, index: number) => {
	filters.value[index].logic = value.logic;
	filters.value[index].operationSelected = true;
	filters.value[index].metadata = value;

	filters.value[index].value = null;
};

const updateValue = (value: {value: string, selectLabel: string} | string | number, indexOfFilter: number) => {
	let toSave = null;
	if (Array.isArray(value)) {
		toSave = value.map((item: any) => item.value);
		if (!toSave.length) {
			toSave = null;
		}
	} else {
		toSave = value.value ?? value;
	}
	filters.value[indexOfFilter].value = toSave;
};

const updateRangeValue = (value: string | number, indexOfFilter: number, indexOfNumber: number, dataType: any) => {
	if (Array.isArray(filters.value[indexOfFilter].value)) {
		filters.value[indexOfFilter].value[indexOfNumber] = value;
	} else {
		// Based on dataType pick correct values
		const tmp = numberTypes.includes(dataType) ? [0, 0] : [null, null];
		tmp[indexOfNumber] = value;
		filters.value[indexOfFilter].value = tmp;
	}
};

const updateGroupOperation = (value: String, index: number) => {
	filters.value[index].groupOperation = value;
};

const isClearButtonDisabled = computed(() => filters.value.length === 1 && !filters.value[0].columnReference);
const filtersHaveCorrectConfiguration = computed(() => filters.value.every((filter: any, index: number) => {
	if (filter.columnReference
		&& filter.operationSelected
		&& filter.dataType
		&& filter.metadata
		&& (filter.metadata.type === filterTypes.SIMPLE_ARRAY_COLUMN_VALUE
			? true
			: filter.logic)
		&& (filter.metadata.type === filterTypes.SIMPLE_COLUMN_VALUE && [filterLogic.EQUAL, filterLogic.NOT_EQUAL].includes(filter.logic)
			? true
			: filter.value !== null)) {
		if (filters.value.length > 1 && index < filters.value.length - 1) {
			return filter.groupOperation;
		}
		return true;
	}
	return false;
}));

const applyFilters = () => {
	const configuration = cloneDeep(widgetConfiguration.value.data.configuration);

	const toSave = {
		postAggregation: [],
		preAggregation: cloneDeep(filters.value),
		version: 'default/v1'
	};

	configuration.staticFilter = toSave;

	store.dispatch('widgetInstances/setConfiguration', {
		widgetInstanceId: props.widgetInstanceId,
		configuration,
		id: widgetConfiguration.value.data.id,
		datasetId: props.source.type === DATASOURCE_TYPES.DATASET ? props.source.id : null,
		catalogItemId: props.source.type === DATASOURCE_TYPES.CATALOG_ITEM ? props.source.id : null
	});
};

</script>

<style lang="scss" scoped>
.filter-bar-height {
	overflow-x: hidden;
	overflow-y: auto;
	height: calc(100vh - 296px);
}
</style>
