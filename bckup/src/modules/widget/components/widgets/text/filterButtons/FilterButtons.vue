<template>
	<div class="d-flex flex-column h-100">
		<h4 class="mx-auto mt-1 mb-0 justify-content-center">
			<strong>{{ title }}</strong>
		</h4>
		<div class="w-100 h-100 d-flex align-items-center">
			<div class="w-100">
				<p class="text-center m-0 mb-2" v-text="description" />
				<div class="btn-group d-flex flex-wrap justify-content-center align-items-center mx-2 widget-padding">
					<button
						v-for="(dimension, i) in widgetData?.data ?? []"
						:key="i"
						:class="{active: dimension.state}"
						:style="{backgroundColor: dimension.state ? getColor(current(i), true) : getColor(current(i))}"
						class="btn btn-dark filter-button px-3 py-2 mx-1 rounded">
						{{ (enums.column || {})[dimension.text] || dimension.text }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {configuration as conf, initialize, widgetGroup} from '@/modules/widget/components/widgets/text/filterButtons/consts';
import {dataTypes, isDataType} from '@/util/queryBuilder';
import {dimensionLabel} from '@/util/widgetData';
import {getFormatter} from '@/util/formatingUtil';
import {mapDimensionAxesConfiguration} from '@/util/widgetDataBinding';
import selectionMixin from '@/mixins/selectionMixin';
import widgetDataMixin from '@/mixins/widgetDataMixin';
import {widgetDefaultControls} from '@/util/consts/WidgetControls';

export default {
	name: 'FilterButtons',
	mixins: [
		widgetDataMixin,
		selectionMixin
	],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	widgetTypes() {
		return ['widget_filter_buttons'];
	},
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: conf,
			options: {
				...widgetDefaultControls,
				color: {
					type: 'widget_control_color_select',
					props: {
						rainbow: true,
						headingIcon: [
							'fal',
							'palette'
						],
						headingText: 't_colorSelect'
					}
				},
				description: {
					type: 'widget_control_text_input',
					default: '',
					props: {
						headingText: 't_Description'
					}
				}
			}
		};
	},
	widgetHooks: {
		dataAnalyze(data) {
			return {
				colors: {
					count: data.rows?.length
				}
			};
		},
		dataTransformation(data, configuration) {
			const dimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1');
			let temp = [];
			const column = mapDimensionAxesConfiguration(configuration.data.configuration.dimensions[0], configuration.data);
			if (dimensionIndex >= 0) {
				temp = data.rows
					.map((dim) => {
						const value = dim[dimensionIndex];
						const enums = configuration.options.enums?.dimension0 ?? {};
						let label = dimensionLabel(value);
						const columnFormatter = getFormatter(
							data.columns[dimensionIndex].dataType,
							'dimension0',
							'xAxis',
							configuration.options.enums,
							configuration.options.selectedFormat
						);

						if (columnFormatter !== null && isDataType(dataTypes.DATE_TYPE, column.datatype)) {
							label = columnFormatter(value[0]);
						}
						return {
							value,
							text: value !== null && value.length > 1 ? label : (enums[value] || label),
							state: false
						};
					});
			}
			return {
				data: temp,
				column
			};
		}
	},
	computed: {
		widgetData() {
			return this.preview ? null : this.$store.getters['widgetData/data'](this.widgetInstanceId);
		},
		column() {
			return this.widgetData?.column;
		},
		description() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'description');
		},
		filter() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'filter');
		},
		color() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'color') ?? 0;
		},
		limit() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'limit') ?? 30;
		},
		ordering() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'ordering');
		},
		enums() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'enums') ?? {};
		},
		selectedFormat() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'selectedFormat');
		},
		selectedDataset() {
			return (this.column && this.column.dataset) ? this.column.dataset : null;
		},
		dimensionColumns() {
			return this.column && this.column.column ? [this.column] : null;
		},
		selectedDimensions() {
			return this.widgetData?.data.filter((dim) => dim.state).map((dim) => [dim.value]) ?? [];
		}
	},
	watch: {
		selectedDimensions(value) {
			this.selected = value;
		}
	},
	methods: {
		current(i) {
			if (this.color === 'rainbow') {
				return i;
			}
			return this.color;
		}
	}
};
</script>
