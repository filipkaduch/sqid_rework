<template>
	<div>
		<hr role="separator" aria-orientation="horizontal" class="dropdown-divider w-100">
		<div class="mb-2 text-body d-flex mt-2">
			<span class="options-grey-style">
				{{ $t(headingText) }}
			</span>
			<fa-icon class="ml-auto my-auto" style="cursor: pointer" :icon="['fal', 'times']" @click="$emit('update:value', [])" />
		</div>

		<div>
			<div v-for="(item, index) in valueToUse" :key="index" class="d-flex mb-1">
				<div class="input-group border rounded">
					<div class="input-group-prepend">
						<button
							style="width: 5.5rem; background-color: #F7F8FA; height: 34px;"
							class="btn fn-span border-0 d-inline-block p-0 m-0 text-center btn-secondary ordering-handle"
							@click="toggleOrder(index)">
							{{ item.order }}
						</button>
					</div>

					<bootstrap-select
						class="h-100 border-0" :options="options" :value="item.columnAlias"
						text-field="text" value-field="value" @input="updateAxisName(index, $event.target.value)" />
				</div>

				<div class="p-0 ml-2">
					<button class="btn btn-white m-0 p-0 collapseBtnSize" @click="deleteMetric(index, $event)">
						<ds-icon class="mr-2 ml-2" name="icon bin" alt="Delete" />
					</button>
				</div>
			</div>

			<div class="my-2 mr-1">
				<button
					class="btn btn-add-section border m-0 bg-white"
					style="color: #2D3038;"
					@click="addMetric">
					<fa-icon :icon="['fas', 'plus']" style="color:#AAABAE;" />
					Add Column
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import {metricLabel} from '@/util/widgetData';
import {ordering} from '@/util/queryBuilder';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';
import clone from 'lodash/clone';
import BootstrapSelect from '@/components/temporary/BootstrapSelect.vue';

export default {
	name: 'Ordering',
	components: {BootstrapSelect},
	mixins: [widgetControlComponentMixin],
	props: {
		value: {
			type: Array,
			default: null
		},
		filterDatasetsByColumnSelect: {
			type: String,
			default: null
		}
	},
	emits: ['update:value'],
	data() {
		return {
			valueToUse: []
		};
	},
	computed: {
		datasets() {
			return this.$store.getters['storyDetail/story']?.datasets ?? [];
		},
		catalogItems() {
			return this.$store.getters['storyDetail/catalogItems'] ?? [];
		},
		columns() {
			return this.datasets.concat(this.catalogItems);
		},
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		selectedDataset() {
			return this.widgetConfiguration.data?.catalogItemId ?? this.widgetConfiguration.data?.datasetId ?? null;
		},
		options() {
			const options = this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId).data.configuration;
			const temp = [];

			let datasetColumns = null;

			if (this.widgetConfiguration?.data?.catalogItemId) {
				datasetColumns = this.catalogItems.find((catalog) => catalog.id === this.widgetConfiguration.data.catalogItemId).attributes;
			} else if (this.widgetConfiguration?.data?.datasetId) {
				datasetColumns = this.datasets.find((dataset) => dataset.id === this.widgetConfiguration.data.datasetId).columns;
			}

			let metricIndex = 0;
			let dimensionIndex = 0;

			Object.keys(options).forEach((key) => {
				const option = cloneDeep(options[key]);
				if (isObject(option) && option.length) {
					option[0].displayName = datasetColumns.find((column) => column.name === option[0]?.column)?.displayName ?? null;
				}
				if (key !== 'timeline' && (option?.column || (Array.isArray(option) && option[0]?.column))) {
					if (key.startsWith('metric')) {
						// metric
						if (Array.isArray(options[key])) {
							options[key].forEach((el, index) => {
								temp.push({
									text: metricLabel(option, index),
									value: `Metric${index + 1}`
								});
							});
						} else {
							temp.push({
								text: metricLabel(Array.isArray(option) ? option : [option], metricIndex),
								value: `Metric${metricIndex + 1}`
							});
						}
						metricIndex += 1;
					} else {
						// eslint-disable-next-line no-lonely-if
						if (key === 'columns') {
							option.forEach((opt, index) => {
								temp.push({
									text: opt?.displayName ?? opt.column,
									value: `Dimension${index + 1}`
								});
							});
						} else if (Array.isArray(option) ? dimensionIndex < option.length : true) {
							const tmpText = Array.isArray(option)
								? (option[dimensionIndex]?.displayName ?? option[dimensionIndex].column)
								: (option?.displayName ?? option.column);
							temp.push({
								text: tmpText,
								value: `Dimension${dimensionIndex + 1}`
							});
							dimensionIndex += 1;
						}
					}
				}
			});
			return temp;
		}
	},
	watch: {
		value: {
			immediate: true,
			handler(newVal) {
				this.valueToUse = newVal;
			}
		}
	},
	methods: {
		updateAxisName(index, axisName) {
			const tmpValue = clone(this.valueToUse);
			const item = tmpValue[index];
			tmpValue.splice(index, 1, {
				columnAlias: axisName,
				order: item.order
			});
			this.$emit('update:value', tmpValue);
		},
		toggleOrder(index) {
			const tmpValue = clone(this.valueToUse);
			const item = tmpValue[index];
			tmpValue.splice(index, 1, {
				columnAlias: item.columnAlias,
				order: item.order === ordering.ASC ? ordering.DESC : ordering.ASC
			});

			this.$emit('update:value', tmpValue);
		},
		addMetric() {
			this.$emit('update:value', this.valueToUse.concat([
				{
					columnAlias: '',
					order: 'ASC'
				}
			]));
		},
		deleteMetric(index) {
			const tmpValue = clone(this.valueToUse);
			tmpValue.splice(index, 1);
			this.$emit('update:value', tmpValue);
		}
	}
};
</script>

<style>
	.input-group {
		height: 36px;
	}
</style>
