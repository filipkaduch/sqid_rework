import {mapDimensionAxesConfiguration, mapMetricAxesConfiguration} from '@/util/widgetDataBinding';

export const getColumn = (configuration, index) => {
	if (configuration.data?.configuration?.dimensions?.length > index) {
		return mapDimensionAxesConfiguration(
			configuration.data.configuration.dimensions[index],
			configuration.data
		);
	}
	return {};
};

export const getMetric = (configuration, index = null) => {
	if (Number.isInteger(index) && configuration?.data?.configuration?.metrics?.length > index) {
		return mapMetricAxesConfiguration(configuration.data.configuration.metrics[index], configuration.data);
	}
	return configuration.data.configuration.metrics
		.map((metric) => mapMetricAxesConfiguration(metric, configuration.data));
};
export const findNewIndexes = (columns) => {
	const temp = {};
	columns.forEach((element, i) => {
		temp[element.reference] = i;
	});
	return temp;
};
