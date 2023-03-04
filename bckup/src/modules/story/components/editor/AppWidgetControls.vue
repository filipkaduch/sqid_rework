<!-- eslint-disable max-lines -->
<template>
	<div
		class="h-100 overflow-auto"
		style="background-color: #F3F6F7"
		data-testid="deselect-section">
		<div class="pr-2">
			<div class="d-flex w-100 px-3 pt-3 border-bottom">
				<div class="row mx-2">
					<div
						class="col d-flex justify-content-center cursor-pointer"
						:class="{'active-editor-tab': activeMenu.step}"
						@click="triggerActiveMenu(storyEditorMenu.STEP)">
						<h4>
							{{ isVisualStory ? $t('t_Step') : $t('t_widget') }}
						</h4>
					</div>
					<div
						v-if="isVisualStory"
						class="col d-flex justify-content-center cursor-pointer"
						:class="{'active-editor-tab': activeMenu.section}"
						@click="triggerActiveMenu(storyEditorMenu.SECTION)">
						<h4>
							{{ $t('t_Section') }}
						</h4>
					</div>
					<div
						class="col d-flex justify-content-center cursor-pointer"
						data-testid="story-section"
						:class="{'active-editor-tab': activeMenu.story}"
						@click="triggerActiveMenu(storyEditorMenu.STORY)">
						<h4>
							{{ isVisualStory ? $t('t_Story') : $t('t_dashboard') }}
						</h4>
					</div>
				</div>
			</div>
			<div class="padded">
				<ds-row v-if="activeMenu.section" class="m-0 p-0">
					<ds-col v-if="isVisualStory && pageWidgetInstanceId === null" cols="12" class="mb-0 mt-2 px-2">
						<div class="d-flex">
							<p class="lead m-0 ml-2 options-grey-style">
								{{ $t('t_GoToSection') }}
							</p>
						</div>
						<div class="px-2 my-2">
							<button
								class="btn btn-white w-100 d-flex justify-content-between rounded select btn-white-collapse align-items-center m-0 p-0 algLeft pl-3"
								@click="collapseChooseSection = !collapseChooseSection">
								<span>
									{{ selectedPage + 1 }}
								</span>
								<fa-icon :icon="collapseSectionOrder ? ['fal','chevron-up'] : ['fal','chevron-down']" class="mx-3 options-grey-style" />
							</button>
							<ds-collapse
								:is-open="collapseChooseSection"
								class="mt-2 mx-3 collapseDropdown">
								<ds-card class="shadow-none border-0" body-class="my-0 p-0" style="background-color: #F3F6F7;">
									<div class="list-group">
										<div
											v-for="(option, index) in orderOptions"
											:key="index"
											class="list-group-item border-0 p-0">
											<button
												class="btn btn-white w-100 d-flex justify-content-between btn-white-collapse align-items-center py-2 px-3 m-0 noBorder"
												@click="choosePage(option.value)">
												{{ option.text }}
											</button>
										</div>
									</div>
								</ds-card>
							</ds-collapse>
						</div>
					</ds-col>
					<ds-col cols="12" class="mb-0 mt-4 mx-0 p-0">
						<div
							class="cardShadow">
							<button
								style="background-color: white"
								class="btn btn-clean w-100 d-flex justify-content-between align-items-center column-select-right m-0 py-0 px-2 btn btn-outline-dark"
								@click="collapse = !collapse">
								<span>
									<span class="d-inline-flex align-items-center p-3" style="color: #2D3038; font-size: 17px; font-weight: bold;">
										<span class="collapseHeader">
											<fa-icon :icon="['fas', 'cog']" class="m-0" />
										</span>
										{{ $t('t_SectionProperties') }}
									</span>
								</span>
								<span style="color: #000000">
									<fa-icon :icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']" class="m-2 mr-3" />
								</span>
							</button>
							<ds-collapse :is-open="collapse" class="w-100 mt-1 bg-white px-2">
								<ds-col v-if="isVisualStory" cols="12" class="mt-2 px-2">
									<div class="d-flex">
										<p class="lead m-0 ml-2 options-grey-style">
											{{ $t('t_SectionTitle') }}
										</p>
									</div>
									<div class="px-2 my-2">
										<ds-input v-model:value="name" :debounce="true" class="mb-2 select" />
									</div>
								</ds-col>
								<ds-col v-if="isVisualStory" cols="12" class="mb-0 mt-2 px-2">
									<div class="d-flex">
										<p class="lead m-0 ml-2 options-grey-style">
											{{ $t('t_SectionOrder') }}
										</p>
									</div>
									<div class="px-2 my-2">
										<button
											class="btn btn-white w-100 d-flex justify-content-between rounded select btn-white-collapse align-items-center m-0 p-0 algLeft pl-3"
											@click="collapseSectionOrder = !collapseSectionOrder">
											<span>
												{{ selectedPage + 1 }}
											</span>
											<fa-icon :icon="collapseSectionOrder ? ['fal','chevron-up'] : ['fal','chevron-down']" class="mx-3 options-grey-style" />
										</button>
										<ds-collapse
											:is-open="collapseSectionOrder"
											class="mt-2 mx-3 collapseDropdown">
											<ds-card class="shadow-none" body-class="my-0 p-0" style="background-color: #F3F6F7;">
												<div class="list-group">
													<div
														v-for="(option, index) in orderOptions"
														:key="index"
														class="list-group-item border-0 p-0">
														<button
															class="btn btn-white w-100 d-flex justify-content-between btn-white-collapse align-items-center py-2 px-3 m-0 noBorder"
															@click="movePage(option.value)">
															{{ option.text }}
														</button>
													</div>
												</div>
											</ds-card>
										</ds-collapse>
									</div>
								</ds-col>
								<ds-col v-if="isVisualStory" cols="12" class="mt-2 px-2">
									<div class="d-flex">
										<p class="lead m-0 ml-2 options-grey-style">
											{{ $t('t_SectionType') }}
										</p>
									</div>
									<div class="px-2 my-2">
										<div class="btn-group flex-wrap w-100">
											<template v-for="(button, key) in sectionStackingVariants" :key="key">
												<button
													class="btn btn-outline-chartOption m-0 text-primary"
													:class="{active: stacking === key}"
													:title="button.title"
													@click="stacking = key">
													<fa-icon v-if="button.icon" :icon="button.icon" fixed-width class="m-0" />
													<fa-layers v-else fixed-width class="m-0">
														<fa-icon
															v-for="(configuration, index) in button.configuration"
															:key="key + '-' + index"
															:icon="['fas', 'square-full']"
															:style="{
																transform: `scaleX(${configuration.scale.x}) `
																	+ `scaleY(${configuration.scale.y}) `
																	+ `translateX(${configuration.translate.x}%) `
																	+ `translateY(${configuration.translate.y}%)`
															}" />
													</fa-layers>
												</button>
											</template>
										</div>
									</div>
								</ds-col>
								<ds-col cols="12" class="mb-0 mt-1 px-2 pb-2">
									<div class="d-flex">
										<p class="lead m-0 ml-2 options-grey-style">
											{{ $t('t_DynamicCrossFilteringBehavior') }}
										</p>
									</div>
									<ds-box padding-x="S">
										<ds-toggle-bar :items="dynamicFilterModeOptions" :value="dynamicFilterMode" @selected="updateFilterModeRation" />
									</ds-box>
								</ds-col>
							</ds-collapse>
						</div>
					</ds-col>
				</ds-row>
				<ds-row v-if="activeMenu.step" class="m-0 p-0">
					<ds-col v-if="isVisualStory && selectedWidgetInstanceId === null" cols="12" class="mb-0 mt-2 px-2">
						<div class="d-flex">
							<p class="lead m-0 ml-2 options-grey-style">
								{{ $t('t_GoToStep') }}
							</p>
						</div>
						<div class="px-2 my-2">
							<button
								class="btn btn-white w-100 d-flex justify-content-between rounded select btn-white-collapse align-items-center m-0 p-0 algLeft pl-3"
								@click="collapseChooseStep = !collapseChooseStep">
								<span>
									{{ stepOptions[selectedPage].text }}
								</span>
								<fa-icon :icon="collapseChooseStep ? ['fal','chevron-up'] : ['fal','chevron-down']" class="mx-3 options-grey-style" />
							</button>
							<ds-collapse
								:is-open="collapseChooseStep"
								class="mt-2 mx-3 collapseDropdown">
								<ds-card class="shadow-none border-0" body-class="my-0 p-0" style="background-color: #F3F6F7;">
									<div class="list-group">
										<div
											v-for="(option, index) in stepOptions"
											:key="index"
											class="list-group-item border-0 p-0">
											<button
												class="btn btn-white w-100 d-flex justify-content-between btn-white-collapse align-items-center py-2 px-3 m-0 noBorder h-100"
												@click="setSelectedWidget(option.value, option.sectionIndex)">
												{{ option.text }}
											</button>
										</div>
									</div>
								</ds-card>
							</ds-collapse>
						</div>
					</ds-col>
					<div v-if="selectedWidgetInstanceId" class="w-100">
						<ds-col
							v-for="(control, controlName) in controls"
							:key="'WidgetControl' + selectedWidgetInstanceId + controlName"
							cols="12"
							class="mx-0 mb-0 mt-0 p-0">
							<app-widget-control-wrapper :widget-instance-id="`${selectedWidgetInstanceId}`" :name="controlName" :control="control" />
						</ds-col>
						<app-section-controls-wrapper v-if="isSwitchable" :title="$t('t_ChartType')">
							<chart-type-switch :widget-instance-id="selectedWidgetInstanceId" />
							<template #icon>
								<fa-icon :icon="['far', 'grip-horizontal']" class="mr-0" />
							</template>
						</app-section-controls-wrapper>
						<app-data-section-controls v-if="widgetTypeMetadata.configuration?.data" :widget-instance-id="selectedWidgetInstanceId" />
						<app-widget-timeline-section v-if="useTimeline" :widget-instance-id="selectedWidgetInstanceId" />
						<app-widget-options-section :widget-instance-id="selectedWidgetInstanceId" />
						<app-widget-filter-section
							v-if="widgetTypeMetadata.configuration?.data"
							:widget-instance-id="selectedWidgetInstanceId" />
					</div>
				</ds-row>
				<ds-row v-else-if="activeMenu.story" class="m-0 p-0 constrolStyle">
					<ds-col cols="12" class="mb-0 mt-4 mx-0 p-0">
						<div class="cardShadow">
							<button
								style="background-color: white"
								class="btn btn-clean w-100 d-flex justify-content-between align-items-center column-select-right m-0 py-0 px-2 btn btn-outline-dark"
								@click="collapseDatasets = !collapseDatasets">
								<span>
									<span class="d-inline-flex align-items-center p-3" style="color: #2D3038; font-size: 17px; font-weight: bold;">
										<span class="collapseHeader">
											<fa-icon :icon="['fas', 'table']" class="m-0" />
										</span>
										{{ $t('t_Datasets') }}
									</span>
								</span>
								<span class="text-black">
									<fa-icon :icon="collapseDatasets ? ['fal','chevron-up'] : ['fal','chevron-down']" class="m-2 mr-3" />
								</span>
							</button>
							<ds-collapse :is-open="collapseDatasets" class="w-100 mt-1 bg-white px-4 pb-4">
								<dataset-section @show-edit-modal="showEditModal = true" @swap-dataset="swapDataset" />
							</ds-collapse>
						</div>
					</ds-col>
					<ds-col cols="12" class="mb-0 mt-4 mx-0 p-0">
						<div class="cardShadow">
							<button
								data-testid="show-global-filters"
								style="background-color: white"
								class="btn btn-clean w-100 d-flex justify-content-between align-items-center column-select-right m-0 py-0 px-2 btn btn-outline-dark"
								@click="collapseFilters = !collapseFilters">
								<span>
									<span class="d-inline-flex align-items-center p-3" style="color: #2D3038; font-size: 17px; font-weight: bold;">
										<span class="collapseHeader">
											<fa-icon :icon="['fas', 'filter']" class="m-0" />
										</span>
										{{ $t('t_GlobalFilters') }}
									</span>
								</span>
								<span class="text-black">
									<fa-icon :icon="collapseFilters ? ['fal','chevron-up'] : ['fal','chevron-down']" class="m-2 mr-3" />
								</span>
							</button>
							<ds-collapse :is-open="collapseFilters" class="w-100 mt-1 bg-white px-2">
								<global-filters />
							</ds-collapse>
						</div>
					</ds-col>
					<ds-col cols="12" class="mb-0 mt-4 mx-0 p-0">
						<div class="cardShadow">
							<button
								style="background-color: white"
								data-testid="show-themes"
								class="btn btn-clean w-100 d-flex justify-content-between align-items-center column-select-right m-0 py-0 px-2 btn btn-outline-dark"
								@click="collapseThemes = !collapseThemes">
								<span>
									<span class="d-inline-flex align-items-center p-3" style="color: #2D3038; font-size: 17px; font-weight: bold;">
										<span class="collapseHeader">
											<fa-icon :icon="['far', 'bars']" class="m-0" />
										</span>
										{{ $t('themes.t_Themes') }}
									</span>
								</span>
								<span style="color: #000000">
									<fa-icon :icon="collapseThemes ? ['fal','chevron-up'] : ['fal','chevron-down']" class="m-2 mr-3" />
								</span>
							</button>
							<ds-collapse :is-open="collapseThemes" class="w-100 mt-1 bg-white px-2">
								<ds-row v-if="!isVisualStory" class="mb-4 padded" :class="{paddedTop: !isVisualStory}">
									<ds-col>
										<ds-row class="bold">{{ $t('t_Dimensions') }}</ds-row>
										<ds-row class="mt-1">
											<ds-col class="p-0">{{ $t('t_StoryWidth') }}</ds-col>
											<ds-col>{{ $t('t_StoryHeight') }}</ds-col>
											<ds-col />
										</ds-row>
										<ds-row>
											<ds-col class="p-0">{{ story.layoutConfiguration.dimensions.width }}</ds-col>
											<ds-col>{{ story.layoutConfiguration.dimensions.height }}</ds-col>
											<ds-col />
										</ds-row>
									</ds-col>
								</ds-row>
								<ds-row class="mx-0">
									<ds-col class="px-0">
										<app-loading :loading="loadingStyleDependencies" class="mb-4">
											<ds-inline align-y="center">
												<ds-box padding-left="M" padding-right="S">
													<ds-switch v-model:value="showCustomStyles" />
												</ds-box>
												<ds-box>
													<b>{{ $t('t_customThemes') }}</b>
												</ds-box>
											</ds-inline>
											<div v-if="showCustomStyles" class="ml-3 mt-3">
												<template v-for="index in colors.graph.length" :key="index">
													<ds-component-wrapper
														component-name="WidgetControlCombinedColorPicker"
														widgetInstanceId="0"
														:type="'theme'"
														:headingIcon="['fal', 'palette']"
														:headingText="$t('t_customColor') + ' ' + index"
														style="height: 100%;"
														class="mx-0"
														:index="index - 1"
														:input-color="colors.graph[index - 1]"
														@update:color="updateColor($event, index - 1)" />
												</template>
												<ds-component-wrapper
													component-name="WidgetControlCombinedColorPicker"
													widgetInstanceId="0"
													:type="'theme'"
													:headingIcon="['fal', 'palette']"
													:headingText="$t('t_backgroundColor')"
													:index="0"
													style="height: 100%;"
													:input-color="colors.background"
													@update:color="updateBackground($event)" />
											</div>
											<div v-else>
												<template v-for="(theme, index) in themes" :key="theme.name">
													<ds-component-wrapper
														component-name="WidgetControlThemePicker"
														:theme-index="index"
														:headingIcon="['fal', 'palette']"
														:headingText="'themes.t_Theme_' + theme.name"
														:theme="theme"
														@update:theme="updateTheme($event)" />
												</template>
											</div>
										</app-loading>
									</ds-col>
								</ds-row>
							</ds-collapse>
						</div>
					</ds-col>
				</ds-row>
			</div>
		</div>
		<edit-catalogs-and-datasets :show="showEditModal" @close-modal="showEditModal = false" @reload-story="reloadData({id: story.id})" />
		<app-dataset-switch-modal
			:showDatasetSwitchModal="showDatasetSwitchModal" :widgets="widgetsToSwitch"
			:selectedDataset="selectedDataset" @close-modal="showDatasetSwitchModal = false" />
	</div>
