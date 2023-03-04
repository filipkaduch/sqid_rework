// This cookie should have the same name as the one in the ataccama website
export const CONSENT_COOKIE_NAME = 'ccmStat';
export const POSTHOG_COOKIE_NAME = 'POSTHOG';
export const DEFAULT_COOKIE_EXPIRATION = new Date(Date.now() + (1000 * 60 * 60 * 24 * 365));
const ATACCAMA_URL = 'https://www.ataccama.com/';

export const saveCookie = (cookie: string) => {
	document.cookie = cookie;
};

const getCurrentTopLevelDomain = () => {
	const currentDomain = window.location.hostname;
	const [topLevelDomain] = currentDomain.match(/\w+\.\w+$/g) ?? [];

	return topLevelDomain ?? currentDomain;
};

export const sendCrossDomainCookie = (cookie: string) => {
	const iframe = document.createElement('iframe');
	iframe.style.display = 'none';
	iframe.onload = () => {
		iframe.contentWindow?.postMessage(cookie, ATACCAMA_URL);
		document.body.removeChild(iframe);
	};
	iframe.src = ATACCAMA_URL;
	document.body.appendChild(iframe);
};

export const setUpCrossDomainCookieListener = () => {
	window.addEventListener(
		'message',
		(event) => {
			if (event.origin !== ATACCAMA_URL) {
				return;
			}
			if (!event.data) {
				return;
			}

			const {data} = event;

			if (typeof data !== 'string') {
				return;
			}
			// parse cookie - Example: 'TRACKING_CONSENT=true, expires=...'
			const [cookie] = data.split(',');

			const [name, value] = cookie.split('=');

			if (name !== CONSENT_COOKIE_NAME) {
				return;
			}

			if (value !== 'true' && value !== 'false') {
				return;
			}
			saveCookie(getConsentCookie(value === 'true'));
		},
		{once: true}
	);
};

export const isCookieSaved = (name: string) => document.cookie.split(';').some((value) => value.includes(name));

export const getConsentCookie = (value: boolean) => `${CONSENT_COOKIE_NAME}=${value}, expires=${DEFAULT_COOKIE_EXPIRATION}, domain=${getCurrentTopLevelDomain()}`;

export const getConsentValue = (name: string) => {
	const foundCookie = document.cookie.split(';').find((value: string) => value.includes(name));
	if (foundCookie) {
		return foundCookie.split(',')?.[0].split('=')[1] === 'true';
	}
	return false;
};
