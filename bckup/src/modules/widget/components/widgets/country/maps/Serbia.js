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
	}echarts.registerMap('塞尔维亚', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Central Serbia'},
				geometry: {type: 'Polygon',
					coordinates: ['@@pìbÔiºGĎl°s¡eÁtðM°ÐgwŘl}ÊEL¦t¨ňY~Ü ®h_CwĮčÀ_tqHq¨N©gªyÔGìXô¨àDÆ`Įh´x°łE²cdÑ~mŘ@Ǽ{~N¡q¸L¸üÒøÔ\\~xÀLþÓÈuJì±No³kÕ·Eaq»KµÕĀap}SyWćXñUWħ]AÃ}āk¥ZÁì³GÏćOnwÀSfòa¾£j©¢¥ĠmÙÁk£ÅoG£Á[½pë[gsÙ§³gĝ{ÍSÞ¯XmñGm»ĻWzăS}wœ]ïaStß»£Eyuġxi `TĤ®qÐ®R\\[´ª¨ÏQāVs~QnçEņÓA£M¼@®·SmcÜëI¯|}_ñN¢¹ woÁH¯ÃGLUÏk¥·Ka}D{¦¥£]£{\\¯]Qàıã¥c¨½w¬o§nÛ`UùXjiÛjcÌÑURÍR½@z¤ôÂOld¾w¾M¨ĄY ­¦Ñċĸe¶ÚYàŜG®^c®õZkÏx[vZðÛMĳ°{°qðÊKvÖÀ¬AlK¶¦¶_T'],
					encodeOffsets: [
						[
							19817,
							45967
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Vojvodina'},
				geometry: {type: 'Polygon',
					coordinates: ['@@³wĭgÅ_ßCó§ëWÓH©zhMª§rGsr¿`ĭĎDx`g­ÛZ}Ňs§K¥F~ÉkŗxÏh¯ïNsfÂ¢¯tčk¹HÓjëaoĉry_³lē·K}¨żHÑGxFÎ{T²]Fö{ŜI|~uíAā^ś°q£D£x¬TðE\\¯ZirÏo¿d´½ÂW¬dBÊwà~´QÖH[Ś@GfèªK¤¤ÀtqlÆÂSÄdÀºiİ¤ä@¤~^ƈğ`¢àW½®fXâáØHzaFåÄÙ½Ėôó² Pä~v»ÔdZǆ§­¡cJ{óÎ·@ÔwLÍkJõ]@'],
					encodeOffsets: [
						[
							21871,
							45899
						]
					]}}
		],
		UTF8Encoding: true});
}));
