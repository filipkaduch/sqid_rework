<template>
	<div class="column-wrapper h-100">
		<ds-box
			padding-y="GROUP"
			padding-x="M"
			class="ds-bg-white-100 w-100 header"
			border-right="disabled"
			style="position: sticky; top: 62px;">
			<ds-box padding-bottom="XS">
				<ds-inline align="space-between">
					<ds-inline-item>
						<ds-inline no-wrap align-y="center">
							<ds-box padding-right="S" align-y="center">
								<ds-icon :name="getIcon(attribute.type)" :alt="attribute.type" />
							</ds-box>
							<ds-box v-if="attribute.selected === chartConstants.dataConfiguration.METRIC && showColorPicker(index, null, index)" padding-right="S" align-y="center">
								<combined-color-picker
									explorer
									:index="index"
									:input-color="colors.graph[index]"
									group-type="metric"
									:group-index="index"
									type="widget"
									:single-metric="widgetMetrics.length === 1 ? 'metric' : null"
									:widget-instance-id="selectedWidgetInstanceId"
									:picker-values="pickerValues"
									@reset-picker-values="pickerValues = null" />
							</ds-box>
							<ds-box align-y="center">
								<ds-text class="text-nowrap" color="display-content-700" variant="bodyMedium">
									<slot name="displayName">{{ attribute.displayName }}</slot>
								</ds-text>
							</ds-box>
							<ds-box
								v-if="!(attribute.selected === chartConstants.dataConfiguration.DIMENSION && index > 0)"
								class="cursor-pointer"
								align-y="center"
								padding-left="S"
								@click="setOrdering(attribute)">
								<ds-icon :name="getSortIcon" alt="Sort" />
							</ds-box>
						</ds-inline>
					</ds-inline-item>
					<ds-inline-item style="height: 22px">
						<ds-kebab-btn small>
							<template #dropdownContent>
								<dropdown-menu
									:items="dropzoneColumnActions(attribute, showColorPicker(index, `metric${index}`, index))"
									align-x="left"
									@update:selected="executeColumnAction($event.value, attribute, index, $event.$event)" />
							</template>
						</ds-kebab-btn>
					</ds-inline-item>
				</ds-inline>
			</ds-box>
			<ds-box>
				<slot name="header" />
			</ds-box>
		</ds-box>
		<div class="data-container">
			<app-loading :loading="widgetLoading">
				<ds-box
					v-for="(data, idx) in attribute.data"
					:key="idx"
					border-bottom="disabled"
					border-right="disabled"
					class="ds-bg-white data w-100 data-row"
					flex-type="row"
					padding-x="M"
					align-y="center"
					align="space-between"
					style="height: 44px">
					<ds-text
						:id="attribute.selected === chartConstants.dataConfiguration.DIMENSION ? `displayNameDimension${index}_r${idx}` : null"
						variant="dataCaption"
						color="display-content-500"
						class="overflow-ellipsis"
						:is-editable="attribute.selected === chartConstants.dataConfiguration.DIMENSION"
						:contenteditable="attribute.selected === chartConstants.dataConfiguration.DIMENSION && renamingDimension"
						:tooltip="getEntryData(attribute, data[0]).tooltip"
						:font-style="getEntryData(attribute, data[0]).fontStyle"
						@keydown.enter.prevent="$emit('changeDimensionName', {dimensionIndex: index, rowIndex: idx, elm: $event})"
						@blur="emitChangeDimensionName(index, idx, $event)"
						@focusout="emitChangeDimensionName(index, idx, $event)">
						{{ getEntryData(attribute, data[0]).textToDisplay }}
					</ds-text>
					<ds-box
						v-if="attribute.selected === chartConstants.dataConfiguration.DIMENSION && isLast && showColorPicker(index, `dimension${index}`, null)"
						padding-left="S"
						align-y="center"
						:align="coloring?.[`dimension${index}`]?.[data[0]?.toString()] ? 'left' : 'right'">
						<combined-color-picker
							explorer
							:index="index"
							:input-color="colors.graph[idx]"
							group-type="dimension"
							:group-index="index"
							:group-key="data[0]?.toString()"
							type="widget"
							:widget-instance-id="selectedWidgetInstanceId"
							:picker-values="pickerValues"
							:row-idx="idx"
							@reset-picker-values="pickerValues = null" />
					</ds-box>

					<ds-box>
						<ds-kebab-btn v-if="attribute.selected === chartConstants.dataConfiguration.DIMENSION" style="height: 22px" small class="kebab-btn">
							<template #dropdownContent>
								<dropdown-menu
									:items="dropzoneDimensionRowActions(attribute, showColorPicker(index, `dimension${index}`, null))"
									@update:selected="executeRowAction($event.value, attribute, idx, $event.$event, data, index)" />
							</template>
						</ds-kebab-btn>
					</ds-box>
				</ds-box>
			</app-loading>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, ref, computed, nextTick} from 'vue';
