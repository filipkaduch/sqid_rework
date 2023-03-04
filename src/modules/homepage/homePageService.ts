import {axiosGet} from '@/util/axiosServiceHandler';
class HomepageService {
    async getNumberOfDatasets() {
        const {data} = await axiosGet('/v0/statistics/datasets/count');
        return data.value;
    }
}
export const homepageService = new HomepageService();
