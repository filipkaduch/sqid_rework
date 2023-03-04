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
	}echarts.registerMap('赞比亚', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Central Province'},
				geometry: {type: 'Polygon',
					coordinates: ['@@PľÐtT¸F £İ¤ĖOĄ¦ČÌԐ³~Ű­tĐĨÌ¾îèVYƄ¦ĲShȈcã¾uÖ¢żĕĘМIÔƱðGº¼WöƈĎÐZÊ°Ïãn±Ƕà~ȐcǐzlrTþn˜ȪĂ®@ÍƺļÔVĄðpĒ³L«³Ĩ±ö^@̈@ՠ@ʴX²ĈÊjÌKīð£˞ħJƫ¸{jģUºhÆ}ÁćY·ǂ©JŰû^°ĸcMççUç¸ñEÅv}āqĥķýýÙ£÷½ًP¸£~ÓĎIāşŁcÏqéǉlõăe§ġ_ƋùµAQƋşCġĊm@ěąƗaïƉmYʁcïÀ¹bûëTµ¹ǟÜ¹kě°õÁvç°fÀ]ÑDġiUţHcéĥQkNÂ¤ċpÛÙkÁőÏTsȆȅBeŊࡱ¸ՓM'],
					encodeOffsets: [
						[
							25941,
							-15640
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Copperbelt Province'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ªÑĴV®¢Ġ_|ÓæHñÒŪyĚŋôÓs­³úďÈSf¸§ÛxHÉC×pÛDĖɓ˛ȩmSýkqǏyȏdß}ǵm²ä¯ÐÉÏYčõƇ»XH¹ïÓƲЛJ¦eÈàŶĒĮVŮÞ²ňǍĀlà¹ÌtĬ¸Pz´ĤØqªfºiàɔžîniĬ'],
					encodeOffsets: [
						[
							28261,
							-12507
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Eastern Province'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ĢCĘĂ@ÊÎÌôº[ĄĊHàüDÂþLĊªŒNİ¢d öüEĬúà¢Ės£ĆhĚ¥°¸FÜAæʔϊê_Gï\\ĿWÕh_³·áa×´½EÆċĊnÖ÷ģéá«l§_§eĽhĕƕMíÒ@½wéKēr­ßōD¡ÛgW³ù¡¹^gÇsÆBºÓÏÎI·ôíU· }¢äö|ß۩ʏȣ¥ïķyßƃǋğƽ¥̍ÝąạŃƉëŃy^eƦÿĜõ¾köêǊÐrdŠłJĂč}Ô·¤ٌO¾¤øÚþþĦĸĂr'],
					encodeOffsets: [
						[
							32182,
							-13728
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Luapula Province'},
				geometry: {type: 'MultiPolygon',
					coordinates: [
						['@@ÑµíyĿǅƭĕ¿{÷É­Ē¹K«¤krĿÙāòst«à¯Ęaö¾CðğY^ÃsÑZçŁ±ĕxğõûyÛÏóv{±ĉÑQŏčUŅÛáĜ­ÒÙĸf¬«ŜʶƾŌíÂáËHąyƃÙǵ`SżƘŎVʎȃ¸­O§YíǁǃϫÕMí¨ōW±Ñim£Ó]É¨ĉÇkïÅYµĉëHmťiāFĆ÷Ī¯xñČU¨¡JǟĦß¾hsHâ¡ÂTĦºĔDâ¬TþmÂžFâÞŸCz¦`¶ĔVs¼d®¹ø¨¶KƞXÎĤÆ}ņâJ§¸Ħò»VĘlÊǔɂÊĂÊǰĩâę®תÔnV'],
						['@@ÀhWûÄ']
					],
					encodeOffsets: [
						[
							[
								30341,
								-8597
							]
						],
						[
							[
								29072,
								-9476
							]
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Lusaka Province'},
				geometry: {type: 'Polygon',
					coordinates: ['@@dêŤGjVCĢÒ¿^¯euèöÂĜ¯ºlǠÛº S¶ìü ºað¿ʂdnZðƊƘbĜĆn@ĢĉŠDRƌ¶BƌúĢ`¨Ąfö½Āěfƥ]EÓ¦ıXÃèÃz­Eākõ¸ÍÅóvǥgşŅsµy¡NħÉNǋçơŉ£óRakƑQï¼Á@ǹľë[·­ŽÐáù'],
					encodeOffsets: [
						[
							28437,
							-16002
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Muchinga'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ÚjɐȔČ¦üOĄìKņ[Òè~èÑ¬zĊkÂ¤ZÊĨÄyƒ°ÔÌØ¶Ăü¨|hŶ°è¦RÜ~A¬Ĳ¾jðãĘeƲēŮpĂªuƐ^²­®ç°L®wĚQTƶýÊĕeęİò]vy`ÛÂĉUđ{eĳĬ½ô¯Uŉz·¼µ`Åªăã¿ćõ¿\\åui³w¥nōÞíqßÝďŏrQķʓωBåÛ·E¯ę¦ąg¤ĕt¡ ùßFīõûc¡Mį©őKĉÁýCûGßăĉ¹\\óÍË@ÉėāġDu~FÆ·òVèèNèķd¯]ůüIǁªZ¸ĈÂÅ~g¹ViĤ·|IƬ˝Ĩï¤ĬËLÉić§ŎNîϬÖǂǄZî'],
					encodeOffsets: [
						[
							31174,
							-11806
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Northern Province'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ю°βăÓmõÏê`©¾r°}¦J°ńŧÌµĊÀÀJ^ƈÚrnŰæs\\ŇŴí¦AİSåºµÄrĎU®oāĔŭfƱäėiïı½B«}QÛç¥¯gŵ{û§µā×ÓËƑ¯zħÃYÉÁ£ĉlyÒ«}çÑçŅ\\LăëP¥ûċɏȓÙiP¨·®ʍȄōUŻƗ_TÚǶzƄGĆÌÁâŋîʵƽ¬śe«ķÑÚě®ÜâVņŐĎÒR²Ċu|ôÜÐüzĠöĖw²łYètÒ]ÄZïĠ½Dõėbß°s¬ñtĂÚqŀ£l¬LđºÊ®|øĖÀƮŀǆîzÒ¶'],
					encodeOffsets: [
						[
							30341,
							-8597
						]
					]}},
			{type: 'Feature',
				properties: {name: 'North-Western Province'},
				geometry: {type: 'Polygon',
					coordinates: ['@@īmjŽíɓjße¹r©ģ×y³·OsīºËkßǎÿŇÝ±UŭđĭßŵfÇ¥ĖėŻ¡vÕä½dgȇıTƃ¥ZçU½íħËsďů®}ԏ´Ëñmƿ[oœOÍSòüú¤Œ]¾ĝnőÊŁoĤ}×LqÙàąEĳȝċƥÍcbËaíÇĻ_u©āsÉHO¸v¼U¢Ã]ÅÙÙèėØ¥µÁ]½āºífɋǶÉN×[ġ²@Ƭ@Ċ@ƆFʼհ@ӞAۢ@ÙĒF§®vƆøYĀłÔcĊßüAĀbȆtt¡ưÀĶ[îÂ±ň@ŠkĬPÞeªÆDÊXęTĮiÞnƭ»ēà¹höBĪÄ~¢à¦ĨXRtžl]ŪpĦ¢Y¹čUăn@ōt½ƐóTÝŴ¸ÆëĠYĆ³Hâ­ŜCjdĚĢªŸ×ĬMîÒRÐÀòVêørĜO zĭIď²aĞÍæçS÷|YzĕØ«'],
					encodeOffsets: [
						[
							28261,
							-12507
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Southern Province'},
				geometry: {type: 'Polygon',
					coordinates: ['@@JĔ²ÚYðôĎY°ÆĄDÎè^mÜBĖƵUÆÓÊlŊƄĎ´ÌŐ´¸£wê¬ȺámÅÄªË¨Ü´ƈrze®ՔNࡲ·fŉȆAtȅÐSÂŒÚlÜČo£MÁlĦRúâžÏ®¸ì\\ǺĽÂ@ð»ƒR³åh¿ğj­~Ñ¥ĿÃÕØ»ÿaŁÁ»Aķ­Kj­ĽåjÁ×qWÌĩ}ÅBO­ĩ×sŽő¡Ľí«fğé¸»ÑÅy½Á]Ņƛǥſĉe§F¯ăVÂ«EăªėDÁhuŋ¯GçLuĥF²÷ºĕuĉoÍjķNēÊAĕĜµÜC'],
					encodeOffsets: [
						[
							25596,
							-18010
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Western Province'},
				geometry: {type: 'Polygon',
					coordinates: ['@@\\ØÊMɌǵîeĂ¹¾Â^¦¶Ę×ÚçÚÆÄ^V¡u»P·ÊGĂtvªļ`îÈÌbaÎdƦȞČĴĆFÚßrØK~pģłŒÉĞm^½£őûùTñÎŔPpǀ\\òn¥ċPă£ĕ¤įES·ÏsOĽf­qy³Ƈ§ÛÌ©ÆÃân«ȹxé¤³·Ëŏč³ŉƃkÔÉVÅƶAĕnÛ]çCÍÅăZ¯óčZï±ÙIēƕÌaïűñ¬ß`Ék÷^ګƉ¾¥nĵl¶R£¬ûŞĉÖāUǉǜěêÑøſŦá²¥´]ŢùŊ{V@ڨ@И@پ@Ș@Ċ@ÒĢ±'],
					encodeOffsets: [
						[
							22642,
							-14132
						]
					]}}
		],
		UTF8Encoding: true});
}));