import type {Attribute} from '@/modules/explorer/store/dataExplore';
import useDataType from '@/components/main/Table/composables/useDataType';
import {ordering} from '@/util/queryBuilder';
import {chartConstants} from '@/util/consts/chartsConstants';
import {dropzoneColumnActions, dropzoneDimensionRowActions} from '@/modules/explorer/consts/consts';
import DropdownMenu from '@/components/main/Dropdown/DropdownMenu.vue';
import {hideAllPoppers} from 'floating-vue';
import CombinedColorPicker from '@/modules/widget/components/widget-controls/CombinedColorPicker.vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import AppLoading from '@/components/design/AppLoading.vue';
import {displayColorPicker} from '@/util/widgetData';
import {useStore} from 'vuex';

export default defineComponent({
	name: 'DropZoneColumn',
	components: {
		AppLoading,
		CombinedColorPicker,
		DropdownMenu
	},
	props: {
		attribute: {
			type: Object as PropType<Attribute>,
			required: true
		},
		index: {
			type: Number,
			required: true
		},
		isLast: {
			type: Boolean,
			default: false
		},
		dimensionAliases: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ['changeDimensionName', 'ordering', 'renameMetric', 'formatting', 'remove', 'function', 'aggregation', 'aggregation', 'numberOfBuckets', 'renameDimension'],
	setup(props, {emit}) {
		const store = useStore();
		const state = reactive({
			timeout: null as any | null
		});
		const renamingDimension = ref(false);

		const {selectedWidgetInstanceId, widgetMetrics, widgetConfiguration, widget} = useExplorerChart();
		const widgetLoading = computed(() => store.getters['widgetInstances/loading'](selectedWidgetInstanceId.value));
		const coloring = computed(() => widgetConfiguration.value.options.coloring);

		const {getIcon} = useDataType();
		const getSortIcon = computed(() => {
			if (props.attribute?.orderBy && props.attribute?.orderBy?.length > 0) {
				if (props.attribute?.orderBy?.[0].order === ordering.ASC) {
					return 'icon-sort-asc';
				}
				return 'icon-sort-desc';
			}
			return 'ds-icon-unsorted';
		});

		const setOrdering = (attribute: Attribute) => {
			if (state.timeout) {
				clearTimeout(state.timeout);
			}
			state.timeout = setTimeout(() => {
				if (attribute?.orderBy?.[0].order === ordering.DESC) {
					emit('ordering', []);
				} else {
					emit('ordering', [
						{
							columnAlias: attribute.selected === chartConstants.dataConfiguration.METRIC ? `Metric${props.index + 1}` : `Dimension${props.index + 1}`,
							order: attribute?.orderBy?.[0]?.order === ordering.ASC ? ordering.DESC : ordering.ASC
						}
					]);
				}
			}, 250);
		};

		const executeColumnAction = (action: string, column: Attribute, index: number, value: any, evt?: any) => {
			hideAllPoppers();

			switch (action) {
				case 'renameMetric':
					emit('renameMetric', value);
					break;
				case 'format':
					emit('formatting', value);
					break;
				case 'remove':
					emit('remove', {name: column.name, index});
					break;
				case 'extract':
				case 'bucketing':
					emit('function', value);
					break;
				case 'aggregation':
					emit('aggregation', value);
					break;
				case 'numberOfBuckets':
					emit('numberOfBuckets', value);
					break;
				case 'color':
					pickerValues.value = {
						groupType: 'metric',
						groupIndex: index,
						groupKey: null,
						rowIdx: null
					};
					break;
			}
		};

		const emitChangeDimensionName = (index: number, rowIndex: number, elm: any) => {
			renamingDimension.value = false;
			emit('changeDimensionName', {dimensionIndex: index, rowIndex, elm});
		};

		const executeRowAction = (action: string, column: Attribute, index: number, value: any, evt?: any, groupIndex?: any) => {
			hideAllPoppers();

			switch (action) {
				case 'renameDimension':
					renamingDimension.value = true;
					nextTick(() => {
						const toFocus: any = document.getElementById(`displayNameDimension${groupIndex}_r${index}`);
						toFocus.focus();
					});
					break;
				case 'changeColor':
					// TODO: add additional params if needed
					pickerValues.value = {
						groupType: 'dimension',
						groupIndex,
						groupKey: evt[0].toString(),
						rowIdx: index
					};
					break;
			}
		};

		const getEntryData = (attribute: Attribute, textValue: string) => {
			const clearedText = textValue === null ? '<NULL>' : textValue;
			const data: any = {
				textToDisplay: clearedText,
				tooltip: '',
				fontStyle: 'normal'
			};

			if (attribute.selected === chartConstants.dataConfiguration.DIMENSION) {
				const newValue = props.dimensionAliases?.[`dimension${attribute.index}`]?.[clearedText];
				const isDefined = typeof newValue !== 'undefined' && newValue !== null;

				data.textToDisplay = newValue && isDefined ? newValue : clearedText;
				data.tooltip = newValue && isDefined ? clearedText.toString() : '';
				data.fontStyle = newValue && isDefined ? 'italic' : 'normal';
			}

			return data;
		};

		const inputVal = ref('NULL');

		const colors = computed(() => store.getters['storyDetail/story'].layoutConfiguration.theme.colors);

		const pickerValues = ref(null as any);

		const showColorPicker = (index: any, dimension: string | null, indexOfMetric: any) => {
			const dimensionsCount = widgetConfiguration.value?.data?.configuration?.dimensions?.length ?? 0;
			const metricsCount = widgetConfiguration.value?.data?.configuration?.metrics?.length;
			if (widget.value) {
				return displayColorPicker(dimensionsCount, metricsCount, index, dimension, widget.value.widgetType, indexOfMetric);
			}
			return false;
		};

		return {
			widgetLoading,
			getIcon,
			getSortIcon,
			chartConstants,
			dropzoneColumnActions,
			dropzoneDimensionRowActions,
			setOrdering,
			executeColumnAction,
			executeRowAction,
			inputVal,
			colors,
			selectedWidgetInstanceId,
			widgetMetrics,
			getEntryData,
			pickerValues,
			coloring,
			showColorPicker,
			renamingDimension,
			emitChangeDimensionName
		};
	}
});
</script>

<style lang="scss" scoped>
.header {
	height: 74px;
	border-bottom: 2px solid map-get($ds-colors, 'separate-content-200');
}
.overflow-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1; /* number of lines to show */
	line-clamp: 1;
	-webkit-box-orient: vertical;
}
.data-row:hover {
	.kebab-btn {
		opacity: 1
	}
}
.kebab-btn {
	opacity: 0;
}
</style>
<style lang="scss">
.drop-zone-table {
	.dropzone-dragging {
		min-height: calc(80vh);
		.column-wrapper {
			display: none;
		}
		background-color: map-get($ds-colors, 'interaction-200');
		border: none!important;
		box-shadow: none;
		border-radius: 0;
	}
	.dropzone-dragging.attribute {
		pointer-events: none;
		.attribute-content {
			display: none!important;
		}
	}
}
</style>
