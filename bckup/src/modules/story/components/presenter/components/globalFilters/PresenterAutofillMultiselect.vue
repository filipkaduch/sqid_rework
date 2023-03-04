<!-- eslint-disable max-lines -->
<template>
	<div class="d-block w-100">
		<div v-if="editable" class="px-3 mb-3">
			<button class="btn btn-clean autofill-select rounded d-flex w-100 border border-left-0 m-0 justify-content-between align-items-center p-0 bg-white">
				<div v-if="multiple === true" class="d-flex align-items-center justify-content-between w-100 custom-autofill-select">
					<bootstrap-tags
						v-model:value="baseValue"
						placeholder="t_selectValue"
						input-id="tags-basic"
						tag-variant="tag-hidden"
						tag-class="tag-hidden"
						class="border-right-0"
						@click.prevent />
					<div class="m-0 p-0 h-100 d-flex align-items-center" @click="collapse = !collapse">
						<fa-icon
							:icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']"
							class="options-grey-style my-1 mx-3 font-size-14" />
					</div>
				</div>
				<div v-else class="d-flex align-items-center justify-content-between w-100 bg-white rounded">
					<div v-if="toRender" class="w-100 choiceInput" @click="cleanInput">
						{{ choice[0].name }}
					</div>
					<app-input-bar
						v-else
						v-model:input="search"
						:pill="false"
						:rounded="true"
						:border="false"
						:type="dataType"
						class="border-0 w-100" />
				</div>
			</button>
			<ds-collapse
				:is-open="collapse"
				class="rounded filterCollapse">
				<ds-card class="rounded bg-white d-block" body-class="my-0 p-0">
					<app-input-bar
						v-if="multiple"
						v-model:input="search"
						:pill="false"
						:rounded="false"
						class="m-0 sticky-top border-0" />
					<div v-for="option in showHints" :key="`${option.name}-${option.count}`" class="p-1">
						<button class="btn btn-transparent p-0 d-flex justify-content-between w-100 align-items-center pr-1" @click="addToOptions(option)">
							<div :class="multiple === false ? 'p-2' : ''">
								<button
									v-if="multiple"
									class="btn btn-clean text-nowrap rounded d-inline-flex align-items-center justify-content-center checkBox">
									<img v-if="isSelected(option)" :src="checkBox">
									<img v-else :src="box">
								</button>
								{{ option.name }}
							</div>
						</button>
					</div>
					<div class="p-1 d-flex justify-content-center">
						<button
							v-if="showHints.length < hints.length && !isSearching"
							class="btn btn-transparent text-nowrap rounded d-inline-flex align-items-center justify-content-center w-100"
							@click="showMoreHints(filterConsts.DIRECTION_UP)">
							{{ $t('t_ShowMore') }}
							<fa-icon :icon="['fal','chevron-down']" class="mx-1" />
						</button>
						<button
							v-if="(hintsCount > 1) && !isSearching"
							class="btn btn-transparent text-nowrap rounded d-inline-flex align-items-center justify-content-center w-100"
							@click="showMoreHints(filterConsts.DIRECTION_DOWN)">
							{{ $t('t_ShowLess') }}
							<fa-icon :icon="['fal','chevron-up']" class="mx-1" />
						</button>
					</div>
				</ds-card>
			</ds-collapse>
		</div>
		<div
			v-if="(baseValue.length || (Array.isArray(value) && value.length > 0))"
			class="tag-container border-bottom-radius d-flex flex-wrap flex-gap-8 p-3">
			<filter-tag
				v-for="(item, index) in Array.isArray(value) ? value : baseValue"
				:key="`${item}-${index}`"
				:deletable="true"
				:value="item"
				@remove-filter="removeTag(index)" />
		</div>
		<div v-else-if="!Array.isArray(value) && value" class="tag-container border-bottom-radius d-flex flex-wrap flex-gap-8 p-3">
			<filter-tag
				:operation="selectedOperation"
				:value="value"
				@remove-filter="$emit('valueChanged', null)" />
		</div>
	</div>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties, sort-imports */
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import {dataTypes} from '@/util/queryBuilder';
import {filterConsts} from '@/util/filterUtils';
import FilterTag from '@/modules/story/components/presenter/components/globalFilters/FilterTag.vue';
import {logicConstants} from '@/util/consts/logicConstants';
import box from '@/assets/box-icon.svg';
import checkBox from '@/assets/checkbox-icon.svg';
import clone from 'lodash/clone';
import BootstrapTags from '@/components/temporary/BootstrapTags.vue';

