<template>
	<ds-btn
		variant="ghost"
		class="w-100"
		:disabled="item.disabled"
		block
		@click="selectValue(item)">
		<ds-box flex-type="row" class="w-100">
			<ds-box
				v-if="checker"
				:padding-left="selectedValue === item.selectLabel || item?.selected ? 'NONE' : 'L'"
				:padding-right="selectedValue === item.selectLabel || item?.selected ? 'S' : 'NONE'">
				<ds-icon
					v-if="selectedValue === item.selectLabel || item?.selected"
					name="ds-icon-checkmark"
					alt="Check"
					class="action-icon"
					fill="display-content-700" />
			</ds-box>
			<ds-text
				:variant="checker && (selectedValue === item.selectLabel || item?.selected) ? '' : 'paragraph'"
				:color="item?.disabled ? 'display-content-300' : 'display-content-700'">
				{{ item.selectLabel }}
			</ds-text>
			<ds-box padding-left="S">
				<ds-box v-if="item.disabled">
					<ds-tooltip style="z-index: 5;">
						<template #icon>
							<div>
								<ds-icon
									name="ds-icon-info"
									alt="Info"
									fill="display-content" />
							</div>
						</template>
						<template #tooltip>
							{{ $t('explorer.tooltips.cumSumInfo') }}
						</template>
					</ds-tooltip>
				</ds-box>
				<ds-box v-if="!item.disabled && !haveDim1Order">
					<ds-tooltip>
						<template #icon>
							<div>
								<ds-icon
									name="ds-icon-warning"
									alt="Warning"
									fill="warning-500" />
							</div>
						</template>
						<template #tooltip>
							{{ $t('explorer.tooltips.cumSumWarning') }}
						</template>
					</ds-tooltip>
				</ds-box>
			</ds-box>
		</ds-box>
	</ds-btn>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';

export default defineComponent({
	props: {
		item: {
			type: Object,
			default: () => ({})
		},
		selectedValue: {
			type: String,
			default: ''
		},
		checker: {
			type: Boolean,
			default: false
		},
		selectValue: {
			type: Function,
			default: () => ({})
		}
	},
	setup() {
		const {dataConfiguration} = useExplorerChart();

		const haveDim1Order = computed(() => dataConfiguration.value.orderBy?.find((item: any) => item.columnAlias === 'Dimension1'));

		return {
			haveDim1Order
		};
	}
});
</script>
