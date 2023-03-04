<template>
	<datepicker
		class="w-100"
		:model-value="value"
		:placeholder="$t(placeholder)"
		:disabled="disabled"
		auto-apply
		:enable-time-picker="false"
		:clearable="false"
		:min-date="minDate"
		:max-date="maxDate"
		model-type="yyyy-MM-dd"
		:format="format"
		@update:model-value="$emit('update:value', $event)">
		<template #calendar-header="{day}">
			<ds-text color="display-content" variant="bodyMedium">
				{{ day }}
			</ds-text>
		</template>
	</datepicker>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default defineComponent({
	name: 'DataStoriesDatepicker',
	components: {Datepicker},
	props: {
		value: {
			type: Date as PropType<Date | string | null>,
			default: null
		},
		minDate: {
			type: Date as PropType<Date | string | null>,
			default: null
		},
		maxDate: {
			type: Date as PropType<Date | string | null>,
			default: null
		},
		disabled: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: 't_selectDate'
		},
		format: {
			type: String,
			default: 'MM/dd/yyyy'
		},
		modelType: {
			type: String,
			default: 'yyyy-MM-dd'
		}
	},
	emits: ['update:value']
});
</script>

<style lang="scss">
.dp__input {
	font-family: 'Roboto', Helvetica, sans-serif!important;
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
}

.dp__month_year_select {
	font-family: 'Roboto', Helvetica, sans-serif!important;
	color: map-get($ds-colors, 'display-content-700');
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	height: 20px
}
.dp__inner_nav {
	height: 20px;
	width: 20px;
}
.dp__month_year_row {
	height: 20px;
	justify-content: center;
}
.dp__overlay_cell {
	font-family: 'Roboto', Helvetica, sans-serif!important;
	font-size: 14px;
	font-weight: 400;
	line-height: 24px;
}
.dp__month_year_wrap {
	display: flex!important;
	width: 25%!important;
}
.dp__arrow_top {
	display: none;
}
.dp__arrow_bottom {
	display: none;
}
.dp__instance_calendar {
	padding: 16px 8px 8px;
}
.dp__calendar_header_item {
	height: 40px;
	width: 40px;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
.dp__calendar_item {
	height: 40px;
	width: 40px;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
.dp__cell_inner {
	padding: 0;
	font-family: 'Roboto', Helvetica, sans-serif!important;
	font-size: 14px;
	font-weight: 400;
	line-height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 9999px!important;
}
.dp__overlay_col {
	font-family: 'Roboto', Helvetica, sans-serif!important;
}
.dp__range_end, .dp__range_start, .dp__active_date {
	background: map-get($ds-colors, 'primary')!important;
}
.dp__overlay_cell_active {
	background: map-get($ds-colors, 'primary')!important;
}
.dp__today {
	border: none!important;
	background-color: map-get($ds-colors, 'separate-content-100');
}
</style>
