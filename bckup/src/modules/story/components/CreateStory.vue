<template>
	<div class="w-100 overflow-auto vh-100">
		<div>
			<app-loading :loading="autoCreate || creating" class="h-100">
				<ds-page-header>
					<ds-text variant="headline1">
						{{ $t('createStory.create') }}
					</ds-text>
				</ds-page-header>
				<ds-box padding-top="L">
					<ds-container class="w-75 mw-100 footer-margin">
						<ds-row v-if="!oneIntegration && saasLimitsState.getAlertVisibilityStatus('storyCreateInfoAlert')">
							<data-stories-limits-info type="storyCreateInfoAlert" class="mb-3 w-100">
								<template #default>
									<ds-text variant="subheadline">
										{{ $t('limits.createStoryInfoBox.title') }}
									</ds-text>
									<ds-text>{{ $t('limits.createStoryInfoBox.message') }}</ds-text>
								</template>
								<template #button>
									<data-stories-button center variant="secondary" @click="$router.push({name: 'billing'})">{{ $t('limits.createStoryInfoBox.button') }}</data-stories-button>
								</template>
							</data-stories-limits-info>
						</ds-row>

						<ds-row>
							<ds-card class="w-100 box-padding border-0" body-class="p-0">
								<ds-text variant="subheadline" color="display-content-700">
									{{ $t('createStory.chooseVisualisation') }}
								</ds-text>
								<ds-text variant="paragraph" color="display-content-base">
									{{ $t('createStory.chooseVisualisationDesc') }}
								</ds-text>
								<ds-box padding-top="L">
									<ds-row>
										<ds-col
											v-for="visualization in storyVisualizationTypes" :key="visualization.type"
											:cols="exploreFeature ? 4 : 6">
											<div
												class="w-100 h-100 selectable-box"
												:class="{'active-box': visualizationType === visualization.type}"
												:data-testid="visualization.type"
												@click="visualizationType = visualization.type">
												<input v-model="visualizationType" class="radio-margin" type="radio" :value="visualization.type">
												<ds-icon
													fill="separate-content-400"
													class="color-icon margin-icon"
													:name="visualization.icon"
													alt="1234" />
												<ds-box flex-type="column">
													<ds-text variant="bodyMedium" color="display-content-700">
														{{ visualization.title }}
													</ds-text>
													<ds-text variant="bodyRegular" color="display-content-base">
														{{ visualization.desc }}
													</ds-text>
													<ds-text variant="bodyRegular" color="display-content-base">
														{{ visualization.reason }}
													</ds-text>
												</ds-box>
											</div>
										</ds-col>
									</ds-row>
								</ds-box>
							</ds-card>
						</ds-row>
						<ds-row class="pt-2">
							<ds-card class="w-100 box-padding border-0" body-class="p-0">
								<ds-row>
									<ds-col cols="6">
										<ds-text variant="subheadline" color="display-content-700">
											{{ $t('createStory.chooseDataset') }}
										</ds-text>
										<ds-text variant="paragraph" color="display-content-base">
											{{ $t('createStory.chooseDatasetDesc') }}
										</ds-text>
									</ds-col>
								</ds-row>
								<ds-row v-if="oneIntegration">
									<ds-col cols="12">
										<ds-box padding-bottom="L">
											<ds-tab-buttons
												v-model:activeTab="activeTab"
												:tabs="dataSourceTypes"
												variant="button" />
										</ds-box>
									</ds-col>
								</ds-row>
								<ds-row>
									<ds-col cols="6">
										<app-input-bar
											v-model:input="datasetSearch" :placeholder="$t('t_search')"
											:right-icon="['fal', 'search']" data-testid="search" class="mb-2" />
									</ds-col>
								</ds-row>
								<ds-row>
									<ds-col cols="12">
										<div v-if="activeTab.name === sourceType.DATASET" class="dataset-list">
											<ds-dataset-list
												ref="datasetList"
												v-model:selected-datasets="selectedDatasets"
												selectable
												sortable
												on-row-select
												:actions="false"
												:search="datasetSearch" />
										</div>
										<ds-box v-else-if="activeTab.name === sourceType.CATALOG">
											<catalog-items-list
												:selected-catalog-items="selectedCatalogItems"
												clickable
												on-row-select
												:search="datasetSearch"
												@update-catalog-items="updateCatalogItems" />
										</ds-box>
									</ds-col>
								</ds-row>
							</ds-card>
						</ds-row>
					</ds-container>
				</ds-box>
				<div class="confirm-footer">
					<ds-box class="right-align">
						<ds-box flex-type="row" align="space-between">
							<ds-box padding-y="L" flex-type="row" align-y="center">
								<ds-box padding-right="S">
									<ds-text variant="captionMedium" color="display-content-500">
										{{ $t('createStory.selectDataAsset') }}
									</ds-text>
								</ds-box>
								<ds-box
									v-for="(item, index) in allItems" :key="index"
									padding-right="S">
									<ds-box
										flex-type="row" align-y="center" padding-x="S" padding-y="XS"
										border-radius="basic" class="ds-bg-interaction-100">
										<ds-box align-y="center" padding-right="XS">
											<ds-text variant="captionMedium" color="interaction" align="center">
												{{ item.type }}
											</ds-text>
										</ds-box>
										<ds-box
											align-y="center" padding-y="NONE" padding-x="S" border-radius="small"
											class="ds-bg-interaction-600">
											<ds-text color="white" variant="captionMedium">
												{{ item.name }}
											</ds-text>
										</ds-box>
									</ds-box>
								</ds-box>
							</ds-box>
							<ds-box padding="L">
								<ds-inline>
									<ds-box padding-right="L">
										<ds-btn variant="secondary" @click="routerBack">{{ $t('t_Cancel') }}</ds-btn>
									</ds-box>
									<ds-btn
										:disabled="disableCreate"
										class="ml-0"
										data-testid="confirm-btn"
										:class="{'disabled': disableCreate}"
										variant="primary"
										@click="createStory">
										{{ getCreateText }}
									</ds-btn>
								</ds-inline>
							</ds-box>
						</ds-box>
					</ds-box>
				</div>
			</app-loading>
		</div>
	</div>
