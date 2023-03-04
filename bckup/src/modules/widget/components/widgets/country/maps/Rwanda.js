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
	}echarts.registerMap('卢旺达', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Amajvepfo'},
				geometry: {type: 'Polygon',
					coordinates: ['@@~D~oRN@]|qJkOR]vjEÒ±TsDEFBDCEID@XåuaLc~YA{GmR{õCo_VaZ³@sWO[oTwLµe»}£euEU`}QQ}]WY£~kAykyLÉm}t³Ca__WofZCajX@p¨Y]²iJHc^}LEbXtXMrmp|~DpdKZÊ¢ÂWôQ\\zpPG®VNCO^LôU'],
					encodeOffsets: [
						[
							30371,
							-1775
						]
					]}},
			{type: 'Feature',
				properties: {name: 'East Province'},
				geometry: {type: 'Polygon',
					coordinates: ['@@Dp|öQHn|Bh`bMÊZnxOnlVTÎIx^^pM|WFJej\\df@E~iM\\TOlujc]FmO]§ÔČOxVdGtARdnVbl^ZIxjOJfbh]]g@kbwDu_btdïYb®W²µLËĄŅeAaVĕoĽ°ýZKpsYAqauAV@mEimyR}ru]Qism^i·fEXnUhC|}SgdyaMsåkBonYIKu]K[·S}^]|udaAb'],
					encodeOffsets: [
						[
							30679,
							-2383
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Iburengerazuba'},
				geometry: {type: 'Polygon',
					coordinates: ['@@­¤]rDiBI£NIp_VKóP]DUMH­oO[yRóXÁÉ¡YcLo}Co{nqNWWsFa~Kd]GjI^±Zo§W@KxZlSuZw@[haDe_foSYoPuYgPqqy|iV_S{jgDklRd]ì{vhH|sTG~j \\PäZpj¢ČTx@cÞuÚCRhöĺA|ZRX~|v¬bVRxöF'],
					encodeOffsets: [
						[
							30158,
							-1542
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Kigali City'},
				geometry: {type: 'Polygon',
					coordinates: ['@@fiIXEN{]o]JwSÍkUmwPmÉYaNg_}ZKdvbWæC@FJCDEACFStCvXtZ\\yvdLdX^K~f@°§zG'],
					encodeOffsets: [
						[
							30974,
							-1890
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Majyaruguru'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ÄhTTjrÔBL\\btM\\cl^rjQjfLJÏXdmæd~KGjfb¨Ó^Pn^EdviPk[SNjF}e@[cyH¯¨e@}]LWKcuc[zsYWDuÑ²FuiQ^PIl{r@^QM}p}Co`JMJ¤AjqC£^®'],
					encodeOffsets: [
						[
							30158,
							-1542
						]
					]}}
		],
		UTF8Encoding: true});
}));
