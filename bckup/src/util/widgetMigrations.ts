// FE migrations which are possible to run after data for widgets are loaded
// intended to be used after loadData in widgetData store
import {cloneDeep, isArray} from 'lodash';
import store from '@/plugins/store';

export const migrateColoring = (widgetInstanceId: string) => {
	const coloring = cloneDeep(store.getters['widgetInstances/option'](widgetInstanceId, 'coloring'));
	if (coloring && isArray(coloring)) {
		const widgetDataConfiguration = cloneDeep(store.getters['widgetInstances/configuration'](widgetInstanceId));
		const widgetData = store.getters['widgetData/rawData'](widgetInstanceId);
		const newColoring: any = {};
		const metricsLength = widgetDataConfiguration.data.configuration.metrics.length;
		const dimensionsLength = widgetDataConfiguration.data.configuration.dimensions.length;
		const dimensionIndex = widgetData.columns.map((column: any) => column.reference).indexOf(`Dimension${dimensionsLength}`);
		newColoring[`dimension${dimensionsLength - 1}`] = {};

		for (let i = 0; i < metricsLength; i++) {
			newColoring[`metric${i}`] = coloring[i].color;
		}
		for (let i = 0; i < widgetData.rows.length; i++) {
			newColoring[`dimension${dimensionsLength - 1}`][widgetData.rows[i][dimensionIndex]] = coloring[i].color;
		}
		store.dispatch('widgetInstances/setOption', {
			widgetInstanceId,
			optionName: 'coloring',
			value: newColoring
		});
	}
};
