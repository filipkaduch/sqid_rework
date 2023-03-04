<template>
	<ds-dropdown v-if="topValues">
		<template #triggerContent>
			<ds-box class="w-100 h-100">
				<ds-tooltip>
					<template #icon>
						<ds-box
							border="separate"
							border-radius="basic"
							class="cursor-pointer ds-bg-separate-content-0 d-flex"
							padding-x="S">
							<ds-text class="pl-1" color="display-content-700" variant="body">
								{{ $t('t_topN') }}
							</ds-text>
							<ds-icon name="ds-icon-chevron-down" />
						</ds-box>
					</template>
					<template #tooltip>
						{{ $t('onlyTopValues') }}
					</template>
				</ds-tooltip>
			</ds-box>
		</template>
		<template #dropdownContent>
			<ds-card body-class="my-2 py-0 px-2" class="shadow-none border-0 column-card-background">
				<ds-box flex-type="row">
					<ds-text color="display-content-500">
						{{ $t('onlyTopValues') }}
					</ds-text>
				</ds-box>
				<ds-btn-group class="d-inline-flex">
					<ds-box padding-right="S">
						<ds-toggle-bar :items="topNOptions" :value="topValuesToSave?.count" @selected="updateSelectedTopN" />
					</ds-box>
					<ds-btn-group class="d-inline-flex">
						<ds-btn
							v-for="item in orderOptions"
							:key="item.value"
							:pressed="item.value === topValuesToSave?.direction"
							variant="ghost"
							iconOnly
							@click="updateTopNOrder(item.value)">
							<template #icon>
								<fa-icon :icon="['fal', item.value === ordering.ASC ? 'long-arrow-up' : 'long-arrow-down']" class="m-0" />
							</template>
						</ds-btn>
					</ds-btn-group>
				</ds-btn-group>
				<ds-collapse :visible="topValuesToSave !== null">
					<column-select
						:function-select="true"
						:hide-formatting-button="true"
						:show-top-values="false"
						:filter-dataset="dataSourceId"
						:value="{...topValuesToSave.metric, dataset: dataSourceId}"
						:widget-instance-id="selectedWidgetInstanceId"
						@update:value="updateTopValues(topValuesToSave ? topValuesToSave.count : null, topValuesToSave ? topValuesToSave.direction : ordering.ASC, false, $event)" />
				</ds-collapse>
			</ds-card>
		</template>
	</ds-dropdown>
</template>

<script lang="ts">
import {computed, defineComponent, ref, Ref, watch} from 'vue';
import ColumnSelect from '@/modules/widget/components/widget-controls/ColumnSelect.vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import useTopValues from '@/modules/explorer/composables/useTopValues';
import {ordering} from '@/util/queryBuilder';
import useAttributes from '@/modules/explorer/composables/useAttributes';
import {topNOptions, orderOptions} from '@/util/consts/topNValues';

export default defineComponent({
	name: 'TopNValues',
	components: {
		ColumnSelect
	},
	emits: ['updateTopValues'],
	setup(props, {emit}) {
		const {selectedWidgetInstanceId} = useExplorerChart();
		const {catalogDetail, datasetDetail} = useAttributes();
		const {buildTopValues, topValues} = useTopValues();
		const topValuesToSave: Ref<any> = ref(null);
		const dataSourceId = computed(() => catalogDetail.value?.id ?? datasetDetail.value?.id ?? null);

		watch(topValues, (newVal) => {
			if (newVal) {
				topValuesToSave.value = buildTopValues(newVal);
			}
		}, {immediate: true});

		const updateTopValues = (count: number, direction: string, force = false, event: any = null) => {
			if (count) {
				topValuesToSave.value.count = count;
			}
			if (direction) {
				topValuesToSave.value.direction = direction;
			}
			if (event) {
				topValuesToSave.value.metric.column = event.column;
				topValuesToSave.value.metric.function = event.function;
			}

			emit('updateTopValues', topValuesToSave.value);
		};

		const updateSelectedTopN = (count: any) => {
			updateTopValues(count, topValuesToSave.value.direction);
		};

		const updateTopNOrder = (direction: any) => {
			updateTopValues(topValuesToSave.value.count, direction);
		};

		return {
			updateTopValues,
			topValues,
			topValuesToSave,
			selectedWidgetInstanceId,
			ordering,
			dataSourceId,
			topNOptions,
			orderOptions,
			updateSelectedTopN,
			updateTopNOrder
		};
	}
});

</script>

<style scoped>

</style>
