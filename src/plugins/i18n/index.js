import {createI18n} from 'vue-i18n';
import translations from './translations';

const i18n = createI18n({
	locale: 'en',
	allowComposition: true,
	fallbackLocale: 'en',
	messages: translations,
	silentTranslationWarn: true
});
const mock = {global: {t: (key) => key}};
export const getI18n = () => {
	if (i18n.global) {
		return i18n;
	}
	return mock;
};
export default i18n;
