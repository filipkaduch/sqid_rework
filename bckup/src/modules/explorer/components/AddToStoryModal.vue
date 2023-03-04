<template>
	<ds-modal
		:show="showAddToStory"
		header-text="modals.addToStory"
		confirmText="modals.add"
		cancelText="modals.cancel"
		:confirm-enabled="selectedStory !== '' && stepTitle !== ''"
		@ok="addToStory"
		@cancel="closeModal">
		<template #modal-text>
			<ds-box>
				<app-loading :loading="loadingStories">
					<ds-box padding-bottom="S">
						<ds-text variant="body">
							{{ $t('t_Title') }}
						</ds-text>
					</ds-box>
					<ds-input v-model:value="stepTitle" type="text" class="mb-4" width="380px" />
					<ds-box padding-bottom="S">
						<ds-text variant="body">
							{{ $t('modals.chooseStory') }}
						</ds-text>
					</ds-box>
					<ds-select
						container=".modal-container" :items="storiesOptions" :placement="'bottom'" has-search
						max-height
						@input="selectedStory = $event"
						@search-change="createStoryName = $event">
						<template v-if="saasLimitsState.limitStatusStories.value !== LimitStatus.ERROR" #selectFooter>
							<ds-box
								flex-type="row" class="w-100" border-top="layout" align-y="center"
								padding-top="XS">
								<app-loading :loading="creating" class="w-100">
									<ds-btn
										v-close-popper
										class="border-0 w-100 border-radius-right-0 border-radius-left-0"
										variant="secondary"
										block
										@click="addToStory(true)">
										<template #icon>
											<ds-icon fill="display-content" name="ds-icon-create" class="action-icon" />
										</template>
										<template #default>
											<ds-text> {{ $t('t_CreateStory') }}</ds-text>
										</template>
									</ds-btn>
								</app-loading>
							</ds-box>
						</template>
					</ds-select>
				</app-loading>
			</ds-box>
		</template>
		<template #modal-footer>
			<app-loading v-if="creating" :loading="creating" relative-parent />
		</template>
	</ds-modal>
</template>

