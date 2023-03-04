import i18n from '@/plugins/i18n';
const {t} = i18n.global;


export const menuValues = {
	CREATE_STORY: 'create-story',
	CREATE_EXPLORATION: 'create-exploration',
	REFRESH: 'refresh',
	UPDATE_CYCLE: 'update-cycle',
	DELETE: 'delete'
};

export const datasetDropdownMenu = [
	{
		value: menuValues.CREATE_STORY,
		label: t('t_createStory'),
		icon: 'ds-icon-story-type'
	},
	{
		value: menuValues.CREATE_EXPLORATION,
		label: t('t_createExploration'),
		icon: 'ds-icon-exploration'
	},
	// {
	// value: menuValues.REFRESH,
	// label: t('t_Refresh'),
	// icon: 'icon-reset'
	// },
	{
		value: menuValues.UPDATE_CYCLE,
		label: t('t_UpdateCycle'),
		icon: 'icon-pencil'
	},
	{
		value: menuValues.DELETE,
		label: t('t_Delete'),
		icon: 'icon-trash'
	}
];
