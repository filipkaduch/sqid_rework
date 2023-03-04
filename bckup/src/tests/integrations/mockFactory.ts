import {Browser, chromium, Page} from '@playwright/test';
import {Polly} from '@pollyjs/core';
import {PlaywrightAdapter} from 'polly-adapter-playwright';
import FSPersister from '@pollyjs/persister-fs';
import path from 'path';
import {PollyResponse} from 'polly-adapter-playwright/dist/types';

const RECORD_MODE = 'record';
const REPLAY_MODE = 'replay';
const pollyMode = process.env.POLLY_RECORD ? RECORD_MODE : REPLAY_MODE;

// this mock factory can create mock from playwright tests
export class MockFactory {
	public page: Page;

	public polly: Polly;

	public browser: Browser;

	constructor() {
		this.page = {} as Page;
		this.polly = {} as Polly;
		this.browser = {} as Browser;
	}

	async initPolly(name: string, mode = pollyMode, recordingsDir = '../__recordings__') {
		this.browser = await chromium.launch();
		this.page = await this.browser.newPage();
		Polly.register(PlaywrightAdapter);
		this.polly = new Polly(name, {
			adapters: ['playwright'],
			persister: FSPersister,
			persisterOptions: {
				fs: {
					recordingsDir: path.resolve(__dirname, recordingsDir)
				}
			},
			mode: pollyMode,
			recordIfMissing: true,
			adapterOptions: {
				playwright: {
					context: this.page,
					modifyResponse: (response: PollyResponse) => ({
						...response,
						headers: {...response.headers, 'access-control-allow-origin': 'http://localhost:8080'}
					})
				}
			}
			// Good for debug
			// logLevel: 'info'
		});
	}

	getPage() {
		return this.page;
	}

	getBrowser() {
		return this.browser;
	}

	async pollyStop() {
		if (this.polly.stop) {
			await this.polly.stop();
		}
		if (this.page.close) {
			await this.page.close();
		}
	}
}
