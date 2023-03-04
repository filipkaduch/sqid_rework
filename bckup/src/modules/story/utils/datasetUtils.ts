export const getIcons = (connectionType: string) => {
	switch (connectionType) {
		case 'SNOWFLAKE':
			return 'ds-icon-snowflake';
		case 'POSTGRESQL':
			return 'ds-icon-postgres';
		case 'AURORA-POSTGRESQL':
			return 'ds-icon-aurora-postgres';
		case 'DMM':
			return 'ds-icon-RDM';
		default:
			return 'ds-icon-postgres';
	}
};
