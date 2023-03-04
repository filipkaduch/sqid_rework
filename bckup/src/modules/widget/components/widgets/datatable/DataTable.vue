<template>
	<div class="h-100 d-flex flex-column align-items-center">
		<h4 v-if="displayName" class="mx-auto mt-1 mb-0">
			<strong>{{ title }}</strong>
		</h4>
		<ds-box class="widget-padding data-table-container w-100 h-100">
			<ds-box class="max-width max-height position-relative overflow-auto">
				<ds-table
					:table-rows="widgetData?.data"
					:table-header="widgetData?.fields"
					:sortable="true"
					:header-line="true"
					:sticky-header="true"
					:data-table="false"
					:show-icons="false"
					:number-of-items-per-page="totalRows" />
			</ds-box>
		</ds-box>
	</div>
</template>

<script>
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/datatable/consts';
import {echartsDefaultControls} from '@/modules/widget/echartsWidgetControls';
import widgetMixin from '@/mixins/widgetMixin';
import {dataTransformation} from '@/modules/widget/components/widgets/datatable/utils';

export default {
	name: 'DataTable',
	mixins: [widgetMixin],
	widgetTypes() {
		return ['widget_data_table'];
	},
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: config,
			options: {
				...echartsDefaultControls(true)
			}
		};
	},
	widgetHooks: {
		dataTransformation
	},
	computed: {
		widgetData() {
			return this.$store.getters['widgetData/data'](this.widgetInstanceId);
		},
		totalRows() {
			return this.widgetData?.data?.length ?? null;
		}
	}
};
</script>

<style lang="scss" scoped>
.max-width {
	width: 100%;
}

.max-height {
	height: calc(100% - 3rem);
	max-height: calc(100% - 3rem);
}
</style>
