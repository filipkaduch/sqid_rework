<template>
	<ds-box
		class="loader"
		align-y="center"
		align="center"
		align-self="center"
		align-y-self="center" />
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, PropType} from 'vue';
// eslint-disable-next-line no-unused-vars
import {DsColorsTypes} from '@/styles/exportFlamingo/types';

export default defineComponent({
	name: 'DataStoriesSpinner',
	props: {
		bgColor: {
			type: String as PropType<DsColorsTypes | null>,
			default: 'display-content-100'
		}
	}
});
</script>

<style lang="scss" scoped>
.loader {
	border: 4px solid transparent;
	border-top: 4px solid map-get($ds-colors, 'secondary-400');
	border-left: 4px solid map-get($ds-colors, 'secondary-400');
	border-bottom: 4px solid map-get($ds-colors, 'secondary-400');
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