</template>

<script>
import DsTabButtons from '@/components/main/button/DsTabButtons.vue';
import {mapActions, mapGetters} from 'vuex';
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import {storyServices} from '@/modules/story/storyServices';
import themes from '@/util/themes';
import {storyType, storyVisualizationTypes, dataSourceTypes, sourceType} from '@/modules/story/consts/storyType';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import DsDatasetList from '@/modules/dataset/components/DataStoriesDatasetList.vue';
import CatalogItemsList from '@/modules/story/components/create/components/CatalogItemsList.vue';
import AppLoading from '@/components/design/AppLoading.vue';
import {getDefaultWidgetConfig} from '@/modules/story/utils/storyUtils';
import {datasetService} from '@/modules/dataset/datasetService';
import {mapDatasetsToTable} from '@/modules/dataset/utils/datasetListUtils';
import {DATASOURCE_TYPES} from '@/modules/dataset/utils/datasetUtils';
import isEqual from 'lodash/isEqual';
import {notify} from '@kyvg/vue3-notification';
import {useSaasLimits} from '@/modules/limits/store/limits';
import DataStoriesButton from '@/components/main/DataStoriesButton.vue';
import {LimitStatus} from '@/modules/limits/consts/enums';
import DataStoriesLimitsInfo from '@/modules/limits/components/DataStoriesLimitsInfo.vue';

const pageFormats = [
	// TODO Need redesign and presenter support
	/*
	{
		name: 'a4Pt',
		label: 'A4 Portrait',
		size: {
			width: 1240,
			height: 1754
		}
	},
	*/
	{
		name: 'a4Ls',
		label: 'A4 Landscape',
		size: {
			width: 1754,
			height: 1240
		}
	}
];

