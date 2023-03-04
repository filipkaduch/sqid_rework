import {aggregateFunctions, filterFunctions, format, getType} from '@/util/dataGrid';
import {dataTypes, ordering} from '@/util/queryBuilder';
import cloneDeep from 'lodash/cloneDeep';

// eslint-disable-next-line max-lines-per-function
const itemsFilterAndSort = (items, filters, sorting) => {
	let newItems = null;
	const columnReferences = items.columns.map((column) => column.reference);
	if (filters?.length > 0 && items.rows.length > 1) {
		newItems = items.rows.filter((item) => {
			let temp1 = true;
			for (let j = 0; j < filters.length; j++) {
				const filter = filters[j];
				if (filter.fn && !filterFunctions[filter.fn].aggregate && filterFunctions[filter.fn].filter) {
					const fn = filterFunctions[filter.fn].filter;
					const temp2 = fn(item[columnReferences.indexOf(filter.key)], filter.value);
					const {invert} = filter;

					if (!filter.op || filter.op === 'and') {
						temp1 = temp1 && (invert ? !temp2 : temp2);
					} else if (filter.op === 'or') {
						temp1 = temp1 || (invert ? !temp2 : temp2);
					}
				}
			}
			return temp1;
		});
	} else {
		newItems = items.rows.slice();
	}
	if (sorting?.key && newItems.length > 1) {
		const {key, type} = sorting;
		const columnDataTypes = {};
		items.columns.forEach((column) => {
			columnDataTypes[column.reference] = column.dataType;
		});
		// eslint-disable-next-line id-length
		newItems.sort((a, b) => {
			const keyIndex = columnReferences.indexOf(key);
			if (columnDataTypes[key] === dataTypes.TEXT) {
				return type === ordering.ASC
					? String(a[keyIndex])
						.localeCompare(String(b[keyIndex]))
					: String(b[keyIndex])
						.localeCompare(String(a[keyIndex]));
			}
			return type === ordering.ASC ? a[keyIndex] - b[keyIndex] : b[keyIndex] - a[keyIndex];
		});
	}
	const aggregateFilter = filters ? (filters.find((fil) => fil.fn ? filterFunctions[fil.fn].aggregate : null)) : null;
	if (!aggregateFilter || newItems.length <= 1) {
		return newItems;
	}

	const {fn, invert, key} = aggregateFilter;
	const {init, filter} = filterFunctions[fn];
	const comparisonValue = init(newItems, key);

	return newItems.filter((item) => {
		const out = filter(item[key], comparisonValue);
		return invert ? !out : out;
	});
};

const getInitialState = () => ({
	facts: {},
	values: {}
});

