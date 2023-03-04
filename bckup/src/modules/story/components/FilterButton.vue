<template>
	<ds-btn
		variant="ghost"
		tooltip="filters.ResetCrossFilter"
		icon-only
		class="btn-filter-reset rounded-circle border-0"
		@click="resetWidgetPageFilters">
		<template #icon>
			<fa-layers fixed-width>
				<fa-icon :icon="['fas', 'filter']" transform="left-1" />
				<fa-icon :icon="['fas', 'times-circle']" transform="shrink-4 right-8 down-4" />
			</fa-layers>
		</template>
	</ds-btn>
</template>

<script>
import {defineComponent} from 'vue';
import {useStore} from 'vuex';

export default defineComponent({
	props: {
		pageWidgetInstanceId: {
			type: String,
			default: null
		}
	},
	setup(props) {
		const store = useStore();
		const resetPageFilters = () => store.dispatch('widgetInstances/resetPageFilters', props.pageWidgetInstanceId);
		const resetWidgetPageFilters = () => {
			resetPageFilters();
		};
		return {
			resetWidgetPageFilters
		};
	}
});
</script>

<style scoped>

</style>
