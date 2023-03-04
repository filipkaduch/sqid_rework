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
	}echarts.registerMap('马恩岛', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Ayre'},
				geometry: {type: 'Polygon',
					coordinates: ['@@nVtNLVJCAmI]]wC[gKCUZ[@aW}kISUIo@QpHT[PPNKRPxdNfwHAT'],
					encodeOffsets: [
						[
							-4607,
							55689
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Garff'},
				geometry: {type: 'Polygon',
					coordinates: ['@@VJJT~lX@bY\\DVhLDSZ]tKzGPM]]eW[_YSCWqSOWDOZK__gKKFD^[foJSt'],
					encodeOffsets: [
						[
							-4580,
							55545
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Glenfaba'},
				geometry: {type: 'Polygon',
					coordinates: ['@@j[FMfBvWIYQSqaoowA[s[qCYIFjSTDTTH^nGXbXZDJl'],
					encodeOffsets: [
						[
							-4730,
							55566
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Michael'},
				geometry: {type: 'Polygon',
					coordinates: ['@@tpVh`jVTVnbZ~XBSxGMewcOLQOM\\OGSQCD_wOWQuXeAENi\\'],
					encodeOffsets: [
						[
							-4730,
							55566
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Middle'},
				geometry: {type: 'Polygon',
					coordinates: ['@@pprbRTJZXRxPC`RDRop@TspI\\eC]LECKsIUBaUHc]G_QeDOWUGSUo@}SBb\\^Gja\\EZ'],
					encodeOffsets: [
						[
							-4723,
							55470
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Rushen'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@LJnFFG[YS@OR'],
						['@@ZJrDt\\\\xBFYb[Hi[]AaCM]IyG]OcA@NaVo@]KFOcCCMaASK]PLVPDb`_JXVdH`p']
					],
					encodeOffsets: [
						[
							[
								-4946,
								55351
							]
						],
						[
							[
								-4847,
								55434
							]
						]
					]}}
		],
		UTF8Encoding: true});
}));
