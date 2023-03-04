/* eslint-disable max-lines */
export const transformedSeries = {
	selectDataComparison: {
		animationThreshold: 10000,
		animationDuration: 333,
		textStyle: {
			fontFamily: '"Roboto", sans-serif',
			fontWeight: 500,
			fontSize: 17,
			color: '#8988AA'
		},
		tooltip: {
			textStyle: {
				fontWeight: 500,
				fontSize: 17
			},
			trigger: 'item'
		},
		title: [
			{
				show: false,
				text: '',
				left: 'center',
				padding: 10,
				textStyle: {
					fontWeight: 500,
					fontSize: 23
				}
			}
		],
		grid: {
			top: '15%',
			bottom: '15%',
			containLabel: true
		},
		xAxis: {
			axisTick: false,
			axisLine: false,
			axisLabel: {
				padding: [
					8,
					0,
					0,
					0
				],
				fontSize: 17,
				fontWeight: 400
			},
			id: 'x',
			type: 'value',
			max: 6826
		},
		yAxis: {
			axisTick: false,
			axisLine: false,
			axisLabel: {
				padding: [
					0,
					8,
					0,
					0
				],
				fontSize: 17,
				fontWeight: 400
			},
			splitLine: {
				lineStyle: {
					type: 'dashed',
					color: '#C9D4DA'
				}
			},
			type: 'category',
			data: ['%']
		},
		legend: {
			textStyle: {
				color: '#8988AA',
				fontSize: 17,
				padding: [
					0,
					0,
					0,
					8
				],
				fontWeight: 400
			},
			itemGap: 32,
			itemHeight: 16,
			itemWidth: 16,
			data: [
				{
					name: '"Greninja"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(255,10,135)'
					}
				},
				{
					name: '"Corviknight"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(85,180,88)'
					}
				},
				{
					name: '"Dhelmise"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(30,85,236)'
					}
				}
			],
			selected: {
				'"Greninja"': true,
				'"Corviknight"': true,
				'"Dhelmise"': true
			},
			type: 'scroll',
			top: 'bottom'
		},
		isWarning: null,
		colors: {
			coloring: null,
			theme: [
				'rgb(255, 10, 135)',
				'rgb(85, 180, 88)',
				'rgb(30, 85, 236)',
				'rgb(255, 173, 10)',
				'rgb(237, 29, 29)',
				'rgb(110, 82, 184)',
				'rgb(255, 163, 210)',
				'rgb(191, 227, 193)',
				'rgb(170, 191, 248)',
				'rgb(255, 224, 163)',
				'rgb(248, 170, 170)',
				'rgb(201, 190, 228)',
				'rgb(180,238,231)',
				'rgb(158,218,47)',
				'rgb(234,177,242)',
				'rgb(186,232,208)',
				'rgb(175,222,243)',
				'rgb(235,236,29)',
				'rgb(107,199,66)',
				'rgb(243,228,221)',
				'rgb(214,183,235)',
				'rgb(248,170,233)',
				'rgb(57,56,210)',
				'rgb(246,20,77)',
				'rgb(188,230,199)',
				'rgb(183,235,219)',
				'rgb(178,234,240)',
				'rgb(173,207,245)',
				'rgb(193,227,38)'
			],
			metadata: {
				dimensionColoring: true
			}
		},
		series: [
			{
				color: 'rgb(255, 10, 135)',
				name: '"Greninja"',
				type: 'bar',
				stack: '%',
				data: [2501],
				label: {
					show: true,
					formatter: '36.64%'
				},
				borderColor: 'rgb(255, 10, 135)'
			},
			{
				color: 'rgb(187,225,188)',
				name: '"Corviknight"',
				type: 'bar',
				stack: '%',
				data: [3015],
				label: {
					show: true,
					formatter: '44.17%'
				},
				borderColor: 'rgb(85, 180, 88)'
			},
			{
				color: 'rgb(30, 85, 236)',
				name: '"Dhelmise"',
				type: 'bar',
				stack: '%',
				data: [1310],
				label: {
					show: true,
					formatter: '19.19%'
				},
				borderColor: 'rgb(30, 85, 236)'
			}
		]
	},
	selectDataPieChart: {
		tooltip: {
			trigger: 'item',
			textStyle: {
				fontWeight: 500,
				fontSize: 17
			}
		},
		grid: {
			top: 10,
			bottom: 35,
			containLabel: true
		},
		legend: {
			show: true,
			itemGap: 32,
			itemHeight: 16,
			itemWidth: 16,
			data: [
				{
					name: '"Greninja"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(255,10,135)'
					}
				},
				{
					name: '"Corviknight"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(85,180,88)'
					}
				},
				{
					name: '"Dhelmise"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(30,85,236)'
					}
				},
				{
					name: '"Woobat"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(255,173,10)'
					}
				},
				{
					name: '"Xerneas"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(237,29,29)'
					}
				},
				{
					name: '"Octillery"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(110,82,184)'
					}
				},
				{
					name: '"Lapras"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(255,163,210)'
					}
				},
				{
					name: '"Anorith"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(191,227,193)'
					}
				},
				{
					name: '"Wingull"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(170,191,248)'
					}
				},
				{
					name: '"Runerigus"',
					icon: 'image://http://localhost:8080/img/checkbox-icon.136b4404.svg',
					textStyle: {
						color: 'rgb(255,224,163)'
					}
				}
			],
			selected: {
				'"Greninja"': true,
				'"Corviknight"': true,
				'"Dhelmise"': true,
				'"Woobat"': true,
				'"Xerneas"': true,
				'"Octillery"': true,
				'"Lapras"': true,
				'"Anorith"': true,
				'"Wingull"': true,
				'"Runerigus"': true
			},
			type: 'scroll',
			pageIconColor: '#6B6E74',
			top: 'bottom',
			left: 'center',
			orient: 'horizontal',
			textStyle: {
				color: '#8988AA',
				fontSize: 17,
				padding: [
					0,
					0,
					0,
					8
				],
				fontWeight: 400
			}
		},
		label: {
			show: false,
			position: 'top'
		},
		series: [
			{
				id: 'data',
				type: 'pie',
				data: [
					{
						value: 2501,
						name: '"Greninja"',
						selected: false,
						itemStyle: {
							color: 'rgb(255, 10, 135)',
							borderColor: 'rgb(255,10,135)'
						}
					},
					{
						value: 3015,
						name: '"Corviknight"',
						selected: true,
						itemStyle: {
							color: 'rgb(255,157,207)',
							borderColor: 'rgb(85,180,88)'
						}
					},
					{
						value: 1310,
						name: '"Dhelmise"',
						selected: false,
						itemStyle: {
							color: 'rgb(255, 10, 135)',
							borderColor: 'rgb(30,85,236)'
						}
					},
					{
						value: 861,
						name: '"Woobat"',
						selected: false,
						itemStyle: {
							color: 'rgb(255, 10, 135)',
							borderColor: 'rgb(255,173,10)'
						}
					},
					{
						value: 1146,
						name: '"Xerneas"',
						selected: true,
						itemStyle: {
							color: 'rgb(255,157,207)',
							borderColor: 'rgb(237,29,29)'
						}
					},
					{
						value: 348,
						name: '"Octillery"',
						selected: false,
						itemStyle: {
							color: 'rgb(255, 10, 135)',
							borderColor: 'rgb(110,82,184)'
						}
					},
					{
						value: 1774,
						name: '"Lapras"',
						selected: true,
						itemStyle: {
							color: 'rgb(255,157,207)',
							borderColor: 'rgb(255,163,210)'
						}
					},
					{
						value: 475,
						name: '"Anorith"',
						selected: false,
						itemStyle: {
							color: 'rgb(255, 10, 135)',
							borderColor: 'rgb(191,227,193)'
						}
					},
					{
						value: 406,
						name: '"Wingull"',
						selected: false,
						itemStyle: {
							color: 'rgb(255, 10, 135)',
							borderColor: 'rgb(170,191,248)'
						}
					},
					{
						value: 1465,
						name: '"Runerigus"',
						selected: true,
						itemStyle: {
							color: 'rgb(255,157,207)',
							borderColor: 'rgb(255,224,163)'
						}
					}
				],
				selectedMode: 'multiple',
				minShowLabelAngle: 10,
				radius: [
					0,
					'80%'
				],
				label: {
					position: 'inside',
					color: '#fff'
				}
			}
		],
		isWarning: null,
		animationThreshold: 10000,
		animationDuration: 333,
		textStyle: {
			fontFamily: '"Roboto", sans-serif',
			fontWeight: 500,
			fontSize: 17,
			color: '#8988AA'
		},
		title: [
			{
				show: false,
				text: null,
				left: 'center',
				padding: 10,
				textStyle: {
					fontWeight: 500,
					fontSize: 23
				}
			}
		],
		xAxis: {
			axisTick: false,
			axisLine: false,
			axisLabel: {
				padding: [
					8,
					0,
					0,
					0
				],
				fontSize: 17,
				fontWeight: 400
			}
		},
		yAxis: {
			axisTick: false,
			axisLine: false,
			axisLabel: {
				padding: [
					0,
					8,
					0,
					0
				],
				fontSize: 17,
				fontWeight: 400
			},
			splitLine: {
				lineStyle: {
					type: 'dashed',
					color: '#C9D4DA'
				}
			}
		}
	},
	stackedToMax: [
		{
			type: 'bar',
			name: '1',
			data: [
				{
					value: 0.6552266177626408,
					name: '"Greninja"'
				},
				{
					value: 0.646856897661446,
					name: '"Corviknight"'
				},
				{
					value: 0.62649450023912,
					name: '"Dhelmise"'
				},
				{
					value: 0.6203170028818443,
					name: '"Woobat"'
				},
				{
					value: 0.6154672395273899,
					name: '"Xerneas"'
				},
				{
					value: 0.6083916083916084,
					name: '"Octillery"'
				},
				{
					value: 0.8713163064833006,
					name: '"Lapras"'
				},
				{
					value: 0.5778588807785888,
					name: '"Anorith"'
				},
				{
					value: 0.5935672514619883,
					name: '"Wingull"'
				},
				{
					value: 0.6282161234991424,
					name: '"Runerigus"'
				}
			],
			realtimeSort: false,
			itemStyle: {
				color: 'rgb(255,10,135)'
			},
			label: {
				valueAnimation: true
			},
			stack: true,
			barWidth: '',
			barCategoryGap: null,
			barGap: null
		},
		{
			type: 'bar',
			name: '2',
			data: [
				{
					value: 0.3447733822373592,
					name: '"Greninja"'
				},
				{
					value: 0.35314310233855395,
					name: '"Corviknight"'
				},
				{
					value: 0.37350549976088,
					name: '"Dhelmise"'
				},
				{
					value: 0.3796829971181556,
					name: '"Woobat"'
				},
				{
					value: 0.3845327604726101,
					name: '"Xerneas"'
				},
				{
					value: 0.3916083916083916,
					name: '"Octillery"'
				},
				{
					value: 0.12868369351669942,
					name: '"Lapras"'
				},
				{
					value: 0.4221411192214112,
					name: '"Anorith"'
				},
				{
					value: 0.4064327485380117,
					name: '"Wingull"'
				},
				{
					value: 0.37178387650085765,
					name: '"Runerigus"'
				}
			],
			realtimeSort: false,
			itemStyle: {
				color: 'rgb(85,180,88)'
			},
			label: {
				valueAnimation: true
			},
			stack: true,
			barWidth: '',
			barCategoryGap: null,
			barGap: null
		}
	],
	stackedToMaxMultiseries: [
		[
			'_',
			'"Appletun"',
			'"Applin"',
			'"Arceus"',
			'"Chinchou"',
			'"Dedenne"',
			'"Duraludon"',
			'"Heatmor"',
			'"Heracross"',
			'"Landorus"',
			'"Seedot"',
			'"Trapinch"'
		],
		[
			'"Apple Nectar Pokemon"',
			1,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN
		],
		[
			'"Apple Core Pokemon"',
			NaN,
			1,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN
		],
		[
			'"Alpha Pokemon"',
			NaN,
			NaN,
			1,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN
		],
		[
			'"Angler Pokemon"',
			NaN,
			NaN,
			NaN,
			1,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN
		],
		[
			'"Antenna Pokemon"',
			NaN,
			NaN,
			NaN,
			NaN,
			1,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN
		],
		[
			'"Alloy Pokemon"',
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			1,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN
		],
		[
			'"Anteater Pokemon"',
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			1,
			NaN,
			NaN,
			NaN,
			NaN
		],
		[
			'"Abundance Pokemon"',
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			1,
			1,
			NaN,
			NaN
		],
		[
			'"Acorn Pokemon"',
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			1,
			NaN
		],
		[
			'"Ant Pit Pokemon"',
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			NaN,
			1
		]
	],
	averageAllMultiseries: [
		[
			'_',
			'"Appletun"',
			'"Applin"',
			'"Arceus"',
			'"Chinchou"',
			'"Dedenne"',
			'"Duraludon"',
			'"Heatmor"',
			'"Heracross"',
			'"Landorus"',
			'"Seedot"',
			'"Trapinch"'
		],
		[
			'"Apple Nectar Pokemon"',
			'3042'
		],
		[
			'"Apple Core Pokemon"',
			null,
			'1501'
		],
		[
			'"Alpha Pokemon"',
			null,
			null,
			'741'
		],
		[
			'"Angler Pokemon"',
			null,
			null,
			null,
			'262'
		],
		[
			'"Antenna Pokemon"',
			null,
			null,
			null,
			null,
			'1131'
		],
		[
			'"Alloy Pokemon"',
			null,
			null,
			null,
			null,
			null,
			'2954'
		],
		[
			'"Anteater Pokemon"',
			null,
			null,
			null,
			null,
			null,
			null,
			'1006'
		],
		[
			'"Abundance Pokemon"',
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			'1395',
			'2438'
		],
		[
			'"Acorn Pokemon"',
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			'401'
		],
		[
			'"Ant Pit Pokemon"',
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			'456'
		],
		[
			'Average',
			'139.34',
			'139.34',
			'139.34',
			'139.34',
			'139.34',
			'139.34',
			'139.34',
			'139.34',
			'139.34',
			'139.34',
			'139.34'
		]
	],
	averageAll: [
		{
			type: 'line',
			name: '1',
			stack: false,
			areaStyle: null,
			smooth: false,
			itemStyle: {
				color: 'rgb(255,10,135)'
			},
			lineStyle: {
				width: 3
			},
			emphasis: {
				focus: 'series',
				lineStyle: {
					width: 6
				}
			},
			connectNulls: false,
			showSymbol: false,
			symbolSize: 4,
			data: [],
			legendHoverLink: true,
			markLine: {
				symbol: [
					'none',
					'none'
				],
				label: {
					show: false
				},
				data: [
					{
						xAxis: 0,
						lineStyle: {
							type: 'solid',
							color: '#8CA4B0',
							width: 1
						}
					},
					{
						xAxis: 1,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 2,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 3,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 4,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 5,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 6,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 7,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 8,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 9,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					}
				]
			}
		},
		{
			type: 'line',
			name: 't_Average',
			stack: false,
			areaStyle: null,
			smooth: false,
			itemStyle: {
				color: 'rgb(85, 180, 88)'
			},
			showSymbol: false,
			symbolSize: 4,
			data: []
		}
	],
	averageBucketMultiseries: [
		[
			'_',
			'"Appletun"',
			'"Applin"',
			'"Arceus"',
			'"Chinchou"',
			'"Dedenne"',
			'"Duraludon"',
			'"Heatmor"',
			'"Heracross"',
			'"Landorus"',
			'"Seedot"',
			'"Trapinch"'
		],
		[
			'"Apple Nectar Pokemon"',
			'3042'
		],
		[
			'"Apple Core Pokemon"',
			null,
			'1501'
		],
		[
			'"Alpha Pokemon"',
			null,
			null,
			'741'
		],
		[
			'"Angler Pokemon"',
			null,
			null,
			null,
			'262'
		],
		[
			'"Antenna Pokemon"',
			null,
			null,
			null,
			null,
			'1131'
		],
		[
			'"Alloy Pokemon"',
			null,
			null,
			null,
			null,
			null,
			'2954'
		],
		[
			'"Anteater Pokemon"',
			null,
			null,
			null,
			null,
			null,
			null,
			'1006'
		],
		[
			'"Abundance Pokemon"',
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			'1395',
			'2438'
		],
		[
			'"Acorn Pokemon"',
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			'401'
		],
		[
			'"Ant Pit Pokemon"',
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			'456'
		],
		[
			'Metric Average',
			'304.20',
			'150.10',
			'74.10',
			'26.20',
			'113.10',
			'295.40',
			'100.60',
			'139.50',
			'243.80',
			'40.10',
			'45.60'
		]
	],
	averageBucket: [
		{
			type: 'line',
			name: '1',
			stack: false,
			areaStyle: null,
			smooth: false,
			itemStyle: {
				color: 'rgb(255,10,135)'
			},
			lineStyle: {
				width: 3
			},
			emphasis: {
				focus: 'series',
				lineStyle: {
					width: 6
				}
			},
			connectNulls: false,
			showSymbol: false,
			symbolSize: 4,
			data: [
				2501,
				3015,
				1310,
				861,
				1146,
				348,
				1774,
				475,
				406,
				1465
			],
			legendHoverLink: true,
			markLine: {
				symbol: [
					'none',
					'none'
				],
				label: {
					show: false
				},
				data: [
					{
						xAxis: 0,
						lineStyle: {
							type: 'solid',
							color: '#8CA4B0',
							width: 1
						}
					},
					{
						xAxis: 1,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 2,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 3,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 4,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 5,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 6,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 7,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 8,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 9,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					}
				]
			}
		},
		{
			type: 'line',
			name: '2',
			stack: false,
			areaStyle: null,
			smooth: false,
			itemStyle: {
				color: 'rgb(85,180,88)'
			},
			lineStyle: {
				width: 3
			},
			emphasis: {
				focus: 'series',
				lineStyle: {
					width: 6
				}
			},
			connectNulls: false,
			showSymbol: false,
			symbolSize: 4,
			data: [
				1316,
				1646,
				781,
				527,
				716,
				224,
				262,
				347,
				278,
				867
			],
			legendHoverLink: true,
			markLine: {
				symbol: [
					'none',
					'none'
				],
				label: {
					show: false
				},
				data: [
					{
						xAxis: 0,
						lineStyle: {
							type: 'solid',
							color: '#8CA4B0',
							width: 1
						}
					},
					{
						xAxis: 1,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 2,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 3,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 4,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 5,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 6,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 7,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 8,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					},
					{
						xAxis: 9,
						lineStyle: {
							type: 'dashed',
							color: '#C9D4DA',
							width: 1
						}
					}
				]
			}
		},
		{
			type: 'line',
			name: 't_MetricAverage',
			stack: false,
			areaStyle: null,
			smooth: false,
			itemStyle: {
				color: 'rgb(30, 85, 236)'
			},
			showSymbol: false,
			symbolSize: 4,
			data: [
				'1908.50',
				'2330.50',
				'1045.50',
				'694.00',
				'931.00',
				'286.00',
				'1018.00',
				'411.00',
				'342.00',
				'1166.00'
			]
		}
	]
};

