import {parseRgb, printRgb} from '@/util/colors/index';

export const rgbLinearShade = (amount, colorRaw) => {
	const color = typeof colorRaw === 'string' ? parseRgb(colorRaw) : colorRaw;
	const linearParameter = amount < 0 ? 0 : 255 * amount;
	const proportionalParameter = amount < 0 ? 1 + amount : 1 - amount;

	const red = Math.round((color.red * proportionalParameter) + linearParameter);
	const green = Math.round((color.green * proportionalParameter) + linearParameter);
	const blue = Math.round((color.blue * proportionalParameter) + linearParameter);

	return printRgb({
		red,
		green,
		blue,
		alpha: color.alpha
	});
};
