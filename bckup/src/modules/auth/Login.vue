<template>
	<ds-container fluid>
		<app-loading :loading="loading || !error">
			<ds-row class="vh-100">
				<ds-col cols="12" md="5" class="bg-white">
					<ds-container class="h-100" style="padding: 12%">
						<ds-row>
							<ds-col cols="12">
								<img
									alt="logo"
									src="../../assets/logoDark.svg"
									class="ts-logo float-left">
								<h3 style="display: inline-block" class="py-2 px-3">Data Stories</h3>
							</ds-col>
						</ds-row>
						<ds-row>
							<ds-col cols="12" lg="10" xl="8">
								<div class="alert alert-warning" role="alert">
									<strong>{{ $t(error) }}</strong>
								</div>
							</ds-col>
						</ds-row>
					</ds-container>
				</ds-col>
				<app-tellstory-side-style />
			</ds-row>
		</app-loading>
	</ds-container>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

import AppLoading from '@/components/design/AppLoading.vue';
import AppTellstorySideStyle from '@/components/design/AppTellstorySideStyle.vue';

export default {
	name: 'Login',
	components: {
		AppLoading,
		AppTellstorySideStyle
	},
	data() {
		return {
			keycloak: null
		};
	},
	computed: {
		...mapGetters('authLogin', [
			'error',
			'loading'
		])
	},
	mounted() {
		this.login();
	},
	methods: {
		...mapActions('authLogin', ['login'])
	}
};
</script>

<style scoped>
	.ts-logo {
		padding: 0;
		height: 43px;
		display: block;
		justify-self: start;
		margin-right: auto;
		max-width: 70%;
	}

	small {
		color: #ff0000;
	}
</style>
