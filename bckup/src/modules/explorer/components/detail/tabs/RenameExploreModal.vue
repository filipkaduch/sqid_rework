<template>
	<ds-modal
		:show="show"
		:header-text="'explore.renameTab'"
		:cancel-text="'modals.cancel'"
		size="md"
		footer-class="h-100 p-4"
		confirmText="explore.renameTab"
		@ok="setName"
		@cancel="$emit('closeModal')">
		<template #modal-text>
			<ds-input v-model:value="exploreName" :title="$t('t_DatasetName')" width="100%" />
		</template>
	</ds-modal>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import {
	WIDGET_INSTANCE_ACTIONS,
	WIDGET_INSTANCE_GETTERS,
	WIDGET_INSTANCE_STORE_NAME
} from '@/modules/widget/store/widgetInstances/types';
import {useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import {useStore} from 'vuex';

export default defineComponent({
	props: {
		show: {
			type: Boolean,
			default: false
		},
		tabId: {
			type: String,
			default: ''
		}
	},
	emits: ['closeModal', 'resetTabs'],
	setup(props, {emit}) {
		const store = useStore();
		const {explore} = useExplorerChart();
		const dataExploreStore = useDataExploreStore();

		const setName = () => {
			store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SET_NAME}`, {name: exploreName.value, widgetInstanceId: props.tabId});
			dataExploreStore.renameDataExploration(props.tabId, exploreName.value);
			emit('resetTabs', props.tabId);
		};
		const exploreName = ref('');

		watch(() => props.show, (value) => {
			if (value) {
				const tabName = store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.INSTANCE}`](props.tabId)?.name;
				if (tabName) {
					exploreName.value = tabName;
				} else {
					const section = explore.value.sections.find((sec: any) => sec.id === props.tabId);
					exploreName.value = section.name;
				}
			}
		});

		return {
			exploreName,
			setName
		};
	}
});
</script>

<style lang="scss" scoped>
</style>
