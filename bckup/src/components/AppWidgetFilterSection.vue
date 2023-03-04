<template>
	<div
		class="mx-0 mb-0 mt-4 p-0 col-12"
		style="border-radius: 5px; box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15); background-color: white">
		<div>
			<button
				class="btn btn-clean w-100 m-0 p-0 bg-white"
				style="border-radius: 5px;"
				data-testid="filters-section"
				@click="collapse = !collapse">
				<span class="d-flex justify-content-between align-items-center">
					<span class="d-inline-flex align-items-center p-3" style="color: #2D3038; font-size: 17px; font-weight: bold;">
						<span
							style="border-radius: 50%;
								background-color: #D3E0FC;
								height: 35px;
								width: 35px;
								color: #1357E9;
								padding: 8px;
								justify-content: center;
								display: inline-flex;
								margin-right: 5px">
							<ds-icon
								class="inline-svg mt-1"
								name="icon filter blue"
								alt="icon" />
						</span>
						{{ $t('t_Filter') }}
					</span>
					<span class="text-black">
						<fa-icon :icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']" class="m-2 mr-3" />
					</span>
				</span>
			</button>
			<ds-collapse :is-open="collapse" class="w-100 mt-1bg-white">
				<filter-select-new
					:source="source"
					:widget-instance-id="selectedWidgetId"
					:columns="columns" />
			</ds-collapse>
		</div>
	</div>
</template>

<script setup lang="ts">
import FilterSelectNew from '@/modules/widget/components/widget-controls/filter/FilterSelectNew.vue';
import {DATASOURCE_TYPES} from '@/modules/dataset/utils/datasetUtils';
import useFilters from '@/modules/widget/components/widget-controls/filter/useFilters';
import {TELLSTORY_ROW_ID} from '@/modules/dataset/utils/dataset';
import {computed, ref} from 'vue';

const collapse = ref(false);

const {widgetConfiguration, findSource, selectedWidgetId} = useFilters();

const datasetId = computed(() => widgetConfiguration.value.data.datasetId);
const catalogItemId = computed(() => widgetConfiguration.value.data.catalogItemId);

const source = computed(() => ({
	type: datasetId.value ? DATASOURCE_TYPES.DATASET : DATASOURCE_TYPES.CATALOG_ITEM,
	id: datasetId.value ? datasetId.value : catalogItemId.value
}));

const columns = computed(() => {
	const sourceData = findSource(source.value);
	const tmp = sourceData?.columns ?? sourceData.attributes;
	return tmp.filter((item: any) => item.name !== TELLSTORY_ROW_ID);
});
</script>
