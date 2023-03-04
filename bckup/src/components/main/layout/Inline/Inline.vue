<template>
	<div :style="computedStyle">
		<slot />
	</div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import {computed, defineComponent, PropType} from 'vue';
import {Align, AlignY, PositiveSpaceUnit} from '@/components/main/layout/utils/types';
import {mapAlignToCss, mapAlignYToCss} from '@/components/main/layout/utils/functions';
import {spacingStyles} from '@/styles/exportFlamingo/exportStyles';
/* eslint-enable no-unused-vars */
export default defineComponent({
	name: 'Inline',
	props: {
		align: {
			type: String as PropType<Align>,
			default: 'left'
		},
		alignY: {
			type: String as PropType<AlignY>,
			default: 'top'
		},
		gap: {
			type: String as PropType<PositiveSpaceUnit>,
			default: 'NONE'
		},
		gapY: {
			type: String as PropType<PositiveSpaceUnit>,
			default: 'NONE'
		},
		noWrap: {
			type: Boolean
		},
		flexGrow: {
			type: Boolean
		}
	},
	setup(props) {
		const computedStyle = computed(() => ({
			display: 'flex',
			'flex-wrap': props.noWrap ? 'nowrap' : 'wrap',
			'flex-grow': props.flexGrow ? 1 : null,
			'justify-content': mapAlignToCss(props.align),
			'align-items': mapAlignYToCss(props.alignY),
			...(props.gap || props.gapY
				? {
					[props.gapY ? 'column-gap' : 'gap']: props.gap && spacingStyles[props.gap],
					'row-gap': props.gapY && spacingStyles[props.gapY]
				}
				: {})
		}));
		return {
			computedStyle
		};
	}
});
</script>

<style scoped>

</style>
