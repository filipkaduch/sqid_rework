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
	}echarts.registerMap('也门', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Abyan Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@dUÊQ¦`Qz§~anbG\\¦ǌĶ\\j@h~ņv`ņÊªG° ãI}©ćhe`Ăb¬QÔ¢ÊƂZÊoİehijXx °T^gCçViÂ}TƵhƧEăȽ³£k±ū±T¯B÷i½SqXÍAďbù[ÛK¥Lă[yS£@Žw@eëÙ}ÅăÏ×}WËS­[Ý{iyUB@_~IºrfÔtľÎ^¨kJ{z£Tx¨À~¦N~©Z]cwRSînu¨pK jk`cJhX¬C'],
					encodeOffsets: [
						[
							46473,
							14243
						]
					]}},
			{type: 'Feature',
				properties: {name: '‘Adan Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@¤Đ¦hƊb@ĨZİ¨ńTVAåeÁCy@®fcgyPyOaiq¿¥AaíG|`»LwK§y½ãQV'],
					encodeOffsets: [
						[
							45476,
							12985
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Ad Dali\' Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@¨`~taÈpâT¤_hi\\qA¡®M§I±YMSÑqùÃá¥sKykROlãR·Bnq{ñq¡p[wÓCvÕQu«bC¤¬RjY~XGzvPr Q¬\\`Q¤r­lAz®[`dlanjR'],
					encodeOffsets: [
						[
							45754,
							14518
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Al Bayda\' Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@¬fHļ~jGDÛlŝÓÒyJb@ofjf^^vW²J|ªjAZ¨CR hpTèEVjs_qLßĢ@àƕ@ďäf°@vk^uu_}Ņg@[iǋĵ¥[Hma}by¨R¥_ÉRcVI\\PÆaªgbõ­wéZJ²¨­NB¢[rjg£`áSÇob}s§_¿pA°`FUChrbº\\lxVĂZÌzöÂ'],
					encodeOffsets: [
						[
							45913,
							15102
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Al Hudaydah Governorate'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@WdcC¯wcDrpO ²¢~'],
						['@@Lx zAy·o}¡Dfz'],
						['@@fT~[¯CÇJ\\D_tuVCj dJ'],
						['@@Ð¡îIÖPøúlnMF¥K­sr_»J¥IµdK@jgUNg_©b\\K·¤_BqtE£`£´TAr}æyflooU¡fIseKÅõ{JÙ~}FāJY¡¹CHv|ékH_¦Bâ½NzzvY¥cCctwKQ~wg@}aÉGyW_½RwHe}LwcmıYĞC´yf_sb]®¦EgcĚÈaÎkYÀ|lD¶WdO]xD~y DuÞnQ¬¾{d[lDÚgËûvuIYw}RoHverLdkr¦N\\IT_H¦ÀXdsè¥n¢yVâz~è~'],
						['@@kIÍP]\\Pü']
					],
					encodeOffsets: [
						[
							[
								43657,
								15828
							]
						],
						[
							[
								43728,
								14037
							]
						],
						[
							[
								43771,
								14400
							]
						],
						[
							[
								43839,
								16248
							]
						],
						[
							[
								43502,
								16080
							]
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Al Jawf Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@fâ¦ÊªĸĪÒ°Äàf´PȺ@@̴ˠ@Ƹċ̊̐ɢc͒¨ɀ˩CɓAˏƽǫʝ˵©̉«īí©µëÁ}ȕNͥɚȹAgyŭ~C`O³[°zČ\\IĐhäEjwÀ¡OyX@'],
					encodeOffsets: [
						[
							45106,
							17054
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Al Mahrah Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ǒΉǐΉĈǧǀͩĘȋ±ÈQǐΗĐǻũķ[Yÿ{[ƃ­Ó}íµ«§±¿³ÑA§ĝE©hcSÅ|gVWRxïkeŧǁÙ¡Õm¿qwIlcëMÿwā@ýăwħmǛ¯K¹Ųmp{Âol£Qg{HǥàóhfĐIdýns\\]z`ĊLĂfØ|Ôrn|Hj}~lhÖĈbÒH¦CvqdZúbhpÜŨlàÀpÈƂĞĆ ĂÔĸŌĎƺºŔÌƬvòj˼JzĆŚæǬȠʘôø'],
					encodeOffsets: [
						[
							53248,
							19456
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Al Mahwit Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@²LrfńRÊZÈ_¤EhMttip\\rKp~þnBV]m\\U{ã±·]Ke»eAtoCocySB³_¤¤sFAr£`¸[La`ªMhVih@'],
					encodeOffsets: [
						[
							44279,
							15880
						]
					]}},
			{type: 'Feature',
				properties: {name: '\'Amran Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@¦ZôVÌ¢AâqŌW¬@ @zW¢P¿xFigãJď[yċ\\¯´Po]¹@·D@Á]sBµ×ssTá{cmKImBwgLsacmAýo}qLo[jssgN¨y`A|t°UN¤xojoªnc`Q®JnW kbEµaJGbTrqvMgjUĊ£BäM²|ÔMČAî'],
					encodeOffsets: [
						[
							44577,
							17030
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Dhamar Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@AÌ²j¬A`eâzªpZn~rpQ~c`L{óÊ°J`¨L¸Y~^bV¬xbLðHÔhľBKvVjq mÖhvö¤LlQFáRÉIÅõÁyYËāwU[ka¹gqDV{qwx½@¬ÇNgj¯Cc~`O¯³Sg\\BäyU©Åïj·c£s£i@sR]K£yyMá¾¥AG`l{êuGºD'],
					encodeOffsets: [
						[
							44580,
							14723
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Hadhramaut'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ˀ̀ǊǰƾǬBːDɔƶAʄƖŒ˪ȾʴˬΈϼȎϼȌԆ¼Δ˞˞բĪӘĐó÷ȟʗåǫąřIyi˻uñËƫ¹œčƹķŋÓāąƁĝoÇ¿ßŧkÛgoaYùrcDuG¥aÑćgÕk~}Gi{qm{Óe×Kā_ĉ^yt[þmJceďôgǦß|Gh¤Rpk|Ánoºűȅ×gÉÑ«ÝyÑYkÏJåyYvÛFíĭ­Qÿuĉ©Õ¿g·yĵÍSu½Pue¥³×KyXu_s±sC}¡}ewsEïFÒ¡~CpGËeġXĝ aÔƕŊixĭǭĬPÕüëÈ°ŬÆp~hÆ]½X¦ÞUƊŬƘèŜãN˭m΅yˣ{΅'],
					encodeOffsets: [
						[
							47418,
							15982
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Hajjah Governorate'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@ÚÜ^j®E´UBíNċ{ÓN±Aã¤VĉhiNruSqaHbI¶FlaXImR­d_mp©piwM£¯VsB{z_§£FÇ`ÉYŃQqe±KcLJ¶I¦`¼qtL®E¦mNùk÷ÕOíJÏ¢vźE²_°P¦s²FaT\\Ua^D~Axmþ`nObN~ŊXvĬnhÄc'],
						['@@YdvlfM']
					],
					encodeOffsets: [
						[
							[
								44267,
								17049
							]
						],
						[
							[
								43362,
								16701
							]
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Ibb Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@¤L^tQ@¤jtd¤i¸ðªÆzVAãh[´TP°_d}°DhiÈM«¾@xw|rE_B¯ÀoQmibck\\_­By®k£q_R«[RquOHyWZ}Qi[µNox©koAvS³OTvtO©{aLH Åi^imI«`Sªxh}RxLdsdDZ¦u'],
					encodeOffsets: [
						[
							44798,
							14442
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Lahij Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@Ô\\x¢oòrr|mAQ¸käPQzltLâ¦úÄrTÒZNêYxö®hab©OÅJ[«DgWIdl_iLov§ímTxQ^dªYM}}¥§¿Sw¤|ylI]§ÍsĽÓqeJ¹`}@ŃSį§ħY@Ɖag¥£ďU×G{PuWYrT»e·A_OHc¹`£~}@dëhµnmU_VľȲ¸^UĠ®MzVnx¤^mUgpÀ¨\\@¬ÐIuV\\^ÞIdWzRxFz]~Vw~p`î@I½nkbNh@P\\DVF¤º'],
					encodeOffsets: [
						[
							45584,
							13916
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Ma\'rib Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@hzȺBͦəȖMÂ~¶ìîªĬ̊¬˶ªʞǉǯʿ˿ǽů͕ɕđ÷kw¹ģYTmgēL_eSgoQ§DYiB{©±IuX]]eeip@IaÑzÔkŞCÜiHĻ}DöTp¼ÐzƎŗ¼ŏÂLA¡]sMÁRUhFIº×«I\\apPzĘl°ĤI¦\\ujw´G¨oĞ­ĲN'],
					encodeOffsets: [
						[
							45645,
							16386
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Raymah Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@j}`¡Ig¯ôÉ|Kd_R}o}qYm©oáy_f«BiË±BZ¢IĂE}~IÚ|öÆLtfJ¢epV'],
					encodeOffsets: [
						[
							44689,
							15301
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Sa\'dah Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@@̳ȹ@³OßeÃÑ¯ķĩÉ©á¥e«@ŋXár¡BËóU¥Y³V­FiÛ]ÙFkt¨IsdS~Vy[´xafBÈpgp_ÍjbO]¤°hV\\ÎXUrć´hbmr_p¦nhb@jTv_IVeY¨³Æ¹ĘPØD¼UÔXW^~dPtɂvà@ČwêxȨC'],
					encodeOffsets: [
						[
							45966,
							17852
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Sanʿaʾ'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ÀtbzBz~xTlnPY§]Q}BWiJ}­VõPy|gmÃSyhUjUA[Ü'],
					encodeOffsets: [
						[
							45180,
							15831
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Sanʿaʾ Governorate'},
				geometry: {type: 'Polygon',
					coordinates: [
						'@@zdDpspB¼fLf¸^ä²|V[^nUbdKtxhnAJLnd|Sâtt¶ØA^t@Â¸Cº@p^_DŮ}M®ıpĝH§x³vi[J¥ģ¯ėkOybo[¬JØJ¹EVgÂQtN^B¢KŐÁŘ»yƍ»ÏoSCõeG«ÆJQÊEâkR£KõuÕgniruULĽAgÓïGaKw«Ua}]·Z§KI_hJ_¢i~pkeåzq~',
						'@@\\ÛBViVzgÄThn{OzUö~®IXjAR~¨^ZOkmwS}Ayay¿s'
					],
					encodeOffsets: [
						[
							44551,
							15411
						],
						[
							45180,
							15831
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Shabwah Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@Άˤ|ΆzˮnäMçśūƗƉV¥ÝW¾^gÅo}ūÅ¯ìÇÖûOǮīĮjwƖŉbÓĞĢWÌfHDo¢} ÑM©ÏZ¹CaT}s÷SQ[é¤±lR­GWœē[ÑW»¥³uaĥč½Ï[û¡QFĄgƨSƶÁ~UjDè]h¯SwiWgjįfÉpƁY¡ÉÓ«Rāa_gfªĈJ~ä¯©HŅÉ]vlu¯@ãe@ĐßƖġ@Kà`ritUçFfK`hĔnSZºĤlxĒø͖ɖǾŰ'],
					encodeOffsets: [
						[
							47418,
							15982
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Socotra'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@§Vu~HO®ÜFa´@­C¥T[n»Bc^'],
						['@@~B~F[Ö@ĠßÂqfBT[¦XÖ~xj¶xLzqK~qÔ]´ooSuWocÓe¹GoUqwM«³F©KokPñW¥[ßQÕDŕFZy± Ïë¬âjRRRÀK^'],
						['@@zLI\\yO\\e']
					],
					encodeOffsets: [
						[
							[
								53397,
								12491
							]
						],
						[
							[
								54720,
								12975
							]
						],
						[
							[
								54280,
								12466
							]
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Ta\'izz Governorate'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ĲdnKxf~GQx`¾zXÊH~b@T©¬_nJj]ÆjGbKª|PusSP´ TuBpªlpw¶M\\«£D¬aRvÖDu£¹EUCO[@Mgla¾mJí@o_x}U^}EywyQcXÝJ[]UvÏJ@«[§o¿hVn£]mwyU­NVğ·]Ľȱ`UqDZöj°¾Đs|Ð»â}¸qÀtìIxPĬzäFø'],
					encodeOffsets: [
						[
							44327,
							14008
						]
					]}}
		],
		UTF8Encoding: true});
}));
