<template>
	<ds-modal
		:show="show"
		header-text="Change auto-update cycle"
		confirm-text="Change"
		cancel-text="Cancel"
		@cancel="$emit('closeModal')"
		@ok="setNewSchedulingInterval">
		<template #modal-text>
			<ds-box class="modal-min-width">
				<ds-text variant="body" color="display-content">
					{{ $t('dataset.scheduling.chooseCycle') }}
				</ds-text>
				<multiselect
					:model-value="selectedValue"
					:options="autoUpdateCycles"
					:multiple="false"
					:deselect-label="''"
					placeholder=""
					:select-label="''"
					track-by="type"
					label="text"
					@update:model-value="selectedValue = $event" />
				<ds-box v-if="selectedValue.type === SchedulingType.CRON" padding-top="L">
					<ds-text color="display-content" class="text-nowrap">
						{{ $t('datasetUpload.enterCron') }}
					</ds-text>
					<ds-box padding-top="S">
						<app-input-bar v-model:input="cronString" />
					</ds-box>
				</ds-box>
				<ds-box v-if="selectedValue.type !== SchedulingType.DISABLED" padding-top="M">
					<ds-text variant="body" color="display-content">
						{{ $t('dataset.scheduling.time') }}
					</ds-text>
					<ds-alert-banner variant="interaction" :message="nextScheduled" class="p-3">
						<template #badge>
							<ds-box padding-right="S" align-y-self="top">
								<img src="@/assets/icon-info.svg" alt="info">
							</ds-box>
						</template>
					</ds-alert-banner>
				</ds-box>
			</ds-box>
		</template>
	</ds-modal>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {
	computed,
	defineComponent,
	inject,
	onUnmounted,
	PropType,
	reactive,
	toRefs,
	watch
} from 'vue';
import 'vue-multiselect/dist/vue-multiselect.css';
import '@/styles/_multiselect.scss';
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import Multiselect from 'vue-multiselect';
import {getNextScheduledText, getSchedulingObj, schedulingOptions, SchedulingType} from '@/modules/dataset/utils/scheduling';
import {datasetService} from '@/modules/dataset/datasetService';
import {DATASET_ACTIONS, DATASET_STORE_NAME} from '@/modules/dataset/store/types';
import {i18n} from '@/plugins/all';
import {useNotification} from '@kyvg/vue3-notification';
import {useStore} from 'vuex';
const {t} = i18n.global;

export default defineComponent({
	components: {
		Multiselect,
		AppInputBar
	},
	props: {
		dataset: {
			type: Object as PropType<any>,
			default: null
		},
		show: {
			type: Boolean,
			default: false
		}
	},
	emits: ['closeModal'],
	// eslint-disable-next-line max-lines-per-function
	setup(props, {emit}) {
		const store = useStore();
		const notification = useNotification();
		const appConfig = inject('appConfig');
		// @ts-ignore
		const {cronEnabled} = appConfig;
		const translate = (word: string) => t(word);
		const datasetDetail = computed(() => store.getters['datasetDetail/dataset'] ?? props.dataset);

		const autoUpdateCycles = [
			{
				type: SchedulingType.DISABLED,
				text: translate('datasetUpload.disableAutoUpdate'),
				icon: 'icon-disable'
			},
			{
				type: SchedulingType.HOUR,
				text: translate('datasetUpload.everyHour'),
				icon: 'icon-time'
			},
			{
				type: SchedulingType.DAY,
				text: translate('datasetUpload.everyDay'),
				icon: 'icon-sun'
			},
			{
				type: SchedulingType.WEEK,
				text: translate('datasetUpload.everyWeek'),
				icon: 'icon-calendar'
			}
		];

		if (cronEnabled) {
			autoUpdateCycles.push({
				type: SchedulingType.CRON,
				text: translate('datasetUpload.cronScheduling'),
				icon: 'icon-stopwatch'
			});
		}

		const state = reactive({
			interval: null as any,
			currentDateTime: null as any,
			selectedValue: autoUpdateCycles[0],
			selectedDate: null,
			cronString: '* * * * *'
		});

		watch(() => props.show, (value) => {
			if (value) {
				state.interval = setInterval(() => {
					state.currentDateTime = new Date();
				}, 1000);
			} else {
				clearInterval(state.interval);
			}
		});

		onUnmounted(() => {
			clearInterval(state.interval);
		});

		const nextScheduled = computed(() => getNextScheduledText(state.selectedValue.type, state.cronString, state.currentDateTime));

		const schedulingObj = computed(() => getSchedulingObj(state.selectedValue.type, state.cronString));

		const setNewSchedulingInterval = async() => {
			const scheduleOption = schedulingOptions[state.selectedValue.type];

			const params = {
				name: datasetDetail.value.name,
				...(scheduleOption
					? {
						externalRunnerJobRef: {
							jobType: datasetDetail.value.latestScheduledJobRun.externalRunnerReference.jobType
						},
						scheduling: schedulingObj.value,
						jobParams: datasetDetail.value.latestScheduledJobRun.jobParams
					}
					: {})
			};
			try {
				await datasetService.updateSchedulingCycle(datasetDetail.value.id, params);
				// Load next scheduled job for dataset
				store.dispatch(`${DATASET_STORE_NAME}/${DATASET_ACTIONS.LOAD_NEXT_SCHEDULED_JOBS}`, [datasetDetail.value.id]);
				// @ts-ignore
				notification.notify({
					type: 'success',
					text: translate('dataset.update.autoUpdateSuccess'),
					duration: 5000
				});
				emit('closeModal');
			} catch (err) {
				// @ts-ignore
				notification.notify({
					type: 'danger',
					text: translate('dataset.update.autoUpdateError'),
					duration: 5000
				});
				emit('closeModal');
			}
		};

		return {
			autoUpdateCycles,
			nextScheduled,
			schedulingObj,
			setNewSchedulingInterval,
			SchedulingType,
			...toRefs(state)
		};
	}
});
</script>

<style lang="scss" scoped>
.modal-min-width {
	min-width: 350px;
}
</style>
