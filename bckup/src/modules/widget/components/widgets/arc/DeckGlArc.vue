<template>
	<div class="h-100">
		<ds-component-wrapper component-name="DeckGlWrapper" @init="chartInit" />
		<deck-gl-container ref="deck-gl-container" :haveTimeline="false" :readOnly="readOnly" />
	</div>
</template>

<script>
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/arc/consts';
import DeckGlContainer from '../DeckGlContainer.vue';
import deckglMixin from '@/mixins/deckglMixin';
import selectionMixin from '@/mixins/selectionMixin';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

export default {
	name: 'DeckGlArc',
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
	widgetTypes() {
		return ['widget_arc_map'];
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
				mapOptions: {
					type: 'widget_control_dummy'
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
			const latSrcIndex = data.columns.map((column) => column.reference).indexOf('Dimension1Lat');
			const lonSrcIndex = data.columns.map((column) => column.reference).indexOf('Dimension1Lon');
			const latDstIndex = data.columns.map((column) => column.reference).indexOf('Dimension2Lat');
			const lonDstIndex = data.columns.map((column) => column.reference).indexOf('Dimension2Lon');
			const metricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');

			if (latSrcIndex >= 0 && lonSrcIndex >= 0 && metricIndex >= 0 && latDstIndex >= 0 && lonDstIndex >= 0) {
				const filtered = [];

				for (const entry of data.rows) {
					const latSrc = entry[latSrcIndex] / 1000000;
					const lonSrc = entry[lonSrcIndex] / 1000000;
					const latDst = entry[latDstIndex] / 1000000;
					const lonDst = entry[lonDstIndex] / 1000000;
					const metric = entry[metricIndex];

					filtered.push({
						source: [
							lonSrc,
							latSrc
						],
						target: [
							lonDst,
							latDst
						],
						metric
					});
				}

				return filtered;
			}
			return [];
		}
	},
	data() {
		return {
			unfilteredDynamicFilter: true,
			brushingExtension: null,
			layer: null,
			lastClickTime: 0
		};
	},
	watch: {
		mapOptions: {
			handler(newValue, oldValue) {
				if (!isEqual(newValue, oldValue)) {
					if (!this.position.zoom && newValue?.zoom) {
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
							this.setZoomToDataConfiguration(this.position.zoom, false);
						}
					}
				}
			},
			immediate: true
		}
	},
	methods: {
		createLayers() {
			this.map.on('click', (evt) => {
				const delta = evt.originalEvent.timeStamp - this.lastClickTime;

				if (delta > 500) {
					this.updateDynamicFilter();
				}

				this.lastClickTime = evt.originalEvent.timeStamp;
			});

			let max = 0;
			if (this.data) {
				for (const entry of this.data) {
					max = entry?.metric > max ? entry?.metric : max;
				}
			}

			this.layer = new this.imports.MapboxLayer({
				type: this.imports.ArcLayer,
				id: 'arc-layer',
				getSourcePosition: (data) => data.source,
				getTargetPosition: (data) => data.target,
				getWidth: (data) => 0.5 + ((data.metric / max) * 1.5),
				getSourceColor: () => [
					255,
					0,
					0
				],
				getTargetColor: () => [
					155,
					0,
					0
				],
				widthScale: 2.5,
				getHeight: 1,
				opacity: 0.5
			});

			this.map.addLayer(this.layer);
		},
		updateDynamicFilter() {
			const bounds = this.map.getBounds();

			/* eslint-disable no-underscore-dangle */
			const filter = [
				bounds._sw.lng,
				bounds._ne.lng,
				bounds._ne.lat,
				bounds._sw.lat
			];

			this.setFilter([
				[filter],
				[filter]
			], [
				'Dimension1',
				'Dimension1'
			]);
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
		}
	}
};
</script>
