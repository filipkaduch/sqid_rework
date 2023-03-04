export const evaluateStatus = (data) => {
	if (data !== null) {
		return data.status !== 'SUBMITTED' && data.status !== 'IN_PROGRESS';
	}
	return false;
};

export const checkErrorStatus = (data) => {
	if (data !== null) {
		return data.status !== 'ERROR';
	}
	return false;
};
