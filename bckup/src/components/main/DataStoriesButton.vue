<template>
	<button
		type="button"
		class="ds-button"
		:class="[`ds-button-${variant}`]"
		:style="btnStyle"
		:aria-pressed="pressed ? pressed : null"
		:disabled="disabled"
		@click="$emit('click', $event)">
		<ds-box
			:class="{'h-100': maxHeight}"
			:border-left="splitLane ? 'layout' : ''"
			:padding-x="paddingX ?? (small || iconOnly ? 'S' : 'M')"
			:padding-y="paddingY ?? (small ? 'XS' : 'S')"
			align-y-self="center"
			align-y="center">
			<ds-tooltip :show="tooltip !== ''">
				<ds-inline align-y="center" :align="iconOnly || center ? 'center' : 'left'" no-wrap>
					<ds-inline-item v-if="$slots.icon">
						<ds-box align-y="center" :padding-right="iconOnly ? 'NONE' : 'S'">
							<slot name="icon" />
						</ds-box>
					</ds-inline-item>
					<ds-text
						v-if="!iconOnly"
						:no-wrap="noWrap"
						:variant="small ? 'captionMedium' : 'bodyMedium'"
						class="inherit-font-color"
						:color="computedColor"
						align="center">
						<slot />
					</ds-text>
					<ds-box v-if="$slots.rightIcon" align-y="center" align="right">
						<slot name="rightIcon" />
					</ds-box>
				</ds-inline>
				<template #tooltip>
					{{ $t(tooltip) }}
				</template>
			</ds-tooltip>
		</ds-box>
	</button>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, computed, PropType} from 'vue';
import {borderStyles} from '@/styles/exportFlamingo/exportStyles';
import DsTooltip from '@/components/main/DsTooltip.vue';
import {PositiveSpaceUnit} from '@/components/main/layout/utils/types';
type ButtonVariants = 'primary' | 'secondary' | 'inverted' | 'ghost' | 'interaction';

export default defineComponent({
	name: 'DataStoriesButton',
	components: {DsTooltip},
	props: {
		tooltip: {
			type: String,
			default: ''
		},
		block: {
			type: Boolean,
			default: false
		},
		rounded: {
			type: Boolean,
			default: false
		},
		splitLane: {
			type: Boolean,
			default: false
		},
		maxHeight: {
			type: Boolean,
			default: false
		},
		pill: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		variant: {
			type: String as PropType<ButtonVariants>,
			default: 'primary'
		},
		iconOnly: {
			type: Boolean,
			default: false
		},
		center: {
			type: Boolean,
			default: false
		},
		small: {
			type: Boolean,
			default: false
		},
		pressed: {
			type: Boolean,
			default: false
		},
		width: {
			type: String,
			default: null
		},
		paddingX: {
			type: String as PropType<PositiveSpaceUnit>,
			default: null
		},
		paddingY: {
			type: String as PropType<PositiveSpaceUnit>,
			default: null
		},
		noWrap: {
			type: Boolean,
			default: false
		}
	},
	emits: ['click'],
	setup(props) {
		const computedColor = computed(() => {
			let color = props.variant === 'primary' ? 'white' : 'display-content-700';
			if (props.disabled && props.variant === 'secondary') {
				color = 'display-content-400';
			}
			return color;
		});

		const btnStyle = computed(() => ({
			...(props.block ? {width: '100%'} : {width: 'max-content'}),
			...(props.rounded ? {'border-radius': borderStyles['radius-rounded']} : {}),
			...(props.pill ? {'border-radius': borderStyles['radius-pill-small']} : {}),
			height: props.small ? '22px' : '36px',
			...(props.iconOnly ? {width: props.small ? '22px' : props.width ? props.width : '36px'} : {})
		}));
		return {
			btnStyle,
			computedColor
		};
	}
});
</script>

<style lang="scss" scoped>
.btn-outline-base {
	border-radius: 4px;
	border: 1px solid map-get($ds-colors, 'display-content-400');
}

.btn-primary {
	border-radius: 4px;
	border: 1px solid map-get($ds-colors, 'primary');
	background-color: map-get($ds-colors, 'primary');
	color: map-get($ds-colors, 'white');
}
.btn {
	&.disabled {
		background-color: map-get($ds-colors, 'display-content-300');
		border-color: map-get($ds-colors, 'display-content-300');
		color: map-get($ds-colors, 'white');
	}

	&-primary-inverse {
		&.disabled {
			background-color: map-get($ds-colors, 'interaction-100');
			border-color: map-get($ds-colors, 'interaction-100');
		}
	}
}
.ds-button-secondary:disabled {
	background-color: map-get($ds-colors, 'white');
	border-color: map-get($ds-colors, 'separate-content-100');
	color: map-get($ds-colors, 'display-content-400');
}
.inherit-font-color {
	color: inherit;
}
</style>
