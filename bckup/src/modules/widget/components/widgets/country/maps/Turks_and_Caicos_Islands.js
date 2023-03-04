/* eslint-disable */
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([
			'exports',
			'echarts'
		], factory);
	} else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
		factory(exports, require('echarts'));
	} else {
		factory({}, root.echarts);
	}
}(this, (exports, echarts) => {
	const log = function(msg) {
		if (typeof console !== 'undefined') {
			console && console.error && console.error(msg);
		}
	}; if (!echarts) {
		log('ECharts is not Loaded'); return;
	} if (!echarts.registerMap) {
		log('ECharts Map is not loaded'); return;
	}echarts.registerMap('特克斯和凯科斯群岛', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Caicos and East Caicos'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@hAQcUf'],
						['@@ZdlAFfTrJÍIQA[h'],
						['@@dhPSu°M`]I¥WEM^klYFAVcAlWbQH']
					],
					encodeOffsets: [
						[
							[
								-73362,
								21811
							]
						],
						[
							[
								-73262,
								22026
							]
						],
						[
							[
								-73317,
								22263
							]
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Grand Turk'},
				geometry: {type: 'Polygon',
					coordinates: ['@@NbEpLlZN@JeYQh'],
					encodeOffsets: [
						[
							-72861,
							21960
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Middle Caicos'},
				geometry: {type: 'Polygon',
					coordinates: ['@@fF`]^MtB`HxQrAXT\\M\\F^[FiiFF{loDaeRki^WS{AgLIKqGKLw@OlPPajGj'],
					encodeOffsets: [
						[
							-73578,
							22376
						]
					]}},
			{type: 'Feature',
				properties: {name: 'North Caicos'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@r^n|NakWea[B'],
						['@@XxfRDKSAL`orkBUaAOmsCE|UxfD`zBdiA@u]MUeebyB[f'],
						['@@Nv`NIscO']
					],
					encodeOffsets: [
						[
							[
								-73867,
								22370
							]
						],
						[
							[
								-73779,
								22451
							]
						],
						[
							[
								-73802,
								22432
							]
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Provinciales and West Caicos'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@\\BvLTdVZAMcS¡e__I'],
						['@@jRDf]MCjdEfRDX_\\KthetItAj\\`HbtPWbKi[geKiP{U[ZUOGciJs\\USN']
					],
					encodeOffsets: [
						[
							[
								-74221,
								22142
							]
						],
						[
							[
								-74093,
								22279
							]
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Salt Cay'},
				geometry: {type: 'Polygon',
					coordinates: ['@@P~FE@'],
					encodeOffsets: [
						[
							-72929,
							21814
						]
					]}}
		],
		UTF8Encoding: true});
}));
