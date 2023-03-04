<!-- eslint-disable max-lines -->
<template>
	<div class="w-100">
		<app-title v-if="story" :title="story.name" />
		<ds-row class="m-0 p-0 h-100">
			<app-widget-palette v-if="story" :story-type="storyType" @create-widget="createWidget" @palette-open="closeSectionPopup" />
			<ds-col class="p-0">
				<ds-container class="m-0 p-0" fluid>
					<ds-row>
						<ds-col class="m-0 p-0">
							<app-editor-navbar />
						</ds-col>
					</ds-row>
					<ds-row class="m-0 p-0" :style="{height: 'calc(100vh - 58px)'}">
						<ds-col ref="container" class="m-0 p-0 overflow-auto" style="height: calc(100% - 2px)">
							<div>
								<app-loading :loading="!initialized || !metadataInitialized || storyLoading" class="p-4">
									<div ref="storyEditorCanvas">
										<ds-card class="m-0 mx-auto border-0" body-class="p-0 border-0 h-100" :style="cardStyle">
											<app-holder id="story-editor-story-holder" :style="storyType === storyTypes.VISUAL_DATA_STORY ? 'margin-bottom: 6rem' : null">
												<draggable
													v-if="storyType === storyTypes.VISUAL_DATA_STORY"
													v-bind="dragOptions"
													v-model="pageWidgetInstanceIds"
													tag="ul"
													class="list-group"
													handle=".custom-handle"
													:item-key="(element) => element + '-draggable-section'"
													@start="drag = true"
													@end="drag = false">
													<template #item="{element, index}">
														<div :data-testid="`app-section-${index}`">
															<div v-if="index === 0" class="d-flex justify-content-center section">
																<button class="btn btn-clean btn-sm section-btn" @click="openSectionPopup(index)">
																	<fa-icon class="m-0" :icon="['fal', 'plus']" />
																</button>
															</div>
															<app-section
																:ref="'section-' + index"
																:page-widget-instance-id="element"
																:pageWidgetInstanceIds="pageWidgetInstanceIds"
																:publishToken="story.publishToken"
																@open-section-popup="openSectionPopup(index, $event)"
																@delete-section="deleteSection(element)"
																@save-widget-instance-id="saveWidgetInstanceId(element)">
																<app-story-page
																	:id="index === 0 ? 'first-page' : ''"
																	:page-widget-instance-id="element" />
															</app-section>
															<div
																:key="'add-section-' + (index + 1)"
																:style="index === pageWidgetInstanceIds.length ? '' : ''"
																class="d-flex justify-content-center">
																<button class="btn btn-clean btn-sm section-btn" @click="openSectionPopup(index + 1)">
																	<fa-icon class="m-0" :icon="['fal', 'plus']" />
																</button>
															</div>
														</div>
													</template>
												</draggable>
												<template v-else>
													<app-story-page
														v-for="pageWidgetInstanceId in pageWidgetInstanceIds"
														:key="'story-page-' + pageWidgetInstanceId"
														:page-widget-instance-id="pageWidgetInstanceId" />
												</template>

												<template v-for="pageWidgetInstanceId in pageWidgetInstanceIds">
													<template v-for="id in widgetInstances(pageWidgetInstanceId)" :key="id + '-data-grid-modal'">
														<app-data-grid-modal :widget-instance-id="id" />
													</template>
												</template>
											</app-holder>
										</ds-card>

										<div class="w-100 d-flex justify-content-center">
											<div v-if="storyType === storyTypes.VISUAL_DATA_STORY" class="add-section">
												<app-popup
													ref="popup"
													data-testid="add-widget-btn"
													:sections="filteredSections"
													:columns="3"
													:visible="addSectionVisible && Object.values(deleting).every((value) => !value)"
													:creatingSection="creatingSection"
													@close="closeSectionPopup"
													@clicked="createWidget($event)"
													@btn-popup-click="popupClick" />
											</div>
										</div>
									</div>
								</app-loading>
							</div>
						</ds-col>
						<ds-col v-if="screenWidth >= 1100" cols="3" class="m-0 p-0 bg-white h-100 shadow-sm">
							<app-loading :loading="!initialized || !metadataInitialized || storyLoading" class="h-100">
								<app-widget-controls @go-to-section="scrollToSection($event)" />
							</app-loading>
						</ds-col>
						<div v-else class="p-0 m-0 h-100 rightPanelMobile">
							<app-widget-controls-mobile
								:storyInicialized="!initialized || !metadataInitialized || storyLoading"
								@scroll-to-index="scrollToSection" />
						</div>
					</ds-row>
				</ds-container>
			</ds-col>
		</ds-row>
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import AppDataGridModal from '@/modules/story/components/editor/AppDataGridModal.vue';
import AppEditorNavbar from '@/modules/story/components/editor/AppEditorNavbar.vue';
import AppHolder from '@/components/design/AppHolder.vue';
import AppLoading from '@/components/design/AppLoading.vue';
import AppPopup from '@/components/design/AppPopup.vue';
import AppSection from '@/components/design/AppSection.vue';
import AppStoryPage from '@/modules/story/components/editor/AppStoryPage.vue';
import AppWidgetControls from '@/modules/story/components/editor/AppWidgetControls.vue';
import AppWidgetControlsMobile from '@/modules/story/components/editor/AppWidgetControlsMobile.vue';
import AppWidgetPalette from '@/modules/story/components/editor/AppWidgetPalette.vue';
import dataPreviewBlacklist from '@/util/consts/dataPreviewBlacklist';
import draggable from 'vuedraggable';
import {scrollToSec} from '@/util/editorUtil';
import sections from '@/util/consts/sections';
import {updatePreviewImage} from '@/modules/story/components/editor/utils/thumbnailUtil';
import {cloneDeep, debounce, isEqual} from 'lodash';
import sectionStackingVariants from '@/util/consts/sectionStackingVariants';
import {storyType as storyTypes} from '@/modules/story/consts/storyType';

