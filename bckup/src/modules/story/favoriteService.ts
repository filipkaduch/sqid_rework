import {axiosDelete, axiosPost} from '@/util/axiosServiceHandler';

export interface Favorite {
	objectId: string;
	objectType: ObjectType
}

type ObjectType = 'STORY' | 'CATALOG-ITEM' | 'DATASET' | 'SECTION' | 'WIDGET'

class FavoriteService {
	async markAsFavorite(config: Favorite) {
		const data = await axiosPost('/v0/favorites', config);
		return data;
	}

	unmarkAsFavorite(config: Favorite) {
		return axiosDelete(`/v0/favorites/${config.objectType}/${config.objectId}`);
	}
}
export const favoriteService = new FavoriteService();

