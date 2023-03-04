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
	}echarts.registerMap('巴拉圭', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Región Occidental'},
				geometry: {type: 'Polygon',
					coordinates: ['@@gå»¬PP³¼±¡ytXĽ¤±B£TßK}ufÁxOb¸Yt©}§°³cìÝ¤Pĉ¾m²ÁJw¼ZÏ}Û®ÿÖü½HÛoVÌirU}e¢ÉÃ@e¼±Zë|uIãx±w{YÛÃmX{Ég¹aQ³busg·¯ÃÕ±LimS·­¿ÁYv¯©°Hz³¾sÔZulęKkÇ@Qv£DeJėÍ©¡Ôō¸ċU­´ßB×ûÎ­F|×^±®«bīÌg²¡\\¥ÖʅƒʅƆƁĥNŃÒ©`aNoĩtmhŅF½ ËJm´ËÐ_àÝªHęúûdwz³Tmēøĝc¾P¹ºœîkr\\k¦µ¬W©jq²~G©ºvÈ­hyÍlÑ ]F»¬¹r[®ƼӞǔԨFÎOΪ̀ЊǀϤौƬՈƌЪHΖFݼґJ¿ŝns¥¯onªZUÁxÁ¬]tgájeca³Ks¹Ju¶HLwÑkÄÅ¥¹j·a`±SÁjy¢]S¡¯cÁ«Fui­Í¥k¥iqX}ëqYJ¿'],
					encodeOffsets: [
						[
							-59385,
							-22620
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Región Oriental'},
				geometry: {type: 'Polygon',
					coordinates: ['@@u°ZÂ®ÀT¸jn²KÖ°Äh¸vt´aRbºhÊW|ÄnZÜ|x²wJä{vYì»²@fÄ¡ÊfV~qËjUpGÜû¾Õ­Ā~ÜYÐ»xI±Â½nĊ£OëÞd¯´~¨sª·Za wPeÂ~vàL¤SA£²Wľs¢z»²O´«O¼hæ ªNXÈYzXÊªVªc¨L}¼LmJ¶cx{¶TÊwl~èImdĪsÀR«ČºHÊkz®zòz¬@¨µTÖc|ÞSZ\\ĴiÐZæAÂēB\\ÙYpĊÝZģ«]¹``čŅ°fgy[÷ª½ÏCÕhG½²kR­ñ_Łvêf~èòdpyÄO¶®ĀhlnòF¢âmØÚgt«øÁ«±£Mq|ġf»Áć]»fÇMáç»ŧiųz«ÓƋëé±róGëbËIOqăą\\ok|µm÷¨»Áx¡¿cÝÇ§o³fÃfåwQõ[_õSùÑPã¹gvËiÃC©¯īïFB©ESsgB·ë­Ç¥J«³ÄõU©§JõÉ½§_BÕa¿|áŎÃN{Lu­Yy·u£d«eý¢o²ÝlċE÷dã¢čMÙeĵ¬āÐÙcH¹ºXşBğ]ëd¥]ġYÙ\\ï{R`ÂÏ \\´Ăh@¢°@gÄƤèa°t¤_ĆÄOWTªqÐ VjPĆªnc¨NAüp~ÐxjZ´¸d\\ª®Dtx¤ÐBMÌA|Brä v'],
					encodeOffsets: [
						[
							-59030,
							-25980
						]
					]}}
		],
		UTF8Encoding: true});
}));
