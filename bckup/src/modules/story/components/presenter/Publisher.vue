<!-- eslint-disable max-lines -->
// TODO use body only to report scroll event and sync it with position
<template>
	<mounting-portal mount-to="body" append="true">
		<app-title v-if="story" :title="story.name" />
		<div ref="publishedStory" @scroll="scrollHandler">
			<app-loading :loading="!initialized || !metadataInitialized || storyLoading">
				<div class="py-4 bg-white">
					<div ref="storyEditorCanvas" class="w-100" :style="cardHolderStyle">
						<ds-card ref="card" class="my-0 border-0 shadow-none w-100" body-class="px-0 px-md-4 py-0 border-0 h-100" :style="cardStyle">
							<div
								v-if="story !== null && globalFilters !== null && globalFilters.length > 0"
								style="z-index: 1101; top: 24px;"
								class="d-flex align-items-center justify-content-end position-fixed w-100 pr-5 cornerButton">
								<button
									class="btn btn-secondary filterList bg-white m-0 rounded border d-flex justify-content-between py-2"
									@click="filterCollapse = !filterCollapse">
									{{ globalFilters.length }}
									<fa-icon :icon="['fal','filter']" class="ml-3 options-grey-style" />
								</button>
								<ds-collapse :is-open="filterCollapse" class="position-absolute mobileCard" style="top: 40px;">
									<ds-card footer-bg-variant="white" footer-class="d-flex justify-content-end">
										<div class="d-flex justify-content-between mb-2">
											<div style="color: #67686F; font-size: 14px; font-weight: 500">
												Filters
											</div>
											<fa-icon
												:icon="['fal','chevron-up']"
												size="lg"
												class="mr-2 cursor-pointer"
												alt="Close filters" />
										</div>
										<div class="mobileFilters" style="overflow-y: scroll; max-height: 265px;">
											<ds-container
												v-for="(filter, index) in preparedFilters"
												:key="index"
												class="border-0 cursor-pointer px-0 w-100 mt-1"
												@click="handleFilterClick(index)">
												<div class="d-flex justify-content-center align-items-center w-100 mobileFilter">
													<multi-filter-column-select
														class="mr-1 bg-white w-100 justify-content-center align-items-center d-flex"
														:editable="false"
														:preview="true"
														:filter="cloneDeep(globalFilters[index])"
														:filterIndex="index"
														:filterValue="globalFilters[index].value"
														:dropDirection="index >= (preparedFilters.length / 2) ? 'top' : 'bottom'"
														:selected-operation="globalFilters[index].logic"
														@filter-reseted="resetFilters($event)"
														@filter-created="setFilterActive(currentIndex, $event)" />
												</div>
												<ds-collapse :is-open="showEdit[index]">
													<ds-card :ref="`filterEdit-${index}`" class="mr-1 my-2 mobileEditCard">
														<multi-filter-column-select
															v-if="showEdit[index] === true"
															class="bg-white filterEditCard"
															:editable="true"
															:filter="cloneDeep(globalFilters[index])"
															:filterIndex="index"
															:filterValue="globalFilters[index].value"
															:selected-operation="globalFilters[index].logic"
															@filter-reseted="resetFilters($event)"
															@filter-created="setFilterActive(currentIndex, $event)"
															@click.stop />
													</ds-card>
												</ds-collapse>
											</ds-container>
										</div>
										<template #footer>
											<button class="btn btn-white" @click="resetAllFilters">
												Reset
											</button>
										</template>
									</ds-card>
								</ds-collapse>
							</div>
							<div class="mx-auto" :style="{width: storyWidth}" style="overflow:hidden;">
								<app-holder>
									<app-story-page
										v-for="pageWidgetInstanceId in pageWidgetInstanceIds"
										:key="'story-page-' + pageWidgetInstanceId"
										:page-widget-instance-id="pageWidgetInstanceId"
										:override-height="isVisualStory ? dimensions.height : null"
										:read-only="true" />
									<div v-if="isVisualStory" class="d-flex justify-content-center align-items-center mt-3" :style="{height: `${READ_AGAIN_SECTION_HEIGHT}px`}" />
								</app-holder>
							</div>
							<template v-if="isVisualStory">
								<div class="bottom-point views d-flex align-items-center">
									<fa-icon class="text-white bottom-point-icon" fixed-width :icon="['far', 'eye']" />
								</div>
								<div class="bottom-label views text-break bg-white rounded p-1">
									<small>{{ story.storyStatistics.visitorsCount }} Viewers</small>
								</div>
								<div class="bottom-point spocks d-flex align-items-center" :class="{'cursor-pointer': !clapAdded}" @click="addClapHandler">
									<fa-icon class="text-white bottom-point-icon" fixed-width :icon="['far', 'hand-spock']" />
								</div>
								<div
									class="bottom-label spocks text-break bg-primary text-white rounded p-1"
									:class="{'cursor-pointer': !clapAdded}"
									@click="addClapHandler">
									<small>{{ story.storyStatistics.clapsCount }} Spocks</small>
								</div>
								<div class="bottom-point read-again cursor-pointer d-flex align-items-center" @click="restartStory">
									<fa-icon class="text-white bottom-point-icon" fixed-width :icon="['far', 'sync-alt']" />
								</div>
								<div class="bottom-label read-again cursor-pointer text-break bg-primary text-white rounded p-1" @click="restartStory">
									<small>Read again</small>
								</div>
								<div class="created-text mb-5">
									<h4 class="text-center">{{ $t("createdWith") }} <a href="https://datastories.ataccama.com/" target="_blank">{{ $t("base.appName") }}</a></h4>
								</div>
							</template>
						</ds-card>
					</div>
				</div>
			</app-loading>
		</div>
	</mounting-portal>
