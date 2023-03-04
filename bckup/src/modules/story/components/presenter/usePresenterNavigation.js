import {debounce} from 'lodash';
import store from '@/plugins/store';
import {STORY_DETAIL_ACTIONS, STORY_DETAIL_NAME} from '@/modules/story/store/types';
import {computed} from 'vue';

// eslint-disable-next-line max-lines-per-function
export default function usePresenterNavigation(route, debouncedHandler, navigationState, stateStory, setActiveGroup) {
	const selectWidgetInstance = (params) => store.commit('widgetInstances/selectWidgetInstance', params);
	const querySection = computed(() => Number(route.query.section));
	const queryStep = computed(() => Number(route.query.step));
	debouncedHandler.value = debounce((event) => {
		if (event.wheelDelta < 0 && !navigationState.inMove) {
			moveUp();
		} else if (event.wheelDelta > 0 && !navigationState.inMove) {
			moveDown();
		}
	}, 50);
	const navigationEventListenerUnregister = () => {
		// keyboard map
		window.removeEventListener('keydown', keyboardMap);
		debouncedHandler.value.cancel();
	};
	const navigationEventListenerRegister = () => {
		// arrows
		window.addEventListener('keydown', keyboardMap);
		// mobile devices
	};
	const keyboardMap = (event) => {
		switch (event.keyCode) {
			case 37:
				moveDown();
				event.preventDefault();
				break;
			case 38:
				moveDown();
				event.preventDefault();
				break;
			case 39:
				moveUp();
				event.preventDefault();
				break;
			case 40:
				moveUp();
				event.preventDefault();
				break;
		}
	};
	const setStoryInstance = (params) => store.dispatch(`${STORY_DETAIL_NAME}/${STORY_DETAIL_ACTIONS.LOAD_STORY_INSTANCE}`, params);
	// eslint-disable-next-line consistent-return
	const scrollToSection = (sectionIndex, force = false, scrollDirectionDown = null, stepIndex = null) => {
		navigationState.scrollDirectionDown = scrollDirectionDown;
		if (navigationState.inMove && !force) {
			return false;
		}
		if (stepIndex === null) {
			stateStory.activeSection = sectionIndex;
			setActiveGroup();
			navigationState.inMove = true;
		} else {
			stateStory.activeSection = sectionIndex;
			setActiveGroup();
			stateStory.activeWidgetGroup.step = stepIndex + 1;
			selectWidgetInstance({widgetInstanceId: stateStory.activeWidgetGroup.stepMap[stepIndex]});
		}
		setTimeout(() => {
			navigationState.inMove = false;
			setStoryInstance({
				section: stateStory.activeSection,
				step: stateStory.activeWidgetGroup.step - 1,
				count: 5
			});
		}, 400);
	};
	const scrollToQuery = () => {
		if (querySection.value <= stateStory.storySectionsIds.length) {
			const step = queryStep.value <= stateStory.pageStates[querySection.value - 1].stepCount ? queryStep.value - 1 : null;
			scrollToSection(querySection.value - 1, true, true, step);
		}
	};
	const handleNavigationClick = (sectionIndex, force = false, scrollDirectionDown = null, stepIndex = null) => {
		scrollToSection(sectionIndex, force, scrollDirectionDown, stepIndex);
		// set sections steps based on clicked section location
		stateStory.pageStates.forEach((section, index) => {
			if (index < sectionIndex) {
				section.step = section.stepCount;
				return section;
			}
			if (index > sectionIndex) {
				section.step = 1;
				return section;
			}
			return section;
		});
	};
	const moveToFirstStep = () => {
		// For each section reset to first step
		stateStory.pageStates = stateStory.pageStates.map((section) => {
			section.step = 1;
			return section;
		});
		scrollToSection(0, false, false, 0);
	};
	const moveDown = () => {
		navigationState.inMove = true;
		navigationState.scrollDirectionDown = false;
		if (stateStory.activeWidgetGroup?.stepCount > 0 && stateStory.activeWidgetGroup.step > 1) {
			stateStory.activeWidgetGroup.step -= 1;
			selectWidgetInstance({widgetInstanceId: stateStory.activeWidgetGroup.stepMap[stateStory.activeWidgetGroup.step - 1]});
			setStoryInstance({
				section: stateStory.activeSection,
				step: stateStory.activeWidgetGroup.step - 1,
				count: 5,
				down: false
			});
			navigationState.inMove = false;
		} else if (stateStory.activeSection > 0) {
			stateStory.activeSection -= 1;
			setActiveGroup();
			// need set last step if going back
			stateStory.activeWidgetGroup.step = stateStory.activeWidgetGroup.stepCount;
			scrollToSection(stateStory.activeSection, true, false, stateStory.activeWidgetGroup.stepCount - 1);
		} else {
			navigationState.inMove = false;
		}
	};
	const moveUp = () => {
		navigationState.inMove = true;
		navigationState.scrollDirectionDown = true;
		if (stateStory.activeWidgetGroup.stepCount > 0 && stateStory.activeWidgetGroup.step < stateStory.activeWidgetGroup.stepCount) {
			selectWidgetInstance({widgetInstanceId: stateStory.activeWidgetGroup.stepMap[stateStory.activeWidgetGroup.step]});
			stateStory.activeWidgetGroup.step += 1;
			setStoryInstance({
				section: stateStory.activeSection,
				step: stateStory.activeWidgetGroup.step - 1,
				count: 5
			});
			navigationState.inMove = false;
		} else if (stateStory.activeSection + 1 < stateStory.storySectionsIds.length) {
			stateStory.activeSection += 1;
			scrollToSection(stateStory.activeSection, true, true);
		} else {
			navigationState.inMove = false;
		}
	};
	const handleMouseWheel = (event) => {
		const isTouchPad = event.wheelDeltaY ? Math.abs(event.wheelDeltaY) <= 100 : event.deltaMode === 0;
		if (isTouchPad) {
			debouncedHandler.value(event);
		} else if (event.wheelDelta < 30 && !navigationState.inMove) {
			moveUp();
		} else if (event.wheelDelta > 30 && !navigationState.inMove) {
			moveDown();
		}
		event.preventDefault();
		return false;
	};
	const handleSwipe = (direction) => {
		if (direction === 'DOWN') {
			moveDown();
		}
		if (direction === 'UP') {
			moveUp();
		}
	};
	return {
		handleSwipe,
		handleMouseWheel,
		moveToFirstStep,
		querySection,
		queryStep,
		scrollToQuery,
		handleNavigationClick,
		navigationEventListenerRegister,
		navigationEventListenerUnregister
	};
}
