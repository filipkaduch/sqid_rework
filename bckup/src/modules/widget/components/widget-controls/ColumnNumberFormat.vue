<template>
	<ds-box class="w-100">
		<ds-select
			v-model:selectedValue="selected"
			class="w-100"
			:initial-value="buttonText"
			:items="formatOptionsFormattedComputed"
			max-width
			checker
			:clear-btn-text="$t('t_Remove')"
			clear-btn-icon="ds-icon-minus-circle"
			:groups="[$t('numberFormat.currencyFormat'), $t('numberFormat.numberFormat')]"
			:placement="'bottom'"
			@input="updateOption($event)">
			<template #triggerContent>
				<ds-tooltip>
					<template #icon>
						<ds-box align-y="center" border-radius="basic" class="cursor-pointer" flex-type="row">
							<ds-box
								border="separate"
								border-radius="basic"
								class="cursor-pointer ds-bg-separate-content-0"
								flex-type="row"
								padding-x="S">
								<ds-text class="pl-1" color="display-content-700" variant="body">
									{{ buttonText }}
								</ds-text>
								<ds-icon name="ds-icon-chevron-down" fill="display-content-700" />
							</ds-box>
						</ds-box>
					</template>
					<template #tooltip>
						<ds-inline>
							<ds-text variant="bodyMedium" color="white">{{ `${$t('t_format')}` }}</ds-text>
							<ds-text white-space="pre-wrap" color="white">{{ ` - ${tooltipText}` }}</ds-text>
						</ds-inline>
					</template>
				</ds-tooltip>
			</template>
		</ds-select>
	</ds-box>
</template>

<script lang="ts">
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import {computed, defineComponent, onMounted, PropType, reactive, toRefs, watch} from 'vue';
import {FormatOption} from './consts/formatTypes';
import {formatOptionsFormatted} from '@/modules/widget/components/widget-controls/consts/formatOptions';
import i18n from '@/plugins/i18n/index';
const {t} = i18n.global;

export default defineComponent({
	name: 'ColumnNumberFormat',
	props: {
		selectedFormat: {
			type: Object as PropType<FormatOption>,
			default: null
		},
		widgetInstanceId: {
			type: String,
			required: true
		},
		formatName: {
			type: String,
			required: true
		}
	},
	emits: ['setDateFormat', 'setNumberFormat'],
	setup(props, {emit}) {
		const state = reactive({
			selected: props.selectedFormat
		});

		onMounted(() => {
			state.selected = cloneDeep(props?.selectedFormat);
		});

		const formatOptionsFormattedComputed = computed(() => formatOptionsFormatted.map((format: any) => ({
			...format,
			...(isEqual(format.value, state.selected) ? {selected: state.selected} : {})
		})));

		const buttonText = computed(() => {
			let res: string | undefined = t('numberFormat.selectNumberFormat');
			for (const option of formatOptionsFormatted) {
				if (isEqual(option.value, state.selected)) {
					res = option?.short ?? option.selectLabel;
				}
			}
			return res;
		});

		const tooltipText = computed(() => {
			let res: string | undefined = t('numberFormat.selectNumberFormat');
			for (const option of formatOptionsFormatted) {
				if (isEqual(option.value, state.selected)) {
					res = option.selectLabel;
				}
			}
			return res;
		});

		const updateOption = (value: FormatOption) => {
			state.selected = value;
			emit('setNumberFormat', value);
		};

		watch(() => props.selectedFormat, (newVal: FormatOption) => {
			state.selected = newVal;
		}, {immediate: true});

		return {
			updateOption,
			buttonText,
			tooltipText,
			formatOptionsFormattedComputed,
			...toRefs(state)
		};
	}
});
</script>

<style lang="scss">

.cleanBtn {
	border-bottom: 0;
	border-left: 0;
	border-right: 0;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
}

</style>