</template>

<script>
/* eslint-disable sort-imports */
import {dynamicFilterModeTitles, dynamicFilterModes} from '@/util/consts/dynamicFilter';
import {mapActions, mapGetters} from 'vuex';
import sectionStackingVariants, {sectionStackingModes} from '@/util/consts/sectionStackingVariants';
import AppDataSectionControls from '@/components/AppDataSectionControls.vue';
import AppDatasetSwitchModal from '@/modules/dataset/components/AppDatasetSwitchModal.vue';
import AppSectionControlsWrapper from '@/components/sectionControls/AppSectionControlsWrapper.vue';
import AppWidgetFilterSection from '@/components/AppWidgetFilterSection.vue';
import AppWidgetOptionsSection from '@/components/AppWidgetOptionsSection.vue';
import AppWidgetTimelineSection from '@/components/AppWidgetTimelineSection.vue';
import ChartTypeSwitch from '@/modules/explorer/components/detail/explore/chartSection/ChartTypeSwitch.vue';
import GlobalFilters from '@/modules/widget/components/widget-controls/GlobalFilters.vue';
import themes from '@/util/themes.js';
import widgetControlsMixin from '@/mixins/widgetControlsMixin';
import {getWidgetCategory} from '@/modules/explorer/consts/suggestionConst';
import EditCatalogsAndDatasets from '@/modules/story/components/editor/EditCatalogsAndDatasets.vue';
import DatasetSection from '@/modules/story/components/editor/DatasetSection.vue';
import cloneDeep from 'lodash/cloneDeep';
import mapValues from 'lodash/mapValues';
import {storyType, storyEditorMenu} from '@/modules/story/consts/storyType';
import DsSwitch from '@/components/inputs/DsSwitch.vue';

