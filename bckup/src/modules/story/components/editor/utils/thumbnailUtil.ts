import html2canvas from 'html2canvas';
import store from '@/plugins/store';
import axios from 'axios';
import {ref} from 'vue';
import {storyType} from '@/modules/story/consts/storyType';

const thumbnailInterval: any = ref(null);
const thumbnailWidth = 600 * 2;
const thumbnailHeight = 300 * 2;

const getThumbnail = (sourceCanvas: any, destCanvas: any) => new Promise((resolve) => {
	const originalWidth = sourceCanvas.width;
	const tmpImage = new Image();
	tmpImage.onload = () => {
		destCanvas.width = thumbnailWidth;
		destCanvas.height = thumbnailHeight;
		destCanvas
			.getContext('2d')
			.drawImage(tmpImage, 0, 0, originalWidth, originalWidth * (thumbnailHeight / thumbnailWidth), 0, 0, thumbnailWidth, thumbnailHeight);
		resolve(destCanvas);
	};
	tmpImage.src = sourceCanvas.toDataURL();
});

export const updatePreviewImage = (story: any, selectedWidget = null, isExplorer = false) => {
	if (thumbnailInterval.value) {
		clearInterval(thumbnailInterval.value);
	}
	thumbnailInterval.value = setInterval(() => {
		let areWidgetsReady = false;
		if (isExplorer && selectedWidget) {
			// @ts-ignore
			const hasFinishedEvent = store.getters['widgetInstances/finishedRender'](selectedWidget.id) !== null;
			areWidgetsReady = hasFinishedEvent
				// @ts-ignore
				? !store.getters['widgetInstances/error'](selectedWidget.id) || store.getters['widgetInstances/finishedRender'](selectedWidget.id)
				// @ts-ignore
				: !store.getters['widgetInstances/error'](selectedWidget.id) || store.getters['widgetInstances/loading'](selectedWidget.id);
		} else {
			areWidgetsReady = store.getters['widgetInstances/widgetInstanceIds'][store.getters['widgetInstances/pageWidgetInstanceIds'][0]]
				?.filter((widgetInstanceId: string) => (store.getters['widgetInstances/finishedRender'](widgetInstanceId) === null
					// @ts-ignore
					? store.getters['widgetInstances/loading'](widgetInstanceId)
					: !store.getters['widgetInstances/finishedRender'](widgetInstanceId)
				))
				.length === 0;
		}
		if (areWidgetsReady) {
			clearInterval(thumbnailInterval.value);
			const thumbnailElement = story?.storyType === storyType.DATA_DASHBOARD
				? document.getElementById('story-editor-story-holder')
				: document.getElementById('first-page');
			if (!thumbnailElement) {
				return;
			}
			html2canvas(thumbnailElement, {scale: window.devicePixelRatio * 2, allowTaint: true, useCORS: true, logging: false})
				.then((canvas: any) => getThumbnail(canvas, canvas))
				.then(async(canvas: any) => {
					const imageBlob = dataURItoBlob(canvas.toDataURL());
					const image = new File([imageBlob], 'thumbnail.png', {type: 'image/png'});
					const {data} = await axios.post(`v0/stories/${story.id}/thumbnail/generate-upload-link`);
					await axios.post(
						data.data.url,
						getFormData(data.data.requestFields, image),
						{
							baseURL: '/',
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						}
					);
				});
		}
	}, 1500);
};

const dataURItoBlob = (dataURI: string) => {
	const binary = atob(dataURI.split(',')[1]);
	const array = [];
	for (let i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	return new Blob([new Uint8Array(array)], {type: 'image/png'});
};

const getFormData = (requestFields: any, file: any) => {
	if (requestFields !== null && file !== null) {
		const formData = new FormData();
		formData.append('key', requestFields.key);
		formData.append('policy', requestFields.policy);
		formData.append('x-amz-algorithm', requestFields['x-amz-algorithm']);
		formData.append('x-amz-credential', requestFields['x-amz-credential']);
		formData.append('x-amz-date', requestFields['x-amz-date']);
		formData.append('x-amz-meta-ts-created-at', requestFields['x-amz-meta-ts-created-at']);
		formData.append('x-amz-meta-ts-created-by', requestFields['x-amz-meta-ts-created-by']);
		formData.append('x-amz-meta-ts-story-id', requestFields['x-amz-meta-ts-story-id']);
		formData.append('x-amz-signature', requestFields['x-amz-signature']);
		formData.append('file', file);
		return formData;
	}
	return null;
};
