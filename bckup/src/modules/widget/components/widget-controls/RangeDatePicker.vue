<template>
	<div>
		<br>
		<div class="d-flex">
			<ds-datepicker
				v-model:value="firstDateFrom"
				:min-date="min"
				:max-date="max"
				class="mb-1 mr-2" />
			<ds-datepicker
				v-model:value="firstDateTo"
				:min-date="min"
				:max-date="max"
				class="mb-1 ml-2" />
		</div>
		<span class="d-flex justify-content-center">vs</span>
		<div class="d-flex">
			<ds-datepicker
				v-model:value="secondDateFrom"
				:min-date="min"
				:max-date="max"
				class="mb-1 mr-2" />
			<ds-datepicker
				v-model:value="secondDateTo"
				:min-date="min"
				:max-date="max"
				class="mb-1 ml-2" />
		</div>
		<div>
			<button
				class="btn btn-white mx-2 my-3 border"
				@click="submit">
				{{ $t('t_submit') }}
			</button>
			<button
				class="btn btn-white mx-2 my-3 border"
				@click="removeDates">
				{{ $t('t_removeDate') }}
			</button>
		</div>
	</div>
</template>

<script>
import {dimensionLabel} from '@/util/widgetData';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';

export default {
	name: 'RangeDatePicker',
	components: {
	},
	mixins: [widgetControlComponentMixin],
	props: {
		widgetInstanceId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			firstDateFrom: null,
			firstDateTo: null,
			secondDateFrom: null,
			secondDateTo: null
		};
	},
	computed: {
		rawData() {
			return this.$store.getters['widgetData/rawData'](this.widgetInstanceId);
		},
		calendarRange() {
			return (this.rawData?.rows ?? []).map((row) => dimensionLabel(row));
		},
		min() {
			return new Date(this.calendarRange[0]);
		},
		max() {
			return new Date(this.calendarRange[this.calendarRange.length - 1]);
		}
	},
	methods: {
		submit() {
			if (this.firstDateFrom !== null
				&& this.firstDateTo !== null
				&& this.secondDateFrom !== null
				&& this.secondDateTo !== null
			) {
				const obj = {
					firstFrom: this.firstDateFrom,
					firstTo: this.firstDateTo,
					secondFrom: this.secondDateFrom,
					secondTo: this.secondDateTo
				};
				this.setOption(obj, 'timeComparisonDates');
			}
		},
		removeDates() {
			this.setOption(null, 'timeComparisonDates');
			this.secondDateFrom = null;
			this.firstDateFrom = null;
			this.firstDateTo = null;
			this.secondDateTo = null;
		}
	}
};
</script>