export default {
	name: 'PresenterAutofillMultiselect',
	components: {
		BootstrapTags,
		FilterTag,
		AppInputBar
	},
	props: {
		value: {
			type: [
				String,
				Array,
				null
			],
			required: true,
			default: null
		},
		multiple: {
			type: Boolean,
			default: false
		},
		editable: {
			type: Boolean,
			required: true
		},
		global: {
			type: Boolean,
			default: false
		},
		dropDirection: {
			type: String,
			default: filterConsts.DIRECTION_DOWN
		},
		column: {
			type: [
				String,
				Object
			],
			default: null
		},
		dataType: {
			type: String,
			default: null
		},
		selectedOperation: {
			type: String,
			required: true
		}
	},
	emits: ['valueChanged'],
	data() {
		return {
			choice: [],
			filtered: [],
			hints: [],
			collapse: false,
			search: '',
			flag: false,
			baseValue: [],
			hintsCount: 1,
			isSearching: false,
			showHints: [],
			filterConsts,
			logicConstants,
			box,
			checkBox
		};
	},
	computed: {
		datasets() {
			return this.$store.getters['storyDetail/story']?.datasets ?? [];
		},
		datasetsFiltered() {
			if (typeof this.column === 'object') {
				return this.datasets.filter((dataset) => Object.keys(this.column).some((key) => key === dataset.id));
			}
			return this.datasets.filter((dataset) => dataset.columns.some((column) => column.name === this.column));
		},

		/*
			This computed property is a handler for getting the relevant data from column received
			either as string (local filters with one column) or object (global filters with multiple columns from
			multiple datasets) and based on this creates array of 'suggestions'
		 */
		mostCommon() {
			const multiDatasets = [];
			if (typeof this.column === 'object') {
				Object.keys(this.column).forEach((col) => {
					if (Array.isArray(this.column[col])) {
						this.column[col].forEach((element) => {
							let datasetCount = 1;
							this.datasetsFiltered.forEach((dataset) => {
								const findMostCommon = dataset.columns.find((el) => el.name === element)?.mostCommonValues;
								if (findMostCommon) {
									multiDatasets.push({
										mostCommon: findMostCommon,
										column: element,
										dataset: datasetCount
									});
								}
								datasetCount += 1;
							});
						});
					} else {
						let datasetCount = 1;
						this.datasetsFiltered.forEach((dataset) => {
							const findMostCommon = dataset.columns.find((el) => el.name === this.column[col])?.mostCommonValues;
							if (findMostCommon) {
								multiDatasets.push({
									mostCommon: findMostCommon,
									column: this.column[col],
									dataset: datasetCount
								});
							}
							datasetCount += 1;
						});
					}
				});
				return multiDatasets;
			}
			let datasetCount = 1;
			this.datasetsFiltered.forEach((dataset) => {
				const findMostCommon = dataset.columns.find((el) => el.name === this.column)?.mostCommonValues;
				if (findMostCommon) {
					multiDatasets.push({
						mostCommon: findMostCommon,
						column: this.column,
						dataset: datasetCount
					});
				}
				datasetCount += 1;
			});
			return multiDatasets;
		},
		mostCommonFormatted() {
			this.mostCommon.forEach((el) => {
				Object.keys(el.mostCommon).forEach((key) => {
					this.hints.push({
						name: el.mostCommon[key],
						count: key,
						column: el.column,
						dataset: el.dataset
					});
				});
			});
			return this.hints.sort((first, second) => second.count - first.count);
		},
		toRender() {
			return this.flag && typeof this.choice[0] !== 'undefined';
		}
	},
	watch: {
		search(value) {
			if (value !== '') {
				this.isSearching = true;
				this.searchForOption();
			}
		},
		selectedOperation(operation) {
			if (operation !== logicConstants.NOT_IN || operation !== logicConstants.IN) {
				this.baseValue = [];
			}
		},
		baseValue(value) {
			if (value.length > 0) {
				value.forEach((val) => {
					if (this.choice.findIndex((index) => index.name === val) === -1 && this.choice.length < value.length) {
						this.choice.push({
							name: val,
							count: 1,
							dataset: 0,
							column: ''
						});
					}
				});
			}
			if (this.choice.length > value.length) {
				const findIndex = this.choice.findIndex((el) => !value.includes(el.name));
				this.choice.splice(findIndex, 1);
			}
			this.changeOption(this.choice);
		},
		value(value) {
			// eslint-disable-next-line no-negated-condition
			if (!Array.isArray(value)) {
				if (this.choice.length > 0) {
					this.choice[0].name = value;
				} else {
					this.choice.push({
						name: value,
						count: 1,
						dataset: 0,
						column: ''
					});
				}
			} else {
				this.search = '';
				value.forEach((val) => {
					const findIndex = this.choice.findIndex((index) => index.name === val);
					if (findIndex === -1 && this.choice.length < value.length) {
						this.choice.push({
							name: val,
							count: 1,
							dataset: 0,
							column: ''
						});
					}
				});
				const removeIndex = [];
				this.choice.forEach((cho, index) => {
					if (value.findIndex((val) => cho.name === val) === -1) {
						removeIndex.push(index);
					}
				});
				removeIndex.forEach((removeInd) => {
					this.choice.splice(removeInd, 1);
				});
				this.getTopValuesForColumns();
			}
		},
		column: {
			deep: true,
			immediate: true,
			handler() {
				this.hints = [];
				this.hints = this.mostCommonFormatted;
				this.showHints = [];
				this.getTopValuesForColumns();
			}
		}
	},
	mounted() {
		if (this.value) {
			this.flag = true;
		}

		if (this.value !== null && !Array.isArray(this.value)) {
			this.choice = this.hints.filter((hint) => hint.name === this.value);
			if (this.choice === null || this.choice.length === 0) {
				this.choice.push({
					name: this.value,
					count: 1,
					dataset: 0,
					column: ''
				});
			}
		} else if (this.value !== null && Array.isArray(this.value)) {
			this.choice = this.hints.filter((mf) => this.value.includes(mf.name));
			this.value.forEach((cho) => {
				this.baseValue.push(cho);
				if (typeof this.choice.find((el) => el.name === cho) === 'undefined') {
					this.choice.push({
						name: cho,
						count: 1,
						dataset: 0,
						column: ''
					});
				}
			});
		}
		if (this.hints.length === 0 && this.mostCommonFormatted.length > 0) {
			this.hints = this.mostCommonFormatted;
			this.getTopValuesForColumns();
		}
	},
	methods: {
		removeTag(index) {
			this.baseValue.splice(index, 1);
		},
		showMoreHints(direction) {
			if (direction === this.filterConsts.DIRECTION_UP) {
				this.hintsCount += 1;
			} else if (this.hintsCount !== 0) {
				this.hintsCount -= 1;
			}
			this.getTopValuesForColumns();
		},

		/*
			Method for preparing data for dropdown handles prop column either as string (local filters) or object (global filters)
			and based on this gets top number of values sorted by occurrence in only/each column
		 */
		getTopValuesForColumns() {
			const cols = [];
			let colNum = 0;

			if (typeof this.column === 'string') {
				let select = 5 * this.hintsCount;
				const toPush = this.hints.filter((filter) => filter.column === this.column);
				if (select > toPush.length) {
					select = toPush.length;
				}
				const iter = toPush.sort((first, second) => second.count - first.count).slice(0, select);
				iter.forEach((it) => {
					cols.push(it);
				});
			} else {
				Object.keys(this.column).forEach((col) => {
					colNum += this.column[col].length;
				});
				Object.keys(this.column).forEach((key) => {
					this.column[key].forEach((col) => {
						let select = Math.ceil(5 / colNum) * this.hintsCount;
						const toPush = this.hints.filter((filter) => filter.column === col);
						if (select > toPush.length) {
							select = toPush.length;
						}
						const iter = toPush.sort((first, second) => second.count - first.count).slice(0, select);
						iter.forEach((it) => {
							cols.push(it);
						});
					});
				});
			}
			this.showHints = cols.sort((first, second) => second.count - first.count);
		},
		searchForOption() {
			this.filtered = [];
			if (this.dataType.toUpperCase() === dataTypes.NUMBER) {
				this.filtered = this.hints.filter((hint) => hint.name === this.search);
				this.search = this.search.toString();
			} else {
				this.filtered = this.hints.filter((hint) => hint.name.toLowerCase().includes(this.search.toLowerCase()) === true);
			}

			if (this.filtered.length === 0) {
				this.filtered.push({
					name: this.search,
					count: 1
				});
				if (this.multiple === false) {
					this.changeOption(this.filtered[0]);
				}
			}
			this.showHints = [];
			this.showHints = this.filtered;
			if (this.search === '') {
				this.isSearching = false;
				this.hints = [];
				this.hints = this.mostCommonFormatted;
				this.showHints = [];
				this.getTopValuesForColumns();
			}
		},
		changeOption(value) {
			if (this.multiple) {
				const sendValues = [];
				value.forEach((el) => {
					sendValues.push(el.name);
				});
				this.$emit('valueChanged', sendValues);
			} else {
				// eslint-disable-next-line no-lonely-if
				if (typeof value === 'object') {
					this.$emit('valueChanged', value.name);
				} else {
					this.$emit('valueChanged', value);
				}
			}
		},
		cleanInput() {
			this.flag = false;
			this.collapse = !this.collapse;

			if (this.multiple === false) {
				this.search = this.choice[0].name;
			}
		},

		/*
			Based on the flag multiple creates an option to display in input bar/form tags
		 */
		addToOptions(value) {
			if (this.multiple === false) {
				this.flag = true;
				if (this.choice.length > 0) {
					this.choice[0] = clone(value);
				} else {
					this.choice.push(value);
				}
				this.collapse = !this.collapse;
				this.changeOption(this.choice[0]);
			} else {
				const findOption = this.choice.find((el) => el.name === value.name);

				/* if (findValue === false) {
					this.baseValue.push(value.name);
				} else {
					const findIndex = this.baseValue.indexOf((el) => el === value.name);
					this.baseValue.splice(findIndex, 1);
				} */

				if (typeof findOption === 'undefined') {
					this.choice.push(value);
				} else {
					const findIndex = this.choice.findIndex((el) => el.name === value.name);
					this.choice.splice(findIndex, 1);
				}
				this.changeOption(this.choice);
			}
		},
		isSelected(value) {
			if (this.choice !== null) {
				return this.choice.some((cho) => value.name === cho.name);
			}
			return false;
		}
	}
};
</script>

<style lang="scss" scoped>
	:deep(li.flex-grow-1) {
		margin:0!important;
		font-size: 14px;
		color: map-get($ds-colors, 'display-content-700')!important
	}
	:deep(li.badge) {
		width: 0!important;
		height: 0!important;
		display: none!important;
	}

	.custom-autofill-select {
		border: 1px solid #8CA4B0;
		border-radius: 4px;
		height: 36px!important;
	}
	:deep(input.select) {
		border: none;
		border-bottom: 1px solid #C8D4DA!important;
	}
	.autofill-select {
		height: 36px!important;
		border: none!important;
		.b-form-tags {
			border: none!important;
			height: 34px!important;
		}
	}
	.card {
		border: 1px solid #8CA4B0;
		border-radius: 4px;
	}
</style>