export const echartsContext = {
	colors: {
		coloring: null,
		theme: [
			'rgb(255, 10, 135)',
			'rgb(85, 180, 88)',
			'rgb(30, 85, 236)',
			'rgb(255, 173, 10)',
			'rgb(237, 29, 29)',
			'rgb(110, 82, 184)',
			'rgb(255, 163, 210)',
			'rgb(191, 227, 193)',
			'rgb(170, 191, 248)',
			'rgb(255, 224, 163)',
			'rgb(248, 170, 170)',
			'rgb(201, 190, 228)',
			'rgb(180,238,231)',
			'rgb(158,218,47)',
			'rgb(234,177,242)',
			'rgb(186,232,208)',
			'rgb(175,222,243)',
			'rgb(235,236,29)',
			'rgb(107,199,66)',
			'rgb(243,228,221)',
			'rgb(214,183,235)',
			'rgb(248,170,233)',
			'rgb(57,56,210)',
			'rgb(246,20,77)',
			'rgb(188,230,199)',
			'rgb(183,235,219)',
			'rgb(178,234,240)',
			'rgb(173,207,245)',
			'rgb(193,227,38)'
		],
		metadata: {
			dimensionColoring: true
		}
	},
	dynamicFilter: []
};

export const coloring = {
	theme: [
		'rgb(255, 10, 135)',
		'rgb(85, 180, 88)',
		'rgb(30, 85, 236)',
		'rgb(255, 173, 10)',
		'rgb(237, 29, 29)',
		'rgb(110, 82, 184)',
		'rgb(255, 163, 210)',
		'rgb(191, 227, 193)',
		'rgb(170, 191, 248)',
		'rgb(255, 224, 163)',
		'rgb(248, 170, 170)',
		'rgb(201, 190, 228)',
		'rgb(180,238,231)',
		'rgb(158,218,47)',
		'rgb(234,177,242)',
		'rgb(186,232,208)',
		'rgb(175,222,243)',
		'rgb(235,236,29)',
		'rgb(107,199,66)',
		'rgb(243,228,221)',
		'rgb(214,183,235)',
		'rgb(248,170,233)',
		'rgb(57,56,210)',
		'rgb(246,20,77)',
		'rgb(188,230,199)',
		'rgb(183,235,219)',
		'rgb(178,234,240)',
		'rgb(173,207,245)',
		'rgb(193,227,38)'
	],
	colors: [
		'rgb(255,10,135)',
		'rgb(255,10,135)',
		'rgb(255,10,135)',
		'rgb(255,10,135)',
		'rgb(255,10,135)',
		'rgb(255,10,135)',
		'rgb(255,10,135)',
		'rgb(255,10,135)',
		'rgb(255,10,135)',
		'rgb(255,10,135)',
		'rgb(255,10,135)'
	],
	multiple: true
};

