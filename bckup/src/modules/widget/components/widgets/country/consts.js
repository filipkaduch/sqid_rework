import countriesJSON from './maps/worldCountries.json';
export const configuration = {
	data: {
		dimensions: {
			count: 1
		},
		metrics: {
			count: 1
		},
		limit: {
			default: 10,
			maxValue: 50
		}
	}
};
export const initialize = {
	size: {
		width: 450,
		height: 300
	}
};
export const widgetGroup = {
	group: 'chart',
	subGroup: 'chart_map'
};
export const getCountryByIso3 = (isoName) => {
	const result = countriesJSON.countries.find((country) => country.properties.iso_a3 === isoName);
	return result ? result : '';
};
