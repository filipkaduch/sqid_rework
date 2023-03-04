<script>
import {ArcLayer, IconLayer, ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import {HeatmapLayer, HexagonLayer} from '@deck.gl/aggregation-layers';
import {MapboxLayer} from '@deck.gl/mapbox';
import mapboxgl from 'mapbox-gl';
import polyfillContext from '@luma.gl/webgl2-polyfill';

export default {
	name: 'DeckGlWrapper',
	emits: ['init'],
	mounted() {
		this.$emit('init', {
			mapboxgl,
			polyfillContext,
			HeatmapLayer,
			HexagonLayer,
			ArcLayer,
			IconLayer,
			MapboxLayer,
			ScatterplotLayer,
			TextLayer
		});
	},
	render() {
		return null;
	}
};
</script>

<style>
@import url('../../../../../node_modules/mapbox-gl/dist/mapbox-gl.css');
</style>
