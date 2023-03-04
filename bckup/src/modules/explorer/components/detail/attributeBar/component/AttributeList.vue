<template>
	<ds-box>
		<ds-box
			v-if="attributeSearch && (!filteredAttributeList || filteredAttributeList.length === 0)"
			class="h-100" align="center" align-y="center" padding="M">
			<ds-text variant="subheadlineMedium" color="display-content">{{ $t('t_noResultsFound') }}</ds-text>
			<ds-text color="display-content" class="">{{ $t('t_noAttributeFound') }} "{{ attributeSearch }}"</ds-text>
		</ds-box>
		<draggable
			v-model="filteredAttributeList"
			class="dragArea list-group"
			:group="{name: 'attributes', pull: 'clone', put: false}"
			:sort="false"
			item-key="name"
			ghost-class="dropzone-dragging"
			@start="getDragged"
			@end="removeDraggedAttribute">
			<template #item="{element}">
				<ds-box
					class="list-item attribute cursor-grab user-select-none"
					:class="{'attribute-selected': element.selected}"
					:name="element.displayName"
					:type="element.type"
					padding-x="L"
					padding-y="M">
					<ds-inline class="w-100 attribute-content" align="space-between">
						<ds-icon :fill="element.selected ? 'display-content-700' : ''" :name="getIcon(element.type)" class="mr-2 img-width" alt="type" />
						<div class="text-size">
							<ds-text class="text-overflow mr-2 d-flex" :variant="element.selected ? 'bodyMedium' : 'body'" :tooltip="element.displayName">
								{{ element.displayName }}
							</ds-text>
						</div>
						<ds-box>
							<span class="badge bg-secondary">{{ element.uniqueValues }}</span>
							<ds-inline>
								<data-stories-badge-rounder v-if="element?.uniqueValuesCount" :text="element?.uniqueValuesCount ?? 'None'" tool-tip="Unique value count" />
								<ds-dropdown v-if="element.type === CUSTOM_METRIC" placement="right-start" @hidden="editMetric = false">
									<template #triggerContent>
										<ds-btn small variant="ghost" padding-x="NONE">
											<ds-icon class="cursor-pointer" name="ds-icon-three-dots-vertical" fill="display-content-300" />
										</ds-btn>
									</template>
									<template #dropdownContent>
										<dropdown-menu-basic
											v-if="!editMetric" :items="element.attributeMenu" @selected="handleCustomMetric($event, element.id)" />
										<custom-metrics-form
											v-else
											class="custom-metrics-form"
											:edit="true"
											:uuid="element.id"
											:custom-column-name="element.name"
											:custom-expression="element.customExpression"
											@modified="editMetric = false"
											@close="editMetric = false" />
									</template>
								</ds-dropdown>
								<!--<fa-icon-->
							<!--class="ml-2"-->
							<!--:class="{'favorite-start': attribute.favorite}"-->
							<!--:icon="starIcon(attribute.favorite)"-->
							<!--@click.stop="attribute.favorite = !attribute.favorite" />-->
							</ds-inline>
						</ds-box>
					</ds-inline>
				</ds-box>
			</template>
		</draggable>
	</ds-box>
</template>
<script lang="ts">
import {defineComponent, watch, onMounted, computed, ref} from 'vue';
import useDataType from '@/components/main/Table/composables/useDataType';
import {CUSTOM_METRIC} from '@/util/queryBuilder';
// eslint-disable-next-line no-unused-vars
import {Attribute, useDataExploreStore} from '@/modules/explorer/store/dataExplore';
// @ts-ignore
import draggable from 'vuedraggable';
import useAttributes from '@/modules/explorer/composables/useAttributes';
import DataStoriesBadgeRounder from '@/components/main/Badge/DataStoriesBadgeRounder.vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import {chartConstants} from '@/util/consts/chartsConstants';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;
import DropdownMenuBasic from '@/components/main/Dropdown/DropdownMenuBasic.vue';
import CustomMetricsForm from '@/modules/explorer/components/detail/attributeBar/component/CustomMetricsForm.vue';
import {cloneDeep, isEmpty} from 'lodash';
import {useNotification} from '@kyvg/vue3-notification';
import {useStore} from 'vuex';

