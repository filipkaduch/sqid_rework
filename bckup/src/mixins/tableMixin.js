export default {
	props: {
		options: {
			type: Object,
			default: () => ({})
		},
		tableData: {
			type: [
				Array,
				Object
			],
			required: true
		},
		tableHeaders: {
			type: Array,
			default: null
		},
		loadMoreLoading: {
			type: Boolean,
			default: false
		},
		hideLoadMoreButton: {
			type: Boolean,
			default: false
		},
		loadMoreEnabled: {
			type: Boolean,
			default: false
		},
		switchEnabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		loadOnScrollCondition() {
			return this.options.loadMore
      && this.options.automaticLoadMore
      && this.loadMoreEnabled
      && !this.loadMoreLoading;
		}
	},
	methods: {
		onScroll() {
			this.$emit('loadMore');
		}
	}
};
