import {logicConstants, operationConstants} from '@/util/consts/logicConstants';
import {functionOperations} from '@/util/consts/functionOperations';

export default {
	data() {
		return {
			functionOperations,
			logicConstants,
			operationConstants
		};
	},
	methods: {
		getOperationObjectByValue(value) {
			let findKey = Object.keys(this.functionOperations).find((key) => this.functionOperations[key].label === value);
			if (typeof findKey === 'undefined') {
				findKey = Object.keys(this.functionOperations).find((key) => this.functionOperations[key].text === value);
			}
			return this.functionOperations?.[findKey];
		},
		getKeyByValue(value) {
			let findKey = Object.keys(this.functionOperations).find((key) => this.functionOperations[key].label === value);
			if (typeof findKey === 'undefined') {
				findKey = Object.keys(this.functionOperations).find((key) => this.functionOperations[key].text === value);
			}
			return this.functionOperations?.[findKey]?.text;
		},
		getLabelByValue(value, pseudo = false) {
			let findKey = Object.keys(this.functionOperations).find((key) => this.functionOperations[key].label === value);
			if (typeof findKey === 'undefined') {
				findKey = Object.keys(this.functionOperations).find((key) => this.functionOperations[key].text === value);
			}
			return pseudo ? this.functionOperations[findKey]?.pseudo : this.functionOperations[findKey].label;
		},
		numberToStringCheck(type) {
			if (typeof type === 'number') {
				return type.toString();
			}
			return type;
		}
	}
};