</template>

<script>
import {
	READ_AGAIN_SECTION_HEIGHT,
	STEP_SCROLL_HEIGHT,
	STEP_SCROLL_IN,
	STEP_SCROLL_OUT
} from '@/util/consts/publisherConsts';
import {mapActions, mapGetters} from 'vuex';

import AppHolder from '@/components/design/AppHolder.vue';
import AppLoading from '@/components/design/AppLoading.vue';
import AppStoryPage from '@/modules/story/components/editor/AppStoryPage.vue';
import {publicRouteNameDashboardVertical} from '@/modules/story/components/presenter/consts';
import MultiFilterColumnSelect from '@/modules/widget/components/widget-controls/MultiFilterColumnSelect.vue';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

export default {
	name: 'Publisher',
	components: {
		AppStoryPage,
		AppHolder,
		AppLoading,
		MultiFilterColumnSelect
	},
	props: {
		token: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			initialized: false,
			timer: null,
			scrollY: 0,
			clapAdded: false,
			collapse: false,
			collapseFilters: false,
			isCloseable: false,
			showEdit: [],
			initialFilters: null,
			currentIndex: 0,
			cloneDeep,
			filterCollapse: false
		};
	},
	computed: {
		...mapGetters('storyDetail', {
			story: 'story',
			storyLoading: 'loading',
			storyError: 'error',
			scale: 'scale'
		}),
		...mapGetters('widgetInstances', [
			'pageWidgetInstanceIds',
			'widgetInstanceIds',
			'selectedWidgetInstanceIds'
		]),
		...mapGetters('widgetMetadata', {metadataInitialized: 'initialized'}),
		dimensions() {
			if (this.isVisualStory) {
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
		isVisualStory() {
			return this.storyType === 'visual-data-story';
		},
		globalFilters() {
			return this.story?.configuration?.globalFilters ?? [];
		},
		globalFilterMap() {
			return this.$store.getters['storyDetail/story'].configuration.globalFilterMap ?? [];
		},
		preparedFilters() {
			const prepareFilters = [];
			this.globalFilters.forEach((element) => {
				const tempFilter = [];
				Object.values(element.columnReference).forEach((col) => {
					col.forEach((val) => {
						tempFilter.push(val);
					});
				});

				prepareFilters.push(tempFilter);
			});

			return prepareFilters;
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
		storyHeight() {
			return this.isVisualStory
				? (this.pageWidgetInstanceIds
					.map((pageWidgetInstanceId) => this.pageHeight(pageWidgetInstanceId))
					.reduce((sum, value) => sum + value, 0) + READ_AGAIN_SECTION_HEIGHT)
				: this.dimensions.height;
		},
		storyWidth() {
			return `${this.dimensions.width * this.scale}px`;
		},
		storyScrollHeight() {
			return this.storyHeight + (this.isVisualStory
				? (this.pageWidgetInstanceIds
					.map((pageWidgetInstanceId) => this.pageWidgetCount(pageWidgetInstanceId) > 1 ? this.pageWidgetCount(pageWidgetInstanceId) * STEP_SCROLL_HEIGHT : 0)
					.reduce((sum, value) => sum + value, 0))
				: 0);
		},
		cardHolderStyle() {
			return {
				height: `${this.storyScrollHeight}px`
			};
		},
		// eslint-disable-next-line max-statements
		pageStates() {
			let heightCounter = 0;
			const {
				pageWidgetInstanceIds
			} = this;
			const pageStates = new Array(pageWidgetInstanceIds.length);
			for (let i = 0; i < pageWidgetInstanceIds.length; i++) {
				let stepCount = this.pageWidgetCount(pageWidgetInstanceIds[i]);
				stepCount = this.pageWidgetCount(pageWidgetInstanceIds[i]);
				const pageHeight = this.pageHeight(pageWidgetInstanceIds[i]);
				let step = (((this.scrollOffset + ((window.innerHeight - pageHeight) / 2)) - heightCounter) / STEP_SCROLL_HEIGHT) + 1;
				let stepProgress = step % 1;
				step = Math.floor(step);
				if (step >= stepCount + 1) {
					step = stepCount === 0 ? 1 : stepCount;
					stepProgress = 1;
				} else if (step < 1) {
					step = 1;
					stepProgress = 0;
				}

				pageStates[i] = {
					pageWidgetInstanceId: pageWidgetInstanceIds[i],
					step,
					stepProgress,
					stepCount,
					active: !((step === 1 && stepProgress === 0) || (step === stepCount && stepProgress === 1) || (stepCount === 1))
				};
				heightCounter += pageHeight + (stepCount > 1 ? stepCount * STEP_SCROLL_HEIGHT : 0);
			}
			return pageStates;
		},
		timelinePointStates() {
			const timeline = [];
			let offset = 0;
			let scrollOffset = 0;
			this.pageStates.forEach((pageState) => {
				for (let i = 0; i < pageState.stepCount; i++) {
					timeline.push({
						key: `${pageState.pageWidgetInstanceId}-step-${i}`,
						pageId: pageState.pageWidgetInstanceId,
						step: i + 1,
						offset: offset + ((this.pageHeight(pageState.pageWidgetInstanceId) / pageState.stepCount) * i),
						label: i === 0 ? this.pageLabel(pageState.pageWidgetInstanceId) : '',
						scrollOffset: Math.max(0, scrollOffset - ((this.editorHeight - this.pageHeight(pageState.pageWidgetInstanceId)) / 2) + 2)
					});
					scrollOffset += pageState.stepCount > 1 ? STEP_SCROLL_HEIGHT : 0;
				}
				scrollOffset += this.pageHeight(pageState.pageWidgetInstanceId);
				offset += this.pageHeight(pageState.pageWidgetInstanceId);
			});

			return timeline;
		},
		timelineProgress() {
			const timelineProgress = {
				progress: 0
			};
			for (let i = 0; i < this.pageStates.length; i++) {
				const page = this.pageStates[i];
				if (page.stepProgress === 0) {
					break;
				}
				if ((page.stepProgress < 1 || (this.pageStates[i + 1] && this.pageStates[i + 1].stepProgress === 0)) && page.step) {
					if (page.step === page.stepCount && this.pageStates[i + 1]) {
						timelineProgress.nextStep = {
							pageId: this.pageStates[i + 1].pageWidgetInstanceId,
							step: this.pageStates[i + 1].step
						};
					} else {
						timelineProgress.nextStep = {
							pageId: page.pageWidgetInstanceId,
							step: page.step + 1
						};
					}
					timelineProgress.nextStep.style = {
						border: `${this.scrollOffset < 4 ? 4 : (4 - (4 * page.stepProgress))}px solid white`
					};
					timelineProgress.currentStep = {
						pageId: this.pageStates[i].pageWidgetInstanceId,
						step: this.pageStates[i].step,
						style: {
							border: `${this.scrollOffset < 4 ? 0 : (4 * page.stepProgress)}px solid white`
						}
					};
				}
				const completedPages = ((page.step - 1) * (this.pageHeight(page.pageWidgetInstanceId)));
				const stepProgress = (((this.pageHeight(page.pageWidgetInstanceId) / 100) * (page.stepProgress * 100)) + completedPages) / page.stepCount;
				timelineProgress.progress += stepProgress;
			}
			if (this.scrollOffset < 4) {
				timelineProgress.progress = 1;
			}

			if (this.scrollOffset + this.editorHeight > this.storyScrollHeight) {
				timelineProgress.progress = this.storyHeight - 24;
				timelineProgress.nextStep = null;
				timelineProgress.currentStep = null;
			}

			return timelineProgress;
		},
		lockedScroll() {
			return this.pageStates.filter((pageState) => pageState.active).length > 0;
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
		metadataInitialized: {
			handler(value) {
				if (value) {
					this.$nextTick(() => {
						this.recomputeHeights();
					});
					this.loadComponent('Formula');
				}
			},
			immediate: true
		},
		storyLoading() {
			this.$nextTick(() => {
				this.recomputeHeights();
			});
		},
		dimensions(newValue, oldValue) {
			if (!isEqual(newValue, oldValue)) {
				this.recomputeHeights();
			}
		},
		timelineCharts(timelineWidgets) {
			if (this.timer) {
				clearTimeout(this.timer);
			}

			this.timer = setTimeout(() => {
				const options = {
					root: null,
					threshold: 0.9
				};

				const observer = new IntersectionObserver(this.observerCallback.bind(this), options);

				for (const wid of timelineWidgets) {
					observer.observe(document.getElementById(wid));
				}
			}, 200);
		},
		pageStates() {
			if (this.isVisualStory) {
				this.pageStates.forEach((scrolledPage) => {
					this.setWidgetInstanceState({
						widgetInstanceId: this.widgetInstanceIds[scrolledPage.pageWidgetInstanceId]?.[scrolledPage.step - 1] ?? null,
						state: scrolledPage.active
							? (scrolledPage.stepProgress < STEP_SCROLL_IN
								? scrolledPage.stepProgress / STEP_SCROLL_IN
								: ((1 - scrolledPage.stepProgress) < STEP_SCROLL_OUT && scrolledPage.step !== scrolledPage.stepCount
									? (1 - scrolledPage.stepProgress) / STEP_SCROLL_OUT
									: 1))
							: 1
					});
				});
			}
		}
	},
	created() {
		this.READ_AGAIN_SECTION_HEIGHT = READ_AGAIN_SECTION_HEIGHT;
		window.addEventListener('scroll', this.scrollHandler);
		document.addEventListener('scroll', this.scrollHandler);
		window.addEventListener('resize', this.recomputeHeights);
	},
	unmounted() {
		window.removeEventListener('scroll', this.scrollHandler);
		document.removeEventListener('scroll', this.scrollHandler);
		window.removeEventListener('resize', this.recomputeHeights);
	},
	async mounted() {
		// set story to be read only in public view
		if (this.$route.name === publicRouteNameDashboardVertical) {
			this.setReadOnly();
			this.setStoryReadOnly();
		}
		try {
			await this.loadStory(this.token);
			this.initialFilters = cloneDeep(this.globalFilters);
			this.initialized = true;
		} catch (error) {
			this.$router.push({
				name: 'disabled-present',
				params: {
					msg: this.$t('disabledPresenter.t_baseLoadError'),
					sub: ''
				}
			});
		}
		this.$nextTick(() => {
			this.recomputeHeights();
		});
	},
	methods: {
		...mapActions('storyDetail', [
			'setStoryReadOnly',
			'loadStory',
			'setScale',
			'addClap'
		]),
		...mapActions('flashMessages', ['addMessage']),
		...mapActions('widgetInstances', [
			'setReadOnly',
			'setWidgetInstanceState'
		]),
		...mapActions('dependencies', {loadComponent: 'loadDependency'}),
		recomputeHeights() {
			this.scrollY = window.scrollY;
			this.recomputeScale(this.dimensions);
		},
		scrollHandler() {
			if (!this.isVisualStory) {
				// return;
			}
			// this.$recompute('scrollOffset');
		},
		pageHeightRatio(pageWidgetInstanceId) {
			return this.$store.getters['widgetInstances/configuration'](pageWidgetInstanceId).options?.heightRatio ?? 1;
		},
		pageHeight(pageWidgetInstanceId) {
			return pageWidgetInstanceId
				? (this.dimensions.height * this.pageHeightRatio(pageWidgetInstanceId) * this.scale)
				: 0;
		},
		pageWidgetCount(pageWidgetInstanceId) {
			const isAnimated = (this.$store.getters['widgetInstances/configuration'](pageWidgetInstanceId).options?.stacking ?? 'animated') === 'animated';
			return (this.isVisualStory && !isAnimated)
				? 1
				: (this.$store.getters['widgetInstances/widgetInstanceIds'][pageWidgetInstanceId]?.length ?? 0);
		},
		pageLabel(pageWidgetInstanceId) {
			return (this.$store.getters['widgetInstances/configuration'](pageWidgetInstanceId).options?.label ?? '');
		},
		restartStory() {
			if (!this.isVisualStory) {
				return;
			}
			window.scrollTo(0, 0);
		},
		resetFilters(index) {
			const newConfiguration = cloneDeep(this.story.configuration);
			newConfiguration.globalFilters[index] = cloneDeep(this.initialFilters[index]);
			this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true}).then(() => {
				this.setFilterActive(index);
			});
		},
		resetAllFilters() {
			const newConfiguration = cloneDeep(this.story.configuration);
			newConfiguration.globalFilters = cloneDeep(this.initialFilters);
			this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true}).then(() => {
				this.globalFilters.forEach((global, index) => {
					this.setFilterActive(index);
				});
			});
		},
		handleHide(bvEvent) {
			if (this.isCloseable) {
				this.$refs.dropdown.hide();
			} else {
				bvEvent.preventDefault();
			}
		},
		closeMe() {
			this.isCloseable = true;
			this.$refs.dropdown.hide();
			const tempEdit = [];
			this.showEdit.forEach(() => {
				tempEdit.push(false);
			});
			this.showEdit = cloneDeep(tempEdit);
		},
		handleFilterClick(index) {
			const checkValue = this.showEdit[index];
			this.currentIndex = index;
			if (this.globalFilters.length >= this.showEdit.length) {
				this.showEdit = [];
				this.globalFilters.forEach(() => {
					this.showEdit.push(false);
				});
			}

			if (this.globalFilters[index]?.editable === true) {
				this.showEdit[index] = !checkValue;
				this.showEdit = cloneDeep(this.showEdit);
			}
			setTimeout(() => {
				this.$refs[`filterEdit-${index}`][0].scrollTop = this.$refs[`filterEdit-${index}`][0].scrollHeight;

				this.$refs[`filterEdit-${index}`][0].scrollIntoView({
					behavior: 'auto',
					block: 'center'
				});
			}, 500);
		},
		setFilterActive(index, event = null) {
			const newConfiguration = cloneDeep(this.story.configuration);
			if (event !== null && typeof event.filter !== 'undefined') {
				newConfiguration.globalFilters[index] = cloneDeep(event.filter);
			}

			this.showEdit[index] = false;
			this.showEdit = cloneDeep(this.showEdit);

			const filterDatasets = [];
			Object.keys(newConfiguration.globalFilters[index].columnReference).forEach((key) => {
				filterDatasets.push(key);
			});

			this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true});

			Object.values(this.widgetInstanceIds).forEach((element) => {
				element.forEach((widget) => {
					if (this.$store.getters['widgetInstances/configuration'](widget).data !== null
						&& filterDatasets.includes(this.$store.getters['widgetInstances/configuration'](widget).data.datasetId)) {
						this.$store.dispatch('widgetData/loadData', {widgetInstanceId: widget}, {root: true});
					}
				});
			});
		},
		pageWidgetIds(pageId) {
			return this.$store.getters['widgetInstances/widgetInstanceIds'][pageId] ?? [];
		},
		facts(id) {
			return this.$store.getters['widgetFacts/facts'](id);
		},
		observerCallback(entries) {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.$store.commit('widgetTimeline/setState', {
						id: entry.target.id,
						playState: true
					});
				} else {
					this.$store.commit('widgetTimeline/setState', {
						id: entry.target.id,
						playState: false
					});
				}
			});
		},
		addClapHandler() {
			if (!this.clapAdded) {
				this.addClap();
				this.clapAdded = true;
			}
		}
	}
};
</script>

