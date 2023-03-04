import {getAlias, getDisplayName} from '@/util/widgetData';
import {dataTypes, isDataType} from '@/util/queryBuilder';
import {getEnum} from '@/util/formatingUtil';
import {formatDate, formatNumber} from '@/plugins/formatting';

export const dataTransformation = (data: any, configuration: any, context: any) => {
	const totalMetrics: any[] = [];
	const metricIndexes: any[] = [];
	const dimensionIndex = data.columns.map((column: any) => column.reference).indexOf('Dimension1');
	const metricIndex = data.columns.map((column: any) => column.reference).indexOf('Metric1');
	const {metrics} = configuration.data.configuration;
	const {enums} = configuration.options;
	let fields = [];
	let tableData = [];

	data.columns.forEach((value: any, index: number) => {
		if (value.reference.includes('Metric')) {
			metricIndexes.push(index);
			totalMetrics.push([]);
		}
	});


	if (dimensionIndex >= 0 && metricIndex >= 0) {
		fields = data.columns.map((field: any, index: number) => ({
			type: field.dataType,
			name: field.reference.includes('Metric')
				? getAlias(field.reference.slice(field.reference.length - 1), metrics, enums, context)
				: getDisplayName(configuration.data.configuration.dimensions[index]?.column, context)
		}));
		fields.unshift({
			type: 'number',
			name: 'index'
		});

		tableData = data.rows.map((row: any, i: number) => {
			const temp: any[] = [i + 1];
			const numberCount = data.columns.filter((column: any) => isDataType(dataTypes.NUMBER, column.dataType) && column.reference.includes('Dimension')).length;
			const dateCount = data.columns.filter((column: any) => isDataType(dataTypes.DATE_TYPE, column.dataType) && column.reference.includes('Dimension')).length;

			data.columns.forEach((column: any, index: number) => {
				const enumValue = getEnum(enums, `dimension${index}`, row[index]);
				const isMetric = column.reference.includes('Metric');

				if (isDataType(dataTypes.DATE_TYPE, column.dataType)) {
					if (isMetric) {
						temp.push(formatDate(new Date(row[index]), configuration.options.selectedFormat?.metric));
					} else {
						temp.push(row[index] === enumValue
							? configuration.options.selectedFormat !== null && numberCount === 0
								? formatDate(new Date(row[index]), configuration.options.selectedFormat?.xAxis)
								: new Date(row[index]).toDateString()
							: enumValue);
					}
				} else if (isDataType(dataTypes.NUMBER, column.dataType)) {
					if (isMetric) {
						temp.push(formatNumber(row[index], configuration.options.selectedFormat?.metric));
					} else {
						temp.push(row[index] === enumValue
							? configuration.options.selectedFormat !== null && dateCount === 0
								? formatNumber(row[index], configuration.options.selectedFormat?.xAxis)
								: enumValue
							: enumValue);
					}
				} else {
					temp.push(row[index] === null ? '<NULL>' : enumValue);
				}
				if (metricIndexes.includes(index)) {
					if (!totalMetrics[metricIndexes.indexOf(index)].includes(row[index])) {
						totalMetrics[metricIndexes.indexOf(index)].push(row[index]);
					}
				}
			});
			return temp;
		});
	}
	const out: any = {
		data: tableData,
		fields,
		totalMetrics,
		metricIndexes
	};
	return out;
};
