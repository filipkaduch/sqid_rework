<template>
	<ds-box class="w-100" padding-top="M">
		<ds-box v-if="numberInputText" padding-bottom="S">
			<ds-text color="display-content">{{ $t(numberInputText) }}</ds-text>
		</ds-box>
		<ds-inline align-y="center" gap="S" no-wrap class="w-100">
			<ds-box class="w-100">
				<ds-inline-item class="w-100">
					<ds-input
						v-model:value="numberValue"
						width="100%"
						type="number"
						:min="1"
						:step="step"
						:unit="unit"
						debounce />
				</ds-inline-item>
			</ds-box>
		</ds-inline>
	</ds-box>
</template>

<script lang="ts">
import {defineComponent, ref, Ref, watch} from 'vue';

export default defineComponent({
	name: 'NumberInput',
	props: {
		default: {
			type: Number,
			default: 10
		},
		disabled: {
			type: Boolean,
			default: false
		},
		minValue: {
			type: Number,
			default: 1
		},
		maxValue: {
			type: Number,
			default: 10
		},
		step: {
			type: Number,
			default: 1
		},
		unit: {
			type: String,
			default: null
		},
		numberInputText: {
			type: String,
			default: null
		}
	},
	emits: ['update:value'],
	widgetControlTypes() {
		return ['widget_control_number_input'];
	},
	setup(props, {emit}) {
		const numberValue: Ref<number> = ref(props.default);

		watch(numberValue, (val) => {
			emit('update:value', val);
		});
		watch(() => props.default, (val) => {
			if (val !== numberValue.value) {
				numberValue.value = val;
			}
		});

		return {
			numberValue
		};
	}
});

</script>

<style scoped>

</style>
