import {mapDimensionAxesConfiguration, mapMetricAxesConfiguration} from '@/util/widgetDataBinding';
import colorMixin from '@/mixins/colorMixin';
import {dataTypes} from '@/util/queryBuilder';
import {rgbLinearShade} from '@/util/colors/shade';
import widgetMixin from '@/mixins/widgetMixin';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import isEqual from 'lodash/isEqual';
import clone from 'lodash/clone';
import uniqWith from 'lodash/uniqWith';

export default {
	mixins: [
		colorMixin,
		widgetMixin
	],
	props: {
		previewConfiguration: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			lastFilter: [],
			unfilteredDynamicFilter: false,
			transformDataDebounceTimer: null
		};
	},
	computed: {
		preview() {
			return this.previewId !== null;
		},
		themeColors() {
			return this.$store.getters['storyDetail/story'].layoutConfiguration.theme.colors ?? null;
		},
		themeRecolor() {
			return this.$store.getters['storyDetail/story'].layoutConfiguration.theme.recolor ?? null;
		},
		coloring() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.COLORING) ?? null;
		},
		rawData() {
			return this.$store.getters['widgetDataCache/data'](this.widgetInstanceId ?? this.previewId);
		},
		selectedDataset() {
			return null;
		},
		dynamicFilter() {
			return (this.preview || !this.selectedDataset)
				? []
				: uniqWith(
					this.$store.getters['widgetInstances/filter'](this.parentId, this.selectedDataset)
						.filter((filter) => this.unfilteredDynamicFilter || filter.widgetId !== this.widgetInstanceId),
					isEqual
				);
		}
	},
	watch: {
		dynamicFilter(value) {
			if (!isEqual(value, this.lastFilter) && !this.widJustChanged) {
				this.lastFilter = clone(value);
				this.$store.dispatch('widgetDataCache/loadData', {
					widgetInstanceId: this.widgetInstanceId,
					dynamicFilter: value
				});
			}
		},
		themeColors() {
			if (this.coloring) {
				this.generateColors(this.rawData.columns.length).then(() => {
					const defaultColors = new Array(this.rawData.columns.length);
					this.coloring.forEach((element) => {
						if (this.themeRecolor === false) {
							defaultColors[element.index] = {
								index: element.index,
								color: this.getColor(element.index, true)
							};
						} else {
							// eslint-disable-next-line no-lonely-if
							if (element.color.indexOf('#') !== -1 || element.singleMetric) {
								defaultColors[element.index] = {
									index: element.index,
									color: element.color
								};
							} else {
								defaultColors[element.index] = {
									index: element.index,
									color: this.getColor(element.index, true)
								};
							}
						}
					});
					this.setOption(widgetOptionName.COLORING, defaultColors);
					this.transformDataHandler(() => {
						this.transformData(this.rawData);
					});
				});
			}
		}
	},
	beforeMount() {
		this.$watch('rawData', {
			immediate: true,
			handler(data) {
				const debug = this.$route?.query?.debug;
				if ((data?.rows?.length ?? 0) > 0 && typeof debug === 'undefined') {
					this.$nextTick(() => this.transformDataHandler(() => this.transformData(data)));
				} else if (data) {
					if (debug === '1') {
						this.setOption('noDataMessage', this.$t('t_debugMode'));
					}
					this.setWarning();
				}
			}
		});
	},
	methods: {
		transformDataHandler(callback) {
			if (this.transformDataDebounceTimer) {
				clearTimeout(this.transformDataDebounceTimer);
				this.transformDataDebounceTimer = null;
			}
			this.transformDataDebounceTimer = setTimeout(() => {
				callback();
			}, 100);
		},
		stopLoading() {
			if (!this.preview) {
				this.$store.commit('widgetInstances/setLoading', {
					widgetInstanceId: this.widgetInstanceId,
					loading: false
				});
			}
		},
		setWarning(warning = true) {
			if (!this.preview) {
				this.$store.commit('widgetInstances/setWarning', {
					widgetInstanceId: this.widgetInstanceId,
					warning
				});
			}
		},
		saveConfiguration() {
			this.$store.dispatch('widgetInstances/setConfiguration', {
				widgetInstanceId: this.widgetInstanceId,
				configuration: this.newConfiguration
			})
				.then((reloadData) => {
					if (reloadData) {
						this.$store.dispatch('widgetDataCache/loadData', {
							widgetInstanceId: this.widgetInstanceId
						});
					}
				});
		},
		setFilter(filters) {
			if (!this.preview && this.dimensionColumns && this.dimensionColumns.length > 0) {
				filters.forEach((filter, index) => {
					this.$store.dispatch('widgetInstances/setFilter', {
						widgetInstanceId: this.parentId,
						dataset: this.selectedDataset,
						column: this.dimensionColumns[index].column,
						filter: filter.length === 0
							? null
							: {
								widgetId: this.widgetInstanceId,
								columnName: this.dimensionColumns[index].column,
								values: filter.map((name) => {
									if (Array.isArray(name)) {
										return name;
									}

									const tmpFilter = ((name.startsWith('[') && name.endsWith(']'))
										? name.substring(1, name.length - 1).split(' - ')
										: [name]).map((value) => value === '<NULL>' ? null : value);
									const dimensionColumnsDataTypes = this.rawData.columns
										.filter((column) => column.reference.startsWith('Dimension'))
										.map((column) => column.dataType);
									switch (dimensionColumnsDataTypes[index]) {
										case dataTypes.DATETIME:
										case dataTypes.DATE:
											return tmpFilter;
										case dataTypes.INT:
										case dataTypes.LONG:
											return tmpFilter.map((value) => value === null ? null : parseInt(value, 10));
										case dataTypes.FLOAT:
											return tmpFilter.map((value) => value === null ? null : parseFloat(value));
									}

									return tmpFilter;
								})
							}
					});
				});
			}
		},
		// eslint-disable-next-line no-empty-function
		transformData() {},
		getColorPie(index, selected = false) {
			if (this.coloring === null || typeof this.coloring === 'undefined' || selected || index > this.coloring.length) {
				return selected
					? rgbLinearShade(0.6, this.$store.getters['storyDetail/graphColor'](index))
					: this.$store.getters['storyDetail/graphColor'](index);
			}
			return this.coloring[index].color;
		},
		getChangedColor(index) {
			if (this.coloring[index]?.color !== null) {
				return this.coloring[index].color;
			}
			return null;
		},
		getColumn(configuration, index) {
			if (configuration.data?.configuration?.dimensions?.length > index) {
				return mapDimensionAxesConfiguration(
					configuration.data.configuration.dimensions[index],
					configuration.data
				);
			}
			return {};
		},
		getMetric(configuration, index = null) {
			if (Number.isInteger(index) && configuration?.data?.configuration?.metrics?.length > index) {
				return mapMetricAxesConfiguration(configuration.data.configuration.metrics[index], configuration.data);
			}
			return configuration.data.configuration.metrics
				.map((metric) => mapMetricAxesConfiguration(metric, configuration.data));
		},
		findNewIndexes(columns) {
			const temp = {};
			columns.forEach((element, i) => {
				temp[element.reference] = i;
			});
			return temp;
		}
	}
};
