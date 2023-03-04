<template>
	<div>
		<div class="mt-4">
			<div class="upload-file-container d-flex text-center lead p-3 mx-auto">
				<div class="mx-auto align-self-center">
					<ds-box>
						<template v-if="!files.length">
							<ds-icon name="upload-file-drag" /><br>
							<ds-text color="display-content" class="mt-3">
								{{ $t('datasetUpload.fileUpload.dragZone') }} <br>
								{{ $t('datasetUpload.fileUpload.dragZoneFormats') }}
							</ds-text>
						</template>
						<template v-if="files.length">
							<ds-icon name="upload-file-success" /><br>
							<ds-text color="success-500" class="mt-3">{{ $t('datasetUpload.fileUpload.addedFiles') }}</ds-text>
						</template>
					</ds-box>
					<ds-btn class="mt-3" variant="secondary">
						{{ files.length ? $t('datasetUpload.fileUpload.addMoreFiles') : $t('datasetUpload.fileUpload.browseFiles') }}
					</ds-btn>
				</div>
				<input
					ref="fileInput"
					accept=".csv, .tsv, .zip, .gzip, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
					type="file"
					multiple
					class="cursor-pointer"
					@change="onFileChange">
			</div>
			<div v-if="files" :class="modal ? 'mt-4' : 'my-4'">
				<template v-for="(file, index) in files" :key="'file - ' + index">
					<ds-row v-if="!modal" class="align-items-center">
						<ds-col cols="4" class="flex-nowrap">
							<ds-inline no-wrap>
								<ds-icon name="icon-success" alt="success" />
								<ds-text variant="bodyMedium" class="align-content-center ml-2 text-truncate">
									{{ file.name }}
								</ds-text>
							</ds-inline>
						</ds-col>
						<ds-col cols="5">
							<app-input-bar
								v-model:input="file.datasetName"
								:placeholder="$t('t_DatasetName')" />
						</ds-col>
						<ds-col cols="1" />
						<ds-col cols="2">
							<ds-box align="right">
								<ds-btn variant="ghost" @click="deleteFile(index)">
									<template #icon>
										<ds-icon name="icon-trash" alt="delete" />
									</template>
									{{ $t('datasetUpload.deleteFile') }}
								</ds-btn>
							</ds-box>
						</ds-col>
					</ds-row>
					<ds-row v-else :key="'file - ' + index" class="align-items-center">
						<ds-col cols="8" class="flex-nowrap">
							<ds-inline no-wrap>
								<ds-icon name="icon-success" alt="success" />
								<ds-text variant="bodyMedium" class="align-content-center ml-2 text-truncate">
									{{ file.name }}
								</ds-text>
							</ds-inline>
						</ds-col>
						<ds-col cols="4">
							<ds-box align="right">
								<ds-btn variant="ghost" @click="deleteFile(index)">
									<template #icon>
										<ds-icon name="icon-trash" alt="delete" />
									</template>
									{{ $t('datasetUpload.deleteFile') }}
								</ds-btn>
							</ds-box>
						</ds-col>
						<ds-col cols="12">
							<app-input-bar
								v-model:input="file.datasetName"
								:placeholder="$t('t_DatasetName')" />
						</ds-col>
					</ds-row>
					<hr v-if="index !== files.length - 1" :key="'file-hr-' + index">
				</template>
			</div>
		</div>
		<teleport v-if="showPortal && isMounted" to="#upload-form-portal">
			<create-dataset-card
				:modal="modal"
				:disabled="!files.every((file) => file.datasetName.length) || !files.length || disableClick"
				:multiple="files.length > 1"
				@cancel="resetForm"
				@upload="chooseAction" />
		</teleport>
	</div>
</template>

<script lang="ts">
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import CreateDatasetCard from '@/modules/dataset/components/createDataset/CreateDatasetCard.vue';
import {
	defineComponent,
	onActivated,
	onDeactivated,
	toRefs,
	reactive,
	onMounted
} from 'vue';
interface customFile extends File {
	datasetName?: string
}
import i18n from '@/plugins/i18n/index';
import {useNotification} from '@kyvg/vue3-notification';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
const {t} = i18n.global;

export default defineComponent({
	name: 'Upload',
	components: {
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
			files: [] as customFile[]
		});
		const resetForm = () => {
			form.files = [];
			if (props.modal) {
				emit('cancel');
			}
		};
		const onFileChange = (event) => {
			// @ts-ignore
			const {files} = event.target;
			const fileArray: customFile[] = Array.from(files ?? []);
			form.files.push(...fileArray);
			form.files = form.files.map((file) => {
				if (!file.datasetName) {
					file.datasetName = file.name;
				}
				return file;
			});
		};
		const deleteFile = (index: number) => {
			form.files.splice(index, 1);
		};
		const uploadDataset = async() => {
			state.disableClick = true;
			try {
				for (const file of Array.from(form.files)) {
					// eslint-disable-next-line no-await-in-loop
					await store.dispatch('datasetCreate/importFile', {
						file,
						datasetName: file.datasetName
					});
				}
				// @ts-ignore
				notification.notify({
					type: 'success',
					text: t('t_fileUploading'),
					duration: 5000
				});
				if (props.modal) {
					emit('cancel');
				} else {
					router.push({name: 'dataset-list'});
				}
			} catch (error: any) {
				notification.notify({
					type: 'danger',
					text: error?.response?.data?.error?.message ?? t('t_UnexpectedError'),
					duration: 5000
				});
			} finally {
				state.disableClick = false;
			}
		};

		const chooseAction = async() => {
			if (props.modal) {
				await updateDataset();
			} else {
				await uploadDataset();
			}
		};

		const updateDataset = () => {
			state.disableClick = true;
			try {
				for (const file of Array.from(form.files)) {
					// eslint-disable-next-line no-await-in-loop
					store.dispatch('datasetCreate/updateFile', {
						file,
						datasetName: file.datasetName,
						id: props.updateId
					});
				}
				// @ts-ignore
				notification.notify({
					type: 'success',
					text: t('t_fileUploading'),
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
			deleteFile,
			onFileChange,
			uploadDataset,
			chooseAction,
			updateDataset,
			resetForm
		};
	}
});
</script>

<style lang="scss" scoped>
.upload-file-container {
	position: relative;
	height: 184px;
	border: 1px dashed map-get($ds-colors, 'separate-content-400');
	border-radius: 4px;
	background: map-get($ds-colors, 'white-100');
}

.upload-file-container input[type=file] {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	opacity: 0;
}
</style>
