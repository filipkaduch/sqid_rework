export const STORY_DETAIL_NAME = 'storyDetail';

export const STORY = 'story';
export const LOADING = 'loading';
export const ERROR = 'error';
export const SCALE = 'scale';

export const STORY_DETAIL_GETTERS = {
	STORY: 'story',
	LOADING: 'loading',
	ERROR: 'error',
	SCALE: 'scale',
	PUBLISH_LOADING: 'publishLoading',
	READ_ONLY: 'readOnly',
	GENERATED_COLORS: 'generatedColors',
	PUBLISH_TOKEN: 'publishToken',
	GRAPH_COLOR: 'graphColor',
	GRAPH_COLORS: 'graphColors',
	DATASET: 'dataset',
	DATASET_COLUMN: 'datasetColumn',
	CATALOG_ITEMS: 'catalogItems',
	CATALOG_ITEM: 'catalogItem'
};
export const STORY_DETAIL_MUTATIONS = {
	START_LOADING: 'startLoading',
	STOP_LOADING: 'stopLoading',
	START_PUBLISH_LOADING: 'startPublishLoading',
	STOP_PUBLISH_LOADING: 'stopPublishLoading',
	SET_STORY: 'setStory',
	SET_SECTION_ORDER: 'setSectionOrder',
	SET_ERROR: 'setError',
	SET_NAME: 'setName',
	SET_CONFIGURATION: 'setConfiguration',
	SET_LAYOUT: 'setLayout',
	SET_PUBLISH_TOKEN: 'setPublishToken',
	SET_PUBLISH_CONFIGURATION: 'setPublishConfiguration',
	SET_VISIBILITY_STATE: 'setVisibilityState',
	SET_UPDATING_TIMEOUT: 'setUpdatingTimeout',
	SET_STORY_ELEMENT: 'setStoryElement',
	SET_SCALE: 'setScale',
	SET_READONLY: 'setReadOnly',
	ADD_COLOR: 'addColor',
	ADD_CLAP: 'addClap',
	RESET: 'reset',
	SET_CATALOG_ITEMS: 'setCatalogItems',
	SET_DATASETS: 'setDatasets',
	SET_SECTIONS: 'setSections'

};
export const STORY_DETAIL_ACTIONS = {
	LOAD_STORY_SECTIONS: 'loadStorySections',
	LOAD_FIRST_SECTION_STEPS: 'loadFirstSectionSteps',
	LOAD_STORY: 'loadStory',
	LOAD_STORY_INSTANCES: 'loadStoryInstances',
	LOAD_STORY_INSTANCE: 'loadStoryInstance',
	RELOAD_SECTION_ORDER: 'reloadSectionOrder',
	REORDER_SECTIONS: 'reorderSections',
	UPDATE_STORY: 'updateStory',
	SET_STORY_READ_ONLY: 'setStoryReadOnly',
	SET_STORY_ELEMENT: 'setStoryElement',
	SET_SCALE: 'setScale',
	SET_VISIBILITY: 'setVisibility',
	GENERATE_COLORS: 'generateColors',
	ADD_CLAP: 'addClap',
	SET_STORY_DATA: 'setStoryData',
	RELOAD_DATA: 'reloadData',
	EDITOR_OPENED: 'editorOpened'
};
