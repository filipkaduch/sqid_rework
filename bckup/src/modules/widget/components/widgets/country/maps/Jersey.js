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
	}echarts.registerMap('泽西', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Jersey'},
				geometry: {type: 'Polygon',
					coordinates: ['@@NPbAHHNIRARML@bFLATRdBPKdBJIZBHJNCTQDKNCdDJFNKTATEDKKUNSLGWIIULeMEYHQBmK[X]B@MQBJNMNBFYNeF[CMGAYLMGKOLWADRYLUO]EOBULNFPTF^K`W\\UPCH'],
					encodeOffsets: [
						[
							-2308,
							50432
						]
					]}}
		],
		UTF8Encoding: true});
}));
