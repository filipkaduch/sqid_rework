<template>
	<ds-box
		padding-y="M"
		padding-x="L"
		border="disabled"
		border-radius="basic"
		class="ds-bg-display-content-0">
		<ds-inline>
			<ds-inline-item v-if="$slots.icon">
				<ds-box
					class="icon-container ds-bg-white"
					border="disabled"
					border-radius="rounded"
					align-y="center"
					align="center">
					<slot name="icon" />
				</ds-box>
			</ds-inline-item>
			<ds-inline-item>
				<ds-box padding-left="M">
					<ds-text variant="captionMedium" color="display-content-400">{{ text }}</ds-text>
					<app-loading :loading="loading">
						<ds-text variant="headline1" color="display-content-600" class="font-weight-700">{{ value }}</ds-text>
					</app-loading>
				</ds-box>
			</ds-inline-item>
		</ds-inline>
	</ds-box>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AppLoading from '@/components/design/AppLoading.vue';

export default defineComponent({
	name: 'DataStoriesStatisticsCard',
	components: {
		AppLoading
	},
	props: {
		text: {
			type: String,
			default: ''
		},
		icon: {
			type: String,
			default: null
		},
		value: {
			type: Number,
			required: true
		},
		loading: {
			type: Boolean,
			default: false
		}
	}
});
</script>

<style lang="scss" scoped>
	.icon-container {
		height: 52px;
		width: 52px;
	}
	.font-weight-700 {
		font-weight: 700!important;
	}
</style>
