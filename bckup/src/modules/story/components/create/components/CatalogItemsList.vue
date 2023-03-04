<template>
	<ds-box padding-top="L">
		<app-loading :loading="loading" relative-parent>
			<ds-table
				data-testid="catalogItemTable"
				:table-header="catalogTableHeader"
				:table-rows="catalogTableData"
				:sticky-header="true"
				:dynamic-width="false"
				:data-table="false"
				:pagination="true"
				:row-select="onRowSelect"
				:total-rows="totalRows"
				@row-clicked="onRowSelect ? updateSelectedCatalogItems($event, !selectedCatalogItems.some((item) => item.Id === $event[schemaNames.id])) : null"
				@get-more-data="getMoreData">
				<template #default="{row, column}">
					<ds-box v-if="column.name === schemaNames.checkbox" align-y="center">
						<ds-check-box
							:state="selectedCatalogItems.some((item) => item.Id === row[schemaNames.id])"
							outline
							@update:state="updateSelectedCatalogItems(row, $event)" />
					</ds-box>
					<div v-else-if="column.name === schemaNames.name" @click="!clickable ? showCatalogItem(row) : null">
						<ds-inline align-y="center" padding-x="M" class="overflow-cell">
							<ds-icon :name="getIcons(row[schemaNames.connectionType])" />
							<ds-box padding-left="S">
								<ds-text>
									<span @click.prevent="clickable ? showCatalogItem(row) : null">{{ row[schemaNames.name] }}</span>
								</ds-text>
							</ds-box>
						</ds-inline>
					</div>
				</template>
			</ds-table>
		</app-loading>
	</ds-box>
</template>

<script lang="ts">
import {datasetService} from '@/modules/dataset/datasetService';
import {computed, defineComponent, inject, onMounted, reactive, ref, toRef, watch} from 'vue';
import AppLoading from '@/components/design/AppLoading.vue';
import {getIcons} from '@/modules/story/utils/datasetUtils';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;
import {useNotification} from '@kyvg/vue3-notification';
import {useRoute} from 'vue-router';

