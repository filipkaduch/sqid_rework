<template>
	<div>
		<template v-if="componentType === componentTypesEnums.CONTROLS">
			<ds-btn-group class="mb-2">
				<ds-btn
					v-for="(button, index) in bucketTypeOptions"
					:key="index"
					variant="secondary"
					:pressed="selectedType === button.value"
					@click="updateType(button.value)">
					{{ button.text }}
				</ds-btn>
			</ds-btn-group>

			<bootstrap-select
				:value="selectedBucketUnit"
				text-field="text"
				value-field="value"
				:options="unitOptions"
				@change="updateUnit($event.target.value)" />
		</template>

		<template v-if="componentType === componentTypesEnums.EXPLORER && selectedColumn.function !== dimensionDefinition.NO_CHANGE">
			<ds-box flex-type="row" padding-right="S">
				<ds-select
					v-if="selectedColumn.function === dimensionDefinition.BUCKET_DATE"
					:items="bucketOptions"
					:container="container"
					checker
					max-width
					:clear-btn-text="$t('t_Remove')"
					clear-btn-icon="ds-icon-minus-circle"
					:groups="[$t('t_Bucketing')]"
					placement="bottom-end"
					@input="updateBucketing">
					<template #triggerContent>
						<ds-tooltip>
							<template #icon>
								<ds-box
									align-y="center"
									border-radius="basic"
									class="cursor-pointer"
									flex-type="row">
									<ds-box
										border="separate"
										border-radius="basic"
										class="cursor-pointer ds-bg-separate-content-0 d-flex"
										padding-x="S">
										<ds-text class="pl-1" color="display-content-700" variant="body">
											{{ (bucketType === dimensionDefinition.BUCKET_DATE && selectedColumn?.bucketsDatetime ? $t(`t_bucket_${selectedColumn?.bucketsDatetime}`) : $t('t_Select')) }}
										</ds-text>
										<ds-icon name="ds-icon-chevron-down" />
									</ds-box>
								</ds-box>
							</template>
							<template #tooltip>
								<ds-inline>
									<ds-text variant="bodyMedium" color="white">{{ `${$t('t_Bucketing')}` }}</ds-text>
									<ds-text white-space="pre-wrap" color="white">{{ ` -  ${$t(`t_bucket_${selectedColumn?.bucketsDatetime}`)}` }}</ds-text>
								</ds-inline>
							</template>
						</ds-tooltip>
					</template>
				</ds-select>
				<ds-select
					v-else-if="selectedColumn.function === dimensionDefinition.EXTRACT_DATE"
					:items="extractOptions"
					max-width
					checker
					:clear-btn-text="$t('t_Remove')"
					clear-btn-icon="ds-icon-minus-circle"
					:groups="[$t('t_Extract')]"
					:container="container"
					placement="bottom-end"
					@input="updateExtracting">
					<template #triggerContent>
						<ds-tooltip>
							<template #icon>
								<ds-box
									align-y="center"
									border-radius="basic"
									class="cursor-pointer"
									flex-type="row"
									padding-bottom="S">
									<ds-box
										border="separate"
										border-radius="basic"
										class="cursor-pointer ds-bg-separate-content-0 d-flex"
										padding-x="S">
										<ds-text class="pl-1" color="display-content-700" variant="body">
											{{ (bucketType === dimensionDefinition.EXTRACT_DATE && selectedColumn?.bucketsDatetime
												? $t(`t_extract_${selectedColumn?.bucketsDatetime}`)
												: $t('t_Select')) }}
										</ds-text>
										<ds-icon name="ds-icon-chevron-down" />
									</ds-box>
								</ds-box>
							</template>
							<template #tooltip>
								<ds-inline>
									<ds-text variant="bodyMedium" color="white">{{ `${$t('t_Extract')}` }}</ds-text>
									<ds-text white-space="pre-wrap" color="white">{{ ` -  ${$t(`t_extract_${selectedColumn?.bucketsDatetime}`)}` }}</ds-text>
								</ds-inline>
							</template>
						</ds-tooltip>
					</template>
				</ds-select>
			</ds-box>
		</template>
	</div>
</template>

<script>
import {bucketing, dimensionDefinition, extracting} from '@/util/queryBuilder';
import {componentTypesEnums} from '@/util/consts/componentTypes';
import BootstrapSelect from '@/components/temporary/BootstrapSelect.vue';

