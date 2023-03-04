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
	}echarts.registerMap('哥伦比亚', {type: 'FeatureCollection',
		features: [
			{type: 'Feature',
				properties: {name: 'Atlántico'},
				geometry: {type: 'Polygon',
					coordinates: ['@@VªDHww`ÑBēkcjUkE§mGi{µS±ÒsL± ¥Y²Djãbz¾Y^ZºGlÒ@tb|ÂnftzLºjÂÂlLbºPV`M'],
					encodeOffsets: [
						[
							-76649,
							11374
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Bogota'},
				geometry: {type: 'Polygon',
					coordinates: ['@@i^©Oq¡iuQr]Ç¥kwC®îRpRÔe`ZzEp\\fnÖu[Z¤XâxpWG°H°ņcVGÖiJgt¢¨FhjDp~vPrÈ_KyZĩmczQ«oKWGEsWWkAf_Gm©ù^¡xDkUF»e»'],
					encodeOffsets: [
						[
							-75923,
							4100
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Boyacá'},
				geometry: {type: 'Polygon',
					coordinates: ['@@DpZGlZ¢noÔfENtQ®F~|dPdgKlmLY@PjlaD±WsXo[uZPv^l¸Ap±®YBeËbdH Q`idvrGPgª®XdqpOhp|D¦|à}th\\L~|ÄbRwc·EßIRiBaw}Dq_zXdR¨HVjjoXl¢DhlYx²NflVraPtlbP´¸|nDxÂ|@paÎZlnWÖZZUiDezsVQt rhogû\\UVpzZQVzK¶ÚGìQ²nWVY²`\\®SÒ¦\\nvÆKFyxJnXq¶\\xIĒ{}k¿ûY¡cEãNokBca±©EuL]{C{J]o{[ÉÛ^KmËbfYemvuBsQnyCdQ£yWaºHV×eÿwWªmKsUqMqccgfy¬yM{mTěµo­ºLoiÕz}çJmU~±IegFEmy¯aPu[ßnS^Z§XY]qXIrsPHn´»\\¯_gjI| Ab]®R¢g@aFc¸Y^{F_xKNÁdÍ¾±jO¨}JùZµÝYL¡jwuEZ¤ecTXªQ^raPptjH~iZLcn_¢gA³d[IdWq`}S'],
					encodeOffsets: [
						[
							-76451,
							5890
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Caldas'},
				geometry: {type: 'Polygon',
					coordinates: ['@@@`t Z¦ÂPl[xJ[ĔMf`rsT@°´[AYÆ¦ªmP[Swd}ZB£zS\\¬æj^¾RbzhJÞH^~Dj\\ÎZ´£ÈFpÊ¶NCoE_YNwo³ZbËq@e]_kuģzygÁ`omF£aSyy·q\\OawiS`Å±Mu|wB{B\\fQGs©¿}BkZW¾sPM{foOoPksyB£Đquo§PewZM²atVho^|¦Ee^Ă}v\\Jnn\\F`N¥yIm`Lt_ì'],
					encodeOffsets: [
						[
							-77688,
							5620
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Caquetá'},
				geometry: {type: 'Polygon',
					coordinates: ['@@¤jxIrºtZ¢@P¶Tv¤Ö^fNNzlâtz]h\\ÜXXtHrª|rK|E^|YÌfW|ÆRrl®èÌÒĊFpTxg²frG^Ex³hcgmT}Qq[wE{qåJw\\py²IIN¡cP\\enÉHG³¾qk¬NziÊI_de´ZN¥¬@in­v^N½r°F\\SN]OcC}¨Û¢t¿¼j±gIdçgTwÒ\\vYIKmZqpPw®tbQDlFArm| xaCczgn|XNc JjW}®{`|FpK_VÁr\\\\k[e^ioWdyrehtvQ{xa\\vh]¢P\\a|Az¡dVMRA§¾e`_ed§vr|YnçimjW®rVxÀu~w~`ET HFHqLdcEueyy£sÉK¯c³KgS{×¥W·^ÅuáiýJGÕNe]g£[yY±ÇgIWÉZwWuóÇ~g¨cCďěkhÕ®{Z³CÙF_RgEsµCqX­aI×äÙmk¿l§c±feQ_IkRYMyO}@qo»@·đjyVs~WO wScsqTC{XMq½J|hb]dwO«OkU@qawsDWu}í|Ru`Uv¡¤jirNK£ óVCµ±UBthpo^S¤~\\Þ«TmYEiD}JGh}OvfMep^d[lm@¿xwBc³rUhwYynF~Ñ`QzwZgµDqqazsit@luT[qTRh_]MTHPÑ}EÉ\\y`kºCrlXTr~|`CrIc¦'],
					encodeOffsets: [
						[
							-77996,
							1626
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Cauca'},
				geometry: {type: 'Polygon',
					coordinates: ['@@HÌxnUCs|~e¤lRG|paÊ]pGnN¦VÄCtvEp}n@jc¸FtYhvUln´Ltl|WDªAi¤U L¾Ure\\yJîmXZYuogf¯]pePvKJufYQ¿ÎËĖïzGj_´sI»AgÁByduCy}Gi{IofMr¹»S·LiñtËuEqZ±¼y^µYyc[£}]BÏa[jÉ^yPS{NUYeJo@zòkwpÉ|rXea±N[ªJhjw¬HAr£l^d¥JqD_}{SqkWqDl¹z_Ê[~FÒGOJsFu_lWZgceáSWMdÉEoa©Yt©Rk¢nÚ@¾upa®XlCÐ]@esXUl}Xqm£m§YÓ]@w}c\\UÐpXK~n¤envÆ]µBe[u·S`±MqYL­p|¸LpUv¶tCtzRZ|cNoxzn´@ UzRf´A³|aByûÇP¥H«]g\\inLcJYPmª@g]^OĊVA¦W jTA~¾lU`ÊL`po\\pĢrb@f¶j¸Þ'],
					encodeOffsets: [
						[
							-79401,
							3295
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Chocó'},
				geometry: {type: 'Polygon',
					coordinates: ['@@wEwAÃqmc}½Qo¿RxLjm^§Ì¥eåa]CP£ĕÕWmmÇ£M_fY·esC_C]g^[Bq¿u_HN»juF}d¦oTS£ßsHcqFw«GvZ£TlqC\\YxMÀ»z{GQağHi¦uz£Ue[mpG¤]FmuAsi]~kYmC]g\\iGw_Y±ilBºKbP´nÊQdfQlZzpd^İTAƒvXYxmJYrQðaâIŘaÂPär[xsNDpW°n·qJg_P H²RdvM|Hxi|`l VpGÐ¡øDhyÖujY§¦}i¦EzX¼~Axx¢Cl\\ºrZQxPÈjd\\m~§FQxj­GS_SgÜm¸­rGbUS^`¾tGxÃĂ¡tqyLÁÚÒȴzB^[`|ĠNÀXfI ^µ åR|¬zOT¨jjFHtlTi@bHPlJÖ@\\¸_¶Vf]qxVhg¶]OU¶J³ôE@ØªÂ[td`È¤ÇF£t¸¸u\\Di«²B^»`kI©kZQuMsUãHu_Ã±JHn¶»TkaÖÅyxîĝnIª¶{²t¹De§iK½ooyOhŭmJhYZ·Uy}CewficaZ_yDWeJ³{E·tOjSiZmAXjHe¥H{r]gH¿~MMmAÜIp¢[Bc`^¬QTfxRêL²R½RÉnROxfbwlYE_µYoN§jgB±cjk²R{M'],
					encodeOffsets: [
						[
							-77833,
							5702
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Guainía'},
				geometry: {type: 'Polygon',
					coordinates: ['@@RjĎvhPjQ~à~E®]¢pKd^wDz^H|hLhrdhir`brPyxHlX£UpPxl¨Tlrn]\\ºrBne`\\rtUfq^R¸nBx§|F{¤RAx^Ev`Zo|@na¾G®\\lâSPltbbQdD¶vG[yADxWIXW~JLrtbbeÂ´ahlfanr@B|xHlgvV\\hPt]¬RZ|zpZfOfpVSt|~]@fRds`njlzv[VKVe¾@YtrZ¡\\~OP|ypLxaS\\~Pvhrè® d\\đtj@¹ÔJR^qHáIT·À{x¹m±A«Få×̉ʵBÝpD\\~ò`HiäkfAyliKµ`Uzf_\\jKzxWV}]°ñY zsO¹çr @dçcO¶³f»V]F·íJsz§Ij[rXI¯To]`wAuLwrȡ½BaFlBªzKFºäTmzZ~wrIÐ\\xWHd{O©y~ÆItTzEe^GXm[SQK{oqOcoÏgÅJG]©ksAsMw}Y«uV]jL@gXs¦mvK]ºkÙObaDOpY`Xx_Oҟ@փAaX£XsC©v·qUY©m£dKwMjWMsTÃ@ÅxÿöyFdÌhEAztUXOô¤Ä{XIhk©CgiSR_r·±rXkj«MqÇºJm`YºAjÁºE~oTogh}o[Teξư'],
					encodeOffsets: [
						[
							-72198,
							2854
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Guaviare'},
				geometry: {type: 'Polygon',
					coordinates: ['@@FֲxHG²^n@AgºtTVvtT¸Z®EdqnMKIäxV{´LèÀub|JxRjjfv{~_XjbBBzRº¶VCHL|]|^vfpqrHBpRnALrkRzIdnrQ^¤kZrs`l¤DÄ^nIJWChCbÈ¬±®ilh¬VMrQV\\ÊeHÄX°LGnzDHÐ_br`fw ARn¢Ffs~\\VY[{vSPz]\\pz^nQjhhYGkhYjrDbzqX\\Nâ¯νƯfSp\\~gphpSF}Â¹Bi¹Zn_IÈ¹r¬NliWq¸²`q QThjªDlJg|WÃó£P£gwV¯iAÏyÛ@Kmm[L[aĩuqYroU©IXmUuT[ww¯£ÓQmcMË¡Wm±»IehcYV¡cåeHOsÑmg@¡qeµuyVÑtN½ng|gBoU¥i­`EwqBȕȉcUy¢{B[b¡Og^[uwbR|ugsqfczpX]j\\f[lq[ÂU`oLE{_­|~XiIMd{WmyhDdwbn{BqECkaR­sxoOYrnLJuZ[ÑSxhcèJhi²»sÀ¡§ÜD~'],
					encodeOffsets: [
						[
							-75426,
							1654
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Magdalena'},
				geometry: {type: 'Polygon',
					coordinates: ['@@T¶|jHn¨FVli ldAĔ_ÒxGxC©Uæ{²sĬļ{´IÆBªRt¢ÀiP~[XlShh`rÈ GffªnĈAs®aqÈcRW¦AÒVnI]¿wqc{sK^wYm^w¥loRÇfe\\clmNsue^yB·RdKTÍ]yLI}J«LqWAu]CuSyqUKysLm]qLq_mµbUnwÓ¨^OotH¡ȹ©ÇsÂpwÊQÙuM¡]mNÌWzD[XÆ­uOgaFssGdsU_ZWPUgB^kl¥ÈOcVF¿|eºqCqLÊ§QZWtwVEMrwfqOGN[ZzJzOmbdy¢VjIvK´e¶hd¾bH up}mbL{^CvĘ'],
					encodeOffsets: [
						[
							-76705,
							10500
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Meta'},
				geometry: {type: 'Polygon',
					coordinates: ['@@Vp¨lx\\FtZX~JZ^j®v|IxZ^kpFxo¦¸nCxêvZlHjlxÈ¦^qvRjr¢ªPj]P¦BT¢D~`XzI|~Lfr¾QS¤`pOàcfHtjlXFxr|¦~bcPg{Eu|F£^aZ©ÐuÜ HaÊ]¤_Ê·XÔЎBBEbÊËPiÔđ }xw`|]|·¦kJpnLaZzMHBªwiZzpDT^¤G¶X´kfâFXL°F^|phWŠÄ~¸TRZÔj @|^||ì`¦nJx@ˡ@Ї@ҝ@ȃ@ЉQBex_aqÏ`GyCHm¯KWÃGÉfU[RNq«Ukg­j«²aÇgDDXImJÃ]£C_kqtY£l]qRcmJQylKqmBoQAqGore]u{{^KGDµU¹QAyaAiW}`u|eiiQIw{vaç¿³KU|ãwJLNmcr­F·YSusUS¹sBh@]mH±wGEֱdP^MT[¯Eq¾Mu]m®j«@M¦³Ycf`ÉJyj«Ml½rH´GmÊ[fOdM¢J±Joz[xIæ|rF\\xrRS~nhgdw´F]qH±ewhSoĉE'],
					encodeOffsets: [
						[
							-76732,
							2977
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Norte de Santander'},
				geometry: {type: 'Polygon',
					coordinates: ['@@wJµ[rmWIwEzLuÅ[mÑ¥T­_[_wyPDSªi^wW@w[YEWco¼å¨DfktKvM¸~u¬Nv`[ÀTl­X[aÙ@f_KR}¥L^×Goy[§R«ÀOz}LF~M}¤ftZzjZ¨U¢RPv|@ªeGYkLQQAªXs~LnCjIjXL¼[¨{bqMfÛ»]nMttOtRoSyh hrON¢WrbznHv|vjFUÎcpjYÜFtfB¬U`b°~CjC°Wl~Iª|Bz\\@jBxáRyW¡t¾ZJ|¤WjZ\\qGjûxãlŅǇvQdwƶǓhKt·O½ąSOM³h[BÛ~y[[¿x`¯IeuOƓpÇeIbSdFêM~k`U\\nY©_Cłǳ'],
					encodeOffsets: [
						[
							-73776,
							7209
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Quindío'},
				geometry: {type: 'Polygon',
					coordinates: ['@@\\PkZTQÀDOy¨|vFrdH[F_gG­±W£Asį©ïGy±KcÕn]rC|jAÈQjN]^BxN]ZAlðBînªl²O®JS¶'],
					encodeOffsets: [
						[
							-77531,
							4827
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Risaralda'},
				geometry: {type: 'Polygon',
					coordinates: ['@@v£¨UuL`ëKsn_J¦zM_Em[Imu[ā~]fF{¥]pgUbsN±YxOfp¨rv¤ďAtzlpOpP|eNtO½XlY~AY­@qcuE§{zP¿CRYSl[OÝHµjBkAegHOªxtsvGc^EvmÌy|eAb^fæË¦]¨inKwQpÀ¾Rd~rnBÄxxF'],
					encodeOffsets: [
						[
							-77833,
							5702
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Sucre'},
				geometry: {type: 'Polygon',
					coordinates: ['@@rÂrâDWªÛ\\^p~dR¤KXpH~fMpVlB¬Wê~đjeRD`}_^y]Ö[BuÍZMS§UUG¡_YvV Glc¶¿ CBÕaÈBA³iP_m­Ij{rÅfgSk²Kb\\Ej¯dm\\ig@s`L±K|gWqJsEk¯GJyq}wëXiwuHOPbk­eqH]µWá±o{·fYCR~iQ¦\\ìIÆ VvI¸zHbbH|qr£KHv¥_IqpWDx`_p\\dMePeeH]e¿~'],
					encodeOffsets: [
						[
							-77528,
							9585
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Valle del Cauca'},
				geometry: {type: 'Polygon',
					coordinates: ['@@Hx[j^hDnlZ}j^Btnv^EH£nof\\¤Vvyj¥ĠGRb|H¼y¿NZw[rDkS¤YHu¬ExdrtGàT¤S¥pcE~ivM¼`GÀvr\\A ]^hDD`tfZ¸eN`È¤nnÖX ĖO¤DfBz{nËuFd]HtuwsP©GfhlBA¶iÞGTµ­I±Pkm©AíkïB^YMAw^]MRiÇBiD{^qÖm^ow­Ck§¥Dwewwe­R{RÝ³ĻK¿Wih©UgV{a{WYínI[zqf½VK£Vj©BCXk{Ks³kmVgusZ·Eidm@o~FusÃDUM¥mHoÉ^b{oHkQ£}f{DtmVwËGCn À¾¶h@¦úKt°ÈRXdPMeIKÆ_\\Lv¨fKJYkEoOcďPil^sTGtv¨^FxÿQqiK_qYcF]³Az^ZUt'],
					encodeOffsets: [
						[
							-79292,
							4176
						]
					]}},
			{type: 'Feature',
				properties: {name: 'Vaupés'},
				geometry: {type: 'Polygon',
					coordinates: ['@@ȖȊAxrF_®jV¦Aphh{mM¾sUÒvzf¶r@¢nhtÒPfGdæU¢dZfgJ¼²XnÌ¢NndÔR°¤x\\xvSnVWªJpVqrZĪv\\bKn\\LnÜ@ÐzB°jUx¤hWVysBgFcËzEĀõÆwÄ@tSXN@գQÔ^CĀps ETªOHslE~KdR`u¸_¢¥e_\\iUiy\\mwKomA`ãuNm~Y¥_W¹Lg³Oy §¯¢YpÇ¥ñÇ{|mH_iw@ggoih[£Ns£lSooMqh@е@ɑLg´±ZimF^qyb@ÌwvwWAfmSYuÇNo­By{C¥lmcP{ieufSOqRkGfawGsnFaYJuI¥PKBÄA§ÈpqMNwnYUmZ°w@£C_gvxWzkr_cWcV[{sIFs¦FDcGgZExttqfa^uTBTxr|}vG°f]vTUðctkK_bt|`|~PmryOctwBUquF}{M[sFc_]s¿k fksu`GE½uYofYxH[·°\\p^ub_ vkrkWJsÁqlYW|DvotiW^Jr\\FvcdKGrEGSF}_}x¿vwU­qiXjnmè{Zuqc¨`f_½fB¨QN'],
					encodeOffsets: [
						[
							-73761,
							681
						]
					]}}
		],
		UTF8Encoding: true});
}));
