<template>
	<ds-box id="detail-data-table" class="max-width max-height">
		<ds-table
			v-if="!datasetLoading"
			:data-table="true"
			:sticky-header="true"
			:table-header="tableHeader"
			:table-rows="tableRows"
			@get-more-data="loadMoreData" />
	</ds-box>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
// eslint-disable-next-line no-unused-vars
import {TableHeader} from '@/components/main/consts/interfaces';
import {TELLSTORY_ROW_ID} from '@/modules/dataset/utils/dataset';
import {useStore} from 'vuex';

export default defineComponent({
	components: {},
	props: {
		checkScroll: {
			type: Boolean,
			default: false
		}
	},
	emits: ['updateScroll'],
	// eslint-disable-next-line max-lines-per-function
	setup() {
		const store = useStore();

		const datasetLoading = computed(() => store.getters['datasetDetail/loading']);
		const datasetTableData = computed(() => store.getters['datasetDetail/tableData']);

		const tableHeader = computed(() => datasetTableData.value?.columns.reduce((data: TableHeader[], item: any) => {
			if (item.reference !== TELLSTORY_ROW_ID) {
				data.push({
					name: item.reference,
					type: item.dataType
				});
			}
			return data;
		}, []));

		const tableRows = computed(() => datasetTableData.value?.rows);

		const loadMoreData = async() => {
			await store.dispatch('datasetDetail/loadTableData');
		};

		return {
			datasetLoading,
			tableHeader,
			tableRows,
			loadMoreData
		};
	}
});
</script>

<style lang="scss" scoped>
.max-width {
	// 64px is padding from left and right, 65px is size of left navbar
	width: calc(100vw - 64px - 65px);
}

.max-height {
	display: flex;
	// 280px is approx height of top area. Can be adjusted if necessary.
	height: calc(100vh - 280px);
	max-height: calc(100vh - 280px);
}
</style>
