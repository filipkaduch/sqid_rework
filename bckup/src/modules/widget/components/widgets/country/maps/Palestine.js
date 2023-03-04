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
	}echarts.registerMap('巴勒斯坦', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Gaza Strip'},
				geometry: {type: 'Polygon',
					coordinates: ['@@Ö«@UeekSaI}m[]ecQG[aeWqm_wR±M_qYU]_WmSukwÚGBaxrp àä`hljª'],
					encodeOffsets: [
						[
							35320,
							32354
						]
					]}},
			{type: 'Feature',
				properties: {name: 'West Bank'},
				geometry: {type: 'Polygon',
					coordinates: ['@@J`\\ztvXlNrE\\@rLL\\npZdfdjLrfPjpXATbXAXN\\G`WLHfA\\OJF`STbFZPRKrL^@^GZPVYPLNUP_IIXDTGZQNWWNMLsAggP[KJWs@uNUR]DWNWdoJSGmgSGDCLfbFN|@lO`cHURLRebR@nLFEh_¤AXPNO`JfGLYHFNcbE^LRZD\\NbbfrNdU\\UBHZFZRZ@@PTXCTQH\\nXRZd^^A^NjlfbhXZa`YjOnKXBR`AaDc`sGCKgPgnWZNtCXOURIZDTiUOLWIKFYESTWC[JWQUNUESTQSSTYMEFeHK[SB[SMVUAO]CLaW_KEZiYaGiMBBuLII_\\SEQZaKG@uKaQ@C[R_AU\\QDOQONYBeKUBURQGYPw}s»UMG¯Ks¯@sI][µ{c¿¡qEM_AsQÇF½@OoA]KY@UZgbQl'],
					encodeOffsets: [
						[
							35719,
							32148
						]
					]}}
		],
		UTF8Encoding: true});
}));
