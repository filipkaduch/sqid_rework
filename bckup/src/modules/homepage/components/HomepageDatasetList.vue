<template>
	<div>
		<ds-box
			padding-x="M"
			align-y="center"
			padding-bottom="XL">
			<ds-inline align="space-between" align-y="center" style="height: 36px">
				<ds-text variant="subheadline">
					{{ $t('t_Datasets') }}
				</ds-text>
				<filter-select :items="datasetFilters" :default-value="[datasetFilters[0]]" @selected="filter = $event" />
			</ds-inline>
		</ds-box>
		<app-loading :loading="loading">
			<ds-box padding-x="M">
				<ds-box
					v-if="!datasets.length"
					align-y="center"
					align="center"
					border-radius="basic"
					border="disabled"
					class="ds-bg-display-content-0 empty-state-container">
					<ds-box padding-bottom="S">
						<ds-text variant="headline1" color="display-content-700">
							{{ $t('emptyStates.datasets.noContent') }}
						</ds-text>
					</ds-box>
					<ds-text align="center" color="display-content-400" class="empty-text-container">
						{{ $t('emptyStates.datasets.needToUploadDataset') }}
					</ds-text>
					<ds-box padding-top="L">
						<ds-btn variant="secondary" @click="$router.push({name: 'dataset-create'})">
							{{ $t('emptyStates.datasets.upload') }}
						</ds-btn>
					</ds-box>
				</ds-box>
			</ds-box>
			<ds-box v-for="(dataset, index) in datasets" :key="index" padding-x="M" padding-bottom="M">
				<ds-box
					border="disabled"
					border-radius="basic"
					padding-x="M"
					padding-y="S"
					class="cursor-pointer ds-bg-white card-shadow"
					@click="$router.push({name: 'dataset-detail',params: {id: dataset.id}})">
					<ds-inline align="space-between" align-y="center" no-wrap>
						<ds-inline align-y="center" no-wrap class="w-100">
							<ds-inline-item>
								<ds-icon :name="getIcon(dataset)" />
							</ds-inline-item>
							<ds-inline-item flex-grow="1">
								<ds-box padding-left="S" padding-y="S">
									<ds-text variant="subheadline" class="overflow-ellipsis">
										{{ dataset.name }}
									</ds-text>
								</ds-box>
							</ds-inline-item>
						</ds-inline>
						<!-- TODO uncomment if PM/Design decides whether these should be aligned in columns or inline -->
						<!--<ds-row class="d-flex justify-content-end align-items-center">
							<ds-col class="w-100 px-3 d-flex justify-content-end">
								<data-stories-sharing-avatar
									v-if="dataset.ownedBy.id !== user.id && dataset.ownedBy.lastName"
									:first-name="dataset.ownedBy.firstName"
									:last-name="dataset.ownedBy.lastName" />
							</ds-col>
							<ds-col class="d-flex px-3 justify-content-end">
								<ds-tooltip v-if="dataset.storyCount">
									<template v-slot:icon>
										<ds-box
											align="center"
											align-y="center"
											padding-x="XS"
											border-radius="big"
											class="ds-bg-separate-content-100">
											<ds-text variant="caption" color="display-content">
												{{ dataset.storyCount }}
											</ds-text>
										</ds-box>
									</template>
									<template v-slot:tooltip>
										{{ $t('t_UsageInStories') }}
									</template>
								</ds-tooltip>
							</ds-col>
							<ds-col class="w-100 px-3 d-flex justify-content-end">
								<data-stories-badge
									v-if="getBadgeVariant(dataset).showBadge"
									:variant="getBadgeVariant(dataset).badgeVariant"
									:text="getBadgeVariant(dataset).badgeText" />
							</ds-col>
							<ds-col class="w-100 d-flex justify-content-end px-3">
								<ds-dropdown placement="bottom-end">
									<template v-slot:triggerContent>
										<ds-btn variant="ghost" icon-only @click.stop.prevent>
											<template v-slot:icon>
												<ds-icon class="menu-icon" name="ds-icon-three-dots-vertical" />
											</template>
										</ds-btn>
									</template>
									<template v-slot:dropdownContent>
										<dropdown-menu :items="datasetDropdownMenu" @update:selected="executeAction($event, dataset)" />
									</template>
								</ds-dropdown>
							</ds-col>
						</ds-row>-->
						<ds-inline align-y="center" no-wrap gap="L">
							<data-stories-sharing-avatar
								v-if="dataset.ownedBy.id !== user.id && dataset.ownedBy.lastName"
								:first-name="dataset.ownedBy.firstName"
								:last-name="dataset.ownedBy.lastName" />
							<ds-tooltip v-if="dataset.storyCount">
								<template #icon>
									<ds-box
										align="center"
										align-y="center"
										padding-x="XS"
										border-radius="big"
										class="ds-bg-separate-content-100">
										<ds-text variant="caption" color="display-content" no-wrap>
											{{ dataset.storyCount }}
										</ds-text>
									</ds-box>
								</template>
								<template #tooltip>
									{{ $t('t_UsageInStories') }}
								</template>
							</ds-tooltip>
							<data-stories-badge
								v-if="getBadgeVariant(dataset).showBadge"
								:variant="getBadgeVariant(dataset).badgeVariant"
								:text="getBadgeVariant(dataset).badgeText" />
							<ds-dropdown placement="bottom-end">
								<template #triggerContent>
									<ds-btn variant="ghost" icon-only @click.stop.prevent>
										<template #icon>
											<ds-icon class="menu-icon" name="ds-icon-three-dots-vertical" />
										</template>
									</ds-btn>
								</template>
								<template #dropdownContent>
									<dropdown-menu-basic :items="cleanDatasetDropdownMenu(dataset)" @update:selected="executeAction($event, dataset)" />
								</template>
							</ds-dropdown>
						</ds-inline>
					</ds-inline>
				</ds-box>
			</ds-box>
		</app-loading>
		<app-delete-dataset-modal
			:show-modal="showDeleteModal"
			:dataset-id="selectedDataset?.id ?? ''"
			:ownedByUser="ownedByUser"
			@deleted="loadNextPage(filter.value, filter.order, true)"
			@close-modal="showDeleteModal = false" />
		<auto-update
			:dataset="selectedDataset"
			:show="showUpdateModal"
			@close-modal="showUpdateModal = false" />
	</div>
