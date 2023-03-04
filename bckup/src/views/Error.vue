<template>
	<div class="container-fluid d-flex w-100 vh-100 m-0">
		<div class="row w-100">
			<div class="col-12 d-flex flex-column align-items-center justify-content-center">
				<img class="mb-5" src="../assets/illustration-404.svg">
				<h3 class="mb-4"><strong>404</strong></h3>
				<!-- <h5 class="text-sorry mb-4">Sorry. We could not ﬁnd the page that you requested.</h5> -->
				<h5 class="text-sorry mb-4">{{ $t(`${error}`) }}</h5>
				<a
					class="btn btn-action px-4 py-2"
					:href="$router.resolve({name: 'homepage'}).href">
					Go to Dashboard
				</a>
			</div>
		</div>
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
	name: 'Error',
	computed: {
		...mapGetters('error', ['error'])
	},
	mounted() {
		if (!this.error) {
			this.$router.push({name: 'homepage'});
		}
		localStorage.removeItem('authToken');
	},
	methods: {
		...mapActions('authLogin', ['logout'])
	}
};
</script>

<style scoped>
.text-sorry {
	color: #6B6E74;
}
</style>
