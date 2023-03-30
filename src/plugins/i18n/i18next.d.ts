import 'i18next';
// import all namespaces (for the default language, only)
// @ts-ignore
import ns1 from './translations.json';

declare module 'i18next' {
	// Extend CustomTypeOptions
	interface CustomTypeOptions {
		// custom namespace type, if you changed it
		defaultNS: 'ns1';
		globalInjection: true,
		// custom resources type
		resources: {
			ns1: typeof ns1;
		};
		// other
	}
}
