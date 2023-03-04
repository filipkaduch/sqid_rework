<template>
	<div>
		<ds-tab-buttons
			v-if="tabs"
			id="tabs-buttons"
			v-model:active-tab="activeTab"
			:tabs="tabs"
			editable
			:tab-width="computedTabsWidth"
			:all-tabs="tabsLength"
			can-add
			is-closable
			:show-arrows="showArrowsInTabs"
			limit-chars
			@add="showAddExploreModal = true;"
			@tab-clicked="handleActiveTab">
			<template #tab-actions="{tab}">
				<ds-dropdown placement="bottom-start">
					<template #triggerContent>
						<ds-btn
							variant="ghost"
							icon-only
							small
							padding-x="NONE"
							class="cursor-pointer mt-2"
							@click.stop.prevent>
							<template #icon>
								<ds-icon fill="display-content-500" name="ds-icon-three-dots-vertical" alt="Dashboard" />
							</template>
						</ds-btn>
					</template>
					<template #dropdownContent>
						<dropdown-menu-basic :items="actionMenu" @update:selected="executeTabAction($event.value, tab)" />
					</template>
				</ds-dropdown>
			</template>
		</ds-tab-buttons>
		<div class="tab-ruler">
			<span v-for="(tab, index) in tabs" :id="`ruler-${tab.name}-${index}`" :key="`ruler-${tab.name}-${index}`">{{ tab.name }}</span>
		</div>
		<add-explore-modal :show="showAddExploreModal" @close-modal="showAddExploreModal = false" @add-explores="addExplores" />
		<rename-explore-modal :show="showRenameExploreModal" :tab-id="tabId" @reset-tabs="renameReset" @close-modal="showRenameExploreModal = false" />
	</div>
</template>

