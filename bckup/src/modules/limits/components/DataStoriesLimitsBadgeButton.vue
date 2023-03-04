<template>
	<ds-dropdown placement="bottom-start" split-lane>
		<template #triggerContent>
			<data-stories-badge
				variant="separate-content-badge"
				type="button"
				:text="$t('limits.freePlan')">
				<template #icon>
					<ds-icon name="ds-icon-circle-solid" class="icon-small" :fill="saasLimitsState.limitsStatusCombined.value" />
				</template>
			</data-stories-badge>
		</template>
		<template #dropdownContent>
			<ds-box padding-x="L" padding-top="M" padding-bottom="L" class="info-box">
				<ds-text variant="subheadlineMedium" color="display-content-700">{{ $t('limits.info.title') }}</ds-text>
				<ds-box align="space-between" flex-type="row" padding-y="M">
					<ds-box flex-type="row">
						<ds-icon v-if="saasLimitsState.limitStatusStories.value === LimitStatus.ERROR" fill="error-400" name="icon-error" />
						<ds-icon v-if="saasLimitsState.limitStatusStories.value === LimitStatus.WARNING" fill="warning" name="icon-warning-medium" />
						<ds-icon v-if="saasLimitsState.limitStatusStories.value === LimitStatus.SUCCESS" fill="success-500" name="icon-check-medium" />
						<ds-text padding-left="S" variant="body" color="display-content">{{ $t('limits.info.reports') }}</ds-text>
					</ds-box>
					<ds-text variant="bodyMedium" :color="saasLimitsState.limitStatusStories.value === LimitStatus.ERROR ? 'error' : 'display-content-700'" padding-left="L">
						{{ saasLimitsState.getStatusData.value.countStories }} / {{ saasLimitsState.getStatusData.value.countStoriesMax }}
					</ds-text>
				</ds-box>
				<ds-box align="space-between" flex-type="row" padding-bottom="S">
					<ds-box flex-type="row">
						<ds-icon v-if="saasLimitsState.limitStatusDatasets.value === LimitStatus.ERROR" fill="error-400" name="icon-error" />
						<ds-icon v-if="saasLimitsState.limitStatusDatasets.value === LimitStatus.WARNING" fill="warning" name="icon-warning-medium" />
						<ds-icon v-if="saasLimitsState.limitStatusDatasets.value === LimitStatus.SUCCESS" fill="success-500" name="icon-check-medium" />
						<ds-text padding-left="S" variant="body" color="display-content">{{ $t('limits.info.datasets') }}</ds-text>
					</ds-box>
					<ds-text variant="bodyMedium" :color="saasLimitsState.limitStatusDatasets.value === LimitStatus.ERROR ? 'error' : 'display-content-700'" padding-left="L">
						{{ saasLimitsState.getStatusData.value.countDatasets }} / {{ saasLimitsState.getStatusData.value.countDatasetsMax }}
					</ds-text>
				</ds-box>
				<ds-box padding-top="M">
					<data-stories-button block center variant="primary" @click="$router.push({name: 'billing'})">{{ $t('limits.info.button') }}</data-stories-button>
				</ds-box>
			</ds-box>
		</template>
	</ds-dropdown>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';
import {useSaasLimits} from '@/modules/limits/store/limits';
import DataStoriesBadge from '@/components/main/Badge/DataStoriesBadge.vue';
import DataStoriesButton from '@/components/main/DataStoriesButton.vue';
import {LimitStatus} from '@/modules/limits/consts/enums';

export default defineComponent({
	name: 'DataStoriesLimitsBadgeButton',
	components: {
		DataStoriesBadge,
		DataStoriesButton
	},
	setup() {
		const saasLimitsState = useSaasLimits();

		onMounted(() => {
			saasLimitsState.getActualStatistics();
		});

		return {
			saasLimitsState,
			LimitStatus
		};
	}
});
</script>

<style lang="scss" scoped>
.icon-small {
	padding-right: 8px;
	width: 16px;
}

.info-box {
	min-width: 310px;
}
</style>