export const selected = [
	['"Corviknight"'],
	['"Xerneas"'],
	['"Lapras"'],
	['"Runerigus"']
];

export const echartsOptions = {
	data: {
		id: 'f23083f7-8ba5-4e3c-b8b7-96c698a72a38',
		datasetId: 'bb4ca9f4-9e71-4fc8-bb97-dbb49880a105',
		widgetId: '00fea9fa-46cc-4df3-9c41-c063e1bff4d1',
		configuration: {
			version: 'default/v0',
			dimensions: [
				{
					column: 'Pokemon Name',
					function: 'NO-CHANGE'
				}
			],
			orderBy: [],
			metrics: [
				{
					column: 'Pokemon Id',
					aggregation: 'SUM'
				}
			],
			limit: 10,
			lastValueColumn: false
		}
	},
	options: {
		version: 'default/v0',
		title: '',
		legendGridWidth: 30,
		smoothLine: false,
		selectedLegend: {

		},
		connectUndefined: false,
		graphSymbols: false,
		coloring: [
			{
				color: 'rgb(255,10,135)',
				index: 0
			},
			{
				color: 'rgb(85,180,88)',
				index: 1
			},
			{
				color: 'rgb(30,85,236)',
				index: 2
			},
			{
				color: 'rgb(255,173,10)',
				index: 3
			}
		],
		averageLineBucketing: false,
		averageLineAll: false,
		verticalLabel: 'horizontal',
		replaceUndefined: false,
		switchToLog: false,
		showLegend: true,
		markLines: true,
		noDataMessage: 'No Data',
		stacked: false,
		legendPosition: 'bottom'
	},
	staticFilter: {
		version: 'default/v0'
	}
};