<script lang="ts">
import {computed, nextTick, defineComponent, onMounted, onUnmounted, reactive, ref, toRefs, watch} from 'vue';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;
import DsTabButtons, {MIN_CHARS_IN_PX, PLUS_SIGN_WIDTH} from '@/components/main/button/DsTabButtons.vue';
import DropdownMenuBasic from '@/components/main/Dropdown/DropdownMenuBasic.vue';
import {useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import {
	WIDGET_INSTANCE_ACTIONS,
	WIDGET_INSTANCE_GETTERS,
	WIDGET_INSTANCE_STORE_NAME
} from '@/modules/widget/store/widgetInstances/types';
import AddExploreModal from './AddExploreModal.vue';
import RenameExploreModal from '@/modules/explorer/components/detail/tabs/RenameExploreModal.vue';
import cloneDeep from 'lodash/cloneDeep';
import {DataSource} from '@/modules/dataset/utils/types';
import {DATASOURCE_TYPES} from '@/modules/dataset/utils/datasetUtils';
import {useStore} from 'vuex';

type ExploreTab = {
	name: string, datasetId: string | null, dataExplorationId: string, catalogItemId: string | null, tooltip?: string, nameLength?: number
}

export default defineComponent({
	name: 'ExplorerTabs',
	components: {
		RenameExploreModal,
		DsTabButtons,
		DropdownMenuBasic,
		AddExploreModal
	},
	props: {
	},
	setup() {
		const store = useStore();
		const dataExploreStore = useDataExploreStore();
		const {cloneExplore, explore, addDataSourcesToStory, createNewSections, createWidgetForSection, pageWidgetInstanceIds} = useExplorerChart();

		// Tabs and handling tabs
		const tabs = ref([] as ExploreTab[]);
		const activeTab = ref({} as ExploreTab);

		const showAddExploreModal = ref(false);
		const showArrowsInTabs = ref(false);
		const tabsLength = ref(0);
		const renameState = reactive({
			showRenameExploreModal: false,
			tabId: ''
		});

		const mapExplorationTabs = () => {
			tabs.value = [];
			if (dataExploreStore.selectedExploration) {
				const dataExplorationIds = Object.keys(dataExploreStore.selectedExploration.datasetExplores);
				for (const dataExplorationId of dataExplorationIds) {
					const {name, datasetId, catalogItemId} = dataExploreStore.selectedExploration.datasetExplores[dataExplorationId];
					tabs.value.push({
						name,
						datasetId,
						catalogItemId,
						dataExplorationId,
						...(name.length > 30 ? {tooltip: name} : {})
					});
				}
			}
		};

		// @ts-ignore
		const computedTabsWidth = computed(() => Math.floor(((tabsLength.value - PLUS_SIGN_WIDTH)
			- (tabs.value.length * 56)) / tabs.value.length));

		watch(() => dataExploreStore.selectedExploration, async(newVal, oldVal) => {
			// @ts-ignore
			tabsLength.value = document.getElementById('tabs-buttons')?.offsetWidth;
			if (oldVal !== newVal) {
				mapExplorationTabs();
				await onResize();
				[activeTab.value] = tabs.value;
			}
		});

		const onResize = () => {
			nextTick(() => {
				// @ts-ignore
				tabsLength.value = document.getElementById('tabs-buttons')?.offsetWidth;
				let countSmallVersions = 1;
				let indexer = 0;
				for (const iterTab of tabs.value) {
					const queriedTab = document.getElementById(`ruler-${iterTab.name}-${indexer}`);
					iterTab.nameLength = queriedTab?.offsetWidth ?? 0;
					indexer += 1;
					// @ts-ignore
					if (queriedTab?.offsetWidth > computedTabsWidth.value) {
						if (computedTabsWidth.value <= MIN_CHARS_IN_PX) {
							countSmallVersions += 1;
						}
						iterTab.tooltip = iterTab.name;
					}
				}
				showArrowsInTabs.value = countSmallVersions >= tabs.value.length && tabs.value.length !== 1;
			});
		};

		onMounted(() => {
			// @ts-ignore
			tabsLength.value = document.getElementById('tabs-buttons')?.offsetWidth;
			nextTick(() => {
				window.addEventListener('resize', onResize);
			});
		});

		onUnmounted(() => {
			window.removeEventListener('resize', onResize);
		});

		watch(() => tabs.value, (val) => {
			nextTick(() => {
				let countSmallVersions = 1;
				let indexer = 0;
				for (const iterTab of val) {
					const queriedTab = document.getElementById(`ruler-${iterTab.name}-${indexer}`);
					iterTab.nameLength = queriedTab?.offsetWidth ?? 0;
					indexer += 1;
					// @ts-ignore
					if (queriedTab?.offsetWidth > computedTabsWidth.value) {
						if (computedTabsWidth.value <= MIN_CHARS_IN_PX) {
							countSmallVersions += 1;
						}
						iterTab.tooltip = iterTab.name;
					}
				}

				showArrowsInTabs.value = countSmallVersions >= tabs.value.length && tabs.value.length > 1;
			});
		}, {immediate: true, deep: true});

		const handleActiveTab = (active: ExploreTab) => {
			const section = store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.INSTANCE}`](active.dataExplorationId);
			if (section) {
				store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SELECT_WIDGET_INSTANCE}`, section.widgetOrder[0]);
			}
			dataExploreStore.selectedDatasetExplorationId = active.dataExplorationId;
		};
		const actionMenu = computed(() => ([
			{
				label: t('t_Rename'),
				value: 'rename-section',
				icon: 'icon-pencil'
			},
			{
				label: t('t_Duplicate'),
				value: 'duplicate-section',
				icon: 'ds-icon-duplicate'
			},
			{
				label: t('t_Remove'),
				value: 'remove-explore',
				...(tabs.value.length === 0 ? {disabled: true} : {}),
				icon: 'icon-trash'
			}
		]));
		const resetTabs = () => {
			mapExplorationTabs();
		};
		const renameReset = (tabId: string) => {
			resetTabs();
			renameState.showRenameExploreModal = false;
			// @ts-ignore
			activeTab.value = tabs.value.find((tab: ExploreTab) => tab.dataExplorationId === tabId);
			dataExploreStore.selectedDatasetExplorationId = activeTab.value.dataExplorationId;
		};
		const executeTabAction = async(action: string, tab: ExploreTab) => {
			let dataExplore = {} as {name: string, dataExploreId: string};
			const widget = getWidget(tab);
			let newActiveTabIndex = null;
			let {sections} = cloneDeep(explore.value);
			switch (action) {
				case 'rename-section':
					renameState.showRenameExploreModal = true;
					renameState.tabId = tab.dataExplorationId;
					break;
				case 'duplicate-section':
					dataExplore = await cloneExplore(widget.widgetId, widget.sectionIndex + 1, explore.value.id, tab.name);
					dataExploreStore.addDataExplore({
						dataExplorationId: dataExplore.dataExploreId,
						datasetId: tab.datasetId,
						catalogItemId: tab.catalogItemId,
						name: dataExplore.name,
						attributes: {
							filteredByType: null,
							list: []
						}
					});
					dataExploreStore.copyAttributeList(tab.dataExplorationId, dataExplore.dataExploreId);
					resetTabs();
					// eslint-disable-next-line require-atomic-updates
					activeTab.value = tabs.value[tabs.value.length - 1];
					dataExploreStore.selectedDatasetExplorationId = activeTab.value.dataExplorationId;
					break;
				case 'remove-explore':
					if (activeTab.value.dataExplorationId === tab.dataExplorationId) {
						// if deleting currently selected tab get index of tab one before one that we are deleting
						newActiveTabIndex = pageWidgetInstanceIds.value.findIndex((id: string) => id === tab.dataExplorationId) - 1;
					}
					// Remove instance
					await store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.REMOVE_PAGE_INSTANCE}`, tab.dataExplorationId);
					// Remove explore from explore store
					dataExploreStore.removeDataExplore(tab.dataExplorationId);
					// Reset tabs
					resetTabs();
					if (newActiveTabIndex === null) {
						// find index of currently selected (not deleted) tab
						newActiveTabIndex = pageWidgetInstanceIds.value.findIndex((id: string) => id === activeTab.value.dataExplorationId);
					}
					// eslint-disable-next-line require-atomic-updates
					activeTab.value = newActiveTabIndex > 0 ? tabs.value[newActiveTabIndex] : tabs.value[0];
					dataExploreStore.selectedDatasetExplorationId = activeTab.value.dataExplorationId;

					// Remove section from store
					sections = sections.filter((section: any) => section.id !== tab.dataExplorationId);
					store.commit('storyDetail/setSections', sections);
					break;
			}
		};

		const getWidget = (tab: ExploreTab) : {sectionIndex: number, widgetId: string} => {
			if (explore.value) {
				const section = explore.value.sections.find((sec: any) => sec.id === tab.dataExplorationId);
				const sectionIndex = explore.value.sectionOrder.indexOf(section.id);
				if (section) {
					const [widget] = section.widgets;
					return {widgetId: widget.id, sectionIndex};
				}
			}
			return {sectionIndex: 0, widgetId: ''};
		};

		const addExplores = async(dataSources: DataSource[]) => {
			const storyId = explore.value.id;
			await addDataSourcesToStory(storyId, dataSources);
			const newSections = await createNewSections(storyId, tabs.value.length, dataSources);

			for (let i = 0; i < dataSources.length; i++) {
				const sourceId = dataSources[i].id;
				const section = newSections[i];
				dataExploreStore.addDataExplore({
					dataExplorationId: section.id,
					...(dataSources[i].type === DATASOURCE_TYPES.DATASET
						? {datasetId: sourceId, catalogItemId: null}
						: {datasetId: null, catalogItemId: sourceId}),
					name: section.name,
					attributes: {
						filteredByType: null,
						list: []
					}
				});
				await store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.ADD_INSTANCE}`, {
					id: section.id,
					name: section.name,
					instance: {...section, ...{parentId: storyId, widgetType: 'widget_page'}}
				});
				await createWidgetForSection(storyId, section, dataSources[i]);
			}

			// Remap tabs
			mapExplorationTabs();
			handleActiveTab(tabs.value[tabs.value.length - 1]);
			activeTab.value = tabs.value[tabs.value.length - 1];
		};

		return {
			executeTabAction,
			actionMenu,
			handleActiveTab,
			tabs,
			activeTab,
			showAddExploreModal,
			addExplores,
			renameReset,
			computedTabsWidth,
			tabsLength,
			showArrowsInTabs,
			...toRefs(renameState)
		};
	}
});
</script>

<style lang="scss" scoped>
.tab-ruler {
	visibility: hidden;
	white-space: nowrap;
	height: 0;
}
</style>
