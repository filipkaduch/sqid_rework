const numberFormatter = new Intl.NumberFormat();

export const formatNumber = (value, format = null) => {
	if (format !== null) {
		if (format?.style === 'currency') {
			return new Intl.NumberFormat('default', format).format(value);
		} else if (format?.style === 'percent') {
			return new Intl.NumberFormat('default', format).format(value / 100);
		}
		if (typeof format.metric !== 'undefined') {
			if (format?.metric?.style === 'currency') {
				return new Intl.NumberFormat('default', format.metric).format(value);
			} else if (format?.metric?.style === 'percent') {
				return new Intl.NumberFormat('default', format.metric).format(value / 100);
			}
			return new Intl.NumberFormat('default', format.metric).format(value);
		}
		if (format.notation === 'compact') {
			return new Intl.NumberFormat('default', {...format, compactDisplay: 'short'}).format(value);
		}
		return new Intl.NumberFormat('default', format).format(value);
	}
	return numberFormatter.format(value);
};

export const formatDate = (value, format = null) => {
	if (format === null) {
		return new Date(value).toDateString();
	}
	return new Intl.DateTimeFormat('default', format).format(value);
};
