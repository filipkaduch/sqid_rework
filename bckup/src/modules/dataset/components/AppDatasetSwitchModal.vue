<!-- eslint-disable max-lines -->
<template>
	<ds-modal
		:show="showDatasetSwitchModal"
		:headerText="$t('t_SwitchDataset', {datasetName})"
		@hide="resetActiveJobsInterval"
		@hidden="reset"
		@cancel="$emit('closeModal')">
		<template #modal-text>
			<div>
				<ds-dataset-list
					ref="datasetList"
					v-model:selected-datasets="selectedDatasets"
					selectable
					on-row-select
					:actions="false"
					:search="datasetSearch" />
			</div>
			<div class="problems overflow-auto">
				<app-loading :loading="calculating" class="d-flex h-100 w-100 justify-content-center">
					<div v-if="problems" class="flex-grow-1 ">
						<div v-for="(widget, index) in problemWidgets" :key="index" class="ma-1">
							<ds-card v-if="widget.datasetSwapFeature.problems.containProblem" class="mb-2" no-body>
								<template #header>
									<div class="d-flex mx-4 justify-content-around">
										<div class="flex-grow-1">{{ $t('datasetSwapFeature.widgetName') }}: {{ $t(`widgetTypes.${widget.widgetType}_title`) }}</div>
										<div class="mx-4">{{ $t('datasetSwapFeature.sectionTitle') }}: {{ widget.datasetSwapFeature.section.name }}</div>
										<div class="mx-4">{{ $t('datasetSwapFeature.step') }}: {{ widget.datasetSwapFeature.section.step }}</div>
									</div>
								</template>
								<div class="my-2 mx-3">
									<div v-if="widget.datasetSwapFeature.problems.dimension.length > 0">
										<div v-for="(problem, dIndex) in widget.datasetSwapFeature.problems.dimension" :key="dIndex">
											{{ $t('datasetSwapFeature.columnProblem', {
												problemDataset: problem.dataset,
												problemName: problem.name})
											}}
										</div>
									</div>
									<div v-if="widget.datasetSwapFeature.problems.metric.length > 0">
										<div v-for="(problem, mIndex) in widget.datasetSwapFeature.problems.metric" :key="mIndex">
											{{ $t('datasetSwapFeature.metricProblem', {
												problemDataset: problem.dataset,
												problemName: problem.name})
											}}
										</div>
									</div>
									<div v-if="widget.datasetSwapFeature.problems.filter.length > 0">
										<div v-for="(problem, fIndex) in widget.datasetSwapFeature.problems.filter" :key="fIndex">
											{{ $t('datasetSwapFeature.filterProblem', {
												problemDataset: problem.dataset,
												problemName: problem.name})
											}}
										</div>
									</div>
								</div>
							</ds-card>
						</div>
					</div>
					<div v-else-if="problemWidgets.length > 0" class="d-flex align-items-center justify-content-center flex-grow-1">
						<div class="text-center">
							<div class="green-text mb-2">
								<fa-icon :icon="['far', 'check-circle']" size="3x" />
							</div>
							<div class="green-text mb-1">{{ $t('datasetSwapFeature.noProblems') }}</div>
							<div v-if="containInsight">
								<fa-icon :icon="['far', 'exclamation-triangle']" size="lg" />
								{{ $t('datasetSwapFeature.insightRemapMessage') }}
							</div>
						</div>
					</div>
					<div v-else class="d-flex align-items-center justify-content-center flex-grow-1">
						{{ $t('datasetSwapFeature.chooseDataset') }}
					</div>
				</app-loading>
			</div>
		</template>
		<template #modal-footer>
			<button class="btn btn-action" :disabled="switchDisabled" @click="swapIt">{{ $t('datasetSwapFeature.swapDataset') }}</button>
		</template>
	</ds-modal>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import AppLoading from '@/components/design/AppLoading.vue';
