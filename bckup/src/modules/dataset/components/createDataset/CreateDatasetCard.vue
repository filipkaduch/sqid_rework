<template>
	<ds-card class="border-0 w-100" :class="{'modal-card': modal}" :body-class="modal ? 'pl-2' : 'py-3 px-5'">
		<ds-box :padding-y="modal ? '' : 'L'">
			<ds-btn
				v-if="!modal"
				variant="primary"
				class="m-0"
				:disabled="disabledButtons"
				@click="$emit('upload')">
				{{ multiple ? $t('datasetUpload.AddDatasets') : $t('datasetUpload.AddDataset') }}
			</ds-btn>
			<ds-btn
				v-else
				variant="primary"
				class="m-0"
				:disabled="disabledButtons"
				@click="$emit('upload')">
				{{ $t('datasetUpload.reupload') }}
			</ds-btn>
			<ds-btn
				variant="secondary"
				class="ml-3 m-0"
				@click="cancel">
				{{ $t('t_Cancel') }}
			</ds-btn>
		</ds-box>
		<ds-modal
			:show="showModal && !modal"
			cancel-text="t_Continue"
			:header-text="$t('datasetUpload.modal.cancelUpload')"
			@ok="cancelUpload"
			@cancel="showModal = false">
			<template #modal-text>
				<ds-text color="display-content">
					{{ $t('datasetUpload.modal.cancelUploadText') }}
				</ds-text>
			</template>
		</ds-modal>
	</ds-card>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue';
import {useSaasLimits} from '@/modules/limits/store/limits';
import {LimitStatus} from '@/modules/limits/consts/enums';

export default defineComponent({
	name: 'CreateDatasetCard',
	props: {
		disabled: {
			type: Boolean,
			required: true
		},
		modal: {
			type: Boolean,
			default: false
		},
		multiple: {
			type: Boolean,
			default: false
		}
	},
	emits: ['cancel', 'upload'],
	setup(props, {emit}) {
		const showModal = ref(false);
		const saasLimitsState = useSaasLimits();

		const disabledButtons = computed(() => props.disabled || saasLimitsState.limitStatusDatasets.value === LimitStatus.ERROR);
		const cancel = () => {
			if (props.modal) {
				cancelUpload();
			} else {
				showModal.value = true;
			}
		};

		const cancelUpload = () => {
			emit('cancel');
			showModal.value = false;
		};

		onMounted(() => {
			saasLimitsState.getActualStatistics();
		});

		return {
			showModal,
			cancelUpload,
			cancel,
			disabledButtons
		};
	}
});
</script>

<style lang="scss" scoped>

.modal-card {
	box-shadow: none !important;
	height: 100% !important;
	padding-left: 0 !important;
}

</style>
