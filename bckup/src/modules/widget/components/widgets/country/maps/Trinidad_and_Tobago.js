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
	}echarts.registerMap('特立尼达和多巴哥', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Trinidad and Tobago'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@CbRBFSSO'],
						['@@`HXZdPBVlLVNV@RPRGxlPEjPXYlPGZRH^ERYEUUYRwWe]AQWeLWOSaeOmoeKILy@QYWS[D]R]_IBW_ASSK]ACRwJ[GF\\ETr@jj@VXNNTEL^Lnp'],
						['@@nHhZPXC\\jDfXªJ\\AbTdT`fM^PZZDxQhSpEfF¦xR^DXZ`WnPPO|ohBhEzLlLXTGH@`TZFbOdQYtSFC`KRiVad§PIP[QBQ]OG^iA]ZLPOPFNnHRZ\\LPT|BRE^NhEVL¦@VVVAbHVURJETb\\LMZP^HhnZMSjBLGrAºJr\\X@^VzC¦Z\\GLXFNK®GRR^MXBGWJM[UWEQiCe]QaeM_SQEQWCMHUIUqFkX³DTWCIMWCE_Lb·bXen@@S[B[{CGLE_QHWAoQ_OSO¯oyHiMuL[LWEcLkEYIYAMFOFISDsIeCSLYESJ{EYDMqWKJa@ehsN{@GcOcXoEkYwS]UeOkFILFV\\XL\\J'],
						['@@RCH[WIUNT\\']
					],
					encodeOffsets: [
						[
							[
								-63237,
								10939
							]
						],
						[
							[
								-62201,
								11521
							]
						],
						[
							[
								-63359,
								10335
							]
						],
						[
							[
								-63169,
								10959
							]
						]
					]}}
		],
		UTF8Encoding: true});
}));
