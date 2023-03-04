export default {
	methods: {
		onScrollUnfiltered({target: {scrollTop, clientHeight, scrollHeight} = {}}) {
			if (this.loadOnScrollCondition && scrollTop + clientHeight + 1 >= scrollHeight) {
				this.onScroll();
			}
		}
	}
};
