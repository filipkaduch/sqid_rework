<template>
	<ds-modal
		:show="showPosthogModal"
		header-text="modals.helpUsImprove"
		confirmText="modals.accept"
		cancelText="modals.decline"
		@ok="updatePosthog(true)"
		@cancel="updatePosthog(false, $event)">
		<template #modal-text>
			<ds-text variant="body">
				<!-- eslint-disable-next-line max-len -->
				{{ $t('modals.posthogConsent') }} <a class="privacy-link" href="https://www.ataccama.com/legal/privacy-policy" target="_blank">{{ $t('modals.privacyPolicy') }} </a>{{ `${$t('modals.moreInfo')} ${DEFAULT_COOKIE_EXPIRATION}` }}
			</ds-text>
		</template>
	</ds-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted, ref, inject} from 'vue';
import {
	CONSENT_COOKIE_NAME,
	DEFAULT_COOKIE_EXPIRATION,
	getConsentCookie,
	sendCrossDomainCookie,
	saveCookie,
	isCookieSaved, getConsentValue
} from '@/util/posthog/utils';
import {versionService} from '@/modules/homepage/versionService';
import posthog from 'posthog-js';

export default defineComponent({
	name: 'PosthogModal',
	setup() {
		const appConfig = inject('appConfig');

		const state = reactive({
			showPosthogModal: false
		});

		const platform = ref(null as any);
		// @ts-ignore
		const versionInfo = appConfig?.versions;

		const versionInfoSetup = (enabled: boolean) => {
			if (enabled && versionInfo) {
				posthog.group('version', versionInfo.business, {
					backend: platform.value.versions.bussiness,
					frontend: versionInfo.business
				});
				const [client, environment] = window.location.hostname.split('.');
				posthog.group('client', client, {client});
				posthog.group('environment', environment, {environment});
			}
		};

		onMounted(async() => {
			// @ts-ignore:next-line
			const isValidPosthog = appConfig ? appConfig.enablePosthog && appConfig.posthogApiKey && appConfig.posthogApiUrl : false;
			const cookieSaved = isCookieSaved(CONSENT_COOKIE_NAME);
			platform.value = await versionService.getBeVersion();

			if (!cookieSaved && isValidPosthog) {
				state.showPosthogModal = true;
			}
			if (cookieSaved && isValidPosthog) {
				if (getConsentValue(CONSENT_COOKIE_NAME)) {
					versionInfoSetup(true);
					posthog.opt_in_capturing();
				} else {
					posthog.opt_out_capturing();
				}
			}
		});
		const updatePosthog = (enabled: boolean, where: string = '') => {
			if (where !== 'hidden') {
				const cookie = getConsentCookie(enabled);
				saveCookie(cookie);
				sendCrossDomainCookie(cookie);
				versionInfoSetup(enabled);
				// @ts-ignore
				if (appConfig?.posthogApiKey && appConfig?.posthogApiKey) {
					if (enabled) {
						posthog.opt_in_capturing();
					} else {
						posthog.opt_out_capturing();
					}
				}
				state.showPosthogModal = false;
			}
		};

		return {
			...toRefs(state),
			updatePosthog,
			DEFAULT_COOKIE_EXPIRATION
		};
	}
});
</script>

<style lang="scss">
.privacy-link {
	color: map-get($ds-colors, 'primary-500');
}
.privacy-link:hover {
	color: map-get($ds-colors, 'primary-500');
}
</style>