<script lang="ts">
import {
	computed,
	defineComponent,
	watch,
	toRefs,
	toRef,
	reactive,
	PropType
} from 'vue';
import {PopupListItem} from '@/components/main/layout/utils/types';
import {useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import {storyType} from '@/modules/story/consts/storyType';
import themes from '@/util/themes';
import {storyServices} from '@/modules/story/storyServices';
import {sectionServices} from '@/modules/story/sectionServices';
import {widgetServices} from '@/modules/widget/widgetServices';
import {sectionDefaultConfig} from '@/modules/explorer/consts/consts';
import AppLoading from '@/components/design/AppLoading.vue';
import {getDefaultLayoutConfig, getDefaultWidgetConfig} from '@/modules/story/utils/storyUtils';
import i18n from '@/plugins/i18n/index';
import {useNotification} from '@kyvg/vue3-notification';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {useSaasLimits} from '@/modules/limits/store/limits';
import {LimitStatus} from '@/modules/limits/consts/enums';
const {t} = i18n.global;

export default defineComponent({
	components: {AppLoading},
	props: {
		storiesOptions: {
			type: Array as PropType<PopupListItem<string>[]>,
			default: () => []
		},
		showModal: {
			type: Boolean,
			default: false
		},
		prefilledTitle: {
			type: String,
			default: ''
		}
	},
	emits: ['closeModal'],
	setup(props, {emit}) {
		const store = useStore();
		const router = useRouter();
		const dataExploreStore = useDataExploreStore();
		const notification = useNotification();
		const state = reactive({
			showAddToStory: false,
			createStoryName: '',
			selectedStory: '',
			creating: false
		});
		const saasLimitsState = useSaasLimits();
		const stepTitle = toRef(props, 'prefilledTitle');

		watch(() => props.showModal, (val) => {
			state.showAddToStory = val;
		});

		const {selectedWidget} = useExplorerChart();
		const loadingStories = computed(() => store.getters['stories/loading']);

		const closeModal = () => {
			state.showAddToStory = false;
			emit('closeModal');
			state.creating = false;
		};

		// eslint-disable-next-line max-statements
		const addToStory = async(create: boolean = false) => {
			const widgetDataConfig = selectedWidget?.value.configuration?.data;
			const addWidgetType = selectedWidget?.value.widgetType;
			const selectedWidgetConfig = selectedWidget.value.configuration;
			const addWidgetConfig = {
				name: selectedWidget.value.name,
				widgetType: addWidgetType,
				widgetConfiguration: selectedWidgetConfig?.options,
				dataConfigurations: [
					{
						dataConfiguration: {
							dimensions: widgetDataConfig.configuration.dimensions,
							metrics: widgetDataConfig.configuration.metrics,
							limit: widgetDataConfig.configuration.limit ?? 20,
							orderBy: widgetDataConfig.configuration.orderBy ?? [],
							lastValueColumn: widgetDataConfig.configuration.lastValueColumn ?? false,
							version: 'default/v0'
						},
						...(widgetDataConfig.datasetId ? {datasetId: widgetDataConfig.datasetId} : {}),
						...(widgetDataConfig.catalogItemId ? {catalogItemId: widgetDataConfig.catalogItemId} : {}),
						version: 'default/v0'
					}
				],
				filters: {
					...selectedWidgetConfig.staticFilter,
					version: 'default/v1'
				},
				layoutConfiguration: getDefaultLayoutConfig(storyType.VISUAL_DATA_STORY)
			};

			state.creating = true;
			if (create) {
				const createStoryConfig = {
					name: state.createStoryName,
					storyType: storyType.VISUAL_DATA_STORY,
					layoutConfiguration: {
						version: 'default/v0',
						theme: themes[0]
					},
					configuration: {
						version: 'default/v0'
					},
					defaultWidget: getDefaultWidgetConfig(storyType.VISUAL_DATA_STORY)
				};

				try {
					const createdStoryData = await storyServices.createStory(createStoryConfig);
					if (widgetDataConfig.datasetId) {
						await storyServices.setStoryDataset(createdStoryData.id, widgetDataConfig.datasetId);
					}
					if (widgetDataConfig.catalogItemId) {
						// @ts-ignore
						await storyServices.addCatalogItemToStory(createdStoryData.id, widgetDataConfig.catalogItemId);
					}
					const updateSectionConfig = sectionDefaultConfig;
					updateSectionConfig.name = stepTitle.value;
					updateSectionConfig.atIndex = createdStoryData.sections.length;
					const {id} = await sectionServices.createSection(createdStoryData.id, updateSectionConfig);
					await widgetServices.createWidget(id, addWidgetConfig);
					await router.push({
						name: 'story-editor',
						params: {id: createdStoryData.id}
					});
				} catch (error: any) {
					// eslint-disable-next-line require-atomic-updates
					state.creating = false;
					// @ts-ignore
					notification.notify({
						type: 'danger',
						text: error?.response?.data?.message ?? t('errors.loadStory')
					});
				}
			} else {
				try {
					const story = await storyServices.getStoryDetail(state.selectedStory);
					if (story?.datasets?.findIndex((dataset: any) => dataset.id === widgetDataConfig.datasetId) === -1
						&& widgetDataConfig.datasetId !== null) {
						await storyServices.setStoryDataset(state.selectedStory, widgetDataConfig.datasetId);
					}
					if (story?.catalogItems?.findIndex((catalog: any) => catalog.catalogItemId === widgetDataConfig.catalogItemId) === -1
						&& widgetDataConfig.catalogItemId !== null) {
						await storyServices.addCatalogItemToStory(state.selectedStory, widgetDataConfig.catalogItemId);
					}
					// @ts-ignore
					const {id} = await sectionServices.createSection(state.selectedStory, {atIndex: story?.sections?.length, name: stepTitle.value});
					await widgetServices.createWidget(id, addWidgetConfig);

					// @ts-ignore
					notification.notify({
						type: 'success',
						title: t('modals.explorationAddedToStory'),
						text: story.name
					});
					closeModal();
				} catch (error: any) {
					// eslint-disable-next-line require-atomic-updates
					state.creating = false;
					// @ts-ignore
					notification.notify({
						type: 'danger',
						text: error?.response?.data?.message ?? t('errors.loadStory')
					});
				}
			}
		};

		return {
			...toRefs(state),
			dataExploreStore,
			stepTitle,
			closeModal,
			loadingStories,
			addToStory,
			saasLimitsState,
			LimitStatus
		};
	}
});
</script>
