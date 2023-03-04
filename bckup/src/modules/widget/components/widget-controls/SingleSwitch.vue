<template>
	<ds-box
		v-show="!hide"
		:flex-type="showTextState && groupHeadOption ? 'row' : 'column'"
		:border-top="border ? 'separate-light' : ''"
		:padding-top="border ? 'M' : ''"
		:padding-bottom="groupHeadOption ? '' : lastOption ? '' : 'M'">
		<div v-if="headingText" class="mb-1 mt-1">
			<ds-text v-if="headingText" variant="body" color="display-content">
				{{ $t(headingText) }}
			</ds-text>
		</div>
		<ds-box>
			<ds-inline align="space-between" class="w-100 d-flex align-items-center">
				<ds-text v-if="!groupHeadOption && switchText" class="switch-text-overflow" variant="body" color="display-content">{{ $t(switchText) }}</ds-text>
				<div class="d-flex">
					<ds-switch :value="value" :disabled="disabled" @update="$emit('update:value', $event)" />
					<ds-box
						:padding-y="showTextState && !groupHeadOption ? 'XS' : ''"
						:padding-left="showTextState && !groupHeadOption ? 'S' : ''"
						flex-type="row"
						align="right">
						<ds-text
							v-if="showTextState && !groupHeadOption"
							:color="disabled ? 'display-content-400' : 'display-content-700'"
							class="switch-text-stable">
							{{ value ? 'On' : 'Off' }}
						</ds-text>
					</ds-box>
				</div>
			</ds-inline>
		</ds-box>
		<ds-box
			v-if="showTextState && groupHeadOption" padding-y="XS" padding-left="S" flex-type="row"
			align-y="center"
			align="right">
			<ds-text class="switch-text-stable" :color="disabled ? 'display-content-400' : 'display-content-700'">{{ value ? 'On' : 'Off' }}</ds-text>
		</ds-box>
	</ds-box>
</template>

<script lang="ts">
import DsSwitch from '@/components/inputs/DsSwitch.vue';

export default {
	name: 'SingleSwitch',
	components: {
		DsSwitch
	},
	props: {
		value: {
			type: Boolean,
			default: null
		},
		headingText: {
			type: String,
			default: null
		},
		switchText: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		hide: {
			type: Boolean,
			default: false
		},
		delimiter: {
			type: Boolean,
			default: false
		},
		border: {
			type: Boolean,
			default: false
		},
		lastOption: {
			type: Boolean,
			default: false
		},
		showTextState: {
			type: Boolean,
			default: false
		},
		// This mean if represent whole group like showLegend affect all legend options.
		// in explorer other options are collapsed of showLegend is false
		groupHeadOption: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:value'],
	widgetControlTypes() {
		return ['widget_control_single_switch'];
	}
};
</script>

<style lang="scss" scoped>
.switch-text-stable {
	min-width: 24px;
}
.switch-text-disabled {
	color: map-get($ds-colors, 'display-content-400') !important;
}
.switch-text-overflow {
	max-width: calc(100% - 72px);
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
