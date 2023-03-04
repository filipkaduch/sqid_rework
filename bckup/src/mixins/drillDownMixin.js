import {bucketing, dimensionDefinition, filterLogic, filterTypes} from '@/util/queryBuilder';
import {sectionStackingModes} from '@/util/consts/sectionStackingVariants';
const quartersDates = {
	q1: [
		'01-01',
		'03-31'
	],
	q2: [
		'04-01',
		'06-30'
	],
	q3: [
		'07-01',
		'09-30'
	],
	q4: [
		'10-01',
		'12-31'
	]
};

export default {
	data: () => ({
		currentBucketing: null
	}),
	computed: {
		dimensionConfiguration() {
			// exploration default widget is barchart but by default it missing metric and dimensions
			if (this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId)?.data.configuration.dimensions) {
				return this.preview ? null : this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId)?.data.configuration.dimensions[0];
			}
			return null;
		},
		isAnimated() {
			return (
				this.$store.getters['widgetInstances/configuration'](this.parentId)?.options?.stacking
				?? sectionStackingModes.ANIMATED
			) === sectionStackingModes.ANIMATED;
		},
		currentBucketType() {
			return this.currentBucketing ? this.currentBucketing : this.dimensionConfiguration.bucketType;
		},
		isDrillDown() {
			return this.isAnimated && this.dimensionConfiguration.function === dimensionDefinition.BUCKET_DATE;
		}
	},
	watch: {
		dimensionConfiguration() {
			this.currentBucketing = null;
		}
	},
	methods: {
		getDrillDownFilterValues(date) {
			const filterValues = [];
			const [selectedDate] = date.toISOString().split('T');
			const selectedYear = date.getFullYear();
			if (this.currentBucketType === bucketing.YEARS) {
				filterValues.push(selectedDate);
				filterValues.push(`${date.getFullYear()}-12-31`);
			}
			if (this.currentBucketType === bucketing.QUARTERS) {
				const [, endOfQuarter] = Object.values(quartersDates)
					.filter((quarter) => `${selectedYear}-${quarter[0]}` === selectedDate)
					.flat(1);
				filterValues.push(selectedDate);
				filterValues.push(`${selectedYear}-${endOfQuarter}`);
			}
			if (this.currentBucketType === bucketing.MONTHS) {
				const [endOfMonth] = new Date(selectedYear, date.getMonth() + 1, 0)
					.toISOString()
					.split('T');
				filterValues.push(selectedDate);
				filterValues.push(endOfMonth);
			}
			if (this.currentBucketType === bucketing.WEEKS) {
				const [endOfWeek] = new Date(selectedYear, date.getMonth(), date.getDate() + 7)
					.toISOString()
					.split('T');
				filterValues.push(selectedDate);
				filterValues.push(endOfWeek);
			}
			return filterValues;
		},
		getNewBucketType() {
			let newBucketType = null;
			switch (this.currentBucketType) {
				case bucketing.YEARS:
				case bucketing.QUARTERS:
					newBucketType = bucketing.MONTHS;
					break;
				case bucketing.MONTHS:
				case bucketing.WEEKS:
					newBucketType = bucketing.DAYS;
					break;
			}
			return newBucketType;
		},
		setDrillDownFilter(event) {
			const newBucketType = this.getNewBucketType();
			const filterValues = this.getDrillDownFilterValues(new Date(event));
			if (newBucketType) {
				this.$store.dispatch('widgetData/loadData', {
					widgetInstanceId: this.widgetInstanceId,
					reloadData: true,
					drillDownFilter: {
						forceBucket: newBucketType,
						filter: [
							{
								type: filterTypes.GROUP,
								negate: false,
								clauses: [
									{
										type: filterTypes.SIMPLE_COLUMN_VALUE,
										logic: '>=',
										value: filterValues[0],
										columnReference: this.dimensionConfiguration.column
									},
									{
										type: filterTypes.SIMPLE_COLUMN_VALUE,
										logic: '<=',
										value: filterValues[1],
										columnReference: this.dimensionConfiguration.column
									}
								],
								operator: filterLogic.AND
							}
						]
					}
				});
				this.currentBucketing = newBucketType;
			}
		},
		resetDrillDown() {
			this.currentBucketing = null;
			this.$store.dispatch('widgetData/loadData', {
				widgetInstanceId: this.widgetInstanceId,
				reloadData: true
			});
		}
	}
};
