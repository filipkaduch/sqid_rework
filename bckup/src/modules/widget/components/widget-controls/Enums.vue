<!-- eslint-disable max-lines -->
<template>
	<div class="">
		<div v-if="headingText" class="d-flex my-1">
			<span class="options-grey-style">
				{{ $t(headingText) }}
			</span>
		</div>
		<div v-if="dataLength > 20 && metric === null && filteredDimensions !== null">
			<app-input-bar
				v-model:input="search"
				:pill="false"
				class="m-0 mb-2"
				:widgetControlRightIcon="['far','search']"
				placeholder="Search" />
		</div>
		<div v-for="(dimension, index) in filteredDimensions" :key="index">
			<template v-if="dimension !== 'mapping'">
				<div v-for="(key, i) in getFilteredEnums(dimension, index)" :key="`key-${i}`" class="input-group mb-1">
					<div v-if="metric === null" class="input-group-prepend">
						<div class="d-flex input-group-text justify-content-center h-100" style="color: #AAABAE; width: 89px">
							<ds-tooltip :disabled="key.length < 10">
								<template #icon>
									<div>
										{{ key.length < 10 ? key : key.substring(0,7) + '...' }}
									</div>
								</template>
								<template #tooltip>
									{{ key }}
								</template>
							</ds-tooltip>
						</div>
					</div>
					<div v-else class="input-group-prepend">
						<div class="d-flex flex-grow-1 input-group-text justify-content-center h-100" style="color: #AAABAE; width: 89px">
							<ds-tooltip :disabled="key.length < 10" class="w-100" height="100%">
								<template #icon>
									<div>
										{{ key.length < 10 ? key : key.substring(0,7) + '...' }}
									</div>
								</template>
								<template #tooltip>
									{{ key }}
								</template>
							</ds-tooltip>
						</div>
					</div>

					<ds-input
						:placeholder="dimension === 'metricAliases' ? getMetricPlaceholder(indexOfMetric) : ''"
						:value="value[dimension][key]"
						class="h-100 flex-grow-1"
						lazy
						@update:value="updateEnum(dimension, key, $event)" />

					<div v-if="showColorPicker(dimension, key)" class="input-group-append">
						<ds-component-wrapper
							:id="indexOfMetric ? indexOfMetric.toString() : i"
							:widgetInstanceId="widgetId"
							:type="'widget'"
							class="h-100"
							:data-testid="`color-picker-${i}-${metric !== null ? 'metric' : 'dimension'}`"
							:height-fit="true"
							component-name="WidgetControlCombinedColorPicker"
							:groupType="metric ? 'metric' : 'dimension'"
							:groupIndex="metric ? indexOfMetric : indexOfDimension"
							:groupKey="metric ? null : key"
							:singleMetric="indexOfMetric !== null
								&& metrics && metrics.length === 1
								&& (widgetType === widgetTypes.BAR_CHART || widgetType === widgetTypes.CATEGORY_BAR)
								&& dimension !== 'dimension0' ? 'metric' : null"
							:index="indexOfMetric ? indexOfMetric : i" />
					</div>
				</div>
			</template>
		</div>
		<div v-if="isLoaded && loaded > 20 && filteredDimensions !== null" class="d-inline-flex justify-content-center w-100 mt-2">
			<button class="btn btn-clean" @click="loadLess">
				<fa-icon :icon="['fas','caret-up']" class="mx-3" />
			</button>
		</div>
		<div v-if="dataLength > 20 && metric === null && filteredDimensions !== null" class="d-inline-flex justify-content-center w-100">
			<button class="btn btn-clean" @click="loadMore">
				<fa-icon :icon="['fas','caret-down']" class="mx-3" />
			</button>
		</div>
		<!-- TODO: un-hide the options if we use them again -->
		<div v-if="widgetType === widgetTypes.DATA_TABLE && indexOfMetric !== null" class="hidden">
			<single-switch
				v-model:value="graphs"
				:disabled="disableGraph"
				switchText="Show graphs" />
			<single-switch
				v-model:value="graphsValue"
				:disabled="disableGraphValue"
				switchText="Show graph values" />
			<single-switch
				v-model:value="colorScale"
				:disabled="disableScale"
				switchText="Show color scale" />
		</div>
	</div>