export default defineComponent({
	components: {
		CustomMetricsForm,
		DropdownMenuBasic,
		DataStoriesBadgeRounder,
		draggable
	},
	props: {
		attributeSearch: {
			type: String,
			default: ''
		}
	},
	// eslint-disable-next-line max-lines-per-function
	setup(props) {
		const store = useStore();
		const notification = useNotification();
		const dataExploreStore = useDataExploreStore();
		const {attributeList, datasetDetailColumns, catalogDetailColumns, starIcon} = useAttributes();
		const {widgetMetrics, widgetDimensions, dataSourceId} = useExplorerChart();
		const usedAttributes = computed(() => dataExploreStore.getUsedAttributes ?? []);
		const storyDetailConfiguration = computed(() => store.getters['storyDetail/story']?.configuration ?? {});
		const widgetPages = computed(() => store.getters['widgetInstances/widgetInstanceIds']);

		const usedCustomMetrics = computed(() => {
			const widgetIds: string[] = [];
			for (const page in widgetPages.value) {
				widgetIds.push(...widgetPages.value[page]);
			}
			const usedMetrics = [];
			for (const widgetId of widgetIds) {
				usedMetrics.push(...store.getters['widgetInstances/configuration'](widgetId)?.data?.configuration?.metrics ?? []);
			}
			return usedMetrics.filter((metric) => metric.id).map((metric) => metric.id);
		});

		onMounted(() => {
			if (datasetDetailColumns.value) {
				setAttributes(datasetDetailColumns.value);
			} else if (catalogDetailColumns.value) {
				setAttributes(catalogDetailColumns.value);
			}
		});

		watch(catalogDetailColumns, (newValue) => {
			setAttributes(newValue);
		}, {deep: true});

		watch(datasetDetailColumns, (newValue) => {
			setAttributes(newValue);
		}, {deep: true});

		const filterByType = computed(() => dataExploreStore.getAttributes.filteredByType);

		const filteredAttributeList = computed(() => {
			let filtered = attributeList.value?.concat(customMetricsAttributes.value);
			if (filterByType.value && filterByType.value.length > 0 && filtered) {
				filtered = attributeList.value?.filter((attribute: Attribute) => filterByType.value?.includes(getType(attribute.type) as never)) ?? [] as Attribute[];
			}
			if (props.attributeSearch && filtered) {
				filtered = filtered.filter((attr: Attribute) => attr.displayName.toLowerCase().includes(props.attributeSearch.toLowerCase())) ?? [] as Attribute[];
			}
			return filtered?.map((attr) => ({...attr, selected: usedAttributes.value.some((item) => item.name === attr.name)}))
				.sort((val1, val2) => val1.name.localeCompare(val2.name)) ?? [];
		});

		const customMetricsAttributes = computed(() => {
			const customMetrics = storyDetailConfiguration.value?.customMetrics?.[dataSourceId.value] ?? [];
			return customMetrics.map((metric: any) => ({
				name: metric.customColumnName,
				displayName: metric.customColumnName,
				customExpression: metric.customExpression,
				customExpressionEnabled: metric.customExpressionEnabled,
				id: metric.id,
				favorite: false,
				type: CUSTOM_METRIC,
				attributeMenu: [
					{
						value: 'edit',
						label: t('t_Edit')
					},
					{
						value: 'delete',
						label: t('t_Delete'),
						disabled: usedCustomMetrics.value.includes(metric.id)
					}
				]
			}));
		});

		const setAttributes = (val: any) => {
			if (!isEmpty(val) && isEmpty(dataExploreStore.getAttributes.list)) {
				const newAttributes = val.map((col: any, index: number) => {
					const additionalData: any = {};
					const metric = widgetMetrics.value.find((elm: {aggregation: string, column: string}) => elm.column === col.name);
					const dimension = widgetDimensions.value.find((elm: {function: string, column: string}) => elm.column === col.name);

					if (metric) {
						additionalData.selected = chartConstants.dataConfiguration.METRIC;
						additionalData.aggregation = metric.aggregation;
					}

					if (dimension) {
						additionalData.selected = chartConstants.dataConfiguration.DIMENSION;
						additionalData.function = dimension.function;
					}

					return {
						name: col.name,
						displayName: col.displayName,
						index,
						favorite: false,
						...additionalData,
						type: col.dataType,
						uniqueValuesCount: col.uniqueValuesCount
					};
				});
				dataExploreStore.addAttributeList(newAttributes);
			}
		};
		const editMetric = ref(false);
		const handleCustomMetric = async(action: any, uuid: string) => {
			if (action.value === 'delete' && !action.disabled) {
				if (!action.disabled) {
					const newConfiguration = cloneDeep(storyDetailConfiguration.value);
					const indexOfMetric = newConfiguration.customMetrics[dataSourceId.value].findIndex((item: any) => item.id === uuid);
					const deletedMetricName = newConfiguration.customMetrics[dataSourceId.value][indexOfMetric].customColumnName;
					newConfiguration.customMetrics[dataSourceId.value].splice(indexOfMetric, 1);
					await store.dispatch('storyDetail/updateStory', {configuration: newConfiguration});
					// @ts-ignore
					notification.notify({
						type: 'success',
						title: t('customMetrics.toasts.deleted'),
						text: `"${deletedMetricName}"`,
						duration: 5000
					});
				}
			}
			if (action.value === 'edit') {
				editMetric.value = true;
			}
		};

		const {getIcon, getType} = useDataType();

		const {removeDraggedAttribute, setDraggedAttribute} = dataExploreStore;
		const getDragged = (event: any) => {
			setDraggedAttribute({
				name: event.item.getAttribute('name'),
				type: event.item.getAttribute('type')
			});
		};
		return {
			filteredAttributeList,
			getIcon,
			starIcon,
			getDragged,
			removeDraggedAttribute,
			usedAttributes,
			customMetricsAttributes,
			handleCustomMetric,
			editMetric,
			CUSTOM_METRIC,
			usedCustomMetrics
		};
	}
});
</script>

<style lang="scss" scoped>
.img-width {
	width: 20px;
}
.text-size {
	flex-grow: 1;
	width: calc(100% - 120px);
}
.text-overflow {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.list-item {
	width: 100%;
	height: 48px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background: map-get($ds-colors, 'white');
	position: relative;
}
.favorite-start {
	color: map-get($ds-colors, 'warning-300');
}
.attribute-selected {
	background: map-get($ds-colors, 'interaction-0');
	box-shadow: inset -4px 0 0 map-get($ds-colors, 'interaction-500');
}
.custom-metrics-form {
	min-width: 371px;
}
</style>
