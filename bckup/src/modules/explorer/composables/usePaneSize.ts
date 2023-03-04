import {ref} from 'vue';

// eslint-disable-next-line func-names
export default function() {
	const getSizeToPercent = (splitpanesWidth: number, pixelWidth: number) => (pixelWidth * 100) / splitpanesWidth;
	const paneMaxSize = ref(0);
	const paneMinSize = ref(0);
	return {
		getSizeToPercent,
		paneMaxSize,
		paneMinSize
	};
}
