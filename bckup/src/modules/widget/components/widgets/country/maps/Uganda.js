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
	}echarts.registerMap('乌干达', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Central Region'},
				geometry: {type: 'Polygon',
					coordinates: ['@@XBlÊH¼S]h}¸uvEv[szYZcjKnHdUNe\\exC^Jîh`ó@Z]Ka^onEPcZDjLgb}HPci¯BMUHPMN}Ai\\QNqV`YpùIKVY·V_IsncZÆ³·ZoI]RYB`UCi\\ruIaRqĂāB˿Cٯէ@Ľ@ف@ƗBʅCɷBMdN»¤KznbIdydNÀ[faV_pibdD\\bbxÔ@ÚijO|kªi[¾LdG`jªVÄE_r}FuSFvxnDMO\\ZvSz}nGl^pI\\|bj|fPnf^Rj]h]H`prCt^tLXXvPEnxnV¬Þ@h¼wrO\\phdG´pMZZzH|ejEhN¶`jAnW^wXe`axqlKyPQK{\\W`kXe@QZ~z BN`t^Af\\Lrf~FZEiL~YAjU^B~Jzr\\|vbXdfHdMdHfdXCV`p@dvZ@MTZ\\'],
					encodeOffsets: [
						[
							32866,
							1691
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Eastern Region'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ØLâGBäOtGch¨|CbLrvMnFp@`h|CZZEzNRpAL^dDjDfXVlJFzPjDr~nXArmTfY\\ZV\\~Z^jldbBbTXZFZzUn@`hvC¤OxnGPchKtHhpCFV|n~xƨğʪƿL­D¹L¯Eů@ƋN@Bá~@X[xN|GhdfKrF`UhBV^hFt²@~e MRym~DHsRk\\MK}xs~mNu·DUK]SOAõ]I_ugsYSG©¡RqQsMFcSa{YWGsaWcFomGyyYMLwcM{cKWF[gS@og_GUqAeUaHuFPQRQgcmGe}{UcéīAU|ċŇAk]ćǱMÝBɩHË@ĽΏ@DٰÀāĂQrJbqv[jD_VAQZ^JYp¸Å´YmdJtU`Z¸UJLoú_ZUMr[RBjM~ONGNVAj°OdGa~KhiYCOdmF]pLbY^@_ô'],
					encodeOffsets: [
						[
							33608,
							1514
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Western Region'},
				geometry: {type: 'Polygon',
					coordinates: ['@@Y[NS@uYco@_DUcWGeNcceGWcua[{yqI}]AiVB}ZKjYFE}eKqe[Bs]M_A}yRYf@lWX_|[RLzOLrkbwf_xWX]Bm_iµgMFfiG{YyNYoH³gc[oqP»x@g«ÝmUwFmOWuWK]sDsoqG_^^gQie]Om{eai{J[]oHk~mTyYuP[NCwmEuvT~E`qFUÃi©H_Kc\\½jl©P{ji@ÙwÓaa[Ccja`obU\\eM¿zcJcmaLy¼£MNcȝ@ȥ@qZWBmeoUe@kaguK¡PsGeS}DYV£^eaeDgMPSQ@cUcJwYS]I{akmUQcmJeGHsUcPwsK_YIgiVoCUccSHiLc}åcnWIÐeKiiRq@kkN[dNs[aKBXÊ]XzBxUJkxZ|O`XôMT¢K|J^UlPL¤@MVG\\tWF¤MlvìX`Wt\\vUTDpdDATRCxJhtȖlŢEHhWG°`RLzpBZjPtMRT¤ǺøĦd`GhJj[fLneb¨CtPtYR`T`\\fBV\\rA^ZzYznP^HffTI°FpbOdZb^FZjbNnkt@Bhj|[tT@lZlIFlt|@ѸӾȔɐB|ĀAdSBhQnAjfTT^nXn@jWpBpaf`NRP^hx^LtrpVbSHE^k\\DT[^C`[jOTwxN°lGhkGpr~ATX~]\\ohkHkEq^mIarOCyShSP]_[EÕco@Iwk_HUWI]_£{MLiK'],
					encodeOffsets: [
						[
							32866,
							1691
						]
					]}}
		],
		UTF8Encoding: true});
}));
