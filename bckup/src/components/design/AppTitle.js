export default {
	name: 'AppTitle',
	props: {
		title: {
			type: String,
			required: true
		}
	},
	watch: {
		title: {
			immediate: true,
			handler(newTitle) {
				document.title = `Data Stories - ${newTitle}`;
			}
		}
	},
	beforeUnmount() {
		document.title = 'Data Stories';
	},
	render() {
		return null;
	}
};
