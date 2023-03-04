<template>
	<div v-if="story !== null" :class="dashboard ? 'position-absolute dashboard-position' : 'position-relative'">
		<div class="position-absolute position-right text-black filters-container vh-100 transition-animation" :class="{active: open}">
			<div class="d-flex filter-heading font-size-17 align-items-center justify-content-between px-4 sticky-top">
				<div class="d-flex justify-content-center align-items-center">
					<div>
						{{ $t('presenterFilter.t_filter') }}
					</div>
					<div>
						<div class="d-flex filter-circle ml-2 justify-content-center align-items-center">
							{{ story?.configuration?.globalFilters?.length ?? 0 }}
						</div>
					</div>
				</div>
				<div class="cursor-pointer" @click="$emit('close-filters')" @touchend="$emit('close-filters')">
					<ds-icon name="icon-close" alt="Close" />
				</div>
			</div>
			<div class="position-relative filters overflow-auto" :style="{height: `calc(100vh - 52px - ${filtersChanged ? 84 : 0}px)`}">
				<div class="pb-4">
					<ds-card
						v-for="(filter, index) in globalFilters"
						:key="index"
						body-class="p-0"
						class="mx-4 mt-4"
						@click="handleFilterClick(index)"
						@touchend="handleFilterClick(index)">
						<div class="m-3">
							<div class="d-flex align-items-center justify-content-between">
								<ds-text variant="subheadline" class="mr-2 column-name-container">{{ preparedFilters[index][0] }}</ds-text>
								<ds-btn
									v-if="!isEqual(filter, initialFilters[index])"
									variant="secondary"
									@click="resetFilters(index)"
									@touchend="resetFilters(index)">
									<template #icon>
										<ds-icon name="icon-reset" alt="Reset" />
									</template>
									{{ $t('presenterFilter.t_reset') }}
								</ds-btn>
								<div v-if="!filter.editable" class="float-right">
									<ds-icon name="icon-lock" alt="locked" />
								</div>
							</div>
						</div>
						<presenter-multi-filter-column-select
							:editable="globalFilters[index].editable"
							:filter="cloneDeep(globalFilters[index])"
							:filterIndex="index"
							:isReset="isReset"
							:filterValue="globalFilters[index].value"
							:selected-operation="globalFilters[index].logic"
							@filter-reseted="resetFilters($event)"
							@filter-created="setFilterActive(index, $event)"
							@click.stop
							@touchend.stop />
					</ds-card>
				</div>
			</div>
			<div v-if="filtersChanged" class="position-absolute reset-all-container p-4">
				<ds-btn
					variant="secondary"
					center
					block
					@click="resetAllFilters"
					@touchend="resetAllFilters">
					<template #icon>
						<ds-icon name="icon-reset" alt="Reset" />
					</template>
					{{ $t('presenterFilter.t_reset_all') }}
				</ds-btn>
			</div>
		</div>
	</div>
</template>

<script>
import PresenterMultiFilterColumnSelect from '@/modules/story/components/presenter/components/globalFilters/PresenterMultiFilterColumnSelect.vue';
import {mapGetters} from 'vuex';
import {privateRouteName} from '@/modules/story/components/presenter/consts';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

