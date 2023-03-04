<template>
	<div class="h-100">
		<ds-component-wrapper component-name="DeckGlWrapper" @init="chartInit" />
		<deck-gl-container ref="deck-gl-container" :haveTimeline="allValues.length > 0" :readOnly="readOnly" />
		<app-timeline-slider
			v-if="allValues.length > 0"
			:values="allValues"
			:map="true"
			:widgetInstanceId="widgetInstanceId"
			@update="updateFilterPosition" />
	</div>
</template>

<script>
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/scatterMap/consts';
import AppTimelineSlider from '@/components/story/AppTimelineSlider.vue';
import DeckGlContainer from '../DeckGlContainer.vue';
import deckglMixin from '@/mixins/deckglMixin';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

export default {
	name: 'DeckGlScatter',
	components: {
		AppTimelineSlider,
		DeckGlContainer
	},
	mixins: [deckglMixin],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			layer: null,
			allValues: [],
			filterPosition: 0
		};
	},
	widgetTypes() {
		return ['widget_map_scatter'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup,
			configuration: config,
			initialize,
			renderOptions: {
				dragWithoutOverlay: false,
				noLoadingOverlay: true
			},
			options: {
				'mapOptions.radius': {
					type: 'widget_control_slider',
					default: 10,
					needReload: false,
					props: {
						headingText: 't_Radius',
						maxValue: 5000,
						mapType: true
					}
				},
				'mapOptions.radiusMinPixels': {
					type: 'widget_control_slider',
					default: 2,
					needReload: false,
					props: {
						headingText: 't_MinPointSize',
						maxValue: 10,
						mapType: true
					}
				},
				'mapOptions.opacity': {
					type: 'widget_control_slider',
					default: 50,
					needReload: false,
					props: {
						headingText: 't_Opacity',
						minValue: 1,
						maxValue: 100
					}
				}
			}
		};
	},
	widgetHooks: {
		dataAnalyze() {
			return {
				colors: {
					count: 1
				}
			};
		},
		dataTransformation(data, configuration, context) {
			const latitudeDimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1Lat');
			const longitudeDimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1Lon');
			const metricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');
			const timelineIndex = data.columns.map((column) => column.reference).indexOf('Timeline');

			if (latitudeDimensionIndex >= 0 && longitudeDimensionIndex >= 0 && metricIndex >= 0) {
				const source = data.rows.filter((entry) => entry[longitudeDimensionIndex] !== null && entry[latitudeDimensionIndex] !== null);
				return source.map((entry, index, arr) => {
					// Caluclate cumulative sum for items (BE support missing rn)
					const cumulativeSum = arr.filter((item, itemIndex) => item[longitudeDimensionIndex] === entry[longitudeDimensionIndex]
						&& item[latitudeDimensionIndex] === entry[latitudeDimensionIndex]
						&& itemIndex < index)
						.map((item) => item[metricIndex])
						.reduce((prev, curr) => prev + curr, 0);

					return {
						COORDINATES: [
							entry[longitudeDimensionIndex] / 1e6,
							entry[latitudeDimensionIndex] / 1e6
						],
						WEIGHT: entry[metricIndex] + cumulativeSum,
						...(timelineIndex > 0 ? {TIMESTAMP: entry[timelineIndex]} : {}),
						COLOR: context.colors.theme[0]
					};
				});
			}
			return [];
		}
	},
	watch: {
		position(value) {
			const newPosition = {
				...(this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'mapOptions')),
				...value
			};
			this.$store.dispatch('widgetInstances/setOption', {
				widgetInstanceId: this.widgetInstanceId,
				optionName: widgetOptionName.MAP_OPTIONS,
				value: newPosition
			});
			this.setZoomToDataConfiguration(value.zoom);
		},
		filterPosition(newValue) {
			this.setFilteredValues(newValue);
		},
		mapOptions: {
			handler(newValue, oldValue) {
				if (!isEqual(newValue, oldValue)) {
					if (!this.position.zoom && newValue.zoom) {
						this.position = {
							center: newValue.center ?? [
								46,
								54
							],
							zoom: newValue.zoom ?? 0.3,
							pitch: newValue.pitch ?? 0,
							bearing: newValue.bearing ?? 0
						};
					}
					if (this.layer !== null) {
						if (newValue.zoom && this.layer) {
							this.setZoomToDataConfiguration(this.position.zoom);
						}

						if (newValue.radius && this.layer) {
							this.layer.setProps({radiusScale: (newValue.radius)});
						}

						if (newValue.opacity && this.layer) {
							this.layer.setProps({opacity: newValue.opacity / 100});
						}

						if (newValue.radiusMinPixels && this.layer) {
							this.layer.setProps({radiusMinPixels: newValue.radiusMinPixels});
						}
					}
				}
			},
			immediate: true
		},
		data() {
			this.updateSliderValues();
		}
	},
	methods: {
		createLayers() {
			this.layer = new this.imports.MapboxLayer({
				type: this.imports.ScatterplotLayer,
				id: 'scatterplot-layer',
				data: this.data,
				opacity: this.mapOptions?.opacity / 100,
				radiusScale: this.mapOptions?.radius ?? 10,
				getRadius: (data) => data.WEIGHT,
				radiusMinPixels: this.mapOptions?.radiusMinPixels ?? 2,
				getPosition: (data) => data.COORDINATES,
				getFillColor: (data) => this.getColorValue(data.COLOR),
				transitions: {
					getRadius: {
						type: 'spring',
						stiffness: 0.01,
						damping: 0.85,
						// grow from size 0
						enter: () => [0]
					}
				}
			});

			this.map.addLayer(this.layer);
		},
		setZoomToDataConfiguration(zoom) {
			if (zoom) {
				const cloneConfiguration = cloneDeep(this.widgetConfiguration);
				cloneConfiguration.options.mapOptions.zoom = zoom;
				this.$store.dispatch('widgetInstances/setConfiguration', {
					widgetInstanceId: this.widgetInstanceId,
					configuration: cloneConfiguration
				});
			}
		},
		updateSliderValues() {
			let arrayOfValues = [];
			if (this.data) {
				// Get all distinct timestamps;
				arrayOfValues = [...new Set(this?.data.filter((entry) => entry?.TIMESTAMP).map((item) => item.TIMESTAMP))];
			}
			this.allValues = arrayOfValues;
			this.setFilteredValues(0);
		},
		updateFilterPosition(value) {
			this.filterPosition = value;
		},
		setFilteredValues(positionIndex) {
			if (this.layer && this.data) {
				const datatoUse = this?.data.filter((item) => new Date(item.TIMESTAMP) <= new Date(this.allValues[positionIndex]));
				this.layer.setProps({data: datatoUse});
			}
		},
		getColorValue(color) {
			const rgb = color.substring(color.indexOf('(') + 1, color.indexOf(')')).split(',');
			return rgb.map((item) => parseInt(item, 10));
		}
	}
};
</script>