export default defineComponent({
	components: {
		AppLoading
	},
	props: {
		clickable: {
			type: Boolean,
			default: false
		},
		selectedCatalogItems: {
			type: Array,
			default: () => []
		},
		onRowSelect: {
			type: Boolean,
			default: false
		},
		search: {
			type: String,
			default: ''
		}
	},
	emits: ['updateCatalogItems'],
	setup(props, {emit}) {
		const route = useRoute();
		const appConfig = inject('appConfig');
		const notification = useNotification();
		const translate = (word: string) => t(word);
		const catalogItems = ref();
		const totalRows = ref(0);
		const loading = ref(false);
		const pagination = reactive({
			offset: 0,
			limit: 20,
			searchTerm: toRef(props, 'search')
		});

		watch(() => props.search, async() => {
			catalogItems.value = await datasetService.getCatalogItems(pagination);
			totalRows.value = catalogItems.value?.pagination.count;
		});

		onMounted(async() => {
			loading.value = true;
			catalogItems.value = await datasetService.getCatalogItems(pagination);
			totalRows.value = catalogItems.value?.pagination.count;

			// Get catalog Items from route and from props
			let catalogIds = route.query.catalogId ?? [];

			const toUpdate = [] as any;

			if (catalogIds) {
				// If there is only one param cast it to array
				if (!Array.isArray(catalogIds)) {
					catalogIds = [catalogIds];
				}
				// For each id check if it exist and update
				catalogIds.forEach(async(catalogId) => {
					const findCatalog = catalogTableData.value.find((row: any) => row.Id === catalogId);
					if (findCatalog) {
						toUpdate.push(findCatalog);
					} else {
						// If id doesnt exist in our data get catalog by id
						try {
							let catalog = await datasetService.getCatalogItemsDetail(catalogId!);
							catalogItems.value.data.unshift(catalog);

							catalog = {
								[`${schemaNames.checkbox}`]: '',
								[`${schemaNames.connectionType}`]: catalog.connection.executorType,
								[`${schemaNames.name}`]: catalog.name,
								[`${schemaNames.attributes}`]: catalog.numberOfAttributes ?? '-',
								[`${schemaNames.records}`]: catalog.numberOfRecords ?? '-',
								[`${schemaNames.id}`]: catalog.id
							};
							toUpdate.push(catalog);
						} catch (err) {
							// @ts-ignore
							notification.notify({
								type: 'danger',
								text: 'Some err occured',
								duration: 5000
							});
						}
					}
				});
				loading.value = false;
			}
			updateSelectedCatalogItems(toUpdate, true);
		});

		const showCatalogItem = (column: any) => {
			// @ts-ignore
			if (appConfig.templates.catalogUrl && appConfig.templates.catalogItemDetailUrl) {
				// @ts-ignore
				const createUrl = `${appConfig.templates.catalogUrl}${appConfig.templates.catalogItemDetailUrl.replace('<ID>', column.Id)}`;
				window.open(createUrl, '_blank');
			}
		};

		const schemaNames = {
			checkbox: translate('createStory.datasetTable.checkbox'),
			connectionType: translate('createStory.datasetTable.connectionType'),
			name: translate('createStory.datasetTable.name'),
			attributes: translate('createStory.datasetTable.attributes'),
			records: translate('createStory.datasetTable.records'),
			id: translate('createStory.datasetTable.id')
		};

		const catalogTableHeader = [
			{
				name: schemaNames.checkbox,
				type: 'string',
				hidden: true
			},
			{
				name: schemaNames.name,
				type: 'string'
			},
			{
				name: schemaNames.attributes,
				type: 'string'
			},
			{
				name: schemaNames.records,
				type: 'string'
			}
		];

		const catalogTableData = computed(() => catalogItems.value?.data.reduce((data: any, item: any) => {
			if (item.name !== '__tellstory_row_id__') {
				data.push({
					[`${schemaNames.checkbox}`]: '',
					[`${schemaNames.connectionType}`]: item.connection.executorType,
					[`${schemaNames.name}`]: item.name,
					[`${schemaNames.attributes}`]: item.numberOfAttributes ?? '-',
					[`${schemaNames.records}`]: item.numberOfRecords ?? '-',
					[`${schemaNames.id}`]: item.id
				});
			}
			return data;
		}, []));

		const updateSelectedCatalogItems = (catalogs: any, selected: boolean) => {
			const selectedContainsId = props.selectedCatalogItems.some((item: any) => item.Id === catalogs.Id);

			// Check if array (when loading component)
			if (Array.isArray(catalogs)) {
				// If there are new items use catalogs, if not use selected
				if (catalogs.length) {
					emit('updateCatalogItems', catalogs);
				} else {
					emit('updateCatalogItems', props.selectedCatalogItems);
				}
			// Check if seleced contains id (when check/uncheck catalog item)
			} else if (selectedContainsId && !selected) {
				emit('updateCatalogItems', props.selectedCatalogItems.filter((item: any) => item.Id !== catalogs.Id));
			} else if (!selectedContainsId && selected) {
				emit('updateCatalogItems', props.selectedCatalogItems.concat([catalogs]));
			}
		};

		const getMoreData = async() => {
			pagination.offset += 20;
			const {data} = await datasetService.getCatalogItems(pagination);
			catalogItems.value.data = catalogItems.value.data.concat(data);
		};

		return {
			catalogTableHeader,
			catalogTableData,
			totalRows,
			schemaNames,
			showCatalogItem,
			updateSelectedCatalogItems,
			getIcons,
			getMoreData,
			pagination,
			loading
		};
	}
});
</script>

<style lang="scss" scoped>

.overflow-cell {
	text-decoration: underline;
	max-width: 250px !important;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
