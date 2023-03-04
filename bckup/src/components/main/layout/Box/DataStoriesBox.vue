<template>
	<div :style="computedStyle">
		<slot />
	</div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import {computed, defineComponent} from 'vue';
import {componentProps} from '@/components/main/layout/Box/props';
import {mapAlignToCss, mapAlignYToCss} from '@/components/main/layout/utils/functions';
import {borderStyles, boxShadowStyles, spacingStyles} from '@/styles/exportFlamingo/exportStyles';
/* eslint-enable no-unused-vars */
export default defineComponent({
	name: 'DataStoriesBox',
	props: componentProps,
	setup(props) {
		const isFlex = () => props.flexType || props.align || props.alignY;
		const isFlexColumn = () => props.flexType === 'column' || !props.flexType;

		const computedFlexStyle = computed(() => ({
			...(isFlex()
				? {
					display: 'flex',
					'flex-grow': props.noGrow ? null : 1,
					'flex-flow': props.flexType ? props.flexType : 'column',
					'align-items': isFlexColumn() ? mapAlignToCss(props.align) : mapAlignYToCss(props.alignY),
					'justify-content': isFlexColumn() ? mapAlignYToCss(props.alignY) : mapAlignToCss(props.align)
				}
				: {})
		}));

		const computedBorderStyles = computed(() => ({
			'border-left': (props.borderLeft || props.border) && borderStyles[`border-${props.borderLeft || props.border}`],
			'border-right': (props.borderRight || props.border) && borderStyles[`border-${props.borderRight || props.border}`],
			'border-top': (props.borderTop || props.border) && borderStyles[`border-${props.borderTop || props.border}`],
			'border-bottom': (props.borderBottom || props.border) && borderStyles[`border-${props.borderBottom || props.border}`],
			'border-radius': props.borderRadius && borderStyles[`radius-${props.borderRadius}`]
		}));

		const computedPadding = computed(() => ({
			'padding-inline-start': spacingStyles[props.paddingLeft || props.paddingX || props.padding],
			'padding-inline-end': spacingStyles[props.paddingRight || props.paddingX || props.padding],
			'padding-block-start': spacingStyles[props.paddingTop || props.paddingY || props.padding],
			'padding-block-end': spacingStyles[props.paddingBottom || props.paddingY || props.padding]
		}));

		const computedStyle = computed(() => ({
			'justify-self': mapAlignToCss(props.alignSelf),
			'align-self': mapAlignYToCss(props.alignYSelf),
			'box-shadow': boxShadowStyles[props.boxShadow],
			...(computedFlexStyle.value),
			...(computedBorderStyles.value),
			...(computedPadding.value)
		}));

		return {
			isFlex,
			computedStyle
		};
	}
});
</script>

<style scoped>
</style>