</template>

<script lang="ts">
import {DATASET_ACTIONS, DATASET_GETTERS, DATASET_STORE_NAME} from '@/modules/dataset/store/types';
import DataStoriesBadge from '@/components/main/Badge/DataStoriesBadge.vue';
import {actionValues, getBannersValues, getDatasetStatus, getSourceIcon} from '@/modules/dataset/utils/dataset';
import {DatasetStatus} from '@/modules/dataset/consts/enums';
import AppLoading from '@/components/design/AppLoading.vue';
import FilterSelect from '@/modules/homepage/components/FilterSelect.vue';
import {computed, defineComponent, reactive, toRefs, watch, onBeforeMount, nextTick, ref} from 'vue';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;
import cloneDeep from 'lodash/cloneDeep';
import DropdownMenuBasic from '@/components/main/Dropdown/DropdownMenuBasic.vue';
// eslint-disable-next-line no-unused-vars
import {SelectItem} from '@/components/main/Dropdown/types';
import {datasetDropdownMenu, menuValues} from '@/modules/dataset/consts/consts';
import AppDeleteDatasetModal from '@/modules/dataset/components/AppDeleteDatasetModal.vue';
import AutoUpdate from '@/modules/dataset/components/detail/AutoUpdate.vue';
import DataStoriesSharingAvatar from '@/components/shared/DataStoriesSharingAvatar.vue';
import {storyType} from '@/modules/story/consts/storyType';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {useSaasLimits} from '@/modules/limits/store/limits';
import {LimitStatus} from '@/modules/limits/consts/enums';