<style lang='scss' scoped>
@import "../../../../../node_modules/bootstrap/scss/mixins/breakpoints";


@include media-breakpoint-down(xl) {
	.filterEditCard {
		right: 0 !important;
		top: 280px !important;
		min-width: 250px !important;
	}
}

@include media-breakpoint-down(md) {
	.cornerButton {
		top: 6px !important;
		right: -40px;
	}
	.mobileCard {
		max-width: 310px;
	}
	.mobileFilter {
		min-width: 380px !important;
	}
	.mobileFilters {
		overflow-x: scroll;
		max-width: 260px;
	}
	.mobileEditCard {
		width: 290px;
	}
}

.mobileFilter {
	min-width: 150px;
}

.filterEditCard {
	right: 310px;
	top: 75px;
	max-width: 350px;
	z-index: 1100;
}

:deep(.dropdown-menu) {
	padding-top: 25px;
	margin-top: 15px;;
	border: 0 !important;
	min-width: 250px;
	max-width: 300px;
	overflow-y: auto;
	max-height: 200px;
	z-index: 1100 !important;
	margin-right: 10px;
}

:deep(.dropdown-menu::-webkit-scrollbar) {
	display: none;
}

:deep(.b-dropdown-form) {
	padding-left: 0 !important;
	padding-right: 0 !important;
}

.bottom-point {
	position: absolute;
	width: 32px;
	height: 32px;
	background-color: $primary;
	border-radius: 50%;
	border: 4px solid white;
	transform: translateX(calc(-50% + 1.5px));
	z-index: 3;
}

.filterCard {
	background-color: rgb(251, 251, 252);
}

.bottom-point .bottom-point-icon {
	margin: auto;
	font-size: 0.75rem;
}

.bottom-point.views {
	bottom: 96px;
	left: 24px;
}

.bottom-point.spocks {
	bottom: 48px;
	left: 24px;
}

.bottom-point.read-again {
	bottom: -1px;
	left: 24px;
}

.bottom-label {
	position: absolute;
	word-break: break-word;
	min-width: 100px;
	z-index: 1;
}

.bottom-label.views {
	left: 48px;
	bottom: 96px;
}

.bottom-label.spocks {
	left: 48px;
	bottom: 48px;
}

.bottom-label.read-again {
	left: 48px;
	bottom: 0;
}

.created-text {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100vw;
}
</style>