export default {
	name: 'PresenterGlobalFilters',
	components: {
		PresenterMultiFilterColumnSelect
	},
	props: {
		open: {
			type: Boolean,
			required: true
		},
		dashboard: {
			type: Boolean,
			default: false
		}
	},
	emits: ['close-filters'],
	data() {
		return {
			showEdit: [],
			isReset: false,
			initialFilters: null,
			initialFilterMap: null,
			cloneDeep,
			isEqual
		};
	},
	computed: {
		...mapGetters('storyDetail', {story: 'story'}),
		...mapGetters('widgetInstances', ['widgetInstanceIds']),
		globalFilters() {
			return this.story?.configuration?.globalFilters ?? [];
		},
		globalFilterMap() {
			return this.$store.getters['storyDetail/story']?.configuration?.globalFilterMap ?? [];
		},
		preparedFilters() {
			const prepareFilters = [];
			if (this.globalFilters.length !== 0) {
				this.globalFilters.forEach((element) => {
					const tempFilter = [];
					Object.values(element.columnReference).forEach((col) => {
						col.forEach((val) => {
							tempFilter.push(val);
						});
					});

					prepareFilters.push(tempFilter);
				});
			}

			return prepareFilters;
		},
		filtersChanged() {
			return !isEqual(this.globalFilters, this.initialFilters);
		}
	},
	created() {
		this.initialFilters = cloneDeep(this.globalFilters);
		this.initialFilterMap = cloneDeep(this.globalFilterMap);
	},
	methods: {
		resetFilters(index) {
			this.isReset = true;
			const newConfiguration = cloneDeep(this.story.configuration);
			newConfiguration.globalFilters[index] = cloneDeep(this.initialFilters[index]);
			newConfiguration.globalFilterMap = cloneDeep(this.initialFilterMap);
			this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true}).then(() => {
				this.setFilterActive(index);
				this.isReset = false;
			});
		},
		resetAllFilters() {
			const newConfiguration = cloneDeep(this.story.configuration);
			newConfiguration.globalFilters = cloneDeep(this.initialFilters);
			newConfiguration.globalFilterMap = cloneDeep(this.initialFilterMap);
			this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true}).then(() => {
				this.globalFilters.forEach((global, index) => {
					this.setFilterActive(index);
				});
			});
		},
		handleFilterClick(index) {
			const checkValue = this.showEdit[index];
			this.currentIndex = index;
			if (this.globalFilters.length >= this.showEdit.length) {
				this.showEdit = [];
				this.globalFilters.forEach(() => {
					this.showEdit.push(false);
				});
			}

			if (this.globalFilters[index]?.editable === true) {
				this.showEdit[index] = !checkValue;
				this.showEdit = cloneDeep(this.showEdit);
			}
			setTimeout(() => {
				this.$refs[`filterEdit-${index}`][0].scrollTop = this.$refs[`filterEdit-${index}`][0].scrollHeight;

				this.$refs[`filterEdit-${index}`][0].scrollIntoView({
					behavior: 'auto',
					block: 'center'
				});
			}, 500);
		},
		setFilterActive(index, event = null) {
			const newConfiguration = cloneDeep(this.story.configuration);
			if (event !== null && typeof event.filter !== 'undefined' && !this.isReset) {
				newConfiguration.globalFilters[index] = cloneDeep(event.filter);
			}

			this.showEdit[index] = false;
			this.showEdit = cloneDeep(this.showEdit);

			const filterDatasets = [];
			Object.keys(newConfiguration.globalFilters[index].columnReference).forEach((key) => {
				filterDatasets.push(key);
			});

			this.$store.dispatch('storyDetail/updateStory', {
				configuration: newConfiguration,
				privateView: this.$route.name === privateRouteName
			}, {root: true});

			Object.values(this.widgetInstanceIds).forEach((element) => {
				element.forEach((widget) => {
					if (this.$store.getters['widgetInstances/configuration'](widget).data !== null
						&& filterDatasets.includes(this.$store.getters['widgetInstances/configuration'](widget).data.datasetId)) {
						this.$store.dispatch('widgetData/loadData', {widgetInstanceId: widget}, {root: true});
					}
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.transition-animation {
	transition: all 400ms ease;
}
.position-right {
 right: -328px;
 top: 0;
 z-index: 3333;
}
.active {
	right: 0!important;
}
.filters-container {
	max-width: 328px;
	width: 328px;
	background-color: map-get($ds-colors, 'separate-content-0');
	border-left: 1px solid map-get($ds-colors, 'separate-content-200');
}

.dashboard-position {
	top: 0;
	right: 0;
}

.filters {
	overflow: auto;
}

.filter-heading {
	height: 52px;
	color: map-get($ds-colors, 'display-content');
	font-weight: 500;
	line-height: 28px;
	background-color: map-get($ds-colors, 'separate-content-0');
	border-bottom: 1px solid map-get($ds-colors, 'separate-content-200');
}

.reset-button {
	border-color: map-get($ds-colors, 'separate-content-400');
	font-size: 12px;
	color: #36363A;
	display: flex;
	align-items: center;
	width: 67px;
	height: 22px;
 img {
 width: 12px;
 height: 12px
 }
}

.pointer-none {
	pointer-events:none
}

.container {
	max-height: 250px;
	max-width: 350px;
	overflow: auto;
	padding: 0;
}

.colapse-window {
	position: absolute;
	top: 40px;
}

.reset-all-container {
	border-top: 1px solid map-get($ds-colors, 'separate-content-200');
	width: 100%;
	height: 84px;
	bottom: 0;
	background-color: map-get($ds-colors, 'separate-content-0');

	button {
		font-size: 14px;
		color: #36363A;
		border-color: map-get($ds-colors, 'separate-content-400');
	}
}
.column-name-container {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
