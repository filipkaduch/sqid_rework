import {computed, ref} from 'vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';

export default function useTopValues() {
	const {dataConfiguration} = useExplorerChart();
	const topVal = ref(null as any);

	const topValues = computed(() => dataConfiguration.value?.dimensions?.[1]?.topValues ?? null);
	const buildTopValues = (newVal: any) => {
		topVal.value = {
			count: newVal.count,
			direction: newVal.direction,
			metric: {
				column: newVal.metric.column,
				function: newVal.metric.aggregation
			}
		};
		return topVal.value;
	};

	return {
		topValues,
		buildTopValues
	};
}

