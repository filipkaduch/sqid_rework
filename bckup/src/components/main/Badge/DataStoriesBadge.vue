<template>
	<ds-box
		flex-type="row"
		class="ds-badge"
		:class="classDefinitionsObject">
		<slot name="icon" />
		<ds-text :variant="textVariant" class="text-nowrap" :color="badgeStyle.text">
			{{ text }}
		</ds-text>
	</ds-box>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {computed, ComputedRef, defineComponent, PropType} from 'vue';
// eslint-disable-next-line no-unused-vars
import {ColorVariant, ColorStyle} from '@/components/main/consts/interfaces';
// eslint-disable-next-line no-unused-vars
import {getVariantStyles} from '../Badge/utils';

export default defineComponent({
	props: {
		variant: {
			type: String as PropType<ColorVariant>,
			default: 'success'
		},
		text: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: null
		}
	},
	setup(props) {
		const badgeStyle: ComputedRef<ColorStyle> = computed(() => getVariantStyles(props.variant));

		const classDefinitionsObject = computed(() => ({
			[`ds-bg-${badgeStyle.value.background}`]: true,
			[`ds-border-${badgeStyle.value.border}`]: true,
			'ds-badge--button': props.type === 'button'
		}));

		const textVariant = computed(() => props.type === 'button' ? 'bodyMedium' : 'captionMedium');

		return {
			badgeStyle,
			classDefinitionsObject,
			textVariant
		};
	}
});
</script>

<style lang="scss" scoped>
.ds-badge {
	border-width: 1px;
	border-style: solid;
	border-radius: 2px;
	padding: 2px 8px;

	&--button {
		border-radius: 4px;
		padding: 6px 16px;
	}
}
</style>
