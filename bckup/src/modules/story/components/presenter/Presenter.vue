<template>
	<div class="presenter-container">
		<app-title v-if="story" :title="story.name" />
		<app-loading :loading="story === null">
			<ds-container fluid class="p-0" data-testid="presenter-sections">
				<ds-row class="bg-separate-content-200" no-gutter>
					<div class="position-relative">
						<div class="position-absolute position-left">
							<presenter-navigation
								:activeSection="activeSection"
								:activeWidgetGroup="activeWidgetGroup"
								:sidebar-active="sidebarActive"
								:seenWidgets="seenWidgets"
								@active-widget="activeWidget = $event"
								@sidebar-state="setSidebarActive"
								@scroll-to-section="handleNavigationClick" />
						</div>
					</div>
					<ds-col
						class="p-0 position-relative bg-white vh-100 vw-100"
						@wheel="handleMouseWheel">
						<preview-banner />
						<presenter-header-navigation
							v-model:sidebar-active="sidebarActive"
							:story="story"
							:activeWidgetGroup="activeWidgetGroup"
							:activeSection="activeSection"
							@open-filters="filterSidebarActive = true" />
						<transition-group
							v-for="(pageWidgetInstanceId, pageIndex) in storySectionsIds"
							:key="'transition-' + pageWidgetInstanceId + '-section-' + pageIndex"
							:name="scrollDirectionDown ? 'slide-down' : 'slide-up'"
							:class="{'active-section': activeSection === pageIndex}"
							tag="section"
							class="story-page mx-auto">
							<presenter-section
								v-if="pageWidgetInstanceId !== 'end-section'"
								v-show="pageIndex === activeSection"
								:key="'section-' + pageWidgetInstanceId + '-step-' + pageIndex"
								class="section-layout"
								:class="{'first-widget': activeSection === 0}"
								:active-resize="pageIndex === activeSection && isStacking(storySectionsIds[pageIndex])"
								:render-widgets="renderWidgets(pageIndex)"
								:section-index="pageIndex"
								:scroll-direction-down="scrollDirectionDown"
								:page-widget-instance-id="storySectionsIds[pageIndex]"
								:override-height="dimensions.height"
								:active-widget-group="activeWidgetGroup"
								:read-only="true" />
							<app-holder
								v-show="storySectionsIds.length - 1 === activeSection"
								key="section-end-section"
								class="position-absolute">
								<presenter-last-page :story="story" @replay-story="moveToFirstStep" />
							</app-holder>
						</transition-group>
					</ds-col>
					<presenter-global-filters :open="filterSidebarActive" :story="story" @close-filters="filterSidebarActive = false" />
				</ds-row>
			</ds-container>
		</app-loading>
	</div>
</template>
<script>
import AppHolder from '@/components/design/AppHolder.vue';
import AppLoading from '@/components/design/AppLoading.vue';
import PresenterHeaderNavigation from '@/modules/story/components/presenter/components/navBar/PresenterHeaderNavigation.vue';
import PresenterLastPage from '@/modules/story/components/presenter/components/PresenterLastPage.vue';
import PresenterNavigation from '@/modules/story/components/presenter/components/PresenterNavigation.vue';
import PresenterSection from '@/modules/story/components/presenter/components/story/PresenterSection.vue';
import {restricted, restriced, publicRouteName} from '@/modules/story/components/presenter/consts';
import {sectionStackingModes} from '@/util/consts/sectionStackingVariants';
import PresenterGlobalFilters from '@/modules/story/components/presenter/components/PresenterGlobalFilters.vue';
import PreviewBanner from '@/modules/story/components/presenter/components/microcomponents/PreviewBanner.vue';
import {useSwipe} from '@vueuse/core';
import i18n from '@/plugins/i18n/index';
const {t} = i18n.global;

import {
	STORY_DETAIL_ACTIONS,
	STORY_DETAIL_GETTERS,
	STORY_DETAIL_MUTATIONS,
	STORY_DETAIL_NAME
} from '@/modules/story/store/types';
import {watch, onMounted, onBeforeUnmount, reactive, toRefs, computed, ref} from 'vue';
import usePresenterNavigation from '@/modules/story/components/presenter/usePresenterNavigation';
import {useStore} from 'vuex';
import {useRoute, useRouter} from 'vue-router';

