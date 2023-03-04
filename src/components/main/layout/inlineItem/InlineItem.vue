<template>
	<div class="inline-item" :style="computedStyle">
		<slot />
	</div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import {computed, defineComponent, PropType} from 'vue';
import {FlexGrow} from '@/components/main/layout/utils/types';
/* eslint-enable no-unused-vars */

export default defineComponent({
	name: 'InlineItem',
	props: {
		flexBasis: {
			type: Boolean,
			default: false
		},
		noShrink: {
			type: Boolean,
			default: false
		},
		flexGrow: {
			type: String as PropType<FlexGrow>,
			default: null
		},
		width: {
			type: Number || String,
			default: null
		}
	},
	setup(props) {
		const computedStyle = computed(() => ({
			'flex-basis': props.flexBasis ? 0 : 'auto',
			'flex-shrink': props.noShrink && 0,
			'flex-grow': props.flexGrow ? Number(props.flexGrow) || 1 : null,
			width: props.width ? `${props.width}px` : null
		}));
		return {
			computedStyle
		};
	}
});
</script>

<style scoped>

</style>
