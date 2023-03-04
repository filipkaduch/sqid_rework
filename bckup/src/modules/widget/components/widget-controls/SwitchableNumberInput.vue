<template>
	<ds-box class="w-100" padding-top="M">
		<ds-box v-if="numberInputText" padding-bottom="S">
			<ds-text color="display-content">{{ $t(numberInputText) }}</ds-text>
		</ds-box>
		<ds-inline align-y="center" gap="S" no-wrap class="w-100">
			<ds-box class="w-100">
				<ds-inline-item class="w-100">
					<data-stories-switch-input
						v-model:value="numberValue"
						:min="minValue"
						:max="maxValue"
						:placeholder="$t('t_unlimited')"
						:step="step" />
				</ds-inline-item>
			</ds-box>
		</ds-inline>
	</ds-box>
</template>

<script lang="ts">
import {defineComponent, ref, Ref, watch} from 'vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import DataStoriesSwitchInput from '@/components/main/DataStoriesSwitchInput.vue';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {useStore} from 'vuex';

export default defineComponent({
	name: 'SwitchableNumberInput',
	components: {
		DataStoriesSwitchInput
	},
	props: {
		default: {
			type: Number,
			default: null
		},
		value: {
			type: [Number, String]
		},
		disabled: {
			type: Boolean,
			default: true
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
		numberInputText: {
			type: String,
			default: null
		}
	},
	emits: ['update:value'],
	widgetControlTypes() {
		return ['widget_control_switchable_number_input'];
	},
	setup(props, {emit}) {
		const store = useStore();
		const numberValue: Ref<number | string | null> = ref(null);
		const disableInput = ref(true);
		const {selectedWidgetInstanceId} = useExplorerChart();
		const setShortLabel = (value: boolean) => {
			store.dispatch('widgetInstances/setOption', {
				widgetInstanceId: selectedWidgetInstanceId.value,
				optionName: widgetOptionName.X_AXIS_SHORT_LABEL,
				value
			});
		};

		watch(numberValue, (val, oldValue) => {
			if (oldValue !== val) {
				if (val === '') {
					setShortLabel(false);
					disableInput.value = true;
					emit('update:value', val);
				} else if (val) {
					setShortLabel(true);
					disableInput.value = false;
					emit('update:value', val);
				}
			}
		});
		watch(() => props.value, (val) => {
			if (val !== numberValue.value) {
				// @ts-ignore
				numberValue.value = val;
			}
		}, {immediate: true});

		return {
			numberValue,
			disableInput
		};
	}
});

</script>

<style scoped>

</style>
