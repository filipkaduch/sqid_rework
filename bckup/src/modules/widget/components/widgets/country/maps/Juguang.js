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
	}echarts.registerMap('undefined', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Juguang'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@^fTMk[ED'],
						['@@hDQ]UZ']
					],
					encodeOffsets: [
						[
							[
								122840,
								26574
							]
						],
						[
							[
								122803,
								26604
							]
						]
					]}}
		],
		UTF8Encoding: true});
}));
