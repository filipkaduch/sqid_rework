<template>
	<div>
		<ds-box padding-top="L">
			<ds-row>
				<ds-col class="pr-2" :cols="modal ? 12 : 6">
					<ds-text color="display-content">
						{{ $t('datasetUpload.importUrl.yourLink') }}
					</ds-text>
					<ds-box padding-y="S">
						<app-input-bar
							v-model:input="url"
							:placeholder="$t('t_ImportUrl')" />
					</ds-box>
					<ds-text variant="caption" color="display-content">
						{{ $t('datasetUpload.importUrl.supportedFormats') }}
					</ds-text>
				</ds-col>
				<ds-col v-if="!modal" cols="6" class="pl-2">
					<ds-text color="display-content">
						{{ $t('datasetUpload.importUrl.datasetName') }}
					</ds-text>
					<ds-box padding-y="S">
						<app-input-bar
							v-model:input="datasetName"
							:placeholder="$t('t_DatasetName')" />
					</ds-box>
				</ds-col>
			</ds-row>
		</ds-box>
		<teleport v-if="showPortal && isMounted" to="#upload-form-portal">
			<ds-card v-if="isScheduledUploadFeature && !modal" body-class="p-0" class="p-5 mb-3 border-0 w-100">
				<ds-box padding-bottom="L">
					<ds-text variant="subheadline">
						2. {{ $t('datasetUpload.cardHeadlines.autoUpdateCycle') }}
					</ds-text>
				</ds-box>
				<auto-update-types v-model:scheduling="scheduling" />
			</ds-card>
			<create-dataset-card
				:modal="modal"
				:disabled="!url || !datasetName || disableClick"
				@cancel="resetForm"
				@upload="chooseAction" />
		</teleport>
	</div>
</template>

<script lang="ts">
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import CreateDatasetCard from '@/modules/dataset/components/createDataset/CreateDatasetCard.vue';
import AutoUpdateTypes from '@/modules/dataset/components/createDataset/AutoUpdateTypes.vue';
import {
	computed,
	defineComponent,
	reactive,
	watch,
	toRefs,
	onActivated,
	onDeactivated,
	onMounted
} from 'vue';
import i18n from '@/plugins/i18n/index';
const {t} = i18n.global;
import {useNotification} from '@kyvg/vue3-notification';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';


export default defineComponent({
	name: 'Url',
	components: {
		AutoUpdateTypes,
		CreateDatasetCard,
		AppInputBar
	},
	props: {
		modal: {
			type: Boolean,
			default: false
		},
		updateId: {
			type: String,
			default: null
		}
	},
	emits: ['cancel', 'closeModal'],
	// eslint-disable-next-line max-lines-per-function
	setup(props, {emit}) {
		const store = useStore();
		const router = useRouter();
		const notification = useNotification();
		const state = reactive({
			disableClick: false,
			showPortal: true,
			isMounted: false
		});
		const form = reactive({
			datasetName: '',
			url: '',
			scheduling: null
		});
		const resetForm = () => {
			form.datasetName = '';
			form.url = '';
			form.scheduling = null;
			if (props.modal) {
				emit('cancel');
			}
		};
		const isScheduledUploadFeature = computed(() => store.getters['authLogin/user']?.subscription?.subscriptionPlan?.features?.scheduledUpload ?? false);
		watch(() => form.url, () => {
			if (!form.datasetName) {
				const {pathname} = new URL(form.url);

				form.datasetName = pathname.substring(pathname.lastIndexOf('/') + 1);
			}
		});

		const importDatasetFromUrl = async() => {
			state.disableClick = true;
			try {
				await store.dispatch('datasetCreate/importUrl', {
					fileUrl: form.url,
					datasetName: form.datasetName,
					scheduling: form.scheduling
				});
				// @ts-ignore
				notification.notify({
					type: 'success',
					text: t('t_urlUploading'),
					duration: 5000
				});
				router.push({name: 'dataset-list'});
			} catch (error: any) {
				notification.notify({
					type: 'danger',
					text: error?.response?.data?.error?.message ?? t('t_UnexpectedError'),
					duration: 5000
				});
			}
		};

		const chooseAction = async() => {
			if (props.modal) {
				await updateDatasetFromUrl();
			} else {
				await importDatasetFromUrl();
			}
		};

		const updateDatasetFromUrl = () => {
			state.disableClick = true;
			try {
				store.dispatch('datasetCreate/updateUrl', {
					fileUrl: form.url,
					datasetName: form.datasetName,
					scheduling: form.scheduling,
					id: props.updateId
				});
				// @ts-ignore
				notification.notify({
					type: 'success',
					text: t('t_urlUploading'),
					duration: 5000
				});
			} catch (error) {
				emit('cancel');
				notification.notify({
					type: 'danger',
					text: error?.response?.data?.error?.message ?? t('t_UnexpectedError'),
					duration: 5000
				});
			} finally {
				emit('closeModal');
				state.disableClick = false;
			}
		};
		onMounted(() => {
			state.isMounted = true;
		});
		onActivated(() => {
			state.showPortal = true;
		});
		onDeactivated(() => {
			state.showPortal = false;
		});

		return {
			...toRefs(state),
			...toRefs(form),
			chooseAction,
			isScheduledUploadFeature,
			importDatasetFromUrl,
			resetForm
		};
	}
});
</script>
