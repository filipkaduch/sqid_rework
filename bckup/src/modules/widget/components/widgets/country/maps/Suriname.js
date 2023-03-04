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
	}echarts.registerMap('苏里南', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Brokopondo'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ĶħßƻeŽÇÏjƍÁœ̏ŹÂm͌πħưĶńdĲ̨@RėĂÃ Ɖ'],
					encodeOffsets: [
						[
							-56150,
							5123
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Commewijne'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ũ~ŏþœλwsƐáîGNCFADCFCJ@@Âì^Č͔W'],
					encodeOffsets: [
						[
							-56007,
							6122
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Coronie'},
				geometry: {type: 'Polygon',
					coordinates: ['@@GıƩųǩJƑ¿ŁǀĂ\\īǪ@ǲԈŵİÅ]ß'],
					encodeOffsets: [
						[
							-57245,
							5799
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Marowijne'},
				geometry: {type: 'Polygon',
					coordinates: ['@@иýư½ÙkǓƻȣěå̙Ƃ¦ƤýŔ}ŐŪ'],
					encodeOffsets: [
						[
							-56007,
							6122
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Nickerie'},
				geometry: {type: 'Polygon',
					coordinates: ['@@@ǱĬǩā[łƿɽZПïȀĨƨ~ɘżø̜©'],
					encodeOffsets: [
						[
							-57962,
							6101
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Para'},
				geometry: {type: 'Polygon',
					coordinates: ['@@KġϐxèxUƎ¾ɴtƏμx¥ƣĹǓ±ǇƊāÄQĘ̧@cıĵŃď×ƭĄȧLöΌ'],
					encodeOffsets: [
						[
							-57257,
							5661
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Paramaribo'},
				geometry: {type: 'MultiPolygon',
					coordinates: [],
					encodeOffsets: []}},
			{type: 'Feature',
				properties: {name: 'Saramacca'},
				geometry: {type: 'Polygon',
					coordinates: ['@@½VƍçwϏwLĢPbHĲ~ÌßƊ¸àʐ~ɦö¥ąȭ'],
					encodeOffsets: [
						[
							-56671,
							5807
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Sipaliwini'},
				geometry: {type: 'Polygon',
					coordinates: ['@@РðɾYƒÀǪIƪŴOaõ΋ȨKƮăĐØĨƯοn͋Á̐źÂŔiƎÈÐfžàƼĵĨ²ǈĺǔ̚Ɓƽ˭®ǏOʅª½IƵůƎȍÀCĸȟYŵƁǧ`ɕƩďŋÃŹĿĵǋNĺƵSœŶċÅǻUÅąĩrȹǁļƻʃàmŜ˷ā³˯ĘœXĭâėCǏɶēǚyŎǅǾHƤïƀSǞʟËºRļƏň±ƀƕǄwƊİņIĮĪȖãƸäĜƀðǸiƠpkÜŬäĀ'],
					encodeOffsets: [
						[
							-58595,
							5390
						]
					]}}
		],
		UTF8Encoding: true});
}));