import {datasetMixin} from '@/mixins/datasetMixin';
import {filterTypes} from '@/util/queryBuilder';
import {widgetTypes} from '@/util/consts/widgetTypes';
import activeJobsMixin from '@/modules/dataset/mixins/activeJobsMixin';
import axios from '@/plugins/axios';
import DsDatasetList from '@/modules/dataset/components/DataStoriesDatasetList.vue';
import {cloneDeep} from 'lodash';


export default {
	name: 'AppDatasetSwitchModal',
	components: {
		DsDatasetList,
		AppLoading
	},
	mixins: [
		datasetMixin,
		activeJobsMixin
	],
	props: {
		showDatasetSwitchModal: {
			type: Boolean,
			default: false
		},
		widgets: {
			type: Array,
			required: true
		},
		selectedDataset: {
			type: Object,
			required: true
		}
	},
	emits: ['closeModal'],
	data() {
		return {
			tableKeys: [
				'name',
				'source',
				'rows',
				'columns',
				'status',
				'action'
			],
			problems: false,
			problemWidgets: [],
			calculating: false,
			swapDataset: null,
			containInsight: false,
			switchDisabled: true,
			selectedDatasets: []
		};
	},
	computed: {
		...mapGetters('storyDetail', {
			story: 'story'
		}),
		...mapGetters('datasetDetail', {
			datasetDetail: 'dataset'
		}),
		...mapGetters('datasets', [
			'datasets',
			'lastPage'
		]),
		sortedItems() {
			return this.datasets.filter((item) => item.id !== this.selectedDataset.id);
		},
		datasetName() {
			return this.selectedDataset?.name ?? '';
		}
	},
	watch: {
		selectedDatasets: {
			handler(value) {
				this.calculateSwapPossibility(value[0]);
			},
			deep: true
		}
	},
	methods: {
		...mapActions('storyDetail', ['reloadData']),
		...mapActions('datasets', ['loadNextPage']),
		...mapActions('datasetDetail', ['loadDatasetDetail']),
		reset() {
			this.problems = false;
			this.problemWidgets = [];
			this.swapDataset = null;
			this.containInsight = false;
			this.switchDisabled = true;
		},
		closeModal() {
			this.$bvModal.hide('dataset-switch-modal');
		},
		// eslint-disable-next-line max-lines-per-function
		calculateSwapPossibility(dataset) {
			this.reset();
			this.calculating = true;
			this.swapDataset = dataset;
			// Reload story data
			this.reloadData({id: this.story.id})
				// eslint-disable-next-line max-lines-per-function
				.then(() => {
					let widgetsFilteredByDataset = [];
					// For each story section filter widgets connected to old dataset
					this.story.sections.forEach((section, sectionIndex) => {
						const sectionWidgets = cloneDeep(section.widgets);
						const widgets = sectionWidgets.filter((widget, widgetIndex) => {
							if (this.containInsight === false) {
								if (widget.widgetType === widgetTypes.INSIGHT) {
									this.containInsight = true;
								}
							}
							widget.datasetSwapFeature = {
								section: {
									name: section.configuration?.label ?? `Section ${sectionIndex + 1}`,
									step: widgetIndex + 1
								}
							};
							const widgetDatasetId = widget.widgetDataConfigurations[0]?.datasetId ?? null;
							return widgetDatasetId === this.selectedDataset.id;
						});
						widgetsFilteredByDataset = widgetsFilteredByDataset.concat(widgets);
					});

					// Load dataset Detail
					this.loadDatasetDetail(dataset.Id)
						// eslint-disable-next-line max-lines-per-function
						.then(() => {
							// eslint-disable-next-line max-lines-per-function
							widgetsFilteredByDataset.forEach((item) => {
								// Assign swap feature problems for every widget
								item.datasetSwapFeature.problems = {
									containProblem: false,
									dimension: [],
									metric: [],
									filter: []
								};

								// If widget has dimensions check each of them if they can be swapped
								if (item.widgetDataConfigurations[0].configuration.dimensions) {
									item.widgetDataConfigurations[0].configuration.dimensions.forEach(({column}) => {
										// Get data about column
										const columnObj = this.$store.getters['datasetDetail/datasetColumn'](column);
										// Check if dataset have a column with same type and name as one we want to switch
										if (!this.datasetDetail.columns.some((datasetColumn) => datasetColumn.name === columnObj?.name
											&& datasetColumn.dataType === columnObj.dataType)) {
											// If column like that doesnt exist add to problems
											item.datasetSwapFeature.problems.dimension.push({
												name: column,
												dataset: this.datasetDetail.name
											});
											this.problems = true;
											item.datasetSwapFeature.problems.containProblem = true;
										}
									});
								}

								// If widget has metric check each of them if they can be swapped
								if (item.widgetDataConfigurations[0].configuration.metrics) {
									item.widgetDataConfigurations[0].configuration.metrics.forEach((metric) => {
										// Get data about metric
										const metricObj = this.$store.getters['datasetDetail/datasetColumn'](metric.column);
										// Check if dataset have a metric with same type and name as one we want to switch
										if (!this.datasetDetail.columns.some((datasetColumn) => datasetColumn.name === metricObj?.name
											&& datasetColumn.dataType === metricObj.dataType)) {
											// If metric like that doesnt exist add to problems
											item.datasetSwapFeature.problems.metric.push({
												name: metric.column,
												dataset: this.datasetDetail.name
											});
											this.problems = true;
											item.datasetSwapFeature.problems.containProblem = true;
										}
									});
								}

								// Check pre/post aggreation filters
								if (item.filters.preAggregation && item.filters?.preAggregation.length > 0) {
									item.filters.preAggregation.forEach((filter) => {
										this.filterClausesControls(filter, item);
									});
								}
								if (item.filters.postAggregation && item.filters.postAggregation.length > 0) {
									item.filters.postAggregation.forEach((filter) => {
										this.filterClausesControls(filter, item);
									});
								}
							});

							if (this.problems === false) {
								this.switchDisabled = false;
							}
							this.problemWidgets = widgetsFilteredByDataset;
							this.calculating = false;
						});
				});
		},
		swapIt() {
			const datasets = this.story.datasets.map((item) => item.id);
			const alreadyConnected = datasets.some((item) => item === this.swapDataset.id);

			// If dataset is already connected start swapping;
			if (alreadyConnected) {
				Promise.all(this.swapWidgets())
					.then(() => {
						this.$router.go();
					});
			} else {
				// If dataset is not connected, connect it and start swaping
				axios({
					method: 'post',
					url: `/v0/stories/${this.story.id}/dataset/${this.swapDataset.id}`
				})
					.then(() => {
						Promise.all(this.swapWidgets())
							.then(() => {
								this.$router.go();
							});
					});
			}
		},
		swapWidgets() {
			return this.problemWidgets.map((item) => {
				const newConfiguration = {
					data: {
						datasetId: this.swapDataset.id,
						configuration: item.widgetDataConfigurations[0].configuration,
						id: item.widgetDataConfigurations[0].id
					}
				};

				return this.$store.dispatch('widgetInstances/setOnlyConfiguration', {
					widgetInstanceId: item.id,
					configuration: newConfiguration
				});
			});
		},
		filterClausesControls(filter, item) {
			// Check if filter has clause. If yes, then call function again
			if (filter.clauses) {
				filter.clauses.forEach((clause) => {
					this.filterClausesControls(clause, item);
				});
				return;
			}
			if (!this.datasetDetail.columns.some((datasetColumn) => datasetColumn.name === filter.columnReference)) {
				// If we have RAW filter skip it
				if (filter.type === filterTypes.RAW_FILTER) {
					return;
				}
				item.datasetSwapFeature.problems.filter.push({
					name: filter.columnReference,
					dataset: this.datasetDetail.name
				});
				this.problems = true;
				item.datasetSwapFeature.problems.containProblem = true;
			}
		}
	}
};
</script>

<style scoped>
.problems {
	height: 150px;
	overflow-x: hidden;
	overflow-y: scroll;
}

.card-header-danger {
	background-color: #FF4646; /* Danger */
	color: #ffffff;
}

.card-header-success {
	background-color: #54C4CA; /* Success */
	color: #ffffff;
}

.green-text {
	color: #54C4CA
}
</style>
