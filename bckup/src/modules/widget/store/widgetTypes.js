// eslint-disable-next-line max-lines-per-function
const getInitialState = () => ({
	widgetTypes: [
		{
			icon: 'map',
			subGroups: [
				{
					icon: 'map_satellite',
					tkDesc: 'widget_pallete_map_satellite_desc',
					tkTitle: 'widget_pallete_map_satellite_title',
					widgets: []
				}
			],
			tkDesc: 'widget_pallete_map_desc',
			tkTitle: 'widget_pallete_map_title'
		},
		{
			icon: 'chart',
			subGroups: [
				{
					icon: 'chart_usecases',
					tkDesc: 'widget_pallete_chart_usecases_desc',
					tkTitle: 'widget_pallete_chart_usecases_title',
					widgets: []
				},
				{
					icon: 'chart_line',
					tkDesc: 'widget_pallete_chart_line_desc',
					tkTitle: 'widget_pallete_chart_line_title',
					widgets: []
				},
				{
					icon: 'chart_pie',
					tkDesc: 'widget_pallete_chart_pie_desc',
					tkTitle: 'widget_pallete_chart_pie_title',
					widgets: []
				},
				{
					icon: 'chart_column',
					tkDesc: 'widget_pallete_chart_column_desc',
					tkTitle: 'widget_pallete_chart_column_title',
					widgets: []
				}
			],
			tkDesc: 'widget_pallete_chart_desc',
			tkTitle: 'widget_pallete_chart_title'
		},
		{
			icon: 'text',
			subGroups: [
				{
					icon: 'text_paragraph',
					tkDesc: 'widget_pallete_text_paragraph_desc',
					tkTitle: 'widget_pallete_text_paragraph_title',
					widgets: []
				}
			],
			tkDesc: 'widget_pallete_text_desc',
			tkTitle: 'widget_pallete_text_title'
		}
	],
	initialized: false
});

const getObjectPath = (widgetTypes, group, subGroup, hide = false) => widgetTypes
	.find((item) => item.icon === group).subGroups.find((item) => (item.icon === subGroup) && !hide)?.widgets ?? [];

export default {
	namespaced: true,
	state: getInitialState(),
	mutations: {
		setWidgetTypes(state, widgetTypes) {
			// eslint-disable-next-line array-element-newline
			for (const [key, value] of Object.entries(widgetTypes ?? {})) {
				getObjectPath(state.widgetTypes, value.widgetGroup.group, value.widgetGroup.subGroup, value.widgetGroup.hide)
					.push({
						wtuid: key,
						tkDesc: `widgetTypes.${key}_desc`,
						tkTitle: `widgetTypes.${key}_title`
					});
			}
		},
		initialize(state) {
			state.initialized = true;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	getters: {
		widgetTypes: (state) => state.widgetTypes,
		initialized: (state) => state.initialized
	},
	actions: {
		loadWidgetTypes({commit}, payload) {
			commit('reset');
			commit('setWidgetTypes', payload);
			commit('initialize');
			return Promise.resolve();
		}
	}
};
