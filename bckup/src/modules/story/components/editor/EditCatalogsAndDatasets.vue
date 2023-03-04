<template>
	<ds-modal
		:show="show"
		header-text="t_StoryConnect"
		size="md"
		footer-class="h-100"
		confirmText="t_EditStory"
		cancelText="modals.cancel"
		@ok="editStory"
		@cancel="$emit('closeModal')">
		<template #modal-text>
			<ds-box v-if="oneIntegration" padding-bottom="L">
				<ds-tab-buttons
					v-model:activeTab="activeTab"
					:tabs="dataSourceTypes"
					variant="button" />
			</ds-box>
			<app-input-bar v-model:input="searchTerm" :placeholder="$t('t_search')" :right-icon="['fal', 'search']" />
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
import {computed, defineComponent, inject, ref} from 'vue';
import DsTabButtons from '@/components/main/button/DsTabButtons.vue';
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import DsDatasetList from '@/modules/dataset/components/DataStoriesDatasetList.vue';
import CatalogItemsList from '@/modules/story/components/create/components/CatalogItemsList.vue';
import {storyServices} from '@/modules/story/storyServices';
import {dataSourceTypes, sourceType} from '@/modules/story/consts/storyType';
import {DATASOURCE_TYPES} from '@/modules/dataset/utils/datasetUtils';
import {useStore} from 'vuex';
import {notify} from '@kyvg/vue3-notification';
import i18n from '@/plugins/i18n/index';
const {t} = i18n.global;

export default defineComponent({
	components: {
		AppInputBar,
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
	emits: ['closeModal', 'reloadStory'],
	setup(props, {emit}) {
		const store = useStore();
		const appConfig = inject('appConfig');

		const story = computed(() => store.getters['storyDetail/story']);
		// @ts-ignore
		const oneIntegration = appConfig?.oneIntegration;

		const searchTerm = ref('');

		const activeTab = ref(dataSourceTypes[0]);

		const selectedDatasets = ref(story.value.datasets.map((dataset: any) => ({Id: dataset.id})));
		const selectedCatalogItems = ref(story.value.catalogItems.map((catalog: any) => ({Id: catalog.catalogItemId})));

		const editStory = async() => {
			const datasets = story.value.datasets.map((dataset: any) => dataset.id);
			const selectedD = selectedDatasets.value.map((item: any) => item.Id);
			const toAddDataset = selectedD.filter((datasetId: any) => !datasets.includes(datasetId));
			const toDeleteDataset = datasets.filter((datasetId: any) => !selectedD.includes(datasetId));

			const catalogs = story.value.catalogItems.map((catalog: any) => catalog.catalogItemId);
			const selectedC = selectedCatalogItems.value.map((item: any) => item.Id);
			const toAddCatalog = selectedC.filter((catalogId: any) => !catalogs.includes(catalogId));
			const toDeleteCatalog = catalogs.filter((catalogId: any) => !selectedC.includes(catalogId));
			const dataSourcesToAdd = [
				...toAddDataset.map((datasetId: string) => ({id: datasetId, type: DATASOURCE_TYPES.DATASET})),
				...toAddCatalog.map((catalogId: string) => ({id: catalogId, type: DATASOURCE_TYPES.CATALOG_ITEM}))
			];
			const dataSourcesToDelete = [
				...toDeleteDataset.map((datasetId: string) => ({id: datasetId, type: DATASOURCE_TYPES.DATASET})),
				...toDeleteCatalog.map((catalogId: string) => ({id: catalogId, type: DATASOURCE_TYPES.CATALOG_ITEM}))
			];
			try {
				if (dataSourcesToAdd.length > 0) {
					await storyServices.addDataSourcesToStory(story.value.id, dataSourcesToAdd);
				}
				if (dataSourcesToDelete.length > 0) {
					await storyServices.deleteDataSourcesFromStory(story.value.id, dataSourcesToDelete);
				}
				setTimeout(() => {
					emit('reloadStory');
					emit('closeModal');
				}, 500);
			} catch (err) {
				notify({
					type: 'danger',
					text: err?.response?.data?.error?.message ?? t('t_UnexpectedError'),
					duration: 5000
				});
			}
		};

		const updateCatalogItems = (data: any) => {
			selectedCatalogItems.value = data;
		};

		return {
			props,
			searchTerm,
			activeTab,
			selectedDatasets,
			selectedCatalogItems,
			story,
			editStory,
			updateCatalogItems,
			sourceType,
			dataSourceTypes,
			oneIntegration
		};
	}
});
</script>

<style lang="scss" scoped>
</style>
