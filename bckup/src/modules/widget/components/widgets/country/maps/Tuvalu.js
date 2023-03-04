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
	}echarts.registerMap('吐瓦鲁', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Nanumanga'},
				geometry: {type: 'Polygon',
					coordinates: ['@@LS@QOQKVPb'],
					encodeOffsets: [
						[
							180553,
							-6424
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Niulakita'},
				geometry: {type: 'Polygon',
					coordinates: ['@@HRVpVh\\dppl`nZ`NxPLlBtCKfKpWmvs`kR_VmTF{@mKOqOcWikwqmeYaqOcGEF{N`kZ_Xcds[xI\\QCz'],
					encodeOffsets: [
						[
							183567,
							-11045
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Niutao'},
				geometry: {type: 'Polygon',
					coordinates: ['@@^CAOYAAV'],
					encodeOffsets: [
						[
							181594,
							-6249
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Vaitupu'},
				geometry: {type: 'Polygon',
					coordinates: ['@@PCTSGQ]bBH'],
					encodeOffsets: [
						[
							182952,
							-7639
						]
					]}}
		],
		UTF8Encoding: true});
}));