export default {
	components: {
		PreviewBanner,
		PresenterGlobalFilters,
		PresenterLastPage,
		PresenterSection,
		AppLoading,
		PresenterHeaderNavigation,
		PresenterNavigation,
		AppHolder
	},
	props: {
		token: {
			type: String,
			required: true
		}
	},
	// eslint-disable-next-line max-lines-per-function,max-statements
	setup(props) {
		const samePageError = 'Avoided redundant navigation to current location';
		const store = useStore();
		const route = useRoute();
		const router = useRouter();
		const {lengthY} = useSwipe(window, {
			passive: false,
			onSwipeEnd(event, direction) {
				if (lengthY.value > 150 || lengthY.value < -150) {
					handleSwipe(direction);
				}
			}
		});
		const state = reactive({
			firstLoad: true,
			sidebarActive: false,
			filterSidebarActive: false,
			dimensions: {
				width: 1200,
				height: 600
			}
		});
		const stateStory = reactive({
			activeSection: 0,
			activeWidgetGroup: null,
			pageStates: [],
			storySectionsIds: [],
			sectionWidgetsIds: {},
			activeWidget: null,
			seenWidgets: []
		});
		const debouncedHandler = ref(null);
		const navigationState = reactive({
			inMove: false,
			touchStartY: 0,
			swipeLength: 0,
			scrollDirectionDown: true
		});
		const {
			handleSwipe,
			handleMouseWheel,
			moveToFirstStep,
			querySection,
			queryStep,
			scrollToQuery,
			handleNavigationClick,
			navigationEventListenerRegister,
			navigationEventListenerUnregister
			// eslint-disable-next-line no-empty-function
		} = usePresenterNavigation(route, debouncedHandler, navigationState, stateStory, setActiveGroup);

		const story = computed(() => store.getters[`${STORY_DETAIL_NAME}/${STORY_DETAIL_GETTERS.STORY}`]);
		watch(story, (val) => {
			if (val) {
				val.sections.forEach((section) => {
					stateStory.sectionWidgetsIds[section.id] = section.widgets.map((widget) => widget.id);
					stateStory.storySectionsIds.push(section.id);
				});
				stateStory.storySectionsIds.push('end-section');
				stateStory.sectionWidgetsIds['end-section'] = ['end-page'];
				getWidgetPages();
				setActiveGroup();
			}
		});
		const setStoryReadOnly = () => store.dispatch(`${STORY_DETAIL_NAME}/${STORY_DETAIL_ACTIONS.SET_STORY_READ_ONLY}`);
		const loadStorySections = (params) => store.dispatch(`${STORY_DETAIL_NAME}/${STORY_DETAIL_ACTIONS.LOAD_STORY_SECTIONS}`, params);
		const setStoryInstance = (params) => store.dispatch(`${STORY_DETAIL_NAME}/${STORY_DETAIL_ACTIONS.LOAD_STORY_INSTANCE}`, params);
		const setReadOnly = () => store.commit(`${STORY_DETAIL_NAME}/${STORY_DETAIL_MUTATIONS.SET_READONLY}`);
		const widgetInstanceSetReadOnly = () => store.dispatch('widgetInstances/setReadOnly');
		const setWrapInstances = () => store.dispatch('widgetInstances/setWrapInstances');
		const isPublicRoute = computed(() => {
			const publicRoutes = [publicRouteName, restricted, restriced];
			return publicRoutes.includes(route.name);
		});
		onMounted(async() => {
			// TODO: we need this only for testing!!! fix IT
			await store.dispatch('widgetMetadata/loadMetadata', true);
			// set story to be read only in public view
			if (isPublicRoute.value) {
				widgetInstanceSetReadOnly();
				setStoryReadOnly();
			}
			setReadOnly();
			if ((!route.query.section && !route.query.step) || (route.query.section === '1' && route.query.step === '1')) {
				stateStory.activeWidget = 1;
			}
			try {
				await loadStorySections(props.token);
				await setWrapInstances();
				setStoryInstance({
					section: querySection.value ? querySection.value - 1 : 0,
					step: queryStep.value ? queryStep.value - 1 : 0,
					count: 2
				});
			} catch (error) {
				router.push({
					name: 'disabled-present',
					params: {
						msg: t('disabledPresenter.t_baseLoadError'),
						sub: ''
					}
				});
			}
			scrollToQuery();
		});
		// Load widget when you moving in navigation
		const activeStep = computed(() => stateStory.activeWidgetGroup?.step ?? null);
		watch(activeStep, (val) => {
			if (state.firstLoad) {
				state.firstLoad = false;
			} else {
				router.replace({
					query: {
						section: stateStory.activeSection + 1,
						step: val
					}
				}).catch((err) => {
					// TODO change for Navigation Failure Types after moving to version 3.4.0
					// Ignore the router err regarding  navigating to the page they are already on.
					if (!err.message.includes(samePageError)) {
						throw err;
					}
				});
			}
		});
		// Set vue route query for link to section/step
		watch(() => stateStory.activeSection, (val) => {
			router.replace({
				query: {
					section: val + 1,
					step: activeStep.value
				}
			}).catch((err) => {
				// TODO change for Navigation Failure Types after moving to version 3.4.0
				// Ignore the router err regarding  navigating to the page they are already on.
				if (!err.message.includes(samePageError)) {
					throw err;
				}
			});
		});
		watch(() => stateStory.activeWidget, (val, oldVal) => {
			if (!stateStory.seenWidgets.includes(oldVal) && Number.isInteger(oldVal)) {
				stateStory.seenWidgets.push(oldVal);
			}
		});
		// Register key down handlers
		navigationEventListenerRegister();
		onBeforeUnmount(() => {
			// Unregister key down handlers
			navigationEventListenerUnregister();
		});
		const setSidebarActive = (isActive) => {
			state.sidebarActive = isActive;
		};
		const getWidgetPages = () => {
			const pageStates = new Array(stateStory.storySectionsIds.length);
			for (let i = 0; i < stateStory.storySectionsIds.length; i++) {
				const stepCount = pageWidgetCount(stateStory.storySectionsIds[i], i);
				pageStates[i] = {
					widgetInstanceId: stateStory.storySectionsIds[i],
					step: 1,
					stepMap: stateStory.sectionWidgetsIds[stateStory.storySectionsIds[i]],
					stepCount
				};
			}
			stateStory.pageStates = pageStates;
		};
		const stateByActiveSection = () => {
			const activeWidgetId = Object.keys(stateStory.sectionWidgetsIds)[stateStory.activeSection];
			return stateStory.pageStates.find((widget) => widget.widgetInstanceId === activeWidgetId);
		};
		const pageWidgetCount = (pageWidgetInstanceId, index) => {
			const isAnimated = (story.value.sections[index]?.configuration?.stacking ?? sectionStackingModes.ANIMATED) === sectionStackingModes.ANIMATED;
			return (isAnimated)
				? stateStory.sectionWidgetsIds[pageWidgetInstanceId]?.length ?? 0
				: 1;
		};
		// eslint-disable-next-line func-style
		function setActiveGroup() {
			const group = stateByActiveSection();
			if (!stateStory.activeWidgetGroup || group.widgetInstanceId !== stateStory.activeWidgetGroup?.widgetInstanceId) {
				stateStory.activeWidgetGroup = group;
				if (!navigationState.scrollDirectionDown) {
					stateStory.activeWidgetGroup.step = group.stepCount;
				}
			}
		}
		const isStacking = (pageWidgetInstanceId) => getStacking(pageWidgetInstanceId) !== sectionStackingModes.ANIMATED;
		// eslint-disable-next-line max-len
		const getStacking = (pageWidgetInstanceId) => (store.getters['widgetInstances/configuration'](pageWidgetInstanceId)?.options?.stacking ?? sectionStackingModes.ANIMATED);
		const renderWidgets = (pageIndex) => pageIndex === stateStory.activeSection
			|| pageIndex === stateStory.activeSection + 1
			|| pageIndex === stateStory.activeSection - 1;

		return {
			story,
			...toRefs(state),
			...toRefs(stateStory),
			...toRefs(navigationState),
			queryStep,
			setSidebarActive,
			handleNavigationClick,
			handleMouseWheel,
			isStacking,
			renderWidgets,
			moveToFirstStep
		};
	}
};
</script>
<style lang="scss" scoped>
.active-section {
	z-index: 2
}
.position-left {
	left: 0;
	top: 0;
	z-index: 3333;
}
.presenter-container {
  margin: 0;
  color: white;
  font-family: Roboto, arial, sans-serif;
  overflow: hidden;
  width: 100%;
  height: 100vh;
}

