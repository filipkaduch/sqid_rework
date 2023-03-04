export const generateColor = (colorArray) => {
	const colors = colorArray.sort((color1, color2) => color1.hue - color2.hue);
	// eslint-disable-next-line prefer-destructuring
	let color1 = colors[0];
	// eslint-disable-next-line prefer-destructuring
	let color2 = colors[1];

	for (let i = 1; i < colors.length - 1; i++) {
		if ((colors[i + 1].hue - colors[i].hue) > (color2.hue - color1.hue)) {
			color1 = colors[i];
			color2 = colors[i + 1];
		}
	}

	if (((1 - colors[colors.length - 1].hue) + colors[0].hue) > (color2.hue - color1.hue)) {
		color1 = colors[colors.length - 1];
		// eslint-disable-next-line prefer-destructuring
		color2 = colors[0];
	}

	return {
		hue: ((color1.hue + color2.hue + ((color1.hue < color2.hue) ? 0 : (((1 - color1.hue) > color2.hue) ? 1 : -1))) / 2),
		saturation: (color1.saturation + color2.saturation) / 2,
		lightness: (color1.lightness + color2.lightness) / 2,
		alpha: (color1.alpha !== null || color2.alpha !== null) ? (((color1.alpha ?? 1) + (color2.alpha ?? 1)) / 2) : null
	};
};