</template>

<script>
import {dimensionDefinition} from '@/util/queryBuilder';
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import SingleSwitch from '@/modules/widget/components/widget-controls/SingleSwitch.vue';
import {removeOldFormat} from '@/util/formatingUtil';
import {displayColorPicker} from '@/util/widgetData';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {getMetricPlaceholderValue, setOption, setupEnums, updateEnumName} from '@/modules/widget/utils/widget';
import cloneDeep from 'lodash/cloneDeep';

export default {
	name: 'Enums',
	components: {
		AppInputBar,
		SingleSwitch
	},
	mixins: [widgetControlComponentMixin],
	props: {
		dimensions: {
			type: Array,
			default: () => []
		},
		metric: {
			type: String,
			default: null
		},
		mapping: {
			type: Boolean,
			default: true
		},
		indexOfMetric: {
			type: Number,
			default: null
		},
		indexOfDimension: {
			type: Number,
			default: null
		}
	},
	data() {
		return {
			value: {},
			search: '',
			loaded: 20,
			isLoaded: false,
			dataLength: 0,
			widgetTypes,
			graphs: false,
			graphsValue: false,
			colorScale: false
		};
	},
	computed: {
		realValue() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, this.name) ?? {};
		},
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
		},
		widgetId() {
			return this.widgetInstanceId;
		},
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		showGraphs() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'showGraphs') ?? [];
		},
		showGraphValue() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'showGraphValue') ?? [];
		},
		showScale() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'showScale') ?? [];
		},
		disableGraphValue() {
			if (this.showGraphs !== null) {
				if (this.indexOfMetric !== null && this.showGraphs.length - 1 >= this.indexOfMetric) {
					const index = this.showGraphs.findIndex((el) => el.index === this.indexOfMetric);
					return index === -1 ? false : this.showGraphs[index].value === false;
				}
			}
			return false;
		},
		disableGraph() {
			if (this.showScale !== null) {
				if (this.indexOfMetric !== null && this.showScale.length - 1 >= this.indexOfMetric) {
					const index = this.showScale.findIndex((el) => el.index === this.indexOfMetric);
					return index === -1 ? false : this.showScale[index].value;
				}
			}
			return false;
		},
		disableScale() {
			if (this.showGraphs !== null) {
				if (this.indexOfMetric !== null && this.showGraphs.length - 1 >= this.indexOfMetric) {
					const index = this.showGraphs.findIndex((el) => el.index === this.indexOfMetric);
					return index === -1 ? false : this.showGraphs[index].value;
				}
			}
			return false;
		},
		metrics() {
			return this.widgetConfiguration?.data?.configuration?.metrics ?? null;
		},
		rawData() {
			return this.$store.getters['widgetData/rawData'](this.widgetInstanceId) ?? null;
		},
		filteredDimensions() {
			if (Object.keys(this.value).length > 0) {
				return Object.keys(this.value).filter((dimension) => {
					if (dimension.indexOf(this.indexOfDimension === null ? 'dimension' : 'Metric') === 0) {
						return true;
					}

					const column = this.getOption(dimension);

					return (!column.function || column.function === dimensionDefinition.NO_CHANGE)
						|| (column.function === dimensionDefinition.BUCKET_DATE)
						|| (column.function === dimensionDefinition.BUCKET_VALUE);
				});
			}
			return [];
		},
		selectedDataset() {
			return this.widgetConfiguration.data?.catalogItemId ?? this.widgetConfiguration.data?.datasetId ?? null;
		},
		datasets() {
			return this.$store.getters['storyDetail/story']?.datasets ?? [];
		},
		catalogItems() {
			return this.$store.getters['storyDetail/catalogItems'] ?? [];
		},
		allItems() {
			return this.datasets.concat(this.catalogItems);
		}
	},
	watch: {
		rawData(data) {
			if (data) {
				this.initialize();
			}
		},
		search(newVal) {
			if (newVal.length > 0) {
				this.loaded = this.dataLength;
			} else {
				this.loaded = 20;
			}
		},
		graphs(value) {
			this.updateVisualFeature(value, 'showGraphs');
		},
		graphsValue(value) {
			this.updateVisualFeature(value, 'showGraphValue');
		},
		colorScale(value) {
			this.updateVisualFeature(value, 'showScale');
		}
	},
	mounted() {
		this.initialize();
	},
	methods: {
		// eslint-disable-next-line complexity
		showColorPicker(dimension, key) {
			const index = (parseInt(key.substr(6, key.length), 10) - 1);
			const dimensionsCount = this.widgetConfiguration?.data?.configuration?.dimensions?.length ?? 0;
			const metricsCount = this.metrics?.length;
			return displayColorPicker(dimensionsCount, metricsCount, index, dimension, this.widgetType, this.indexOfMetric);
		},
		getFilteredEnums(dimension) {
			const returnValue = Object.keys(this.value[dimension]).slice(0, this.loaded)
				.filter((dimensionSearch) => dimensionSearch.toLowerCase().includes(this.search.toLowerCase()));

			if (this.indexOfMetric !== null) {
				return returnValue.filter((dim) => (parseInt(dim.substr(6, dim.length), 10) - 1) === this.indexOfMetric);
			}
			return returnValue;
		},
		updateVisualFeature(value, name) {
			let getValue = cloneDeep(this.getOption(name));
			if (Object.keys(getValue).length === 0) {
				getValue = [];
				getValue.push({
					index: this.indexOfMetric,
					value
				});
			} else {
				const foundIndex = getValue.findIndex((el) => el.index === this.indexOfMetric);
				if (foundIndex === -1) {
					getValue.push({
						index: this.indexOfMetric,
						value
					});
				} else {
					getValue[foundIndex].value = value;
				}
			}
			this.setOption(getValue, name);
		},
		// eslint-disable-next-line max-lines-per-function,max-statements
		initialize() {
			if (this.indexOfMetric !== null && this.widgetType === widgetTypes.DATA_TABLE) {
				this.graphs = this.showGraphs?.find((el) => el.index === this.indexOfMetric)?.value ?? false;
				this.colorScale = this.showScale?.find((el) => el.index === this.indexOfMetric)?.value ?? false;
				this.graphsValue = this.showGraphValue?.find((el) => el.index === this.indexOfMetric)?.value ?? false;
			}

			const [dimension] = this.dimensions ?? [];
			const enums = setupEnums(this.realValue, this.metric, dimension, this.metrics, this.rawData);
			if (enums) {
				this.value = enums;
				if (dimension && this.value[dimension]) {
					this.dataLength = Object.keys(this.value[dimension]).length;
				}
			}
		},
		loadMore() {
			this.isLoaded = true;
			this.loaded += 10;
		},
		loadLess() {
			this.loaded -= 10;
			if (this.loaded <= 20) {
				this.isLoaded = false;
			}
		},
		getOption(column) {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, column) ?? {};
		},
		getMetricPlaceholder(index) {
			const metric = this.metrics?.[index];
			// Find dataset in usage
			const dataset = this.allItems.find((item) => item.id === this.selectedDataset);
			return getMetricPlaceholderValue(metric, dataset);
		},
		updateEnum(dimension, key, value) {
			const keyAsString = key.toString();

			this.value[dimension][keyAsString] = value;
			const cleanedValue = removeOldFormat(this.realValue, dimension, keyAsString);
			const updatedEnumName = updateEnumName(dimension, keyAsString, value, cleanedValue);
			setOption(this.widgetInstanceId, this.name, updatedEnumName);
		}
	}
};
</script>

<style lang="scss" scoped>
.input-group {
	height: 36px;
}
.input-group-prepend,
.input-group-append {
	height: 100%;
}
</style>
