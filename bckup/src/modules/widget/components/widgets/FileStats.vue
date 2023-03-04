<template>
	<!-- eslint-disable vue/no-v-html -->
	<p :style="style" class="d-flex justify-content-center align-items-center w-100 h-100 m-0 p-0" v-html="html" />
</template>

<script>
import widgetMixin from '@/mixins/widgetMixin';
import {$sanitizeHtml} from '@/util/sanitizeHtml';
import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import clone from 'lodash/clone';
import axios from '@/plugins/axios';

export default {
	name: 'FileStats',
	mixins: [widgetMixin],
	data() {
		return {
			filtered: 0,
			all: 0
		};
	},
	computed: {
		column() {
			return this.$store.getters['widgetInstances/option'](
				this.widgetInstanceId,
				'column'
			);
		},
		newConfiguration() {
			if (!(this.column && this.column.dataset && this.column.column)) {
				return null;
			}

			return {
				data: {
					binding: {
						dataset: this.column.dataset,
						databaseType: this.column.databaseType,
						metricAxes: [
							{
								columnName: this.column.column
							}
						]
					}
				},
				options: {
					format: this.format,
					noDataMessage: this.noDataMessage ?? 'No Data'
				}
			};
		},
		selectedDataset() {
			return (this.column && this.column.dataset) ? this.column.dataset : null;
		},
		style() {
			return {
				fontFamily: this.fontFamily,
				color: this.fontColor
			};
		},
		dynamicFilter() {
			return this.selectedDataset
				? uniqWith(
					this.$store.getters['widgetInstances/filter'](this.parentId, this.selectedDataset)
						.filter((filter) => this.unfilteredDynamicFilter || filter.widgetId !== this.widgetInstanceId),
					isEqual
				)
				: [];
		},
		format() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'format');
		},
		html() {
			return this.format
				? this.format
					// eslint-disable-next-line prefer-named-capture-group
					.replace(/\[(.*?)\]\((.+?)\)/gu, (match, text, url) => {
						const actualText = text || url;
						return $sanitizeHtml(`<a href='${url}' target='_blank' rel='nofollow'>${actualText}</a>`);
					})
					.replace(/\$[\w-]+/gu, (text) => this.$store.getters['widgetFacts/value'](text.substring(1)) ?? '...')
					.replace('{1}', () => this.filtered)
					.replace('{2}', () => this.all)
				: $sanitizeHtml(`${this.filtered} of ${this.all}`);
		}
	},
	watch: {
		dynamicFilter(value) {
			if (!isEqual(value, this.lastFilter) && !this.widJustChanged) {
				this.lastFilter = clone(value);
				this.loadData(value);
			}
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadConfiguration() {
			const configuration = this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
			if (configuration !== null) {
				this.setOptions({
					format: configuration.layout?.options?.format ?? '{1} of {2}',
					noDataMessage: configuration.layout?.options?.noDataMessage ?? 'No Data'
				});
				this.$store.commit('widgetInstances/setOption', {
					widgetInstanceId: this.widgetInstanceId,
					optionName: 'column',
					value: {
						dataset: configuration.data.binding.dataset,
						databaseType: configuration.data.binding.databaseType,
						column: configuration.data.binding.metricAxes[0].columnName,
						datatype: configuration.data.binding.metricAxes[0].datatype,
						function: configuration.data.binding.metricAxes[0].function
					}
				});
			}
		},
		startLoading() {
			this.$store.commit('widgetInstances/setLoading', {
				widgetInstanceId: this.widgetInstanceId,
				loading: true
			});
		},
		stopLoading() {
			this.$store.commit('widgetInstances/setLoading', {
				widgetInstanceId: this.widgetInstanceId,
				loading: false
			});
		},
		setWarning(warning = true) {
			this.$store.commit('widgetInstances/setWarning', {
				widgetInstanceId: this.widgetInstanceId,
				warning
			});
		},
		saveConfiguration() {
			this.$store.dispatch('widgetInstances/setConfiguration', {
				widgetInstanceId: this.widgetInstanceId,
				configuration: this.newConfiguration
			})
				.then((reloadData) => {
					if (reloadData) {
						this.loadData();
					}
				});
		},
		loadData(dynamicFilter) {
			this.startLoading();
			if (dynamicFilter && dynamicFilter.length > 0) {
				Promise.all([
					axios.post('widget/loaddata', {
						wuid: this.widgetInstanceId,
						dynamicFilters: dynamicFilter
					}),
					axios.post('widget/loaddata', {wuid: this.widgetInstanceId})
				])
					.then((res) => {
						const [
							filtered,
							all
						] = res;
						const filteredData = filtered.data.resultSet.data;
						const allData = all.data.resultSet.data;
						this.filtered = this.$formatNumber(filteredData[0][0]?.[0]) ?? 0;
						this.all = this.$formatNumber(allData[0][0]?.[0]) ?? 0;
						this.stopLoading();
					})
					.catch(() => {
						this.setWarning();
					});
			} else {
				axios
					.post('widget/loaddata', {wuid: this.widgetInstanceId})
					.then(({data}) => {
						const count = this.$formatNumber(data.resultSet.data[0][0]?.[0]) ?? 0;
						this.filtered = count;
						this.all = count;

						this.stopLoading();
					})
					.catch(() => {
						this.setWarning();
					});
			}
		},
		getPlaceholderValue(placeholder) {
			if (!this.resultSet.header) {
				return placeholder;
			}

			const index = placeholder.slice(1, -1);
			const dataIndex = this.resultSet.header.indexOf(`Metric${index}`);
			const value = this.resultSet.data[0][dataIndex];

			return dataIndex >= 0 ? value : placeholder;
		}
	}
};
</script>
