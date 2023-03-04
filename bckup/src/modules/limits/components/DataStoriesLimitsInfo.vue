<template>
	<ds-card body-class="m-0 p-0" class="px-4 py-4 border-0">
		<ds-box flex-type="row" align-y="center">
			<ds-box align="center" align-y="center" class="box-round__interaction">
				<ds-icon name="icon-info-squared-large" fill="interaction" />
			</ds-box>
			<ds-box align-y="center" padding-left="M">
				<slot />
			</ds-box>
			<slot name="button" />
			<ds-close-button @click="saasLimitsState.setAlertVisibilityStatus(type, false)" />
		</ds-box>
	</ds-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useSaasLimits} from '@/modules/limits/store/limits';
import DsCloseButton from '@/components/main/button/DsCloseButton.vue';

export default defineComponent({
	name: 'DataStoriesLimitsInfo',
	components: {
		DsCloseButton
	},
	props: {
		type: {
			type: String,
			default: ''
		}
	},
	setup() {
		const saasLimitsState = useSaasLimits();

		return {
			saasLimitsState
		};
	}
});
</script>

<style lang="scss" scoped>
.box-round__interaction {
	background: map-get($ds-colors, 'interaction-100');
	border-radius: 50%;
	height: 52px;
	max-height: 52px;
	max-width: 52px;
	width: 52px;
}
</style>


