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
	}echarts.registerMap('南乔治亚和南桑威奇群岛', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'South Georgia'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@­KD|ªo'],
						['@@gkR\\t®zÖHÀeî`LtĔ¦DZW¤B¶NVg¥UJ}seĢJZRÈS]¬VrhÂoWC@èrb¹waoƂ²ÞWQgPªDW²KÉ¿Iv`ðZtiĕ¯ÃDSYÎsHÄx¬HhYiA¡¼\\]`pu~dÒMHyªufwoR]ÎJ^uik{¤NªuTBJkw]boÌX]Üzéf]X§z}tãIm]ïSÔiqįa^Nj÷R}r_²{bEhxUãnurJăSRFj£CħxJvHFrhkÿxj\\Cgb³DtgmWĩHIfîT[p«VFtŐhybęOËXùA\\wÙcÉZq¾nYV©QQdâ~qùmEybcÃ\\@']
					],
					encodeOffsets: [
						[
							[
								-37919,
								-55805
							]
						],
						[
							[
								-38880,
								-55344
							]
						]
					]}},
			{type: 'Feature',
				properties: {name: 'South Sandwich Islands'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@b}E¡hBbÒE'],
						['@@©yzäb'],
						['@@`]èmBguÛS×AZþ'],
						['@@ºTêeMyRÅ­fGífdEjvA'],
						['@@JtrQbs¢c[åIj'],
						['@@¡NLx\\Ø[Is·Q'],
						['@@I^CypT^'],
						['@@zZt]su']
					],
					encodeOffsets: [
						[
							[
								-27809,
								-60853
							]
						],
						[
							[
								-27982,
								-60839
							]
						],
						[
							[
								-27168,
								-60383
							]
						],
						[
							[
								-27052,
								-59813
							]
						],
						[
							[
								-27173,
								-59199
							]
						],
						[
							[
								-27860,
								-58091
							]
						],
						[
							[
								-27384,
								-58443
							]
						],
						[
							[
								-28235,
								-57670
							]
						]
					]}}
		],
		UTF8Encoding: true});
}));
