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
	}echarts.registerMap('萨尔瓦多', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Departamento de Ahuachapán'},
				geometry: {type: 'Polygon',
					coordinates: ['@@DysÏÛG^_CÍysT{SÇōºu¼ôdb¸~´n|Îj}D'],
					encodeOffsets: [
						[
							-91888,
							14372
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de Cabañas'},
				geometry: {type: 'Polygon',
					coordinates: ['@@¶ItÐ`jjB®lIè¤AZĩķ­HMd·zāPkÃW­¨Û¨B'],
					encodeOffsets: [
						[
							-91081,
							14276
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de Cuscatlán'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ð_Ûlm¨QAÜ§®§E¿yėtdzĎíÈx§ÆXÞfz'],
					encodeOffsets: [
						[
							-91279,
							14402
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de La Libertad'},
				geometry: {type: 'Polygon',
					coordinates: ['@@¬¨N®zzC~àĀfàKº¼RÔXx¨`¦icclåSšFù|wZēYt BXgyŁ´ƭb±Kďz'],
					encodeOffsets: [
						[
							-91780,
							13847
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de La Paz'},
				geometry: {type: 'Polygon',
					coordinates: ['@@hzWXìc¾Vº¨ĘszX¿ cÅ]ÏÃYÅ§¿ıºïıÈ'],
					encodeOffsets: [
						[
							-91307,
							13749
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de La Unión'},
				geometry: {type: 'Polygon',
					coordinates: ['@@J~¨¨JĮb~gÖh¸I¼j¨RÂd¸HÆc~ĂPÜa®·PċAóÝf_ªGA¿EuËHMÃ¬w}³½ÃwS©ǁb'],
					encodeOffsets: [
						[
							-90214,
							13489
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de Morazán'},
				geometry: {type: 'Polygon',
					coordinates: ['@@Lº_X¾u°ÿÄrd}GÅ·cQÁi§»ãCjPt¿JÏÂETBvrahaÈ'],
					encodeOffsets: [
						[
							-90375,
							14247
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de San Miguel'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ĸjW²|¼_ĂbÇgbqAuSFÐÁÀIOsiäDJg·hÕa}Iĭ§§I}sK¹ÈVTá¸·HbĮeü\\´nu~£D'],
					encodeOffsets: [
						[
							-90659,
							14075
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de San Salvador'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ĎC~`eyWÝ¨ÅwîÇčcy¹§½UdWëAsZYĔ{xEúŢTkædd'],
					encodeOffsets: [
						[
							-91413,
							14388
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de Santa Ana'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ JswYÉ¥sJă»Jk{lxDQÓ»L¹eßqnVon­m«Þ±`tÐCzU|Ø  hEÌfJt¹ÒO|^ÐÈGbcy'],
					encodeOffsets: [
						[
							-91500,
							14767
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de San Vicente'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ÀFÄXlĂO¸yNc®G·I_ë­ÿTyqDy`¨ÀZÆÄ^ÐÆdWÀ'],
					encodeOffsets: [
						[
							-91034,
							14002
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de Sonsonate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@È|TSztDÎ`]ÜH²_¬Ý®npm UrmßÿD}yyM­«§µXĹOØıÌ'],
					encodeOffsets: [
						[
							-92118,
							13997
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departamento de Usulután'},
				geometry: {type: 'Polygon',
					coordinates: ['@@¤Cv}m[³fûaĭ¸Gâ·SUºÇēIĿX¡[tq]ŧőp±fCzrSz®Ā`ìJ¸'],
					encodeOffsets: [
						[
							-90622,
							14028
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Departemento de Chalatenango'},
				geometry: {type: 'Polygon',
					coordinates: ['@@äMcƦ·Id¯g³êsªÃÒCz¿w­kAiiÏ_sµJ§RknÜï`}_čD¥j§_WwwCkl|IĄ¼I¦tZÊxIt'],
					encodeOffsets: [
						[
							-91500,
							14767
						]
					]}}
		],
		UTF8Encoding: true});
}));
