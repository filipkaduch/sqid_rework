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
											<app-holder id="story-editor-story-holder" :style="storyType === 'visual-data-story' ? 'margin-bottom: 6rem' : null">
												<draggable
													v-if="storyType === 'visual-data-story'"
													v-bind="dragOptions"
													v-model="pageWidgetInstanceIds"
													tag="ul"
													class="list-group"
													handle=".custom-handle"
													@start="drag = true"
													@end="drag = false">
													<transition-group type="transition">
														<div v-for="(pageWidgetInstanceId, index) in pageWidgetInstanceIds" :key="'story-page-' + pageWidgetInstanceId">
															<div v-if="index === 0" class="d-flex justify-content-center section">
																<button class="btn btn-clean btn-sm section-btn" @click="openSectionPopup(index)">
																	<fa-icon class="m-0" :icon="['fal', 'plus']" />
																</button>
															</div>
															<app-section
																:ref="'section-' + index"
																:page-widget-instance-id="pageWidgetInstanceId"
																:pageWidgetInstanceIds="pageWidgetInstanceIds"
																:publishToken="story.publishToken"
																@open-section-popup="openSectionPopup(index, $event)"
																@delete-section="deleteSection(pageWidgetInstanceId)"
																@save-widget-instance-d="saveWidgetInstanceId(pageWidgetInstanceId)">
																<app-story-page
																	:id="index === 0 ? 'first-page' : ''"
																	:page-widget-instance-id="pageWidgetInstanceId" />
															</app-section>
															<div
																:key="'add-section-' + (index + 1)"
																class="d-flex justify-content-center">
																<button class="btn btn-clean btn-sm section-btn" @click="openSectionPopup(index + 1)">
																	<fa-icon class="m-0" :icon="['fal', 'plus']" />
																</button>
															</div>
														</div>
													</transition-group>
												</draggable>
												<template v-else>
													<app-story-page
														v-for="pageWidgetInstanceId in pageWidgetInstanceIds"
														:key="'story-page-' + pageWidgetInstanceId"
														:page-widget-instance-id="pageWidgetInstanceId" />
												</template>

												<template v-for="pageWidgetInstanceId in pageWidgetInstanceIds">
													<template v-for="id in widgetInstances(pageWidgetInstanceId)" :key="id">
														<app-data-grid-modal v-if="!dataPreviewBlacklist[widgetType(id)]" :widget-instance-id="id" />
													</template>
												</template>
											</app-holder>
										</ds-card>

										<div class="w-100 d-flex justify-content-center">
											<div v-if="storyType === 'visual-data-story'" class="add-section">
												<app-popup
													ref="popup"
													:sections="filteredSections"
													:columns="3"
													:visible="addSectionVisible && Object.values(deleting).every((value) => !value)"
													:creatingSection="creatingSection"
													@focusout="closeSectionPopup"
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
			'selectedWidgetInstanceIds',
			'selectedPageWidgetInstanceId',
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
			if (this.storyType === 'visual-data-story') {
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
			const storyHeight = this.storyType === 'visual-data-story'
				? this.dimensions.height * this.pageWidgetInstanceIds
					.map((pageWidgetInstanceId) => this.pageHeightRatio(pageWidgetInstanceId))
					.reduce((sum, value) => sum + value, 0)
				: this.dimensions.height;
			return {
				height: this.storyType === 'visual-data-story' ? 'auto' : `${storyHeight * this.scale}px`,
				width: `${this.dimensions.width * this.scale}px`,
				backgroundColor: this.storyType === 'visual-data-story' ? 'transparent' : this.theme.colors.background,
				boxShadow: this.storyType === 'visual-data-story' ? 'none' : '0 0.01rem 0.2rem rgba(0,0,0,.075)'
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
		globalFilters(val, oldVal) {
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
		metadataInitialized() {
			this.recomputeScale(this.dimensions);
		},
		storyLoading() {
			this.recomputeScale(this.dimensions);
		},
		dimensions(dimensions) {
			this.recomputeScale(dimensions);
		}
	},
	async mounted() {
		try {
			await this.loadStory(this.storyId);
			this.initialized = true;
			this.editorOpened();
			this.recomputeHeights();
		} catch (error) {
			await this.$router.push({
				name: 'disabled-present',
				params: {
					msg: this.$t('disabledPresenter.t_baseLoadError'),
					sub: ''
				}
			});
		}
	},
	methods: {
		...mapActions('storyDetail', [
			'loadStory',
			'setScale',
			'setVisibility',
			'reorderSections',
			'editorOpened'
		]),
		...mapActions('widgetInstances', [
			'selectWidgetInstance',
			'addPage',
			'createNewInstance',
			'removePageInstance'
		]),
		...mapActions('flashMessages', ['addMessage']),
		recomputeHeights() {
			this.recomputeScale(this.dimensions);
		},
		recomputeScale(dimensions) {
			this.$nextTick(() => {
				this.screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
				const storyEditorWidth = this.$refs.storyEditorCanvas?.getBoundingClientRect().width ?? 1000;
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
			(this.storyType === 'visual-data-story' && this.addSectionStep === null ? this.addPage(this.addSectionIndex) : Promise.resolve())
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
		}
	}
};
</script>

<style scoped>
.modal-backdrop {
	width: 100%;
	height: 100%;
}
.flip-list-move {
	transition: transform 0.5s;
}
.no-move {
	transition: transform 0s;
}
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
.list-group {
	min-height: 20px;
}
.add-section {
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
