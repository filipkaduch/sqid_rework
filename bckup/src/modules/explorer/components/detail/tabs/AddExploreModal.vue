<template>
	<ds-modal
		:show="show"
		:header-text="$t('explore.addNewTab')"
		size="md"
		footer-class="h-100"
		confirmText="explore.add"
		cancel-text="modals.cancel"
		@ok="addExplores"
		@cancel="$emit('closeModal')">
		<template #modal-text>
			<ds-box v-if="oneIntegration" padding-bottom="L">
				<ds-tab-buttons
					v-model:activeTab="activeTab"
					:tabs="dataSourceTypes"
					variant="button"
					:search="searchTerm" />
			</ds-box>
			<ds-box padding-bottom="S">
				<ds-search-input v-model:search="searchTerm" debounce />
			</ds-box>
			<ds-box v-if="activeTab.name === sourceType.DATASET" class="dataset-list">
				<ds-dataset-list
					ref="datasetList"
					v-model:selected-datasets="selectedDatasets"
					selectable
					sortable
					:actions="false"
					on-row-select
					:search="searchTerm" />
			</ds-box>
			<ds-box v-else-if="activeTab.name === sourceType.CATALOG">
				<catalog-items-list
					:selected-catalog-items="selectedCatalogItems"
					:search="searchTerm"
					clickable
					on-row-select
					@update-catalog-items="updateCatalogItems" />
			</ds-box>
		</template>
	</ds-modal>
</template>

<script lang="ts">
import {defineComponent, inject, ref, watch} from 'vue';
import DsTabButtons from '@/components/main/button/DsTabButtons.vue';
import DsDatasetList from '@/modules/dataset/components/DataStoriesDatasetList.vue';
import CatalogItemsList from '@/modules/story/components/create/components/CatalogItemsList.vue';
import {dataSourceTypes, sourceType} from '@/modules/story/consts/storyType';
import {DATASOURCE_TYPES} from '@/modules/dataset/utils/datasetUtils';

export default defineComponent({
	components: {
		DsTabButtons,
		DsDatasetList,
		CatalogItemsList
	},
	props: {
		show: {
			type: Boolean,
			default: false
		}
	},
	emits: ['closeModal', 'addExplores'],
	setup(props, {emit}) {
		const appConfig = inject('appConfig');
		const activeTab = ref(dataSourceTypes[0]);
		// @ts-ignore
		const oneIntegration = appConfig?.oneIntegration;
		const searchTerm = ref('');

		const selectedDatasets = ref([]);
		const selectedCatalogItems = ref([]);

		const updateCatalogItems = (data: any) => {
			selectedCatalogItems.value = data;
		};

		const addExplores = () => {
			const selectedD = selectedDatasets.value.map((item: any) => ({id: item.Id, type: DATASOURCE_TYPES.DATASET}));
			const selectedC = selectedCatalogItems.value.map((item: any) => ({id: item.Id, type: DATASOURCE_TYPES.CATALOG_ITEM}));
			emit('closeModal');
			emit('addExplores', [...selectedD, ...selectedC]);
		};

		watch(() => props.show, (value) => {
			if (value) {
				selectedDatasets.value = [];
				selectedCatalogItems.value = [];
				activeTab.value = {...dataSourceTypes[0]};
				searchTerm.value = '';
			}
		});

		return {
			props,
			activeTab,
			searchTerm,
			selectedDatasets,
			selectedCatalogItems,
			updateCatalogItems,
			addExplores,
			sourceType,
			dataSourceTypes,
			oneIntegration
		};
	}
});
</script>

<style lang="scss" scoped>
</style>
