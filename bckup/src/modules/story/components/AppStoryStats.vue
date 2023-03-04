<template>
	<app-loading :loading="loadingStats">
		<button class="btn btn-white border" :disabled="alreadyClicked" @click="increaseClaps">
			<fa-icon fixed-width class="m-0" :icon="['far', 'thumbs-up']" />
		</button>
		<p class="m-0 text-center p-2 d-inline-block align-middle">
			{{ claps }}
		</p>
		<button class="btn btn-white border" disabled>
			<fa-icon fixed-width class="m-0" :icon="['fas', 'eye']" />
		</button>
		<p class="m-0 text-center p-2 d-inline-block align-middle">
			{{ visitors }}
		</p>
	</app-loading>
</template>

<script>
import AppLoading from '../../../components/design/AppLoading.vue';
import axios from '@/plugins/axios';
import {notify} from '@kyvg/vue3-notification';
import i18n from '@/plugins/i18n/index';
const {t} = i18n.global;

export default {
	name: 'AppStoryStats',
	components: {AppLoading},
	props: {
		suid: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			visitors: null,
			claps: null,
			alreadyClicked: false,
			loadingStats: false,
			loadingClapsError: false,
			loadingVisitorsError: false
		};
	},
	mounted() {
		this.getStats();
		setInterval(() => {
			this.getStats();
		}, 30000);
		setTimeout(() => {
			this.increaseViews();
		}, 10000);
	},
	methods: {
		getStats() {
			this.loadingStats = true;
			this.loadingVisitorsError = false;
			this.loadingClapsError = false;

			Promise.all([
				this.getVisitors(),
				this.getClaps()
			])
				.finally(() => {
					this.loadingStats = false;
				});
		},
		getVisitors() {
			return axios.get('/VisitorCount/GetVisitorCount', {
				params: {
					suid: this.suid
				}
			})
				.then(({data}) => {
					this.visitors = data;
				})
				.catch(() => {
					this.loadingVisitorsError = true;
				});
		},
		getClaps() {
			return axios.get('/VisitorCount/GetClapCount', {
				params: {
					suid: this.suid
				}
			})
				.then(({data}) => {
					this.claps = data;
				})
				.catch(() => {
					this.loadingClapsError = true;
				});
		},
		increaseClaps() {
			return axios.post('/VisitorCount/UpdateClapCount', {
				suid: this.suid
			})
				.then(() => {
					this.claps += 1;
					this.alreadyClicked = true;
				})
				.catch((err) => {
					notify({
						type: 'danger',
						text: err?.response?.data?.error?.message ?? t('t_UnexpectedError'),
						duration: 5000
					});
				});
		},
		increaseViews() {
			return axios.post('/VisitorCount/UpdateVisitorCount', {
				suid: this.suid
			})
				.then(() => {
					this.visitors += 1;
				})
				.catch((err) => {
					notify({
						type: 'danger',
						text: err?.response?.data?.error?.message ?? t('t_UnexpectedError'),
						duration: 5000
					});
				});
		}
	}
};
</script>
