<template>
	<div class="h-100">
		<ds-component-wrapper component-name="DeckGlWrapper" @init="chartInit" />
		<deck-gl-container ref="deck-gl-container" :haveTimeline="false" :readOnly="readOnly" />
	</div>
</template>
<script>
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/hexagon/consts';
import DeckGlContainer from '../DeckGlContainer.vue';
import deckglMixin from '@/mixins/deckglMixin';
import selectionMixin from '@/mixins/selectionMixin';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

export default {
	name: 'DeckGlHeatmap',
	components: {
		DeckGlContainer
	},
	mixins: [
		deckglMixin,
		selectionMixin
	],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			layer: null
		};
	},
	widgetTypes() {
		return ['widget_heatmap_map'];
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
					default: 80,
					props: {
						headingText: 't_Radius',
						maxValue: 300
					}
				},
				'mapOptions.detail': {
					type: 'widget_control_slider',
					default: 4,
					props: {
						headingText: 't_Detail',
						maxValue: 6
					}
				}
			}
		};
	},
	widgetHooks: {
		dataAnalyze(data) {
			return {
				colors: {
					count: data.rows.length
				}
			};
		},
		dataTransformation(data) {
			const latitudeDimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1Lat');
			const longitudeDimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1Lon');
			const metricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');
			// eslint-disable-next-line multiline-ternary
			return (latitudeDimensionIndex < 0 || longitudeDimensionIndex < 0 || metricIndex < 0) ? [] : data.rows.map((entry) => ({
				COORDINATES: [
					entry[longitudeDimensionIndex] / 1e6,
					entry[latitudeDimensionIndex] / 1e6
				],
				WEIGHT: entry[metricIndex]
			}));
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
			this.setZoomAndDetailToDataConfiguration(this.mapOptions.detail, value.zoom);
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
					if (newValue.radius && this.layer) {
						this.layer.setProps({radiusPixels: newValue.radius});
					}
					if (newValue.detail) {
						this.setZoomAndDetailToDataConfiguration(newValue.detail, this.position.zoom);
					}
				}
			},
			immediate: true
		}
	},
	methods: {
		updateDynamicFilter() {
			const bounds = this.map.getBounds();

			/* eslint-disable no-underscore-dangle */
			const filter = [
				bounds._sw.lng,
				bounds._ne.lng,
				bounds._ne.lat,
				bounds._sw.lat
			];
			/* eslint-enable no-underscore-dangle */

			this.setFilter([
				[filter],
				[filter]
			], [
				'Dimension1',
				'Dimension1'
			]);
		},
		setZoomAndDetailToDataConfiguration(detail, zoom) {
			if (detail && zoom) {
				const cloneConfiguration = cloneDeep(this.widgetConfiguration);
				cloneConfiguration.data.configuration.dimensions[0].zoom = detail + zoom;
				this.$store.dispatch('widgetInstances/setConfiguration', {
					widgetInstanceId: this.widgetInstanceId,
					configuration: cloneConfiguration
				});
			}
		},
		createLayers() {
			this.layer = new this.imports.MapboxLayer({
				type: this.imports.HeatmapLayer,
				id: 'heatmap',
				radiusPixels: (this.mapOptions.radius || 300),
				// colorRange: this.colorRange,
				threshold: 0.03,
				opacity: 1,
				getPosition: (data) => data.COORDINATES,
				getWeight: (data) => data.WEIGHT
			});

			this.map.addLayer(this.layer);
		}
	}
};
</script>

<style scoped>

</style>