export default {
	name: 'Editor',
	components: {
		AppEditorNavbar,
		AppSection,
		AppWidgetControls,
		AppWidgetControlsMobile,
		AppHolder,
		AppWidgetPalette,
		AppLoading,
		AppStoryPage,
		draggable,
		AppDataGridModal,
		AppPopup
	},
	inject: ['appConfig'],
	props: {
		storyId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			initialized: false,
			screenWidth: 0,
			sections,
			dataPreviewBlacklist,
			addSectionVisible: false,
			addSectionIndex: null,
			addSectionStep: null,
			deleting: {},
			activeWidgetInstanceId: null,
			thumbnailDebounce: null,
			firstLoad: true,
			thumbnailDebounceFn: null,
			storyTypes,
			creatingSection: false
		};
	},
	computed: {
		...mapGetters('storyDetail', {
			story: 'story',
			storyLoading: 'loading',
			storyError: 'error',
			scale: 'scale',
			publishLoading: 'publishLoading'
		}),
		...mapGetters('widgetInstances', [
			'selectedWidgetInstanceId',
			'widgetInstanceIds'
		]),
		...mapGetters('widgetMetadata', {metadataInitialized: 'initialized'}),
		pageWidgetInstanceIds: {
			get() {
				return this.$store.getters['widgetInstances/pageWidgetInstanceIds'].filter((sectionId) => !this.deleting[sectionId]);
			},
			set(value) {
				this.reorderSections(value);
			}
		},
		firstSection() {
			const [firstPageId] = this.$store.getters['widgetInstances/pageWidgetInstanceIds'];
			const section = cloneDeep(this.$store.getters['widgetInstances/instance'](firstPageId));
			if (section) {
				section.widgets = section.widgetOrder.map((widgetId) => cloneDeep(this.$store.getters['widgetInstances/instance'](widgetId)));
			}
			return section;
		},
		filteredSections() {
			if (this.appConfig?.denyMaps || this.appConfig?.oneIntegration) {
				return this.sections.filter((section) => section.title !== 'Maps');
			}
			return this.sections;
		},
		globalFilters() {
			return this.story?.configuration?.globalFilters ?? [];
		},
		publishStoryUrl() {
			return this.story
				? `${window.location.origin}${this.$router.resolve({
					name: 'story-publish',
					params: {token: this.story.id}
				}).href}`
				: '';
		},
		publishStoryIframe() {
			return this.story
				? `<iframe width="100%" height=800 style="overflow:hidden; border: 0 none" src="${this.publishStoryUrl}"></iframe>`
				: '';
		},
		dimensions() {
			if (this.storyType === storyTypes.VISUAL_DATA_STORY) {
				return {
					width: 1200,
					height: 600
				};
			}
			const dimensions = this.story?.layoutConfiguration.dimensions ?? {};
			if (!dimensions.width) {
				dimensions.width = 1000;
			}
			if (!dimensions.height) {
				dimensions.height = 1000;
			}
			return dimensions;
		},
		storyType() {
			return this.story?.storyType ?? null;
		},
		theme() {
			const theme = this.story?.layoutConfiguration.theme ?? {};
			if (!theme.colors) {
				theme.colors = {
					background: '#FFFFFF'
				};
			} else if (!theme.colors.background) {
				theme.colors.background = '#FFFFFF';
			}

			return theme;
		},
		cardStyle() {
			const storyHeight = this.storyType === storyTypes.VISUAL_DATA_STORY
				? this.dimensions.height * this.pageWidgetInstanceIds
					.map((pageWidgetInstanceId) => this.pageHeightRatio(pageWidgetInstanceId))
					.reduce((sum, value) => sum + value, 0)
				: this.dimensions.height;
			return {
				height: this.storyType === storyTypes.VISUAL_DATA_STORY ? 'auto' : `${storyHeight * this.scale}px`,
				width: `${this.dimensions.width * this.scale}px`,
				backgroundColor: this.storyType === storyTypes.VISUAL_DATA_STORY ? 'transparent' : this.theme.colors.background,
				boxShadow: this.storyType === storyTypes.VISUAL_DATA_STORY ? 'none' : '0 0.01rem 0.2rem rgba(0,0,0,.075)'
			};
		},
		dragOptions() {
			return {
				animation: 200,
				group: 'description',
				disabled: false,
				ghostClass: 'ghost'
			};
		}
	},
	watch: {
		storyError(error) {
			if (error) {
				this.addMessage({
					variant: 'danger',
					text: error
				});
			}
		},
		globalFilters: {
			handler(val, oldVal) {
				if (!(val.length === 0 && oldVal.length === 0)) {
					const filterDatasets = [];
					val.forEach((el) => {
						Object.keys(el.columnReference).forEach((key) => {
							filterDatasets.push(key);
						});
					});

					Object.values(this.widgetInstanceIds).forEach((element) => {
						element.forEach((widget) => {
							if (this.$store.getters['widgetInstances/configuration'](widget).data !== null
								&& filterDatasets.includes(this.$store.getters['widgetInstances/configuration'](widget).data.datasetId)) {
								this.$store.dispatch('widgetData/loadData', {widgetInstanceId: widget}, {root: true});
							} else if (val.length === 0) {
								this.$store.dispatch('widgetData/loadData', {widgetInstanceId: widget}, {root: true});
							}
						});
					});
				}
			},
			deep: true
		},
		dimensions(dimensions) {
			this.recomputeScale(dimensions);
		},
		firstSection: {
			handler(newVal, oldVal) {
				let updateThumbnail = false;
				if (newVal) {
					if (this.storyType === storyTypes.VISUAL_DATA_STORY) {
						if (!oldVal) {
							updateThumbnail = true;
						}
						// if sectionId is changed
						if (!updateThumbnail && newVal?.id !== oldVal?.id) {
							updateThumbnail = true;
						}
						// if section stacking is changed
						const stackingNew = newVal?.configuration?.options?.stacking;
						const stackingOld = oldVal?.configuration?.options?.stacking;
						if (stackingNew && oldVal && newVal) {
							if (!updateThumbnail && stackingNew !== stackingOld) {
								updateThumbnail = true;
							}
						}
						// if widget order is changed check based on stacking
						if (!updateThumbnail && !isEqual(newVal.widgetOrder, oldVal.widgetOrder)) {
							updateThumbnail = this.checkWidgetsOrder(newVal, oldVal, stackingNew ?? stackingOld);
						}
						// if there was change in some widget data/option configuration
						if (!updateThumbnail && !isEqual(newVal.widgets, oldVal.widgets)) {
							updateThumbnail = this.checkWidgetsConfigurations(newVal, oldVal, stackingNew ?? stackingOld);
						}
					} else if (this.storyType === storyTypes.DATA_DASHBOARD) {
						if (!isEqual(newVal?.widgets, oldVal?.widgets)) {
							updateThumbnail = true;
						}
					}
					if (updateThumbnail) {
						this.thumbnailDebounceFn(this.story);
					}
				}
			},
			deep: true
		}
	},
	async mounted() {
		window.addEventListener('resize', this.recomputeHeights);
		document.addEventListener('click', this.deselect);
		try {
			await this.loadStorySections(this.storyId);
			await this.setWrapInstances();
			await this.loadFirstSectionSteps();
			this.initialized = true;
			this.editorOpened();
			this.recomputeHeights();
		} catch (error) {
			this.$router.push({
				name: 'disabled-present',
				params: {
					msg: this.$t('disabledPresenter.t_baseLoadError'),
					sub: ''
				}
			});
		}
	},
	unmounted() {
		window.removeEventListener('resize', this.recomputeHeights);
		document.removeEventListener('click', this.deselect);
	},
	created() {
		// eslint-disable-next-line
		this.thumbnailDebounceFn = debounce(function(story){ updatePreviewImage(story) }, 1000);
	},
	methods: {
		...mapActions('storyDetail', [
			'loadStory',
			'setScale',
			'setVisibility',
			'reorderSections',
			'loadStorySections',
			'loadFirstSectionSteps',
			'editorOpened'
		]),
		...mapActions('widgetInstances', [
			'selectWidgetInstance',
			'addPage',
			'createNewInstance',
			'removePageInstance',
			'setWrapInstances'
		]),
		...mapActions('flashMessages', ['addMessage']),
		recomputeHeights() {
			this.recomputeScale(this.dimensions);
		},
		recomputeScale(dimensions) {
			this.$nextTick(() => {
				this.screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
				const storyEditorWidth = this.$refs.storyEditorCanvas?.getBoundingClientRect().width ?? 1200;
				this.setScale(storyEditorWidth < dimensions.width ? storyEditorWidth / dimensions.width : 1);
			});
		},
		deselect() {
			if (this.selectedWidgetInstanceId) {
				this.$nextTick(() => {
					this.selectWidgetInstance(null);
				});
			}
		},
		onCopy() {
			this.addMessage({
				variant: 'success',
				text: 't_copiedToClipboard'
			});
		},
		openPublishedStory() {
			window.open(this.publishStoryUrl);
		},
		pageHeightRatio(pageWidgetInstanceId) {
			return this.$store.getters['widgetInstances/configuration'](pageWidgetInstanceId).options?.heightRatio ?? 1;
		},
		widgetInstances(pageWidgetInstanceId) {
			return this.$store.getters['widgetInstances/widgetInstanceIds'][pageWidgetInstanceId] ?? [];
		},
		createWidget(wtuid) {
			this.creatingSection = true;
			(this.storyType === storyTypes.VISUAL_DATA_STORY && this.addSectionStep === null ? this.addPage(this.addSectionIndex) : Promise.resolve())
				.then(() => {
					this.addSectionVisible = false;
					this.createNewInstance({
						widgetType: wtuid,
						index: this.addSectionStep
					})
						.then(() => {
							if (this.addSectionStep === null) {
								const sectionIndex = this.addSectionIndex === null ? this.pageWidgetInstanceIds.length - 1 : this.addSectionIndex;
								scrollToSec(this.$refs, sectionIndex);
							}
							this.addSectionStep = null;
							this.addSectionIndex = null;
							this.creatingSection = false;
						});
				});
		},
		scrollToSection(index) {
			scrollToSec(this.$refs, index);
		},
		widgetType(id) {
			return this.$store.getters['widgetInstances/widgetType'](id);
		},
		openSectionPopup(index, step = null) {
			this.addSectionVisible = true;
			this.addSectionIndex = index;
			this.addSectionStep = step;
		},
		closeSectionPopup() {
			this.addSectionVisible = false;
			this.addSectionIndex = null;
			this.addSectionStep = null;
		},
		popupClick() {
			this.addSectionVisible = !this.addSectionVisible;
			this.addSectionIndex = null;
			this.addSectionStep = null;
		},
		deleteSection(sectionId) {
			this.deleting[sectionId] = true;
			this.removePageInstance(sectionId).finally(() => {
				this.deleting[sectionId] = false;
			});
		},
		saveWidgetInstanceId(value) {
			this.activeWidgetInstanceId = value;
		},
		checkWidgetsOrder(newVal, oldVal, stackingVariant) {
			for (let i = 0; i < newVal.widgets.length; i++) {
				// do not check non relevant widgets
				if (i === sectionStackingVariants[stackingVariant]?.configuration.length) {
					break;
				}
				if (newVal.widgets[i]?.id !== oldVal.widgets?.[i]?.id) {
					return true;
				}
			}
			return false;
		},
		checkWidgetsConfigurations(newVal, oldVal, stackingVariant) {
			for (let i = 0; i < newVal.widgets.length; i++) {
				// do not check non relevant widgets
				if (i === sectionStackingVariants[stackingVariant]?.configuration.length) {
					break;
				}
				const newWidget = newVal.widgets[i];
				const oldWidget = oldVal.widgets[i];
				if (!isEqual(newWidget?.configuration.data, oldWidget?.configuration.data) || !isEqual(newWidget?.configuration.options, oldWidget?.configuration.options)) {
					return true;
				}
			}
			return false;
		}
	}
};
</script>

<style scoped>
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
.list-group {
	min-height: 20px;
}
.add-section {
	max-width: 640px;
	position: fixed;
	z-index: 901;
	bottom: 1rem;
}
.section-btn {
	z-index: 1;
}

.rightPanelMobile {
	flex: 0 0 3rem !important;
	max-width: 3rem !important;
	/* z-index must be bigger than z-index in vb-dragger */
	z-index: 1023 !important;
}
</style>
