import {updateDatasetStatusInterval} from '@/modules/dataset/utils/datasetUtils';
import {mapActions} from 'vuex';
import {DATASET_ACTIONS, DATASET_STORE_NAME} from '@/modules/dataset/store/types';
export default {
	data() {
		return {
			activeJobInterval: null
		};
	},
	methods: {
		...mapActions(DATASET_STORE_NAME, [
			DATASET_ACTIONS.LOAD_NEXT_PAGE,
			DATASET_ACTIONS.UPDATE_STATUS
		]),
		setActiveJobsInterval() {
			this.loadNextPage({reset: true});
			this.activeJobInterval = setInterval(() => {
				this.updateStatus();
			}, updateDatasetStatusInterval);
		},
		resetActiveJobsInterval() {
			clearInterval(this.activeJobInterval);
		}
	}
};
