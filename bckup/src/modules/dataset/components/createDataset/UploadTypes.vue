<template>
	<ds-box>
		<radio-card-group :items="sourceTypes" :selected="selectedType" @selected="reroute($event)" />
	</ds-box>
</template>

<script lang="ts">
import RadioCardGroup from '@/modules/dataset/components/createDataset/RadioCardGroup.vue';
import {reactive, computed, toRefs, defineComponent, onMounted, inject} from 'vue';
import {useRoute, useRouter} from 'vue-router';
// eslint-disable-next-line no-unused-vars
import {SelectTypes} from '@/modules/dataset/components/createDataset/types';
const UPLOAD_TYPES = {
	UPLOAD_FILE: 'uploadFile',
	IMPORT_URL: 'importUrl',
	GOOGLE_DRIVE: 'gDrive',
	DQ_IMPORT: 'dq'
};
export default defineComponent({
	name: 'UploadTypes',
	components: {
		RadioCardGroup
	},
	// eslint-disable-next-line max-lines-per-function
	setup() {
		const route = useRoute();
		const router = useRouter();
		const currentRoute = computed(() => route.name);
		const appConfig = inject('appConfig');
		const state = reactive({
			selectedType: 'uploadFile'
		});
		// @ts-expect-error
		const googleDriveEnabled = appConfig?.googleApi?.apiKey && appConfig.googleApi.clientId;
		// @ts-expect-error
		const importDqEnabled = appConfig?.oneIntegration;
		// eslint-disable-next-line no-unused-vars
		const sourceTypes: SelectTypes = {
			uploadFile: {
				icon: 'upload-file',
				text: 't_UploadFile',
				route: 'dataset-create-upload'
			},
			importUrl: {
				icon: 'url-link',
				text: 't_ImportUrl',
				route: 'dataset-create-url'
			},
			...(googleDriveEnabled
				? {
					gDrive: {
						icon: 'google-drive',
						text: 't_ImportGoogleDrive',
						route: 'dataset-create-google-drive'
					}
				}
				: {}),
			...(importDqEnabled
				? {
					dq: {
						icon: 'data-quality',
						text: 't_ImportDQ',
						route: 'dataset-create-import-dq'
					}
				}
				: {}
			)
			// objectStorage: {
			// icon: 'object-storage',
			// text: 't_ImportObjectStorage',
			// route: ''
			// }
		};
		onMounted(() => {
			state.selectedType = Object.keys(sourceTypes).find((key) => sourceTypes[key].route === currentRoute.value) ?? UPLOAD_TYPES.UPLOAD_FILE;
		});
		const reroute = (newVal: string) => {
			if (currentRoute.value !== sourceTypes[newVal].route) {
				router.push({name: sourceTypes[newVal].route});
			}
			state.selectedType = newVal;
		};
		return {
			...toRefs(state),
			sourceTypes,
			reroute
		};
	}
});
</script>
