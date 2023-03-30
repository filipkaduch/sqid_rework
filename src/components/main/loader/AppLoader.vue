<template>
	<app-box
		class="loader"
		align-y="center"
		align="center"
		align-self="center"
		align-y-self="center" />
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
// eslint-disable-next-line no-unused-vars
import {AppColorsTypes} from '@/styles/values/types';

export default defineComponent({
	name: 'AppLoader',
	props: {
		bgColor: {
			type: String as PropType<AppColorsTypes | null>,
			default: 'display-content-100'
		}
	}
});
</script>

<style lang="scss" scoped>
.loader {
	border: 4px solid transparent;
	border-top: 4px solid map-get($app-colors, 'display-content-400');
	border-left: 4px solid map-get($app-colors, 'display-content-400');
	border-bottom: 4px solid map-get($app-colors, 'display-content-400');
	border-radius: 50%;
	width: 20px;
	height: 20px;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style>
