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
				text: 'secondary',
				border: 'secondary-300',
				background: 'secondary-100'
			};
		case 'secondary-outline':
			return {
				text: 'secondary',
				border: 'secondary-300',
				background: 'transparent'
			};
		case 'display-content':
			return {
				text: 'display-content-700',
				border: 'display-content-200',
				background: 'display-content-0'
			};
		case 'interaction':
			return {
				text: 'interaction-700',
				border: 'interaction-200',
				background: 'interaction-100'
			};
		case 'separate-content':
			return {
				text: 'separate-content-700',
				border: 'separate-content-200',
				background: 'separate-content-0'
			};
		case 'separate-content-badge':
			return {
				text: 'display-content',
				border: 'separate-content-100',
				background: 'separate-content-0'
			};
		case 'success':
			return {
				text: 'success-600',
				border: 'success-300',
				background: 'success-100'
			};
		case 'warning':
			return {
				text: 'warning-700',
				border: 'warning-300',
				background: 'warning-100'
			};
		case 'error':
			return {
				text: 'error-600',
				border: 'error-300',
				background: 'error-100'
			};
		default:
			return {
				text: 'primary-700',
				border: 'primary-200',
				background: 'primary-0'
			};
	}
};
