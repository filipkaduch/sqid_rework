<template>
	<div>
		<template v-if="story && (story.datasets.length > 0 || story.catalogItems.length > 0)">
			<ds-box v-if="story.datasets.length > 0">
				<ds-text variant="caption" color="display-content-300">
					{{ $t('editor.datasets') }}
				</ds-text>
				<ds-box v-for="(dataset, index) in story.datasets" :key="index">
					<ds-box
						:border-bottom="index !== story.datasets.length - 1 ? 'separate' : 'none'"
						padding-x="M"
						class="cursor-pointer">
						<ds-inline align="space-between" align-y="center" no-wrap>
							<ds-inline align-y="center" no-wrap class="w-50">
								<ds-inline-item>
									<ds-icon :name="getSourceIcon(dataset.latestScheduledJobRun?.externalRunnerReference.jobType)" />
								</ds-inline-item>
								<ds-inline-item flex-grow="1">
									<ds-box padding-left="S" padding-y="S">
										<ds-text variant="bodyMedium" color="display-content-base" class="overflow-ellipsis">
											{{ dataset.name }}
										</ds-text>
									</ds-box>
								</ds-inline-item>
							</ds-inline>
							<ds-inline align-y="center" no-wrap gap="S" flex-grow>
								<ds-box flex-type="row" align-y="center">
									<dataset-info-btn class="info-color" :next-update="false" :dataset="dataset" />
									<ds-text variant="body" class="overflow-ellipsis">
										{{ relativeDate(dataset.updatedAt) }}
									</ds-text>
								</ds-box>
								<ds-dropdown placement="bottom-end">
									<template #triggerContent>
										<ds-btn variant="ghost" icon-only @click.stop.prevent>
											<template #icon>
												<ds-icon class="menu-icon" name="ds-icon-three-dots-vertical" />
											</template>
										</ds-btn>
									</template>
									<template #dropdownContent>
										<dropdown-menu-basic :items="datasetDropDownActions" @update:selected="executeAction($event, dataset)" />
									</template>
								</ds-dropdown>
							</ds-inline>
						</ds-inline>
					</ds-box>
				</ds-box>
			</ds-box>
			<ds-box v-if="story.catalogItems.length > 0">
				<ds-text variant="caption" color="display-content-300">
					{{ $t('editor.catalogItems') }}
				</ds-text>
				<ds-box v-for="(catalogItem, index) in storyCatalogItems" :key="index">
					<ds-box
						:border-bottom="index !== storyCatalogItems.length - 1 ? 'separate' : 'none'"
						padding-x="M"
						class="cursor-pointer">
						<ds-inline align="space-between" align-y="center" no-wrap>
							<ds-inline align-y="center" no-wrap class="w-50">
								<ds-inline-item>
									<ds-icon :name="getIcons(catalogItem.connection.executorType)" />
								</ds-inline-item>
								<ds-inline-item flex-grow="1">
									<ds-box padding-left="S" padding-y="S">
										<ds-text variant="bodyMedium" color="display-content-base" class="overflow-ellipsis">
											{{ catalogItem.name ?? catalogItem.catalogItemId }}
										</ds-text>
									</ds-box>
								</ds-inline-item>
							</ds-inline>
							<ds-inline
								align-y="center" no-wrap gap="S" flex-grow
								align="space-between">
								<ds-box flex-type="row" align-y="center">
									<dataset-info-btn class="info-color" :next-update="false" :dataset="catalogItem" />
									<ds-text variant="body" class="overflow-ellipsis">
										{{ relativeDate(catalogItem.updatedAt) }}
									</ds-text>
								</ds-box>
								<ds-dropdown placement="bottom-end">
									<template #triggerContent>
										<ds-btn variant="ghost" icon-only @click.stop.prevent>
											<template #icon>
												<ds-icon class="menu-icon" name="ds-icon-three-dots-vertical" />
											</template>
										</ds-btn>
									</template>
									<template #dropdownContent>
										<dropdown-menu-basic :items="catalogDropDownActions" @update:selected="executeAction($event, catalogItem)" />
									</template>
								</ds-dropdown>
							</ds-inline>
						</ds-inline>
					</ds-box>
				</ds-box>
			</ds-box>
		</template>
		<div v-else class="alert alert-danger show" role="alert">
			{{ $t('t_NoConnectedDataset') }}
		</div>
		<ds-box>
			<ds-btn variant="secondary" @click="$emit('showEditModal')">
				<template #icon>
					<ds-icon name="icon_edit" alt="minus" />
				</template>
				{{ $t('t_StoryConnect') }}
			</ds-btn>
		</ds-box>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {sourceIcon, formatToRelativeDate} from '@/modules/dataset/utils/dataset';
import {widgetTypes} from '@/util/consts/widgetTypes';
import DatasetInfoBtn from '@/modules/dataset/components/DatasetInfoBtn.vue';
import DropdownMenuBasic from '@/components/main/Dropdown/DropdownMenuBasic.vue';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;
import {getIcons} from '@/modules/story/utils/datasetUtils';
import {storyServices} from '@/modules/story/storyServices';
import {useStore} from 'vuex';

export default defineComponent({
	components: {
		DatasetInfoBtn,
		DropdownMenuBasic
	},
	emits: ['showEditModal', 'swapDataset'],
	setup(props, {emit}) {
		const store = useStore();
		const story = computed(() => store.getters['storyDetail/story']);
		const storyCatalogItems = computed(() => store.getters['storyDetail/catalogItems']);

		const getSourceIcon = (type: string) => sourceIcon(type);

		const relativeDate = (date: string | null) => formatToRelativeDate(date);
		// Function to check if widgets use dataset we want to switch
		const canSwitch = (dataset: any) => {
			let widgetsFilteredByDataset = [] as any;
			story.value.sections.forEach((section: any) => {
				const widgets = section.widgets.filter((widget: any) => {
					if (widget.widgetType === widgetTypes.INSIGHT) {
						// TODO check if insight have same dataset
					}
					const widgetDatasetId = widget.widgetDataConfigurations[0]?.datasetId ?? null;
					return widgetDatasetId === dataset.id;
				});
				widgetsFilteredByDataset = widgetsFilteredByDataset.concat(widgets);
			});
			return widgetsFilteredByDataset.length > 0;
		};

		const datasetDropDownActions = [
			{
				value: 'swapDataset',
				label: t('datasetSwapFeature.swapDataset'),
				icon: 'icon-reset'
			}
		];
		const catalogDropDownActions = [
			{
				value: 'deleteCatalog',
				label: t('datasetSwapFeature.deleteCatalog'),
				icon: 'icon-trash'
			}
		];

		const swapDatasets = (dataset: any) => {
			// Get actual story configuration
			store.dispatch('storyDetail/reloadData', {id: story.value.id})
				.then(() => {
					emit('swapDataset', dataset);
				});
		};
		const reloadStory = async() => {
			await store.dispatch('storyDetail/reloadData', {id: story.value.id});
		};
		const executeAction = async(action: any, dataset: any) => {
			switch (action.value) {
				case 'swapDataset':
					swapDatasets(dataset);
					break;
				case 'deleteCatalog':
					await storyServices.deleteCatalogFromStory(story.value.id, dataset.id);
					reloadStory();
					break;
			}
		};

		return {
			story,
			storyCatalogItems,
			getSourceIcon,
			getIcons,
			relativeDate,
			catalogDropDownActions,
			datasetDropDownActions,
			executeAction,
			canSwitch
		};
	}
});
</script>
