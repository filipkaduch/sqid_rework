<template>
	<ds-box
		:border-top="edit ? 'NONE' : 'disabled'"
		padding-x="L"
		padding-top="M"
		class="ds-bg-separate-content-0 w-100">
		<ds-inline align-y="center" align="space-between" no-wrap>
			<ds-text variant="subheadlineMedium" color="display-content-700" no-wrap>
				{{ edit ? $t('customMetrics.edit.title') : $t('customMetrics.create.title') }}
			</ds-text>
			<ds-close-button small @close="$emit('close')" />
		</ds-inline>
		<ds-box padding-top="M">
			<ds-input
				v-model:value="customName"
				width="100%"
				:placeholder="$t('t_CustomColumnName')"
				@update="$emit('update:customColumnName', $event)" />
			<ds-box padding-top="S">
				<app-query-editor
					v-model:query="customQuery"
					:columns="columns"
					@update:query="$emit('update:customExpression', $event)" />
			</ds-box>
		</ds-box>
		<ds-box padding-y="M">
			<ds-btn
				:disabled="!isFormValid" variant="secondary" block center
				@click="edit ? editCustomMetric() : saveCustomMetric()">
				{{ edit ? $t('customMetrics.edit.button') : $t('customMetrics.create.button') }}
			</ds-btn>
		</ds-box>
	</ds-box>
</template>

<script lang="ts">
import AppQueryEditor from '@/components/AppQueryEditor.vue';
import DsCloseButton from '@/components/main/button/DsCloseButton.vue';
import {onMounted, computed, defineComponent, ref, watch} from 'vue';
import useAttributes from '@/modules/explorer/composables/useAttributes';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import {cloneDeep} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {
	WIDGET_INSTANCE_ACTIONS,
	WIDGET_INSTANCE_GETTERS,
	WIDGET_INSTANCE_STORE_NAME
} from '@/modules/widget/store/widgetInstances/types';
import i18n from '@/plugins/i18n/index';
import {useNotification} from '@kyvg/vue3-notification';
import {useStore} from 'vuex';
const {t} = i18n.global;

export default defineComponent({
	name: 'CustomMetricsForm',
	components: {
		AppQueryEditor,
		DsCloseButton
	},
	props: {
		uuid: {
			type: String,
			default: ''
		},
		customColumnName: {
			type: String,
			default: ''
		},
		customExpression: {
			type: String,
			default: ''
		},
		edit: {
			type: Boolean,
			default: false
		}
	},
	emits: ['close', 'update:customColumnName', 'update:customExpression', 'modified'],
	setup(props, {emit}) {
		const store = useStore();
		const notification = useNotification();
		const storyDetailConfiguration = computed(() => store.getters['storyDetail/story'].configuration ?? {});
		const {dataSourceId, selectedWidgetInstanceId} = useExplorerChart();
		const {datasetDetailColumns, catalogDetailColumns} = useAttributes();
		const columns = computed(() => [...datasetDetailColumns.value, ...(catalogDetailColumns?.value ?? [])]);
		const customQuery = ref('');
		const customName = ref('');

		onMounted(() => {
			customName.value = props.customColumnName;
			customQuery.value = props.customExpression;
		});

		watch(dataSourceId, () => {
			customName.value = props.customColumnName;
			customQuery.value = props.customExpression;
		});
		watch(() => props.customColumnName, (newVal) => {
			customName.value = newVal;
		});
		watch(() => props.customExpression, (newVal) => {
			customQuery.value = newVal;
		});

		const isFormValid = computed(() => Boolean(customName.value.length > 0 && customQuery.value.length > 0));

		const saveCustomMetric = async() => {
			const newConfiguration = cloneDeep(storyDetailConfiguration.value);
			if (!newConfiguration.customMetrics) {
				newConfiguration.customMetrics = {};
			}
			if (!newConfiguration.customMetrics[dataSourceId.value]) {
				newConfiguration.customMetrics[dataSourceId.value] = [];
			}
			newConfiguration.customMetrics[dataSourceId.value].push({
				customColumnName: customName.value,
				customExpression: customQuery.value,
				customExpressionEnabled: true,
				id: uuidv4()
			});
			await store.dispatch('storyDetail/updateStory', {configuration: newConfiguration});
			// @ts-ignore
			notification.notify({
				type: 'success',
				title: t('customMetrics.toasts.created'),
				text: `"${customName.value}"`,
				duration: 5000
			});
			customName.value = '';
			// eslint-disable-next-line require-atomic-updates
			customQuery.value = '';
			emit('modified');
		};

		const editCustomMetric = async() => {
			const newConfiguration = cloneDeep(storyDetailConfiguration.value);
			const indexOfMetric = newConfiguration.customMetrics[dataSourceId.value].findIndex((item: any) => item.id === props.uuid);
			newConfiguration.customMetrics[dataSourceId.value][indexOfMetric].customColumnName = customName.value;
			newConfiguration.customMetrics[dataSourceId.value][indexOfMetric].customExpression = customQuery.value;
			await store.dispatch('storyDetail/updateStory', {configuration: newConfiguration});
			updateWidgetConfigurations();
			emit('modified');
		};

		// update configuration of modified custom metric if is used in widgets
		const updateWidgetConfigurations = () => {
			const widgetPages = store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.WIDGET_INSTANCE_IDS}`];
			const widgetIds: string[] = [];
			for (const page in widgetPages) {
				widgetIds.push(...widgetPages[page]);
			}
			let widgetConfigurationsToUpdate: any = [];
			for (const widgetId of widgetIds.filter((id) => id !== selectedWidgetInstanceId.value)) {
				widgetConfigurationsToUpdate.push(store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.CONFIGURATION}`](widgetId));
			}
			widgetConfigurationsToUpdate = widgetConfigurationsToUpdate
				.filter((configuration: any) => configuration.data.configuration.metrics.some((metric: any) => metric.id === props.uuid));
			for (const configuration of cloneDeep(widgetConfigurationsToUpdate)) {
				for (let i = 0; i < configuration.data.configuration.metrics.length; i++) {
					if (configuration.data.configuration.metrics[i].id === props.uuid) {
						configuration.data.configuration.metrics[i].customColumnName = customName.value;
						configuration.data.configuration.metrics[i].customExpression = customQuery.value;
					}
					store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SET_CONFIGURATION}`, {
						widgetInstanceId: configuration.data.widgetId,
						configuration
					});
				}
			}
		};

		return {
			columns,
			isFormValid,
			customName,
			customQuery,
			saveCustomMetric,
			editCustomMetric
		};
	}
});
</script>

<style scoped>
</style>
