import {axiosGet} from '@/util/axiosServiceHandler';
class VersionService {
	getBeVersion() {
		return axiosGet('/');
	}
}
export const versionService = new VersionService();
