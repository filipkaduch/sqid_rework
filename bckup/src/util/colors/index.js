export const parseRgb = (color) => {
	const [
		red,
		green,
		blue,
		alpha
	] = color.split(',');

	const tmpAlpha = alpha ? parseFloat(alpha) : null;

	return {
		red: parseInt(red[3] === 'a' ? red.slice(5) : red.slice(4), 10),
		green: parseInt(green, 10),
		blue: parseInt(blue, 10),
		alpha: (tmpAlpha === 1) ? null : tmpAlpha
	};
};

export const printRgb = (color) => `rgb${color.alpha ? 'a' : ''}(${color.red},${color.green},${color.blue}${color.alpha ? `,${color.alpha}` : ''})`;

export const rgbToHsl = (colorRaw) => {
	const color = typeof colorRaw === 'string' ? parseRgb(colorRaw) : colorRaw;

	const red = color.red / 255;
	const green = color.green / 255;
	const blue = color.blue / 255;

	const max = Math.max(red, green, blue);
	const min = Math.min(red, green, blue);
	const lightness = (max + min) / 2;
	let hue = 0;
	let saturation = 0;

	if (max !== min) {
		const difference = max - min;
		saturation = lightness > 0.5 ? difference / (2 - max - min) : difference / (max + min);

		switch (max) {
			case red:
				hue = ((green - blue) / difference) + (green < blue ? 6 : 0);
				break;
			case green:
				hue = ((blue - red) / difference) + 2;
				break;
			case blue:
				hue = ((red - green) / difference) + 4;
				break;
		}

		hue /= 6;
	}

	return {
		hue,
		saturation,
		lightness,
		alpha: color.alpha
	};
};

export const hslToRgb = (color) => {
	let red = color.lightness;
	let green = color.lightness;
	let blue = color.lightness;

	if (color.saturation !== 0) {
		const tmp1 = color.lightness < 0.5
			? color.lightness * (1 + color.saturation)
			: color.lightness + color.saturation - (color.lightness * color.saturation);
		const tmp2 = (2 * color.lightness) - tmp1;

		[
			red,
			green,
			blue
		] = [
			color.hue + (1 / 3),
			color.hue,
			color.hue - (1 / 3)
		]
			.map((hue) => {
				let tmpHue = hue;
				if (tmpHue < 0) {
					tmpHue += 1;
				} else if (tmpHue > 1) {
					tmpHue -= 1;
				}
				if (tmpHue < 1 / 6) {
					return tmp2 + ((tmp1 - tmp2) * 6 * tmpHue);
				}
				if (tmpHue < 1 / 2) {
					return tmp1;
				}
				if (tmpHue < 2 / 3) {
					return tmp2 + ((tmp1 - tmp2) * ((2 / 3) - tmpHue) * 6);
				}
				return tmp2;
			});
	}

	return {
		red: Math.round(red * 255),
		green: Math.round(green * 255),
		blue: Math.round(blue * 255),
		alpha: color.alpha
	};
};