export default {
	name: 'AppWidgetControls',
	components: {
		DsSwitch,
		AppSectionControlsWrapper,
		AppWidgetTimelineSection,
		AppWidgetFilterSection,
		AppWidgetOptionsSection,
		AppDataSectionControls,
		AppDatasetSwitchModal,
		ChartTypeSwitch,
		GlobalFilters,
		EditCatalogsAndDatasets,
		DatasetSection
	},
	mixins: [widgetControlsMixin],
	emits: ['goToSection'],
	data() {
		return {
			showCustomStyles: false,
			collapseSteps: false,
			collapse: true,
			collapseSectionOrder: false,
			collapseFilters: false,
			collapseThemes: false,
			collapseDatasets: false,
			collapseChooseSection: false,
			collapseChooseStep: false,
			stacking: 'animated',
			heightRatio: 1,
			dynamicFilterMode: dynamicFilterModes.SAME_DATASET,
			showPossibleWidgets: false,
			activeMenu: {
				step: false,
				section: false,
				story: true
			},
			storyEditorMenu,
			name: '',
			isDefaultName: null,
			displayName: null,
			themes: null,
			sectionStackingVariants: null,
			dynamicFilterModeOptions: Object.keys(dynamicFilterModes).map((mode) => ({
				label: dynamicFilterModeTitles[mode],
				value: dynamicFilterModes[mode]
			})),
			widgetsToSwitch: [],
			selectedDataset: {},
			showEditModal: false,
			showDatasetSwitchModal: false
		};
	},
	computed: {
		...mapGetters('storyDetail', {
			story: 'story'
		}),
		isSwitchable() {
			return Boolean(getWidgetCategory(this.$store.getters['widgetInstances/widgetType'](this.selectedWidgetInstanceId)));
		},
		isVisualStory() {
			return this.$store.getters['storyDetail/story']?.storyType === storyType.VISUAL_DATA_STORY;
		},
		pageWidgetInstanceId() {
			return this.$store.getters['widgetInstances/selectedPageWidgetInstanceId'];
		},
		sectionInstance() {
			return (this.$store.getters['widgetInstances/instance'](this.pageWidgetInstanceId) ?? null);
		},
		sectionOptions() {
			return (this.sectionInstance?.configuration?.options ?? null);
		},
		selectedPage() {
			return (this.$store.getters['widgetInstances/selectedPage'] ?? 0);
		},
		orderOptions() {
			return this.$store.getters['widgetInstances/pageWidgetInstanceIds'].map((element, index) => {
				const name = (this.$store.getters['widgetInstances/instance'](element)?.name ?? '');
				const textNumber = index + 1;
				return {
					text: `${textNumber} - ${name}`,
					value: textNumber
				};
			});
		},
		pageWidgetInstanceIds() {
			return this.$store.getters['widgetInstances/pageWidgetInstanceIds'];
		},
		stepOptions() {
			const options = [];

			Object.entries(this.$store.getters['widgetInstances/widgetInstanceIds']).forEach((element, index) => {
				element[1].forEach((watch, subIndex) => {
					const widget = this.$store.getters['widgetInstances/configuration'](watch);
					const addText = widget?.name ? ` - Title: ${widget.name}` : '';
					options.push({
						text: `Section: ${index + 1} - Step: ${subIndex + 1}${addText}`,
						value: watch,
						sectionIndex: index
					});
				});
			});
			return options;
		},
		useTimeline() {
			return Boolean(this.widgetTypeMetadata?.configuration?.timeline);
		},
		colors() {
			return this.$store.getters['storyDetail/story'].layoutConfiguration.theme.colors;
		},
		dark() {
			return this.$store.getters['storyDetail/story'].layoutConfiguration.theme.dark;
		}
	},
	watch: {
		sectionInstance: {
			immediate: true,
			handler() {
				this.loadOptions();
			}
		},
		selectedWidgetInstanceId(val) {
			if (val === null) {
				this.activeMenu.step = false;
				this.activeMenu.section = false;
				this.activeMenu.story = true;
			} else {
				this.activeMenu.step = true;
				this.activeMenu.section = false;
				this.activeMenu.story = false;
			}
		},
		stacking() {
			this.saveOptions();
		},
		heightRatio() {
			this.saveOptions();
		},
		dynamicFilterMode() {
			this.resetPageFilters(this.pageWidgetInstanceId);
			this.saveOptions();
		},
		name() {
			this.isDefaultName = false;
			this.saveOptions();
		}
	},
	created() {
		this.themes = themes;
		this.sectionStackingVariants = mapValues(sectionStackingVariants, (variant) => ({
			title: variant.title,
			icon: variant.icon,
			configuration: variant.configuration.map((configuration) => ({
				scale: {
					x: configuration.size.width === 0.5 ? 0.45 : configuration.size.width,
					y: configuration.size.height === 0.5 ? 0.45 : configuration.size.height
				},
				translate: {
					x: configuration.size.width === 1 ? 0 : (configuration.position.x === 0 ? -60 : 60),
					y: configuration.size.height === 1 ? 0 : (configuration.position.y === 0 ? -60 : 60)
				}
			}))
		}));
		if (this.$store.getters['storyDetail/story'].layoutConfiguration.theme.name === 'Custom') {
			this.showCustomStyles = true;
		}
	},
	methods: {
		...mapActions('widgetInstances', [
			'resetPageFilters',
			'selectWidgetInstance'
		]),
		...mapActions('storyDetail', ['reloadData']),
		triggerActiveMenu(key) {
			for (const option in this.activeMenu) {
				if (option === key) {
					this.activeMenu[option] = true;
				} else {
					this.activeMenu[option] = false;
				}
			}
			if (key === storyEditorMenu.STEP && this.selectedWidgetInstanceId === null) {
				this.showPossibleWidgets = true;
			}
		},
		setSelectedWidget(option, index) {
			this.collapseSteps = false;
			this.collapseChooseStep = false;
			this.selectWidgetInstance(option);
			this.$emit('goToSection', index);
		},
		loadOptions() {
			this.stacking = this.sectionOptions?.stacking ?? sectionStackingModes.ANIMATED;
			this.heightRatio = this.sectionOptions?.heightRatio ?? 1;
			this.dynamicFilterMode = this.sectionOptions?.dynamicFilterMode ?? dynamicFilterModes.SAME_DATASET;
			this.name = this.sectionInstance?.name ?? '';
		},
		saveOptions() {
			this.$store.dispatch('widgetInstances/setConfiguration', {
				widgetInstanceId: this.pageWidgetInstanceId,
				isDefaultName: this.isDefaultName,
				name: this.name,
				configuration: {
					options: {
						stacking: this.stacking,
						heightRatio: this.heightRatio,
						dynamicFilterMode: this.dynamicFilterMode
					}
				}
			});
		},
		movePage(newIndex) {
			const pages = cloneDeep(this.pageWidgetInstanceIds);
			const selectedWidgetId = this.$store.getters['widgetInstances/selectedWidgetInstanceId'];
			pages.splice(newIndex - 1, 0, pages.splice(this.selectedPage, 1)[0]);

			this.$store.dispatch('storyDetail/reorderSections', pages)
				.then(() => this.$store.dispatch('widgetInstances/selectWidgetInstance', selectedWidgetId));
		},
		swapDataset(dataset) {
			this.selectedDataset = dataset;
			this.showDatasetSwitchModal = true;
		},
		updateFilterModeRation(value) {
			this.dynamicFilterMode = value;
		}
	}
};

