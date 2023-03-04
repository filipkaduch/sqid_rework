<template>
	<div>
		<template v-for="(column, index) in filters" :key="`FilterColumn${index}`">
			<div>
				<div
					v-if="hasRelation && index !== 0"
					class="d-flex justify-content-center p-3"
					style="background: linear-gradient(#AABFF8, #AABFF8) no-repeat center/2px 100%;">
					<ds-dropdown
						variant="clean"
						style="background: white; min-width: 0px;"
						class="w-auto p-1 border-0 text-center">
						<template #dropdownContent>
							<button class="btn btn-clean">
								{{ operationConstants.AND }}
							</button>
						</template>
						<template #triggerContent>
							<div class="dropdown-item" @click="setfilterClause(operationConstants.AND, index)">
								{{ operationConstants.AND }}
							</div>
						</template>
					</ds-dropdown>
				</div>
				<div class="p-3" style="background-color:#FBFBFC;" :style="isNotFirst ? 'border-bottom: 1px solid #AABFF8; border-top: 1px solid #AABFF8;' : ''">
					<multi-filter-column-select
						v-model:filter="filters[index]"
						:selected-operation="filters[index].logic"
						:filterValue="getFilterValue(index)"
						:filterIndex="index"
						:automap="false"
						@filter-deleted="deleteFilter(index)"
						@filter-created="saveConfiguration(index, $event)" />
				</div>
			</div>
		</template>
		<div
			v-if="isNotFirst"
			class="d-block justify-content-center p-3"
			:style="filters.length > 0 ? 'background: linear-gradient(#AABFF8, #AABFF8) no-repeat top/2px 20%;' : ''">
			<button
				data-testid="add-global-filter"
				class="btn btn-add-section btn-block border bg-white"
				style="color: #2D3038;"
				@click="addFilterColumn">
				<fa-icon :icon="['fal','plus-circle']" />
				{{ $t('t_AddFilter') }}
			</button>
			<button
				v-if="filters.length > 0"
				class="btn btn-add-section btn-block border bg-white"
				style="color: #2D3038;"
				@click="removeAllFilters">
				<ds-icon name="icon bin" alt="Delete filter" />
				{{ $t('t_RemoveFilters') }}
			</button>
		</div>
	</div>
</template>

<script>
import MultiFilterColumnSelect from '@/modules/widget/components/widget-controls/MultiFilterColumnSelect.vue';
import {dataTypes} from '@/util/queryBuilder';
import filterMixin from '@/mixins/filterMixin';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

export default {
	name: 'GlobalFilters',
	components: {
		MultiFilterColumnSelect
	},
	mixins: [filterMixin],
	data() {
		return {
			filters: [],
			filterClauses: ['AND'],
			chooseType: false,
			dataTypes
		};
	},
	computed: {
		value() {
			return this.storyConfig?.globalFilters ?? [];
		},
		datasets() {
			return this.$store.getters['storyDetail/story']?.datasets ?? [];
		},
		storyConfig() {
			return this.$store.getters['storyDetail/story'].configuration ?? {};
		},
		hasRelation() {
			return this.filters.length >= this.filterClauses.length && this.filters.length > 1;
		},
		globalFilterMap() {
			return this.storyConfig?.globalFilterMap ?? [];
		}
	},
	watch: {
		value: {
			immediate: true,
			deep: true,
			handler(newValue) {
				this.filters = cloneDeep(newValue);
				if (!this.filters) {
					this.filters = [];
				}
			}
		}
	},
	methods: {
		isNotFirst() {
			if (this.filters?.length <= 1 && isEmpty(this.filters[0])) {
				return false;
			}
			return true;
		},
		getFilterOperation(index) {
			return typeof this.filters[index] === 'undefined'
				? ''
				: this.getKeyByValue(this.filters[index].logic);
		},
		getFilterValue(index) {
			return typeof this.filters[index].value === 'undefined'
				? this.filters[index].values
				: this.filters[index].value;
		},
		addFilterColumn() {
			this.chooseType = false;
			this.filters.push({
				columnReference: {},
				active: true,
				editable: true
			});
		},
		removeAllFilters() {
			this.filters = [];
			this.filterClauses = ['AND'];
			const newConfiguration = cloneDeep(this.storyConfig);
			newConfiguration.globalFilters = null;
			newConfiguration.globalFilterMap = [];
			this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true});
		},
		deleteFilter(index) {
			this.filters.splice(index, 1);
			if (this.filters.length === 0) {
				this.filters = [];
			}
			if (this.globalFilterMap.find((el) => el.index === index)) {
				const tempMap = this.globalFilterMap.filter((item) => item.index !== index);
				const newConfiguration = cloneDeep(this.storyConfig);
				newConfiguration.globalFilterMap = tempMap;
				this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true});
			}
			this.saveConfiguration(index);
		},
		setfilterClause(operation, index) {
			if (index - 1 > this.filterClauses.length) {
				this.filterClauses.push(operation);
			} else {
				this.filterClauses[index - 1] = operation;
			}
			this.saveConfiguration();
		},
		// eslint-disable-next-line max-lines-per-function, max-statements, no-unused-vars
		saveConfiguration(index, event = null) {
			if (event !== null) {
				if (event.filterIndex >= this.filters.length) {
					this.filters.push(event.filter);
				} else {
					this.filters[index] = event.filter;
				}
			}
			if (this.filters.length > 0) {
				let newConfiguration = cloneDeep(this.storyConfig);
				if (newConfiguration === null) {
					newConfiguration = {};
				}
				newConfiguration.globalFilters = this.filters;
				this.$store.dispatch('storyDetail/updateStory', {
					configuration: newConfiguration,
					keepColors: true
				}, {root: true});
			} else {
				const newConfiguration = cloneDeep(this.storyConfig);
				newConfiguration.globalFilters = null;
				this.$store.dispatch('storyDetail/updateStory', {
					configuration: newConfiguration,
					keepColors: true
				}, {root: true});
			}
		}
	}
};
</script>
