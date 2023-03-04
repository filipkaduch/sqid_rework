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
	}echarts.registerMap('根西', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Alderney'},
				geometry: {type: 'Polygon',
					coordinates: ['@@\\N@HTBPBVAND@JnDJCMKSAFEGGI@UMQA[IgDAL'],
					encodeOffsets: [
						[
							-2288,
							50903
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Guernsey'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@DFP@LCJDLRALMPJAJFTCJF@FZAXHBJNFRDPVRDNNLCJDXKHPARTADGNAHJbGDKEKE@EODEEEI@WCKGCMFEEK@IJEMYPOBGQIGBFNM@_SIFAHS@GDKIOC[DGEUFE@QFGASHQEKBSFEL'],
						['@@TFAKPMGIMECHDLKP']
					],
					encodeOffsets: [
						[
							[
								-2739,
								50620
							]
						],
						[
							[
								-2516,
								50668
							]
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Sark'},
				geometry: {type: 'Polygon',
					coordinates: ['@@JFVF@HKBGNXRCFFJJGNC@IRC@OIGU@MKCOMEEBIL'],
					encodeOffsets: [
						[
							-2440,
							50601
						]
					]}}
		],
		UTF8Encoding: true});
}));
