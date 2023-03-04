import {CUSTOM_METRIC, dataTypes} from '@/util/queryBuilder';

export default function useDataType() {
	const getIcon = (datatype: string) => {
		switch (datatype) {
			case dataTypes.NUMBER:
			case dataTypes.FLOAT:
			case dataTypes.INT:
			case dataTypes.LONG:
				return 'icon-number-datatype';

			case dataTypes.DATETIME:
			case dataTypes.DATE:
				return 'icon-date-datatype';

			case dataTypes.TEXT:
				return 'icon-text-datatype';

			case dataTypes.BOOL:
				return 'icon-text-datatype';

			case CUSTOM_METRIC:
				return 'ds-icon-custom-function';

			default:
				return 'icon-text-datatype';
		}
	};
	const getType = (datatype: string) => {
		switch (datatype) {
			case dataTypes.NUMBER:
			case dataTypes.FLOAT:
			case dataTypes.INT:
			case dataTypes.LONG:
				return dataTypes.NUMBER;

			case dataTypes.DATETIME:
				return dataTypes.DATETIME;
			case dataTypes.DATE:
				return dataTypes.DATE;

			case dataTypes.TEXT:
				return dataTypes.TEXT;

			case dataTypes.BOOL:
				return dataTypes.BOOL;

			case CUSTOM_METRIC:
				return CUSTOM_METRIC;

			default:
				return dataTypes.TEXT;
		}
	};
	return {
		getIcon,
		getType
	};
}
