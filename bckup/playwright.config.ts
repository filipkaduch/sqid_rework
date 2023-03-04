// @ts-ignore
import type {PlaywrightTestConfig} from '@playwright/test';
// eslint-disable-next-line no-duplicate-imports
// @ts-ignore
// eslint-disable-next-line no-duplicate-imports
import {devices} from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// TODO: replace with vite alternative
const isInCI = Boolean(process.env.CI ?? false);

const runCommand = isInCI ? '/docker-entrypoint.sh "nginx" "-g" "daemon off;"' : 'vite dev';
const baseUrl = isInCI ? 'http://localhost:80/' : 'http://localhost:8080/';

const config: PlaywrightTestConfig = {
	timeout: 50000,
	// @ts-ignore
	...(isInCI ? {globalSetup: require.resolve('./src/tests/pages/globalSetup/globalSetup')} : {}),
	testDir: './src/tests',

	/* Maximum time one test can run for. */
	expect: {

		/**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
		// @ts-ignore
		toMatchSnapshot: {
			threshold: 0.1,
			maxDiffPixelRatio: 0.15
		},
		timeout: 40000
	},

	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: isInCI,

	/* Retry on CI only */
	retries: isInCI ? 1 : 0,

	/* Opt out of parallel tests on CI. */
	// eslint-disable-next-line no-undefined
	workers: isInCI ? 1 : undefined,

	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [
		[
			'html',
			{outputFolder: 'test-reports'}
		],
		[
			'junit',
			{outputFile: 'results.xml'}
		]
	],

	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {

		/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
		actionTimeout: 0,

		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: baseUrl,
		colorScheme: 'dark',
		acceptDownloads: true,
		headless: true,
		// Tell all tests to load signed-in state from 'storageState.json'.
		storageState: './src/tests/storageState.json',
		trace: 'on-first-retry'
	},

	/* Configure projects for major browsers */
	projects: [

		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				baseURL: baseUrl
			}
		}

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: {
		//     ...devices['Pixel 5'],
		//   },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: {
		//     ...devices['iPhone 12'],
		//   },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: {
		//     channel: 'msedge',
		//   },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: {
		//     channel: 'chrome',
		//   },
		// },
	],

	/* Folder for test artifacts such as screenshots, videos, traces, etc. */
	outputDir: 'test-results/',

	/* Run your local dev server before starting the tests */
	webServer: {
		// better for local testing
		...(isInCI
			? {url: baseUrl}
			: {
				reuseExistingServer: true,
				port: 8080
			}),
		command: runCommand,
		timeout: 400 * 1000
	}
};

export default config;
