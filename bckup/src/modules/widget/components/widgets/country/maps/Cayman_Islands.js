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
	}echarts.registerMap('开曼群岛', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Cayman Islands'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@lqxG~bFX~JGh[lgjJpM¬RAZWIm_@SNMEwiAqR}P]YbPXCfLrUvuRH\\vXpSaUhOa'],
						['@@RRJ¤ZT[G¡m[FOUcMiARbxZ'],
						['@@hXtNnrLtbpJXYog©[­kA']
					],
					encodeOffsets: [
						[
							[
								-83322,
								19786
							]
						],
						[
							[
								-81991,
								20160
							]
						],
						[
							[
								-81808,
								20161
							]
						]
					]}}
		],
		UTF8Encoding: true});
}));
