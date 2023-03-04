<template>
	<app-loading :loading="loading" class="h-100">
		<div class="d-flex">
			<app-new-navbar />
			<router-view />
		</div>
		<app-toast-message />
		<posthog-modal v-if="user" />
	</app-loading>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import AppLoading from '@/components/design/AppLoading.vue';
import AppNewNavbar from '@/components/design/AppNewNavbar.vue';
import AppToastMessage from '@/components/design/AppToastMessage.vue';
import posthog from 'posthog-js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {POSTHOG_COOKIE_NAME} from './util/posthog/utils';
import PosthogModal from '@/modules/homepage/components/PosthogModal.vue';

export default {
	components: {
		PosthogModal,
		AppToastMessage,
		AppNewNavbar,
		AppLoading
	},
	inject: ['appConfig'],
	computed: {
		...mapGetters('appLoading', ['loading']),
		...mapGetters('authLogin', ['user'])
	},
	mounted() {
		this.loadMetadata(true);
		if (this.appConfig?.enablePosthog
			&& this.appConfig?.posthogApiKey
			&& this.appConfig?.posthogApiUrl) {
			this.$posthog = posthog.init(
				// Disabled camel-case because posthog didn't like replacing the whole remapped config
				/* eslint-disable camelcase */
				this.appConfig.posthogApiKey,
				{
					api_host: this.appConfig.posthogApiUrl,
					mask_all_text: true,
					cookie_name: POSTHOG_COOKIE_NAME
				}
				/* eslint-enable camelcase */
			);
		}
	},
	methods: {
		...mapActions('widgetMetadata', ['loadMetadata']),
		...mapActions('authLogin', ['refreshToken'])
	}
};
</script>
