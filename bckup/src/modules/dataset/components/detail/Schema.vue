<template>
	<ds-table
		v-if="!datasetLoading"
		:table-header="schemaHeader"
		:table-rows="schemaData"
		:sticky-header="true"
		:data-table="false">
		<template #default="{row, column}">
			<div v-if="column.name === schemaNames.type">
				<ds-inline>
					<ds-box>
						<ds-badge
							variant="display-content"
							:text="row[column.name]" />
					</ds-box>
				</ds-inline>
			</div>
			<div v-else-if="column.name === schemaNames.uniqueValues">
				<ds-text variant="data">
					{{ row[column.name] }}
				</ds-text>
			</div>
			<div v-else-if="column.name === schemaNames.mostCommonValues">
				<ds-text variant="data">
					<ds-box flex-type="row">
						<ds-box padding-right="S">
							{{ row[column.name].slice(0,4).join(', ') }}
						</ds-box>
						<ds-inline>
							<ds-box v-if="row[column.name].length > 4" padding-x="S" flex-type="row" class="ds-bg-separate-content-100 text-nowrap">
								<ds-dropdown placement="bottom-end">
									<template #triggerContent>
										<ds-box flex-type="row" class="cursor-pointer">
											+{{ row[column.name].length - 4 }}
											<div class="dot ds-bg-display-content-700" />
										</ds-box>
									</template>
									<template #dropdownContent>
										<dropdown-menu-basic :items="row[column.name].slice(4).map((value) => ({label: value}))" class="dropdown-menu-height" />
									</template>
								</ds-dropdown>
							</ds-box>
						</ds-inline>
					</ds-box>
				</ds-text>
			</div>
		</template>
	</ds-table>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import DsBadge from '@/components/main/Badge/DataStoriesBadge.vue';
import DropdownMenuBasic from '@/components/main/Dropdown/DropdownMenuBasic.vue';
import {TELLSTORY_ROW_ID} from '@/modules/dataset/utils/dataset';
import {i18n} from '@/plugins/all';
import {useStore} from 'vuex';
const {t} = i18n.global;

export default defineComponent({
	components: {
		DsBadge,
		DropdownMenuBasic
	},
	// eslint-disable-next-line max-lines-per-function
	setup() {
		const store = useStore();
		const translate = (word: string) => t(word);

		const datasetDetail = computed(() => store.getters['datasetDetail/dataset']);
		const datasetLoading = computed(() => store.getters['datasetDetail/loading']);

		const schemaNames = {
			name: translate('datasetDetail.schemaNames.name'),
			type: translate('datasetDetail.schemaNames.type'),
			uniqueValues: translate('datasetDetail.schemaNames.uniqueValues'),
			mostCommonValues: translate('datasetDetail.schemaNames.mostCommonValues')
		};

		const schemaHeader = [
			{
				name: schemaNames.name,
				type: 'date'
			},
			{
				name: schemaNames.type,
				type: 'string'
			},
			{
				name: schemaNames.uniqueValues,
				type: 'string'
			},
			{
				name: schemaNames.mostCommonValues,
				type: 'number'
			}
		];

		const schemaData = computed(() => datasetDetail.value.columns.reduce((data: any, item: any) => {
			if (item.name !== TELLSTORY_ROW_ID) {
				data.push({
					[`${schemaNames.name}`]: item.displayName,
					[`${schemaNames.type}`]: item.dataType,
					[`${schemaNames.uniqueValues}`]: item.uniqueValuesCount,
					[`${schemaNames.mostCommonValues}`]: Object.keys(item.mostCommonValues)
				});
			}
			return data;
		}, []));

		return {
			datasetLoading,
			schemaNames,
			schemaHeader,
			schemaData
		};
	}
});
</script>

<style lang="scss" scoped>
.dot {
	margin-left: 6px;
	width: 8px;
	height: 8px;
	border-radius: 8px;
	align-self: center;
}

.dropdown-menu-height {
	max-height: 200px;
}
</style>