export default {
	name: 'ColumnSelectDate',
	components: {BootstrapSelect},
	props: {
		selectedColumn: {
			type: Object,
			required: true
		},
		componentType: {
			type: String,
			default: componentTypesEnums.CONTROLS
		},
		container: {
			type: String,
			default: 'body'
		}
	},
	emits: ['update:isDateBucketValid', 'update', 'update:selectedBucketType'],
	data() {
		return {
			bucketTypeOptions: [
				{
					value: dimensionDefinition.EXTRACT_DATE,
					text: this.$t('t_Extract')
				},
				{
					value: dimensionDefinition.BUCKET_DATE,
					text: this.$t('t_Bucketing')
				}
			],
			extractUnitOptions: Object.values(extracting),
			bucketUnitOptions: Object.values(bucketing),
			selectedBucketUnit: null,
			selectedExtractUnit: null,
			selectedType: null,
			componentTypesEnums,
			dimensionDefinition
		};
	},
	computed: {
		bucketUnit() {
			return this.selectedColumn.bucketsDatetime ? this.selectedColumn.bucketsDatetime : null;
		},
		bucketType() {
			return this.selectedColumn.function ? this.selectedColumn.function : dimensionDefinition.BUCKET_DATE;
		},
		unitOptions() {
			return this.selectedType === dimensionDefinition.BUCKET_DATE
				? this.bucketOptions
				: this.extractOptions;
		},
		bucketOptions() {
			return this.mapUnitOptions(this.bucketUnitOptions, 'bucket');
		},
		extractOptions() {
			return this.mapUnitOptions(this.extractUnitOptions, 'extract');
		},
		isValid() {
			return Boolean(this.selectedType && this.selectedBucketUnit);
		}
	},
	watch: {
		isValid() {
			this.$emit('update:isDateBucketValid', this.isValid);
		},
		bucketUnit: {
			deep: true,
			handler(val) {
				if (val) {
					this.selectedBucketUnit = val;
				}
			}
		}
	},
	mounted() {
		this.selectedType = this.bucketType;
		this.selectedBucketUnit = this.bucketUnit;
	},
	methods: {
		updateUnit(unit) {
			this.selectedBucketUnit = unit;
			if (this.selectedBucketUnit) {
				this.$emit('update', {
					function: this.selectedType,
					bucketsDatetime: this.selectedBucketUnit
				});
			}
		},
		updateBucketing(unit) {
			this.selectedBucketUnit = unit;
			this.selectedExtractUnit = null;
			if (this.selectedBucketUnit || this.componentType === componentTypesEnums.EXPLORER) {
				this.$emit('update', {
					function: dimensionDefinition.BUCKET_DATE,
					bucketsDatetime: this.selectedBucketUnit
				});
			}
		},
		updateExtracting(unit) {
			this.selectedExtractUnit = unit;
			this.selectedBucketUnit = null;
			if (this.selectedExtractUnit) {
				this.$emit('update', {
					function: dimensionDefinition.EXTRACT_DATE,
					bucketsDatetime: this.selectedExtractUnit
				});
			}
		},
		updateType(type) {
			this.selectedType = type;
			this.selectedBucketUnit = null;
			this.$emit('update:selectedBucketType', this.selectedType);
		},
		mapUnitOptions(units, type) {
			let unitsFiltered = [...units];
			if (this.componentType === this.componentTypesEnums.EXPLORER) {
				unitsFiltered = units.filter((unit) => unit !== null);
			}
			return unitsFiltered.map((unit) => ({
				value: unit,
				text: this.$t(`t_${type}_${unit}`),
				selectLabel: this.$t(`t_${type}_${unit}`),
				...(this.selectedBucketUnit === unit || this.selectedExtractUnit === unit ? {selected: unit} : {}),
				label: this.$t(`t_${type}_${unit}`),
				group: type === 'bucket' ? this.$t('t_Bucketing') : this.$t('t_Extract')
			}));
		}
	}
};
</script>

<style scoped>
.btn-white.active {
	background-color: #F3F6F7 !important;
	box-shadow: 0 0 0 0.2rem rgb(78 117 253 / 25%)!important;
	z-index:2;
}
.btn-white.active:focus {
	box-shadow: 0 0 0 0.2rem rgb(78 117 253 / 25%)!important;
	z-index:2;
}
</style>
