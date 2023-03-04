<template>
	<div>
		<bootstrap-select
			v-model:value="selectedFormatOption" :options="FormatOptions" value-field="value" text-field="text"
			@update:value="resetSelectedOption" />
		<div v-if="selectedFormatOption === 'currency'">
			<bootstrap-select
				v-model:value="selected" :options="currencyFormatOptions" value-field="value" text-field="text"
				@update:value="updateOption" />
		</div>
		<div v-else-if="selectedFormatOption === 'Number'">
			<bootstrap-select
				v-model:value="selected" :options="numberFormatOptions" value-field="value" text-field="text"
				@update:value="updateOption" />
		</div>
	</div>
</template>

<script>
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import {numberFormatOptions, currencyFormatOptions} from './consts/formatOptions';
import BootstrapSelect from '@/components/temporary/BootstrapSelect.vue';

export default {
	name: 'FormatNumberSelect',
	components: {BootstrapSelect},
	mixins: [widgetControlComponentMixin],
	props: {
		selectedFormat: {
			type: Object,
			default: null
		},
		widgetInstanceId: {
			type: String,
			required: true
		},
		formatName: {
			type: String,
			required: true
		}
	},
	emits: ['setNumberFormat'],
	// eslint-disable-next-line max-lines-per-function
	data() {
		return {
			selected: this.selectedFormat,
			selectedFormatOption: this.selectedFormat === null
				? null
				: typeof this.selectedFormat?.style !== 'undefined' && this.selectedFormat?.style === 'currency'
					? this.selectedFormat?.style
					: 'Number',
			collapse: false,
			FormatOptions: [
				{
					value: null,
					text: this.$t('numberFormat.selectFormat')
				},
				{
					value: 'currency',
					text: this.$t('numberFormat.currency')
				},
				{
					value: 'Number',
					text: this.$t('numberFormat.number')
				}
			],
			currencyFormatOptions,
			numberFormatOptions
		};
	},
	methods: {
		updateOption() {
			this.$emit('setNumberFormat', this.selected);
		},
		resetSelectedOption() {
			if (this.selectedFormatOption === null) {
				this.selected = null;
				this.$emit('setNumberFormat', this.selected);
			}
		}
	}
};
</script>
