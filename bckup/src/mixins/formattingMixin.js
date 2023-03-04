import {dataTypes, dimensionDefinition} from '@/util/queryBuilder';
import cloneDeep from 'lodash/cloneDeep';

export default {
	methods: {
		// eslint-disable-next-line max-lines-per-function, complexity, max-statements
		formatter(option, axis = option, advancedOptions = {}) {
			const {
				transformParams = null,
				datatypeOverride,
				tooltip = false,
				shortLabel = false,
				characterValue
			} = advancedOptions;
			let column = this.$store.getters['widgetInstances/option'](this.widgetInstanceId, option);

			if (option === 'timeline') {
				column = column?.column;
			}
			if ((option === 'columns' || option === 'metric') && Array.isArray(column)) {
				column = column?.[0];
			}

			let datatype = datatypeOverride ?? (this.$store.getters['storyDetail/datasetColumn'](column?.dataset, column?.column)?.dataType ?? null);

			if ((column?.function !== null || typeof column?.function !== 'undefined') && option === 'metric') {
				datatype = dataTypes.INT;
			}

			if (axis && datatype) {
				const options = this.selectedFormat?.[axis] ?? {};
				switch (datatype) {
					case dataTypes.DATETIME:
					case dataTypes.DATE: {
						if (column && column.function === dimensionDefinition.EXTRACT_DATE) {
							break;
						}
						return ((params) => {
							const data = typeof transformParams === 'function' ? transformParams(params) : params;
							if (!this.intlFormatter || this.intlOptions !== options) {
								this.intlOptions = options;
								this.intlFormatter = new Intl.DateTimeFormat('default', options);
							}

							try {
								return this.intlFormatter.format(new Date(data * 1000));
							} catch {
								try {
									return this.intlFormatter.format(new Date(data));
								} catch {
									return data.toString();
								}
							}
						});
					}

					case dataTypes.INT:
					case dataTypes.LONG:
					case dataTypes.FLOAT: {
						if (column && column.function === dimensionDefinition.BUCKET_VALUE) {
							return (params) => {
								const enumToFind = typeof params === 'string' ? params.replace(',', ' - ') : params;
								const data = typeof transformParams === 'function' ? transformParams(params) : enumToFind;
								const enumeration = this.getEnum(option, enumToFind);
								if (enumeration !== enumToFind) {
									return enumeration;
								}
								return data;
							};
						}
						return (params) => {
							const data = typeof transformParams === 'function' ? transformParams(params) : params;
							if (option !== 'metric') {
								if (option === 'categoryY' || option === 'categoryX') {
									this.intlOptions = options;
									this.intlFormatter = new Intl.NumberFormat('default', options);
									return this.intlFormatter.format(data);
								}
								const enumeration = this.getEnum(option, params?.data?.name ?? params);
								if (enumeration !== params?.data?.name && enumeration !== data) {
									return enumeration;
								}
							}
							if (typeof params === 'string' && params.includes('-')) {
								return this.formatBucketsLabel(params);
							}
							if (isNaN(data)) {
								return '-';
							}
							if (!this.intlFormatter || this.intlOptions !== options) {
								this.intlOptions = options;
								this.intlFormatter = new Intl.NumberFormat('default', options);
							}
							return this.intlFormatter.format(data);
						};
					}
					case dataTypes.TEXT: {
						return (params) => {
							const result = this.getEnum(option, params?.data?.name ?? params);
							if (shortLabel && !tooltip) {
								return this.smartTrim(result, characterValue);
							}
							return result;
						};
					}
				}
			}
			return (params) => this.getEnum(option, params?.data?.name ?? params);
		},
		smartTrim(string, maxLength) {
			if (!string || maxLength < 1 || string.length <= maxLength) {
				return string;
			}
			if (maxLength === 1) {
				return `${string.substring(0, 1)}\u2026`;
			}

			const midpoint = Math.ceil(string.length / 2);
			const toremove = string.length - maxLength;
			const lstrip = Math.ceil(toremove / 2);
			const rstrip = toremove - lstrip;
			return `${string.substring(0, midpoint - lstrip)}\u2026${string.substring(midpoint + rstrip)}`;
		},
		formatBucketsLabel(params) {
			const interval = cloneDeep(JSON.parse(params.replace(' - ', ',')));
			return `${Math.round(interval[0] * 1e3) / 1e3} - ${Math.round(interval[1] * 1e3) / 1e3}`;
		}
	}
};
