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
	}echarts.registerMap('珊瑚海群岛领地', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Coral Sea Islands Territory'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@żǚҠë΢̪΢ǾʱǍ˓ֽʫۧØ©˪'],
						['@@ʜͨ\\̄џġʃ֟Ь'],
						['@@ѴǶ¢ե˕«ȿМ'],
						['@@Ā̸ʹàƆЉɉȣͯɖ'],
						['@@˨̨̮ůǭ·Чǐ'],
						['@@ư˜Β§ăϥнƲ'],
						['@@ϞӀêȝ٩̣Ȣ']
					],
					encodeOffsets: [
						[
							[
								154207,
								-17851
							]
						],
						[
							[
								153347,
								-16696
							]
						],
						[
							[
								151676,
								-17992
							]
						],
						[
							[
								155596,
								-19687
							]
						],
						[
							[
								156978,
								-22387
							]
						],
						[
							[
								151136,
								-16920
							]
						],
						[
							[
								162593,
								-30662
							]
						]
					]}}
		],
		UTF8Encoding: true});
}));