.end-section-background {
	background-color: map-get($ds-colors, 'separate-content-0') !important;
}

@media screen and (max-width: 1200px) {
	h1 {
		font-size: 2.5em;
	}
}
.story-page {
	height: 100vh;
	width: 100vw;
	position: absolute;
}
.section-layout {
	height: 100% !important;
}
.header-bar {
	border-bottom: 1px solid map-get($ds-colors, 'separate-content-200');
	background-color: white!important;
}
.title {
	font-family: Roboto, sans-serif;
	size: 1.2rem !important;
	line-height: 28px;
}
.active-sidebar-widget-padding :deep(.widget-padding) {
	padding-left: calc(100vw / 12);
	padding-right: 1rem;
}
.active-sidebar-widget-padding-stacking :deep(.stacked-left) {
	padding-left: calc(100vw / 12);
	padding-right: 0;
}
.bg-separate-content-200 {
	background-color: map-get($ds-colors, 'separate-content-200')
}
.slide-down-enter-active,
.slide-down-leave-active {
	transition: all 0.5s;
	transition-delay: 100ms;
}
.slide-down-enter-from {
	transform: translateY(100%);
}
.slide-down-leave-to {
	transform: translateY(-100%);
}

.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.5s;
	transition-delay: 100ms;
}
.slide-up-enter-from {
	transform: translateY(-100%);
}
.slide-up-leave-to {
	transform: translateY(100%);
}
</style>
