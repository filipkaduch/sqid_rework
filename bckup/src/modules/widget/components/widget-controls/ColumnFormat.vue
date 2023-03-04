<template>
	<div>
		<column-date-format
			v-if="isDataType(dataTypes.DATE_TYPE, currentDataType)"
			v-model:selected-format="selectedColumnFormat"
			:format-name="formatName"
			:widget-instance-id="selectedWidgetInstanceId"
			@set-date-format="updateValue(formatName, $event)" />
		<column-number-format
			v-else-if="isDataType(dataTypes.NUMBER, currentDataType)"
			:format-name="formatName"
			:widget-instance-id="selectedWidgetInstanceId"
			:selected-format="selectedColumnFormat"
			@set-number-format="updateValue(formatName, $event)" />
	</div>
</template>

<script lang="ts">
import * as dataTypeHelper from '@/util/queryBuilder';
import {chartConstants} from '@/util/consts/chartsConstants';
import {axisDataMap} from '@/modules/explorer/utils/dropZoneUtils';
import type {Attribute} from '@/modules/explorer/store/dataExplore';
import useAttributes from '@/modules/explorer/composables/useAttributes';
import {computed, defineComponent, PropType, reactive, toRefs, watch} from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';

import ColumnDateFormat from '@/modules/widget/components/widget-controls/ColumnDateFormat.vue';
import ColumnNumberFormat from '@/modules/widget/components/widget-controls/ColumnNumberFormat.vue';
import {useStore} from 'vuex';

export default defineComponent({
	name: 'ColumnFormat',
	components: {
		ColumnDateFormat,
		ColumnNumberFormat
	},
	props: {
		dimensions: {
			type: Array,
			default: () => []
		},
		attribute: {
			type: Object as PropType<Attribute>,
			default: null
		}
	},
	emits: ['changed'],
	setup(props, {emit}) {
		const store = useStore();
		const {dataTypes} = dataTypeHelper;
		const {selectedWidgetInstanceId} = useExplorerChart();
		const {getFormatting} = useAttributes();
		const formatState = reactive({
			selectedColumnFormat: null as any,
			formatName: ''
		});

		watch(() => props.attribute, (newVal: Attribute) => {
			if (newVal) {
				formatState.selectedColumnFormat = newVal?.selectedFormat ?? null;
				const indexedOption = `${newVal.selected}${newVal.index}`;
				// @ts-ignore
				formatState.formatName = axisDataMap?.[newVal.selected === chartConstants.dataConfiguration.METRIC ? newVal.selected : indexedOption] ?? '';
			}
		}, {immediate: true});

		const isDataType = (type: string, selected: string) => dataTypeHelper.isDataType(type, selected);
		const currentDataType = computed(() => {
			if (props.attribute.selected === chartConstants.dataConfiguration.METRIC) {
				return dataTypes.INT;
			}
			return props.attribute?.type ?? null;
		});
		const updateValue = (axis: string, value: string) => {
			const temp = cloneDeep(getFormatting.value);
			temp[axis] = value;
			formatState.selectedColumnFormat = temp;
			store.dispatch('widgetInstances/setOption', {
				widgetInstanceId: selectedWidgetInstanceId.value,
				optionName: 'selectedFormat',
				value: temp
			});
			emit('changed', temp);
		};

		return {
			...toRefs(formatState),
			updateValue,
			isDataType,
			selectedWidgetInstanceId,
			dataTypes,
			currentDataType
		};
	}
});
</script>
