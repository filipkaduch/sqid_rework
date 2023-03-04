<template>
	<div class="h-100">
		<ds-component-wrapper component-name="DeckGlWrapper" @init="chartInit" />
		<deck-gl-container ref="deck-gl-container" :haveTimeline="false" :readOnly="readOnly" />
	</div>
</template>

<script>
import {configuration as config, hexagonColorRange, initialize, widgetGroup} from '@/modules/widget/components/widgets/hexagon/consts';
import DeckGlContainer from '../DeckGlContainer.vue';
import deckglMixin from '@/mixins/deckglMixin';
import isEqual from 'lodash/isEqual';

export default {
	name: 'DeckGlHexagon',
	components: {
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
			colorRange: hexagonColorRange
		};
	},
	widgetTypes() {
		return ['widget_hexagon_map'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: {...config},
			renderOptions: {
				dragWithoutOverlay: false,
				noLoadingOverlay: true
			},
			options: {
				'mapOptions.radius': {
					type: 'widget_control_slider',
					default: 100,
					props: {
						headingText: 't_Radius',
						maxValue: 200000,
						mapType: true
					}
				},
				'mapOptions.coverage': {
					type: 'widget_control_slider',
					default: 100,
					props: {
						headingText: 't_Coverage',
						maxValue: 100
					}
				},
				'mapOptions.elevation': {
					type: 'widget_control_slider',
					default: 250,
					props: {
						headingText: 't_Elevation',
						maxValue: 1000
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
		dataTransformation(data) {
			const latitudeDimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1Lat');
			const longitudeDimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1Lon');
			const metricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');
			if (latitudeDimensionIndex >= 0 && longitudeDimensionIndex >= 0 && metricIndex >= 0) {
				const source = data.rows.filter((entry) => entry[longitudeDimensionIndex] !== null && entry[latitudeDimensionIndex] !== null);
				return source.map((entry) => ({
					position: [
						entry[longitudeDimensionIndex] / 1e6,
						entry[latitudeDimensionIndex] / 1e6
					],
					metric: entry[metricIndex]
				}));
			}
			return [];
		}
	},
	watch: {
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
						if (newValue.zoom) {
							this.setZoomToDataConfiguration(this.position.zoom);
						}
						if (newValue.radius && this.layer) {
							this.layer.setProps({radius: newValue.radius});
						}
						if (newValue.coverage && this.layer) {
							this.layer.setProps({coverage: newValue.coverage / 100});
						}
						if (newValue.elevation && this.layer) {
							this.layer.setProps({elevationScale: newValue.elevation});
						}
					}
				}
			},
			immediate: true
		}
	},
	methods: {
		createLayers() {
			const material = {
				diffuse: 0.6
			};
			this.layer = new this.imports.MapboxLayer({
				type: this.imports.HexagonLayer,
				id: 'hexagon',
				elevationRange: [
					0,
					500
				],
				colorRange: this.colorRange,
				elevationScale: this.mapOptions?.elevation,
				extruded: true,
				opacity: 1,
				material,
				radius: this.mapOptions?.radius,
				coverage: this.mapOptions?.coverage / 100,
				getColorValue: (points) => points.reduce((prev, currentPoint) => prev + currentPoint.metric, 0),
				getElevationValue: (points) => points.reduce((prev, currentPoint) => prev + currentPoint.metric, 0)
			});

			this.map.addLayer(this.layer);
		}
	}
};
</script>
