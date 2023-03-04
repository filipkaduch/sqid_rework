<template>
	<div class="h-100vh w-100vw">
		<ds-box class="h-100" align="center" align-y="center">
			<ds-text align="center" variant="headline1">{{ $t('base.appName') }}</ds-text>
			<ds-text v-if="platformVersion === webappVersion" align="center" variant="body">{{ `${$t('version.name')}: ${webappVersion}` }}</ds-text>
			<ds-box v-else padding-top="S">
				<ds-text align="" variant="body">{{ `${$t('version.webappVersion')}: ${webappVersion}` }}</ds-text>
				<ds-text align="center" variant="body">{{ `${$t('version.platformVersion')}: ${platformVersion}` }}</ds-text>
			</ds-box>
			<ds-box padding-y="M">
				<ds-btn v-clipboard:copy="webappVersion === platformVersion ? platformVersion : fullVersion" v-clipboard:success="onCopy" variant="secondary">
					{{ $t('version.copyVersion') }}
					<template #icon>
						<ds-icon name="icon-copy" fill="display-content-300" />
					</template>
				</ds-btn>
			</ds-box>
			<ds-inline gap="M">
				<ds-btn v-clipboard:copy="webappSetting" v-clipboard:success="onCopy" variant="secondary">
					{{ $t('version.copySettingWebapp') }}
					<template #icon>
						<ds-icon name="icon-copy" fill="display-content-300" />
					</template>
				</ds-btn>
				<ds-btn v-clipboard:copy="platformSetting" v-clipboard:success="onCopy" variant="secondary">
					{{ $t('version.copySettingPlatform') }}
					<template #icon>
						<ds-icon name="icon-copy" fill="display-content-300" />
					</template>
				</ds-btn>
			</ds-inline>
		</ds-box>
	</div>
</template>

<script>
import {computed, defineComponent, inject, onMounted, ref} from 'vue';
import {versionService} from '@/modules/homepage/versionService';
import {i18n} from '@/plugins/all';
import {useStore} from 'vuex';
const {t} = i18n.global;

export default defineComponent({
	name: 'Version',
	setup() {
		const store = useStore();
		const appConfig = inject('appConfig');

		const webappVersion = computed(() => appConfig?.versions?.build);
		const platformVersion = computed(() => platform.value?.versions?.build);
		const onCopy = () => {
			store.dispatch('flashMessages/addMessage', {
				variant: 'success',
				text: 't_copiedToClipboard'
			});
		};
		const platform = ref(null);
		onMounted(async() => {
			platform.value = await versionService.getBeVersion();
		});
		const fullVersion = computed(() => `${t('version.webappVersion')}: ${webappVersion.value} \n ${t('version.platformVersion')}: ${platformVersion.value}`);
		const webappSetting = computed(() => JSON.stringify(appConfig));
		const platformSetting = computed(() => JSON.stringify(platform.value));
		return {
			webappSetting,
			platformSetting,
			onCopy,
			webappVersion,
			platformVersion,
			fullVersion
		};
	}
});
</script>
