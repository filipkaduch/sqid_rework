import {ref} from 'vue';

export const contentHeightHandler = () => {
	const contentHeight = ref(window.innerHeight);

	const getContentHeight = () => {
		contentHeight.value = window.innerHeight;
	};
	// expose managed state as return value
	return {
		contentHeight,
		getContentHeight
	};
};
