<template>
	<ds-box
		class="circle"
		:class="`ds-bg-${bgColor}`"
		align-y="center"
		align="center"
		align-self="center"
		align-y-self="center">
		<ds-text variant="bodyMedium" :color="textColor">
			{{ text }}
		</ds-text>
	</ds-box>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, PropType} from 'vue';
// eslint-disable-next-line no-unused-vars
import {DsColorsTypes} from '@/styles/exportFlamingo/types';

export default defineComponent({
	name: 'DataStoriesAvatar',
	props: {
		text: {
			type: String,
			required: true
		},
		bgColor: {
			type: String as PropType<DsColorsTypes | null>,
			default: 'display-content-100'
		},
		textColor: {
			type: String as PropType<DsColorsTypes | null>,
			default: 'separate-content'
		}
	}
});
</script>

<style scoped>
.circle {
	white-space: nowrap;
	width: 32px;
	max-width: 32px;
	height: 32px;
	border-radius: 100px;
}
</style>
