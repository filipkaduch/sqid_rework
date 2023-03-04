import {axiosPost} from '@/util/axiosServiceHandler';
type SectionConfig = {
	atIndex: number
	name?: string,
	configuration: any
	layoutConfiguration: any
}

class SectionServices {
	async createSection(storyId: any, sectionConfig: SectionConfig) {
		const {data} = await axiosPost(`/v0/sections/${storyId}`, sectionConfig);
		return data;
	}

	async createSectionsBulk(storyId: any, sectionsConfigurations: SectionConfig[]) {
		const {data} = await axiosPost(`/v0/sections/${storyId}/bulk`, {sections: sectionsConfigurations});
		return data;
	}
}
export const sectionServices = new SectionServices();