export default {
	namespaced: true,
	state: getInitialState(),
	mutations: {
		initFacts(state, widgetInstanceId) {
			if (!state.facts[widgetInstanceId]) {
				state.facts[widgetInstanceId] = {
					savedCells: {},
					filters: [],
					sorting: null
				};
			}
		},
		saveCell(state, {widgetInstanceId, newName, column, index = null, aggregation = null, oldName = null}) {
			if (oldName && newName !== oldName && state.facts[widgetInstanceId].savedCells[oldName]) {
				delete state.facts[widgetInstanceId].savedCells[oldName];
			}
			state.facts[widgetInstanceId].savedCells[newName] = {
				column,
				...(Number.isInteger(index) ? {index} : {aggregation})
			};
		},
		removeCell(state, {widgetInstanceId, factName}) {
			delete state.facts[widgetInstanceId].savedCells[factName];
		},
		addFilter(state, widgetInstanceId) {
			state.facts[widgetInstanceId].filters.push({
				op: 'and',
				key: 'Metric1',
				fn: '>',
				value: ''
			});
		},
		removeFilter(state, {widgetInstanceId, index}) {
			state.facts[widgetInstanceId].filters.splice(index, 1);
		},
		updateFilter(state, {widgetInstanceId, index, filter}) {
			if (!filter) {
				if (index !== -1) {
					state.facts[widgetInstanceId].filters.splice(index, 1);
				}
				return;
			}

			if (index === -1) {
				state.facts[widgetInstanceId].filters.push(filter);
			} else {
				state.facts[widgetInstanceId].filters.splice(index, 1, filter);
			}
		},
		toggleSorting(state, {widgetInstanceId, label}) {
			const {key, type} = state.facts[widgetInstanceId].sorting ?? {
				key: null,
				type: null
			};
			if (key === label) {
				if (type === ordering.ASC) {
					state.facts[widgetInstanceId].sorting.type = ordering.DESC;
				} else {
					state.facts[widgetInstanceId].sorting = null;
				}
			} else {
				state.facts[widgetInstanceId].sorting = {
					key: label,
					type: ordering.ASC
				};
			}
		},
		setFacts(state, facts) {
			if (facts) {
				state.facts = facts;
			}
		},
		removeWidgetFacts(state, widgetInstanceId) {
			if (state.facts[widgetInstanceId]) {
				delete state.facts[widgetInstanceId];
			}
			if (state.values[widgetInstanceId]) {
				delete state.values[widgetInstanceId];
			}
		},
		setValue(state, payload) {
			state.values[payload.id] = payload.value;
		},
		resetValues(state) {
			state.values = {};
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	getters: {
		facts: (state) => (id) => state.facts[id] ?? {},
		allFacts: (state) => state.facts ?? {},
		itemsFilteredSorted: (state, getters, rootState, rootGetters) => {
			const result = {};
			Object.values(rootGetters['widgetInstances/widgetInstanceIds']).flat(1)
				.forEach((widgetInstanceId) => {
					const data = rootGetters['widgetData/rawData'](widgetInstanceId);
					if (data) {
						result[widgetInstanceId] = itemsFilterAndSort(
							data,
							state.facts[widgetInstanceId]?.filters ?? null,
							state.facts[widgetInstanceId]?.sorting ?? null
						);
					}
				});
			return result;
		},
		widgetItemsFilteredSorted: (state, getters) => (widgetInstanceId) => getters.itemsFilteredSorted[widgetInstanceId],
		value: (state, getters) => (name) => getters.allValues[name],
		allValues: (state, getters, rootState, rootGetters) => {
			const result = {};
			Object.keys(state.facts).forEach((widgetInstanceId) => {
				const itemsFilteredSorted = getters.itemsFilteredSorted[widgetInstanceId];
				if (itemsFilteredSorted) {
					const {columns} = rootGetters['widgetData/rawData'](widgetInstanceId);
					const columnReferences = columns.map((column) => column.reference);
					Object.keys(state.facts[widgetInstanceId].savedCells)
						.forEach((name) => {
							const savedCell = state.facts[widgetInstanceId].savedCells[name];
							let value = null;
							if (savedCell.aggregation) {
								const items = itemsFilteredSorted.map((row) => row[columnReferences.indexOf(savedCell.column)]);

								if (items.length > 0) {
									value = aggregateFunctions[savedCell.aggregation](items, {
										type: 'number'
									});
								} else {
									value = null;
								}

								if (savedCell.aggregation === 'percentEmpty' || savedCell.aggregation === 'percentNotEmpty') {
									value = format(value, 'percent');
								} else {
									value = format(value, 'number');
								}
							} else {
								value = itemsFilteredSorted?.[savedCell.index]?.[columnReferences.indexOf(savedCell.column)];
								value = format(value, getType(columns[columnReferences.indexOf(savedCell.column)].dataType));
							}

							if (value) {
								result[name] = value;
							}
						});
				}
			});
			return result;
		}
	},
	actions: {
		saveFacts({state, dispatch, rootGetters}) {
			const newConfiguration = cloneDeep(rootGetters['storyDetail/story'].configuration) ?? {};
			newConfiguration.facts = cloneDeep(state.facts);
			dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true});
		},
		saveCell({commit, dispatch}, payload) {
			commit('initFacts', payload.widgetInstanceId);
			commit('saveCell', payload);
			dispatch('saveFacts');
		},
		removeCell({commit, dispatch}, payload) {
			commit('removeCell', payload);
			dispatch('saveFacts');
		},
		addFilter({commit}, widgetInstanceId) {
			commit('initFacts', widgetInstanceId);
			commit('addFilter', widgetInstanceId);
		},
		updateFilter({commit, dispatch}, payload) {
			commit('initFacts', payload.widgetInstanceId);
			commit('updateFilter', payload);
			dispatch('saveFacts');
		},
		removeFilter({commit, dispatch}, payload) {
			commit('removeFilter', payload);
			dispatch('saveFacts');
		},
		toggleSorting({commit, dispatch}, payload) {
			commit('initFacts', payload.widgetInstanceId);
			commit('toggleSorting', payload);
			dispatch('saveFacts');
		},
		removeWidgetFacts({state, commit, dispatch}, widgetInstanceId) {
			if (state.facts[widgetInstanceId]) {
				commit('removeWidgetFacts', widgetInstanceId);
				dispatch('saveFacts');
			}
		}
	}
};
