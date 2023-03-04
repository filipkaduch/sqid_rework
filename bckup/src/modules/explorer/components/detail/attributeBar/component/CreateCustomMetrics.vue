<template>
	<ds-box
		border-top="disabled"
		padding-x="L" padding-y="M"
		class="w-100 ds-bg-separate-content-0 position-absolute custom-metrics-position" align-y="center" align="center">
		<ds-btn variant="secondary" block center @click="showCreate = true">
			<template #icon>
				<ds-icon fill="inherit" name="ds-icon-plus-circle" />
			</template>
			{{ $t('customMetrics.create.buttonBase') }}
		</ds-btn>
		<transition name="slide-fade" appear>
			<custom-metrics-form
				class="custom-metrics-popup position-absolute"
				:class="{active: showCreate}"
				@close="showCreate = false"
				@modified="showCreate = false" />
		</transition>
	</ds-box>
</template>

<script lang="ts">
import {defineComponent, watch, ref} from 'vue';
import CustomMetricsForm from '@/modules/explorer/components/detail/attributeBar/component/CustomMetricsForm.vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';

export default defineComponent({
	name: 'CreateCustomMetrics',
	components: {
		CustomMetricsForm
	},
	setup() {
		const {dataSourceId} = useExplorerChart();
		const showCreate = ref(false);

		watch(dataSourceId, () => {
			showCreate.value = false;
		});

		return {
			showCreate
		};
	}
});
</script>

<style scoped>
.custom-metrics-popup {
	transition: bottom 400ms ease;
	bottom: -400%;
}
.custom-metrics-position {
	bottom: 36px;
}
.custom-metrics-popup.active {
	bottom: 0;
	left: 0;
	z-index: 2
}
</style>
