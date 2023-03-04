<template>
	<div>
		<ds-box v-if="headingText" padding-bottom="S" flex-type="column">
			<ds-text variant="body" color="display-content">
				{{ $t(headingText) }}
			</ds-text>
		</ds-box>
		<ds-toggle-bar :items="buttons" :disabled="disabled" :value="value" @selected="$emit('update:value', $event)" />
	</div>
</template>

<script>
export default {
	name: 'ButtonGroup',
	props: {
		value: {
			type: [String, Boolean],
			default: null
		},
		headingText: {
			type: String,
			default: null
		},
		options: {
			type: Array,
			default() {
				return [];
			}
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:value'],
	widgetControlTypes() {
		return ['widget_control_button_group'];
	},
	computed: {
		buttons() {
			return this.options?.map((option) => ({
				value: typeof option === 'string' ? option : option.value,
				label: typeof option === 'string' ? option : (option.text ?? null),
				icon: option?.icon ?? null
			}));
		}
	}
};
</script>