export default {
	name: 'CreateStory',
	components: {
		DataStoriesButton,
		DataStoriesLimitsInfo,
		AppInputBar,
		DsDatasetList,
		CatalogItemsList,
		DsTabButtons,
		AppLoading
	},
	inject: ['appConfig'],
	props: {
		datasetId: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			creating: false,
			visualizationType: null,
			storyType,
			layoutConfiguration: null,
			selectedDatasets: [],
			datasetSearch: '',
			selectedSize: 'a4Ls',
			activeTab: dataSourceTypes[0],
			selectedCatalogItems: [],
			storyVisualizationTypes,
			sourceType,
			dataSourceTypes,
			saasLimitsState: null,
			showInfoBanner: true
		};
	},
	computed: {
		...mapGetters('storyDetail', ['story']),
		disableCreate() {
			const saasLimitsState = useSaasLimits();
			return (this.selectedDatasets.length === 0 && this.selectedCatalogItems.length === 0) || saasLimitsState.limitStatusStories.value === LimitStatus.ERROR;
		},
		exploreFeature() {
			return this.appConfig?.explorer;
		},
		getCreateText() {
			switch (this.visualizationType) {
				case storyType.DATA_DASHBOARD:
					return this.$t('createStory.newDashboard');
				case storyType.VISUAL_DATA_STORY:
					return this.$t('createStory.newStory');
				case storyType.DATA_EXPLORE:
					return this.$t('createStory.newExploration');
				default:
					return this.$t('createStory.newStory');
			}
		},
		allItems() {
			const datasets = this.selectedDatasets.map((dataset) => ({
				name: dataset.Name,
				type: 'Data Stories'
			}));
			const catalogItems = this.selectedCatalogItems.map((catalogItem) => ({
				name: catalogItem.Name,
				type: 'ONE'
			}));
			return datasets.concat(catalogItems);
		},
		oneIntegration() {
			return this.appConfig?.oneIntegration;
		},
		catalogItemsFromQuery() {
			return this.$route.query.catalogId ?? [];
		},
		datasetsFromQuery() {
			return this.$route.query.datasetId ?? [];
		},
		autoCreate() {
			return Boolean(this.$route.query.autoCreate);
		},
		user() {
			return this.$store.getters['authLogin/user'];
		}
	},
	beforeMount() {
		this.saasLimitsState = useSaasLimits();
		this.saasLimitsState.getActualStatistics();
	},
	async mounted() {
		if (!this.exploreFeature) {
			this.storyVisualizationTypes = this.storyVisualizationTypes.filter((visualization) => visualization.type !== storyType.DATA_EXPLORE);
		}

		if (this.datasetId) {
			const preselectedDataset = await datasetService.getDatasetById(this.datasetId);
			for (const mappedDatset of mapDatasetsToTable([preselectedDataset], this.user.id)) {
				this.selectedDatasets.push(mappedDatset);
			}
		}

		if (this.$route.params.preselectedType) {
			this.visualizationType = this.$route.params.preselectedType;
		} else if (this.$route.query.preselectedType && Object.values(storyType).includes(this.$route.query.preselectedType)) {
			this.visualizationType = this.$route.query.preselectedType;
		} else {
			this.visualizationType = storyType.VISUAL_DATA_STORY;
		}

		if (this.catalogItemsFromQuery.length > 0) {
			this.activeTab = {name: 'Catalog'};
		}

		// Check if query have autocreate, then create story
		if (this.autoCreate) {
			const catalogs = Array.isArray(this.catalogItemsFromQuery) ? this.catalogItemsFromQuery : [this.catalogItemsFromQuery];
			const datasets = Array.isArray(this.datasetsFromQuery) ? this.datasetsFromQuery : [this.datasetsFromQuery];

			this.selectedCatalogItems = catalogs.map((item) => ({Id: item}));
			this.selectedDatasets = datasets.map((item) => ({Id: item}));

			if (this.selectedCatalogItems.length || this.selectedDatasets.length) {
				this.createStory();
			} else {
				notify({
					type: 'danger',
					text: this.$t('errors.createStory'),
					duration: 5000
				});
				this.$router.push({name: 'homepage'});
			}
		}
	},
	methods: {
		updateCatalogItems(data) {
			this.selectedCatalogItems = data;
		},
		...mapActions('flashMessages', ['addMessage']),
		routerBack() {
			this.$router.back();
		},
		convertPageSize(pageSize, fromSize = false) {
			return pageFormats.filter((pageFormat) => isEqual(
				pageFormat[fromSize ? 'size' : 'name'],
				pageSize
			))[0]?.[fromSize ? 'name' : 'size'] ?? (
				fromSize
					? null
					: {
						width: 1000,
						height: 1000
					}
			);
		},
		async createStory() {
			try {
				this.creating = true;
				const selectedDataSources = [
					...this.selectedDatasets.map((dataset) => ({type: DATASOURCE_TYPES.DATASET, id: dataset.Id})),
					...this.selectedCatalogItems.map((catalogItem) => ({type: DATASOURCE_TYPES.CATALOG_ITEM, id: catalogItem.Id}))
				];
				if (this.visualizationType === storyType.DATA_EXPLORE) {
					const {createExploration} = useExplorerChart();
					await createExploration(selectedDataSources);
				} else {
					const createStoryConfig = {
						name: this.visualizationType === storyType.DATA_DASHBOARD ? 'My dashboard' : 'My story',
						storyType: this.visualizationType,
						layoutConfiguration: {
							version: 'default/v0',
							theme: themes[0],
							...(this.visualizationType === storyType.DATA_DASHBOARD ? {dimensions: this.convertPageSize(this.selectedSize)} : {})
						},
						configuration: {
							version: 'default/v0'
						},
						defaultWidget: getDefaultWidgetConfig(this.visualizationType)
					};

					const createdStoryData = await storyServices.createStory(createStoryConfig);
					await storyServices.addDataSourcesToStory(createdStoryData.id, selectedDataSources);
					await this.$router.push({
						name: 'story-editor',
						params: {id: createdStoryData.id}
					});
				}
			} catch (error) {
				this.creating = false;
				this.addMessage({
					variant: 'danger',
					text: error?.response?.data?.message ?? this.$t('errors.loadStory')
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.selectable-box{
	border: 2px solid map-get($ds-colors, 'separate-content-200');
	border-radius: 8px;
	padding: 16px 0;
	display: inline-flex;
	cursor: pointer;
}
.color-icon :deep(.nav-icon-a) {
	fill: map-get($ds-colors, 'separate-content-400')!important;
}
.margin-icon{
	margin: auto 20px auto 0;
}
.type-title{
	margin-bottom: 4px;
	color: map-get($ds-colors, 'display-content-700');
}
.dataset-list{
	height: 100%;
	width: 100%;
}
.radio-margin {
	margin: auto 20px;
}
.active-box {
	background-color: map-get($ds-colors, 'interaction-0');
	border: 2px solid map-get($ds-colors, 'interaction-500');

	:deep(.color-icon) {
		fill: map-get($ds-colors, 'secondary-400')!important;
	}
}
.confirm-footer {
	z-index: 1;
	height: 84px;
	width: calc(100vw - 56px);
	position: fixed;
	bottom: 0;
	box-shadow: 0px -1px 0px #E2E7EB;
	background-color: map-get($ds-colors, 'white');
}

.right-align {
	width: 87.5%;
	margin-left: auto;
	margin-right: 0
}
.confirm-buttons {
	float: right;
}
.btn {
	margin: 24px;
}
.box-padding {
	padding: 48px;
}
.margin-bottom-24 {
	margin-bottom: 24px;
}
.padding-top-108{
	padding-top: 58px;
	padding-left: 0;
	padding-bottom: 24px;
}
.footer-margin {
	padding-bottom: 90px;
}
.btn.disabled {
	background-color:  map-get($ds-colors, 'display-content-300');
	border-color:  map-get($ds-colors, 'display-content-300');
	color: white;
}

.flex {
	display: flex;
}

.btn-active {
	border-bottom: solid 2px map-get($ds-colors, 'primary');
}
</style>
