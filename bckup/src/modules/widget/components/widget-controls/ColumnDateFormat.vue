<template>
	<div>
		<ds-box class="w-100">
			<ds-select
				v-model:selectedValue="selected2"
				class="w-100"
				:initialValue="buttonText"
				:items="dateFormatOptionsFormattedComputed"
				max-width
				checker
				:groups="[$t('dateFormat.dateFormatting')]"
				:clear-btn-text="$t('t_Remove')"
				clear-btn-icon="ds-icon-minus-circle"
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
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, PropType, reactive, toRefs, watch} from 'vue';
import {
	dateFormatOptions,
	dateFormatOptionsFormatted
} from '@/modules/widget/components/widget-controls/consts/formatOptions';
import {chartConstants} from '@/util/consts/chartsConstants';
import isEqual from 'lodash/isEqual';
import {FormatOption} from './consts/formatTypes';
import cloneDeep from 'lodash/cloneDeep';
import i18n from '@/plugins/i18n/index';
import {useStore} from 'vuex';
const {t} = i18n.global;

export default defineComponent({
	name: 'ColumnDateFormat',
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
	emits: ['setDateFormat'],
	setup(props, {emit}) {
		const store = useStore();
		const state = reactive({
			selected2: props?.selectedFormat
		});

		onMounted(() => {
			state.selected2 = cloneDeep(props?.selectedFormat);
		});

		const selected = computed(() => {
			const selectedFormat = store.getters['widgetInstances/option'](props.widgetInstanceId, 'selectedFormat');
			if (props?.formatName === chartConstants.dataConfiguration.X_AXIS) {
				return selectedFormat?.xAxis ?? null;
			} else if (props?.formatName === chartConstants.dataConfiguration.TIMELINE) {
				return selectedFormat?.timeline ?? null;
			}
			return selectedFormat?.yAxis ?? null;
		});

		const dateFormatOptionsFormattedComputed = computed(() => dateFormatOptionsFormatted.map((format: any) => ({
			...format,
			group: t('dateFormat.dateFormatting'),
			...(isEqual(format.value, selected.value) ? {selected: selected.value} : {})
		})));

		const buttonText = computed(() => {
			let res: string = t('dateFormat.selectFormat');
			for (let i = 0; i < dateFormatOptions.length; i++) {
				if (objectEquals(dateFormatOptions?.[i]?.value, selected.value)) {
					res = dateFormatOptions[i]?.short ?? dateFormatOptions[i].text;
				}
			}
			return res;
		});

		const tooltipText = computed(() => {
			let res: string = t('dateFormat.selectFormat');
			for (let i = 0; i < dateFormatOptions.length; i++) {
				if (objectEquals(dateFormatOptions?.[i]?.value, selected.value)) {
					res = dateFormatOptions[i].text;
				}
			}
			return res;
		});

		const updateOption = (value: FormatOption) => {
			emit('setDateFormat', value);
		};

		const objectEquals = (object1: any, object2: any) => {
			if (object1 === null || object2 === null) {
				return false;
			}

			const keys1 = Object.keys(object1);
			const keys2 = Object.keys(object2);

			if (keys1.length !== keys2.length) {
				return false;
			}

			for (const key of keys1) {
				// @ts-ignore
				if (object1[key] !== object2[key]) {
					return false;
				}
			}
			return true;
		};

		watch(() => props.selectedFormat, (newVal: FormatOption) => {
			state.selected2 = newVal;
		}, {immediate: true});

		return {
			updateOption,
			buttonText,
			tooltipText,
			selected,
			dateFormatOptionsFormattedComputed,
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
