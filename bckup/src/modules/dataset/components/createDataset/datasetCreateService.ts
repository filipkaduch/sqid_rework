import {axiosGet, axiosDelete, axiosPost} from '@/util/axiosServiceHandler';

class DatasetCreateService {
	googleSignOut() {
		return axiosDelete('/v0/oauth2-tokens/');
	}

	googleSignIn(authCode: string) {
		return axiosPost('/v0/oauth2-tokens/', {
			authorizationCode: authCode
		});
	}

	async getAccessToken() {
		const {data: {accessToken, idToken}} = await axiosGet('/v0/oauth2-tokens/');
		return {accessToken, idToken};
	}

	async getMonitoringProjects() {
		const {data} = await axiosGet('v0/integrations/dq/monitoring-projects');
		return data;
	}

	importProject(projectConfig: Object) {
		return axiosPost('v0/integrations/dq/monitoring-projects/setup-integration', projectConfig);
	}

	importCatalogItems(catalogItemsConfig: Object) {
		return axiosPost('v0/integrations/dq/catalog-items/setup-integration', catalogItemsConfig);
	}

	async getCatalogItems(projectId: string) {
		const {data} = await axiosGet(`v0/integrations/dq/monitoring-projects/${projectId}/catalog-items`);
		return data;
	}

	async searchForCatalogItems(searchValue: string) {
		const {data} = await axiosGet('v0/integrations/gen2/catalog-items', {
			params: {
				searchTerm: searchValue
			}
		});
		return data;
	}
}
export const datasetCreateService = new DatasetCreateService();
