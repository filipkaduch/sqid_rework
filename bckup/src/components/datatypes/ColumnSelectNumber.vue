<template>
	<div>
		<template v-if="componentType === componentTypesEnums.CONTROLS">
			<ds-inline align-y="center">
				<ds-switch
					:value="selectedColumn.function === dimensionDefinition.BUCKET_VALUE"
					:disabled="forceBucketing"
					@update="updateBucketing" />
				<ds-box padding-left="S">
					{{ $t('t_Bucketing') }}
				</ds-box>
			</ds-inline>

			<ds-box class="mt-2">
				<ds-text>
					{{ $t('t_BucketCount') }}
				</ds-text>
				<ds-component-wrapper
					component-name="WidgetControlSlider"
					:value="selectedColumn.numberOfBuckets || 3"
					:disabled="!bucketing"
					:minValue="min"
					:maxValue="max"
					@update:value="updateCount" />
			</ds-box>
		</template>

		<template v-if="componentType === componentTypesEnums.EXPLORER">
			<ds-inline-item>
				<ds-tooltip>
					<template #icon>
						<ds-box
							align-y="center"
							border-radius="basic"
							class="cursor-pointer"
							flex-type="row"
							padding-right="M">
							<ds-input
								:debounce="true"
								:block-emit="false"
								:value="numberOfBuckets"
								:md="true"
								:lg="false"
								:min="min"
								:max="max"
								width="100px"
								type="number"
								@update:value="updateCount" />
						</ds-box>
					</template>
					<template #tooltip>
						{{ $t('t_BucketCount') }}
					</template>
				</ds-tooltip>
			</ds-inline-item>
		</template>
	</div>
</template>

<script>
import {dimensionDefinition} from '@/util/queryBuilder';
import {componentTypesEnums} from '@/util/consts/componentTypes';
import DsSwitch from '@/components/inputs/DsSwitch.vue';

export default {
	name: 'ColumnSelectNumber',
	components: {DsSwitch},
	props: {
		selectedColumn: {
			type: Object,
			required: true
		},
		min: {
			type: Number,
			default: 1
		},
		max: {
			type: Number,
			default: 30
		},
		forceBucketing: {
			type: Boolean,
			default: false
		},
		componentType: {
			type: String,
			default: componentTypesEnums.CONTROLS
		}
	},
	emits: ['update'],
	data() {
		return {
			dimensionDefinition,
			numberOfBuckets: 0,
			componentTypesEnums
		};
	},
	computed: {
		bucketing() {
			return this.selectedColumn.function === dimensionDefinition.BUCKET_VALUE;
		}
	},
	watch: {
		selectedColumn: {
			immediate: true,
			handler(newVal) {
				// eslint-disable-next-line no-negated-condition
				if (!newVal.numberOfBuckets) {
					this.numberOfBuckets = 0;
				} else {
					this.numberOfBuckets = newVal.numberOfBuckets;
				}
			}
		}
	},
	mounted() {
		if (this.selectedColumn.function !== dimensionDefinition.BUCKET_VALUE) {
			this.updateBucketing(this.bucketing || this.forceBucketing);
		}
	},
	methods: {
		updateBucketing(bucketing) {
			this.$emit('update', {
				function: bucketing || this.forceBucketing ? dimensionDefinition.BUCKET_VALUE : dimensionDefinition.NO_CHANGE,
				numberOfBuckets: this.selectedColumn.numberOfBuckets
			});
		},
		updateCount(count) {
			this.$emit('update', {
				numberOfBuckets: count
			});
		}
	}
};
</script>

