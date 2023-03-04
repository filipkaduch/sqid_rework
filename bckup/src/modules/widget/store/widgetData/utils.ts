// eslint-disable-next-line max-lines-per-function
import {dimensionDefinition, ordering} from '@/util/queryBuilder';
import {widgetServices} from '@/modules/widget/widgetServices';
import {checkColumnsInDataAsset} from '@/modules/widget/store/widgetInstances/utils';
import {notify} from '@kyvg/vue3-notification';
import i18n from '@/plugins/i18n/index';
const {t} = i18n.global;

// eslint-disable-next-line max-lines-per-function
export const getTopValues = async(configurationData: any, rootGetters: any, multiSeriesMetric: any, columnsInDataset: string[] = []): Promise<any> => {
	let findTopValues: any = [];
	const isCatalog = configurationData.catalogItemId;
	const topValues = configurationData.configuration?.dimensions?.find((dimension: any) => (dimension.topValues || dimension.topValues === null));

	const topValuesDimension = topValues?.topValues
		? topValues
		: multiSeriesMetric
			? {
				...(topValues || {}),
				topValues: {
					count: 10,
					direction: ordering.ASC
				}
			}
			: null;

	if (topValuesDimension) {
		try {
			const topValuesPayload = {
				...(isCatalog
					? {
						catalogItemId: configurationData.catalogItemId,
						dataObjectSource: 'CATALOG-ITEM'
					}
					: {
						datasetInfoId: rootGetters['storyDetail/story'].datasets.find((dataset: any) => dataset.id === configurationData.datasetId)?.info.datasetInfoId,
						dataObjectSource: 'DATA-STORIES-DATASET'
					}
				),
				dimensions: [
					{
						column: {
							name: topValuesDimension.column,
							alias: 'Dimension1'
						},
						function: dimensionDefinition.NO_CHANGE
					}
				],
				...(topValuesDimension.topValues.metric
					? {
						metrics: [
							{
								column: {
									name: topValuesDimension.topValues.metric.column,
									alias: 'Metric1'
								},
								aggregation: topValuesDimension.topValues.metric.aggregation
							}
						]
					}
					: {}),
				limit: topValuesDimension.topValues.count,
				orderBy: [
					{
						columnAlias: topValuesDimension.topValues.metric ? 'Metric1' : 'Dimension1',
						order: topValuesDimension.topValues.direction
					}
				]
			};

			const columnsToCheck = topValuesPayload.metrics ? [topValuesDimension.topValues.metric.column] : [];
			const performFetch = checkColumnsInDataAsset(columnsInDataset, columnsToCheck);

			if (performFetch) {
				const {data} = rootGetters['widgetInstances/readOnly']
					? await widgetServices.fetchDataPublished(rootGetters['storyDetail/publishToken'], topValuesPayload)
					: await widgetServices.fetchData(topValuesPayload);
				const dimensionIndex = data?.columns.map((column: any) => column.reference).indexOf('Dimension1');

				findTopValues = dimensionIndex >= 0
					? [
						{
							column: topValuesDimension.column,
							values: data.rows.map((row: any) => row[dimensionIndex])
						}
					]
					: [];
			}
		} catch (error) {
			notify({
				type: 'danger',
				text: error?.response?.data?.error?.message ?? t('t_UnexpectedError'),
				duration: 5000
			});
		}
	}
	return findTopValues;
};
