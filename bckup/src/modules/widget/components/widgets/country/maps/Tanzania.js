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
	}echarts.registerMap('坦桑尼亚', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Coastal'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@®B^oļfňÒÚ| j¾G cÔZĖd~f\\rĞZà^fY~¨DraɨǂĞæo¤o¨EPňÜZL`^Ŋ²TUü§ìHÂĚXȰ¤]t®QĈÂĈRƎãĺÁi§H~¯xbAPÇoå@yh¯~of}Ĝ­G¶¿az¡`Cnvïb_vlEµÈrqĈarkr×teEĽs{_³aiq¹ę_KI`FNykÇAmwçdęSoV}M¡_mQ^k|Ntyp©QmBX½hArWcP}i£F¤ë]Ýh[TotYbmOZrCrÉtWtVvW]µdc[uøa¿v©B¿R{@·L}£§gJevqBaoONoÀRt@qeV|©Q|kWh_mXcxDJlKhqLU_QLÑqWg\\sndÔEbq WtpHÜ¢WRéQs´rkdvJRmùDjUxf{z`p±qkE¯XM_¥QmkLéSqoYKkkýq}]įÍ¯ağggUyy±ççÙ_ûxkF_ïKgOL«IçcqRO«e¡§kEwpÍlww^Ac¥bKÍb­cZØCĀcXM|PäO]~i\\KpÜ öqÞėBݣͼÜ`rBæN¤b²¤¸¾¸\\rtbīă­«mSµ¹ÅÏÛÁa­Xk`Mv¢þnL_©cRà]X¯m³WÑM¹[Å»Ã}¡e»£ÃiV xaÆ¢¤âĞVÒbJÜc [îuhkß³©·¥HçCjg §zĹê§º[zWòw¾`s¬àĔȴ¥PD­jutHĲfÎ´Ö¾ÐÊêÌÊ²¨Äôº®¾´¶ÊÆ`ÌD°WÀo²OèÞàøÍH{N_wVuªÁf»lUX­E³ÚAt'],
						['@@pCXf¢vx¶ªdah¦JpI×qÿ{C[mµToS`[½eDZ}'],
						['@@HtLygR']
					],
					encodeOffsets: [
						[
							[
								37350,
								-7592
							]
						],
						[
							[
								40538,
								-8135
							]
						],
						[
							[
								40713,
								-8211
							]
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Northern'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@ĹÂƍäQććÁ­Rs^ȯ£ęWÁëGû¨V±S]ŉK_ÛYŇO§F£påpŝœOĝŞġÀÍÂěĒlÄx¤C_ÉQŞոǊSèJĈUÎ˹Ňÿ²i«Ņ÷i¯~Ý±±·µÇÙƟ^ŁÄeĢlFÅð¶éVÏfļɼÈÎÊʣȊ]^vvytA~XVQDΤ@ʮĆãPuNgpŌÊôΊÜʆ¥Ĭt°XĒĨIĠ̒Ǘ˪ǁTMθȱɒŭ¢qȺśɜůɂŝƈęfħ\\±NáÕÙqimiX[¤`ì¾ŧê±̚ɏƀĥ }̺ɓ̬ɉO}Lmk}OjaA[o`e«L[{CkLg[P{c¯J¿ƛcTSÝ_¿pS@¡«ïo¿@Õg'],
						['@@pJ»yb']
					],
					encodeOffsets: [
						[
							[
								39732,
								-6114
							]
						],
						[
							[
								40127,
								-4856
							]
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Southern Highlands'},
				geometry: {type: 'Polygon',
					coordinates: ['@@Bs´Ù®FVW¼kÂev©xU`|MÎGß÷Ýç±P¿p¯XËCÅ_É³µ­½ó¹Ã§±ËÉÉé½Ï³ÕeÍGısivC®Oȳ¦ßēt«_x½Xñ\\y¹¨ĺé¨yhièD¦Gª¸à´lvg\\ídIÛaUÑáĝ£Å¡bwUÄj¤f¼¢~¼ÄÆº\\ÒN´X°n^WQßdª`Km¡ýNul_®WÂbÜÐ Æ¶º T¬nĄ®Ĭas[q··½±£aM£Aå_qÛݤͻĘArÝõ ÛLoj[^}POãN{dWÿDY×óLu\\Ñw_iuIE½kcUWR¡ą[áZ³m}£M\\NiÉpßLµ\\gKÓjxQ©w¯w[iÛ£c}_`^oj©G¹JywLYc|£cJÔqvbIÃmiPmz{KMMÉvOUm{GW³§SuVYa}R³OguZYWZŝHąEƗ@cüw´NngbĵÎTvy]d]tÅ AÆkJAzÈf\\NUZVêMtPVrÄJxt]v¢oj[`ðXiªJ¦ÌOr`bH~¢_xÆsv±ÖOxůŠŝľmK¥}kd£sñkEUj«~D}ç^{jUQgaÅZcXgDai\\©g³\\wv¥x×Ð{HqO·~elsASPÍB­x¯KI^£ÊNh¿ĕ[¹AqRÓ¦QZčVUg[oV K`­rÁj¥B¯Xk×]|XÂUzE»RmqyPqm^§oK·V¥|¥®yÑöÑĈ]łð{öüşǘ­ĊiÒQægÔqÔ}ÌàĻƦėĒb¾ äÐĦİ¤ĐÜ¢Xâ_È[d×LËƈÇłwĆ×˰ŝĲľ¤ĲhDĒÈØŜ¯ĈwĸéǰŏĢ§C{^wÐm^WUÉR£[IĴ@¦OĺVæI´¢^rR°mæE_¶KlW@uÁbA×|«¢¥¸c\\Êam´Ûy¾KĂcVÅƹoƃDÉSùg¥â@ŌO`´|¶PªtĆGÞQĬLLż£²ÕmZkQͥƶg®@zrrÞYDÎæxt~RîYLÀÆ°ªtt²°RläÄ¾¬¶pRØcAÂQÌĒU|F]@¼£IìGb°IÎiĦ·[LĖ@}zKpgÈ×dÃf[´^®yx¯'],
					encodeOffsets: [
						[
							37350,
							-7592
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Zanzibar'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@zĢ\\Ibdw|lInWdtÈP`ziJĂlm Apy¢eVr|Fáµ@{]ãhONfDWāģcKOÉC§RQW'],
						['@@DxUpZlÜSj~»TMH©vábc\\dMKÑx¹x@~\\i®fBvÍDùb¡v¥YUqvkYº_kw@IlS~qgj¹eG¨{d_NpkzBU¾ahKÊ'],
						['@@LÆhys']
					],
					encodeOffsets: [
						[
							[
								40583,
								-5532
							]
						],
						[
							[
								40123,
								-6091
							]
						],
						[
							[
								40153,
								-5985
							]
						]
					]}}
		],
		UTF8Encoding: true});
}));
