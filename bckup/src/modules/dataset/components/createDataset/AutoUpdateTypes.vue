<template>
	<div class="grid-container">
		<template v-for="(item, key) in autoUpdateCycles" :key="key">
			<div>
				<radio-card
					:id="key"
					class="text-nowrap"
					:item="item"
					horizontal
					:active="key === selectedCycle"
					@selected="selectedCycle = $event" />
				<ds-box v-if="key === 'cron' && selectedCycle === 'cron'" padding-top="L">
					<ds-text color="display-content" class="text-nowrap">
						{{ $t('datasetUpload.enterCron') }}
					</ds-text>
					<ds-box padding-top="S">
						<app-input-bar v-model:input="cronString" />
					</ds-box>
				</ds-box>
				<ds-box v-if="key !== 'disable' && selectedCycle === key" padding-top="M">
					<ds-alert-banner variant="interaction" :message="nextScheduled" class="p-3">
						<template #badge>
							<ds-box padding-right="S" align-y-self="top">
								<ds-icon name="icon-info" alt="info" />
							</ds-box>
						</template>
					</ds-alert-banner>
				</ds-box>
			</div>
		</template>
	</div>
</template>

<script>
import RadioCard from '@/modules/dataset/components/createDataset/RadioCard.vue';
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import {getNextScheduledText, getSchedulingObj} from '@/modules/dataset/utils/scheduling';

export default {
	name: 'AutoUpdateTypes',
	components: {
		AppInputBar,
		RadioCard
	},
	inject: ['appConfig'],
	props: {
		// eslint-disable-next-line vue/require-prop-types
		scheduling: {
			value: [
				Object,
				null
			],
			required: true
		}
	},
	emits: ['update:scheduling'],
	data() {
		return {
			dateTimeInterval: null,
			currentDateTime: null,
			cronString: '* * * * *',
			selectedCycle: 'disable',
			autoUpdateCycles: {
				disable: {
					text: 'datasetUpload.disableAutoUpdate',
					icon: 'icon-disable'
				},
				hour: {
					text: 'datasetUpload.everyHour',
					icon: 'icon-time'
				},
				day: {
					text: 'datasetUpload.everyDay',
					icon: 'icon-sun'
				},
				week: {
					text: 'datasetUpload.everyWeek',
					icon: 'icon-calendar'
				}
			}
		};
	},
	computed: {
		nextScheduled() {
			return getNextScheduledText(this.selectedCycle, this.cronString, this.currentDateTime);
		},
		schedulingObj() {
			return getSchedulingObj(this.selectedCycle, this.cronString);
		},
		cronEnabled() {
			return this.appConfig.cronEnabled;
		}
	},
	watch: {
		schedulingObj() {
			this.$emit('update:scheduling', this.schedulingObj);
		}
	},
	created() {
		this.dateTimeInterval = setInterval(() => {
			this.currentDateTime = new Date();
		}, 1000);
		if (this.cronEnabled) {
			this.autoUpdateCycles.cron = {
				text: this.$t('datasetUpload.cronScheduling'),
				icon: 'icon-stopwatch'
			};
		}
	},
	beforeUnmount() {
		clearInterval(this.dateTimeInterval);
	}
};
</script>

<style scoped>
.grid-container {
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
}
</style>
