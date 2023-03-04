import {config} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';

const i18n = createI18n({
	locale: 'en',
	allowComposition: true,
	fallbackLocale: 'en',
	messages: {},
	silentTranslationWarn: true
});
config.global.plugins = [i18n];
config.global.mocks.i18n = i18n;