</script>

<style lang="scss" scoped>
.info-color {
	color: map-get($ds-colors, 'interaction-300');
	padding-right: 4px;
}
dd {
	font-weight: 500;
}

dt {
	font-size: 1.25rem;
	font-weight: 300;
}

.row.padded {
	padding-left: 16px;
	padding-right: 16px;
}

.custom-control.padded{
	padding-left: 16px;
}

div.padded {
	padding-left: 8px;
	padding-right: 8px;
	padding-bottom: 24px;
}

.noBorder {
	border: 0 none !important;
	border-radius: 0;
	padding-left: 32px;
}

.collapseHeader {
	border-radius: 50%;
	background-color: #D3E0FC;
	height: 35px;
	width: 35px;
	color: #1357E9;
	padding: 8px;
	justify-content: center;
	display: inline-flex;
	margin-right: 5px;
}

.cardShadow {
	border-radius: 5px;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
	background-color: white;
}

.collapseDropdown {
	position: absolute;
	z-index: 5;
	left: 0;
	right: 0;
	box-sizing: border-box;
	border-radius: 0.25rem;
	border: 1px solid #CFD8DD;
}

.btn-custom-margin {
	margin: 0;
}

.btn-group {
	height: unset;
}

@media only screen and (max-width: 1600px) {
	.resize {
		height: auto
	}
}

.underline {
	text-decoration: underline;
}

.active-editor-tab {
	border-bottom: 2px solid #D6056D;
}

.overflow-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1; /* number of lines to show */
	line-clamp: 1;
	-webkit-box-orient: vertical;
}
</style>
