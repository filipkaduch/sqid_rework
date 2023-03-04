<template>
	<div>
		<div>
			<button
				class="btn btn-white w-100 d-flex justify-content-between rounded select border btn-group align-items-center column-select-right m-0 p-0 algLeft pl-3"
				@click="collapse = !collapse">
				<span v-if="selected === null">
					Please select date format
				</span>
				<span v-else>
					{{ buttonText }}
				</span>
				<fa-icon :icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']" class="mx-3 options-grey-style" />
			</button>
			<ds-collapse :is-open="collapse" class="w-100 mt-2 m-0">
				<ds-card class="shadow-none border-0" body-class="my-0 p-0" style="background-color: #F3F6F7;">
					<div class="list-group">
						<div
							v-for="(option, index) in dateFormatOptions"
							:key="index"
							class="list-group-item border-0 p-0">
							<button
								class="btn btn-white w-100 d-flex justify-content-between align-items-center py-2 m-0 noBorder"
								@click="updateOption(option.value)">
								{{ option.text }}
							</button>
						</div>
					</div>
				</ds-card>
			</ds-collapse>
		</div>
	</div>
</template>

<script>
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import {dateFormatOptions} from './consts/formatOptions';

export default {
	name: 'FormatDateSelect',
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
	emits: ['setDateFormat'],
	// eslint-disable-next-line max-lines-per-function
	data() {
		return {
			selected2: this.selectedFormat,
			collapse: false,
			dateFormatOptions
		};
	},
	computed: {
		buttonText() {
			let res = '---';
			for (let i = 0; i < this.dateFormatOptions.length; i++) {
				if (this.objectEquals(this.dateFormatOptions[i].value, this.selected)) {
					res = this.dateFormatOptions[i].text;
				}
			}
			return res;
		},
		selected() {
			if (this.formatName === 'xAxis') {
				return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'selectedFormat')?.xAxis ?? null;
			} else if (this.formatName === 'Timeline') {
				return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'selectedFormat')?.timeline ?? null;
			}
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'selectedFormat')?.yAxis ?? null;
		}
	},
	methods: {
		updateOption(value) {
			this.$emit('setDateFormat', value);
		},
		objectEquals(object1, object2) {
			if (object1 === null || object2 === null) {
				return false;
			}

			const keys1 = Object.keys(object1);
			const keys2 = Object.keys(object2);

			if (keys1.length !== keys2.length) {
				return false;
			}

			for (const key of keys1) {
				if (object1[key] !== object2[key]) {
					return false;
				}
			}
			return true;
		}
	}
};
</script>
