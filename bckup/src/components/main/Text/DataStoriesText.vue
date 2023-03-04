<template>
	<ds-tooltip class="inherit-font-color" :show="tooltip !== ''">
		<component
			:is="componentTag"
			tabindex="0"
			:contenteditable="isEditable"
			class="m-0 ds-text"
			:class="[`ds-text-${color}`]"
			:style="computedTextStyle"
			@keyup="$emit('keyup', $event)"
			@change="$emit('change', $event)"
			@blur="$emit('blur', $event)">
			<slot />
		</component>
		<template #tooltip>
			<ds-box :class="{'wrap-tooltip': wrapTooltip}">
				{{ tooltip }}
			</ds-box>
		</template>
	</ds-tooltip>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {computed, defineComponent, PropType} from 'vue';
// eslint-disable-next-line no-unused-vars
import {TextVariant, TextAlign, FontStyle, WhiteWrap} from '@/components/main/Text/consts';
import {fontStyles, spacingStyles} from '@/styles/exportFlamingo/exportStyles';
// eslint-disable-next-line no-unused-vars
import {DsColorsTypes} from '@/styles/exportFlamingo/types';
import DsTooltip from '@/components/main/DsTooltip.vue';
import {PositiveSpaceUnit} from '@/components/main/layout/utils/types';

export default defineComponent({
	name: 'DataStoriesText',
	components: {DsTooltip},
	props: {
		tooltip: {
			type: String,
			default: ''
		},
		variant: {
			type: String as PropType<TextVariant>,
			default: 'body'
		},
		color: {
			type: String as PropType<DsColorsTypes | null>,
			default: 'display-content-700'
		},
		align: {
			type: String as PropType<TextAlign>,
			default: 'left'
		},
		fontStyle: {
			type: String as PropType<FontStyle>,
			default: 'normal'
		},
		noWrap: {
			type: Boolean,
			default: false
		},
		noHyphen: {
			type: Boolean,
			default: false
		},
		wrapTooltip: {
			type: Boolean,
			default: false
		},
		isEditable: {
			type: Boolean,
			default: false
		},
		whiteSpace: {
			type: String as PropType<WhiteWrap>,
			default: 'no-wrap'
		},
		paddingRight: {
			type: String as PropType<PositiveSpaceUnit>,
			default: 'NONE'
		},
		paddingLeft: {
			type: String as PropType<PositiveSpaceUnit>,
			default: 'NONE'
		}
	},
	emits: ['keyup', 'change', 'blur'],
	setup(props) {
		const componentTag = computed(() => {
			switch (props.variant) {
				case 'paragraph':
				case 'ds-paragraphLarge':
					return 'p';
				case 'captionMedium':
				case 'caption':
					return 'small';
				case 'data':
					return 'code';
				case 'display':
				case 'headline1':
				case 'headline1light':
				case 'ds-headline1':
				case 'ds-s-headline1':
					return 'h1';
				case 'headline2':
				case 'ds-headline2':
				case 'ds-s-headline2':
					return 'h2';
				case 'subheadline':
				case 'subheadlineRegular':
				case 'ds-headline3':
				case 'ds-s-headline3':
					return 'h3';
				case 'body':
				case 'bodyMedium':
					return 'span';
			}
			return 'span';
		});

		const wordWrap = props.noWrap
			? {
				'word-wrap': 'normal',
				'word-break': 'normal',
				'white-space': 'nowrap'
			}
			: {};

		const computedPadding = computed(() => ({
			'padding-inline-start': spacingStyles[props.paddingLeft],
			'padding-inline-end': spacingStyles[props.paddingRight]
		}));

		const computedTextStyle = computed(() => ({
			font: fontStyles[props.variant],
			'text-align': props.align,
			'font-style': props.fontStyle,
			'white-space': props.whiteSpace,
			hyphens: props.noHyphen ? 'none' : 'auto',
			...wordWrap,
			...computedPadding.value
		}));

		return {
			componentTag,
			computedTextStyle
		};
	}
});
</script>

<style scoped>
.ds-text {
	overflow-wrap: break-word;
	word-wrap: break-word;
	word-break: break-word;
	hyphens: auto;
}
.inherit-font-color {
	color: inherit;
}

.wrap-tooltip {
	width: 200px;
	word-wrap: break-word;
}
</style>
