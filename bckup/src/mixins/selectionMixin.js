import {dataTypes} from '@/util/queryBuilder';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {isEqual} from 'lodash';

export default {
	data: () => ({
		selected: [],
		notHidden: []
	}),
	computed: {
		parentId() {
			return this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		selection() {
			if (this.selected.length > 0) {
				return [...this.selected];
			}
			if (this.widgetData && this.widgetData?.baseOption?.series && (this.notHidden?.length < this.widgetData?.baseOption?.series?.[0]?.data?.length
				|| this.notHidden?.length < this.widgetData?.dataset?.source[0]?.length)) {
				return [...this.notHidden];
			}
			return [];
		},
		myDynamicFilter() {
			if (this.selectedDataset) {
				return this.$store.getters['widgetInstances/filter'](this.parentId, this.selectedDataset).filter((filter) => filter.widgetId === this.widgetInstanceId);
			} else if (this.selectedCatalogItem) {
				return this.$store.getters['widgetInstances/filter'](this.parentId, this.selectedCatalogItem).filter((filter) => filter.widgetId === this.widgetInstanceId);
			}
			return null;
		},
		selectedCatalogItem() {
			return this.widgetConfiguration?.data?.catalogItemId ?? null;
		},
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		selectedDataset() {
			return this.widgetConfiguration?.data?.datasetId ?? null;
		},
		rawData() {
			return this.$store.getters['widgetData/rawData'](this.widgetInstanceId);
		},
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
		},
		widgetTypeMetadata() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType).configuration.data;
		}
	},
	watch: {
		selection(newVal, oldVal) {
			const dimensionCount = this.widgetConfiguration?.data?.configuration?.dimensions?.length ?? 0;
			if ((dimensionCount > 0) && !isEqual(newVal, oldVal) && ((newVal?.length > 0) || (this.myDynamicFilter?.length > 0))) {
				const filters = Array.from({length: dimensionCount}, () => []);
				if (this.widgetType === widgetTypes.BAR_MULTISERIES) {
					newVal.forEach((select, innerIndex) => {
						select.forEach((dimensionSelect) => {
							filters[innerIndex].push(dimensionSelect);
						});
					});
				} else {
					newVal.forEach((select) => {
						select.forEach((dimensionSelect, index) => {
							filters[index].push(dimensionSelect);
						});
					});
				}
				this.setFilter(filters);
			}
		},
		myDynamicFilter: {
			handler(value) {
				if (!value || value.length === 0) {
					this.selected = [];
				}
			},
			deep: true
		}
	},
	methods: {
		// eslint-disable-next-line max-lines-per-function
		setFilter(filters) {
			let dimensions = null;
			if (this.widgetTypeMetadata.mapType) {
				dimensions = [
					{
						dataset: this.widgetConfiguration.data.datasetId,
						column: this.widgetConfiguration.data?.configuration.dimensions.latitudeColumnName
					},
					{
						dataset: this.widgetConfiguration.data.datasetId,
						column: this.widgetConfiguration.data?.configuration.dimensions.longitudeColumnName
					}
				];
			} else {
				dimensions = this.widgetConfiguration.data?.configuration.dimensions ?? null;
			}
			if (!this.preview && dimensions && dimensions.length > 0) {
				filters.forEach((filter, index) => {
					const values = filter.map((name) => {
						if (Array.isArray(name)) {
							return name;
						}

						let filterItem = name;
						if (typeof name !== 'string') {
							filterItem = String(name);
						}

						const tmpFilter = ((filterItem.startsWith('[') && filterItem.endsWith(']'))
							? filterItem.substring(1, filterItem.length - 1).split(' - ')
							: [filterItem]).map((value) => value === '<NULL>' ? null : value);
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
					});
					this.$store.dispatch('widgetInstances/setFilter', {
						widgetInstanceId: this.parentId,
						dataset: this.selectedDataset ? this.selectedDataset : this.selectedCatalogItem,
						column: dimensions[index].column,
						filter: filter.length === 0
							? null
							: {
								widgetId: this.widgetInstanceId,
								columnName: dimensions[index].column,
								values
							}
					});
				});
			}
		}
	}
};
