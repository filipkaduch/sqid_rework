<template>
	<ds-alert-banner
		v-if="saasLimitsState.limitsStatusCombined.value === LimitStatus.ERROR"
		align="center"
		padding="M"
		:variant="saasLimitsState.limitsStatusCombined.value">
		<ds-inline>
			<ds-icon fill="error-400" name="icon-error" />
			<ds-text padding-left="S" color="display-content-700" variant="bodyMedium">{{ saasLimitsState.getStatusData.value.message }}</ds-text>
			<ds-text padding-left="S" color="display-content-700" variant="body">{{ saasLimitsState.getStatusData.value.messageCTA }}</ds-text>
			<ds-text padding-left="XS" color="display-content-700" variant="body">
				<router-link :to="{name: 'billing'}" class="ds-text-display-content-700 underline">{{ $t('limits.disabledReportsLinkText') }}</router-link>.
			</ds-text>
		</ds-inline>
	</ds-alert-banner>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';
import {useSaasLimits} from '@/modules/limits/store/limits';
import {LimitStatus} from '@/modules/limits/consts/enums';

export default defineComponent({
	name: 'DataStoriesLimitsAlerts',
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

<style scoped>

</style>
