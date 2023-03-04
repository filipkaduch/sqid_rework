import {axiosDelete, axiosGet, axiosPost, axiosUpdate} from '@/util/axiosServiceHandler';
import {notify} from '@kyvg/vue3-notification';
import i18n from '@/plugins/i18n/index';
const {t} = i18n.global;
class WidgetServices {
	async updateSections(id: string, payload: any) {
		const {data} = await axiosUpdate(`/v0/sections/${id}`, payload);
		return data;
	}

	async updateWidget(id: string, payload: any) {
		const {data} = await axiosUpdate(`/v0/widgets/${id}`, payload);
		return data;
	}

	async getSection(sectionId: string) {
		const {data} = await axiosGet(`/v0/sections/${sectionId}`);
		return data;
	}

	setDataConfiguration(instanceId: string, payload: any) {
		return axiosPost(`/v0/widgets/${instanceId}/data-configuration`, payload);
	}

	async updateDataConfiguration(instanceId: string, payload: any, widgetId: string) {
		await axiosUpdate(`/v0/widgets/${instanceId}/data-configuration/${widgetId}`, payload);
	}

	createWidget(id: string, config = {}) {
		return axiosPost(`/v0/widgets/${id}`, config);
	}

	deleteWidget(id: string) {
		return axiosDelete(`/v0/widgets/${id}`);
	}

	deleteSection(id: string) {
		return axiosDelete(`/v0/sections/${id}`);
	}

	async fetchData(payload: any) {
		let resp = {
			data: {
				columns: [],
				rows: []
			}
		};

		await axiosPost('/v0/queries/fetch-data', payload)
			.then((response: any) => {
				resp = response;
			})
			.catch((err: any) => {
				notify({
					type: 'danger',
					text: err?.response?.data?.error?.message ?? t('t_UnexpectedError'),
					duration: 5000
				});
			});

		return resp;
	}

	async fetchDataPublished(publishToken: string, payload: any) {
		let resp = {
			data: {
				columns: [],
				rows: []
			}
		};

		await axiosPost(`/v0/queries/story-token/${publishToken}`, payload)
			.then((response: any) => {
				resp = response;
			})
			.catch((err: any) => {
				notify({
					type: 'danger',
					text: err?.response?.data?.error?.message ?? t('t_UnexpectedError'),
					duration: 5000
				});
			});
		return resp;
	}
}
export const widgetServices = new WidgetServices();

