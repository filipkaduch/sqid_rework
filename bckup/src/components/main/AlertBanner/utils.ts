import {ColorStyle} from '../consts/interfaces';

// eslint-disable-next-line max-lines-per-function
export const getVariantStyles = (variant: string): ColorStyle => {
	switch (variant) {
		case 'primary':
			return {
				text: 'primary-700',
				border: 'primary-200',
				background: 'primary-0'
			};
		case 'secondary':
			return {
				text: 'secondary-400',
				border: 'secondary-200',
				background: 'secondary-0'
			};
		case 'display-content':
			return {
				text: 'display-content-700',
				border: 'display-content-200',
				background: 'display-content-0'
			};
		case 'interaction':
			return {
				text: 'display-content-700',
				border: 'interaction-100',
				background: 'interaction-0'
			};
		case 'separate-content':
			return {
				text: 'separate-content-700',
				border: 'separate-content-200',
				background: 'separate-content-0'
			};
		case 'success':
			return {
				text: 'success-700',
				border: 'success-200',
				background: 'success-0'
			};
		case 'warning':
			return {
				text: 'warning-700',
				border: 'warning-200',
				background: 'warning-0'
			};
		case 'error':
			return {
				text: 'error-700',
				border: 'error-200',
				background: 'error-0'
			};
		default:
			return {
				text: 'primary-700',
				border: 'primary-200',
				background: 'primary-0'
			};
	}
};