const datasetFilters = [
	{
		value: 'UPDATED-AT',
		order: 'DESC',
		label: t('t_Newest')
	},
	{
		value: 'CREATED-AT',
		order: 'DESC',
		label: t('t_DateCreated')
	}
];
export default defineComponent({
	name: 'HomepageDatasetList',
	components: {
		DataStoriesSharingAvatar,
		AutoUpdate,
		AppDeleteDatasetModal,
		DropdownMenuBasic,
		FilterSelect,
		AppLoading,
		DataStoriesBadge
	},
	emits: ['refreshStatistics'],
	// eslint-disable-next-line max-lines-per-function
	setup(props, {emit}) {
		const store = useStore();
		const router = useRouter();
		const state = reactive({
			filter: datasetFilters[0],
			selectedAction: null as null | SelectItem,
			showUpdateModal: false,
			selectedDataset: null as any
		});
		const showDeleteModal = ref(false);

		const datasets = computed(() => store.getters[`${DATASET_STORE_NAME}/${DATASET_GETTERS.DATASETS}`]);
		const loading = computed(() => store.getters[`${DATASET_STORE_NAME}/${DATASET_GETTERS.LOADING}`]);
		const loadNextPage = (orderByField?: string, orderByDir?: string, refreshStatistics?: boolean) => {
			store.dispatch(`${DATASET_STORE_NAME}/${DATASET_ACTIONS.LOAD_NEXT_PAGE}`, {
				reset: true,
				limit: 12,
				orderByField,
				orderByDir
			});
			if (refreshStatistics) {
				emit('refreshStatistics');
			}
		};
		watch(() => state.filter, (filter) => {
			loadNextPage(filter.value, filter.order);
		});

		onBeforeMount(() => {
			loadNextPage();
		});

		const getIcon = (dataset: any) => getSourceIcon(dataset);
		const getBadgeVariant = (dataset: any) => {
			const status = getDatasetStatus(dataset);
			const stepInfo = status === DatasetStatus.VALID ? null : (dataset.latestScheduledJobRun?.statusParams?.stepDescription ?? null);

			return getBannersValues(status, stepInfo);
		};
		const executeAction = (action: SelectItem, dataset: any) => {
			state.selectedDataset = dataset;
			nextTick(() => {
				switch (action.value) {
					case menuValues.CREATE_STORY:
						router.push({
							name: 'create-story',
							params: {id: dataset.id}
						});
						break;
					case menuValues.CREATE_EXPLORATION:
						router.push({
							name: 'create-story',
							params: {id: dataset.id, preselectedType: storyType.DATA_EXPLORE}
						});
						break;
					case menuValues.UPDATE_CYCLE:
						state.showUpdateModal = true;
						break;
					case menuValues.REFRESH:
						break;
					case menuValues.DELETE:
						showDeleteModal.value = true;
						break;
				}
			});
		};

		const user = computed(() => store.getters['authLogin/user']);
		const ownedByUser = computed(() => state.selectedDataset?.ownedById === user.value.id);

		const saasLimitsState = useSaasLimits();
		const datasetDropdownMenuLimited = computed(() => datasetDropdownMenu.map((item: SelectItem) => {
			if (saasLimitsState.limitStatusStories.value === LimitStatus.ERROR) {
				if (item.value === menuValues.CREATE_STORY || item.value === menuValues.CREATE_EXPLORATION) {
					item.disabled = true;
				}
			} else {
				item.disabled = false;
			}
			return item;
		}));

		const cleanDatasetDropdownMenu = (dataset: any) => {
			let cleanedMenu = cloneDeep(datasetDropdownMenuLimited.value);
			const status = getDatasetStatus(dataset);
			if (status === DatasetStatus.ERROR || status === DatasetStatus.NO_DATA) {
				cleanedMenu = cleanedMenu.filter((actionItem) => actionItem.value !== actionValues.CREATE_STORY
					&& actionItem.value !== actionValues.CREATE_EXPLORATION);
			}
			return cleanedMenu;
		};

		return {
			...toRefs(state),
			datasets,
			loading,
			getIcon,
			getBadgeVariant,
			datasetFilters,
			cleanDatasetDropdownMenu,
			datasetDropdownMenu,
			executeAction,
			loadNextPage,
			ownedByUser,
			user,
			showDeleteModal
		};
	}
});
</script>

<style lang="scss" scoped>
.menu-icon {
	fill: map-get($ds-colors, 'display-content-300')
}

.overflow-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1; /* number of lines to show */
	line-clamp: 1;
	-webkit-box-orient: vertical;
}

.empty-state-container {
	height: 400px;
	.empty-text-container {
		max-width: 250px;
	}
}
</style>
