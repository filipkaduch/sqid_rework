<!-- eslint-disable max-lines -->
<template>
	<div>
		<ds-card v-show="!deleting" header-class="bg-white border-0" body-class="p-0">
			<template #header>
				<div class="d-flex text-dark align-items-center">
					<span v-if="icon && text" class="section-content">
						<fa-icon class="mr-2" :icon="icon" />{{ text }}
					</span>
					<app-pagination
						:value="step"
						:total-rows="widgetInstanceIds.length"
						@change="stepChange" />

					<ds-btn-group class="d-inline-flex">
						<ds-tooltip>
							<template #icon>
								<ds-btn
									variant="secondary"
									class="section-group-btn border-radius-right-0"
									icon-only
									:disabled="widgetInstanceIds.indexOf(selectedWidgetInstanceId) === 0"
									@click="moveStep(widgetInstanceIds.indexOf(selectedWidgetInstanceId) - 1)">
									<template #icon>
										<fa-icon class="m-0" :icon="['far', 'chevron-double-left']" transform="shrink-2" />
									</template>
								</ds-btn>
							</template>
							<template #tooltip>
								{{ $t('editor.moveStepLeft') }}
							</template>
						</ds-tooltip>
						<ds-tooltip>
							<template #icon>
								<ds-btn
									variant="secondary"
									class="section-group-btn border-radius-0 border-left-0"
									icon-only
									:disabled="widgetInstanceIds.indexOf(selectedWidgetInstanceId) === widgetInstanceIds.length - 1"
									@click="moveStep(widgetInstanceIds.indexOf(selectedWidgetInstanceId) + 1)">
									<template #icon>
										<fa-icon class="m-0" :icon="['far', 'chevron-double-right']" transform="shrink-2" />
									</template>
								</ds-btn>
							</template>
							<template #tooltip>
								{{ $t('editor.moveStepRight') }}
							</template>
						</ds-tooltip>
						<ds-tooltip>
							<template #icon>
								<ds-btn
									variant="secondary"
									class="section-group-btn border-radius-0 border-left-0"
									icon-only
									:disabled="isSectionFull"
									@click="addStep(false)">
									<template #icon>
										<div class="img-container">
											<ds-icon name="icon duplicate-step" fill="display-content" alt="Duplicate step" />
										</div>
									</template>
								</ds-btn>
							</template>
							<template #tooltip>
								{{ $t('editor.duplicateStep') }}
							</template>
						</ds-tooltip>
						<ds-tooltip>
							<template #icon>
								<ds-btn
									variant="secondary"
									class="section-group-btn border-radius-0 border-left-0"
									icon-only
									:disabled="canMoveStepToAnotherSection"
									@click="showMoveStepModal = true">
									<template #icon>
										<ds-icon name="ds-icon-move-step" fill="display-content" :alt="$t('editor.moveStep')" />
									</template>
								</ds-btn>
							</template>
							<template #tooltip>
								{{ $t('editor.moveStep') }}
							</template>
						</ds-tooltip>
						<ds-tooltip>
							<template #icon>
								<ds-btn
									variant="secondary"
									class="section-group-btn border-radius-0 border-left-0"
									icon-only
									data-testid="add-widget-step"
									:disabled="isSectionFull"
									@click="addChart">
									<template #icon>
										<ds-icon name="icon_chart-add" fill="display-content" alt="Add step" />
									</template>
								</ds-btn>
							</template>
							<template #tooltip>
								{{ $t('editor.addStep') }}
							</template>
						</ds-tooltip>
						<ds-tooltip>
							<template #icon>
								<ds-btn
									variant="secondary"
									class="section-group-btn border-radius-0 border-left-0"
									:class="{'border-btn-radius': !showInsights}"
									icon-only
									:disabled="isSectionFull"
									@click="addStep(true)">
									<template #icon>
										<div class="img-container">
											<ds-icon name="icon notification-add" fill="display-content" alt="Add notification" />
										</div>
									</template>
								</ds-btn>
							</template>
							<template #tooltip>
								{{ $t('editor.addExplainer') }}
							</template>
						</ds-tooltip>
						<ds-tooltip v-if="showInsights">
							<template #icon>
								<ds-btn
									variant="secondary"
									class="section-group-btn border-radius-left-0 border-left-0"
									icon-only
									:disabled="isSectionFull"
									@click="openInsightsModal">
									<template #icon>
										<div class="img-container">
											<ds-icon name="icon insight-add" fill="display-content" alt="Add insight" />
										</div>
									</template>
								</ds-btn>
							</template>
							<template #tooltip>
								{{ $t('editor.addInsight') }}
							</template>
						</ds-tooltip>
						<ds-btn
							v-if="isSelectedTimelineChart"
							variant="secondary"
							class="section-group-btn"
							icon-only
							@click="toggleState">
							<template #icon>
								<fa-icon class="m-0" :icon="playState ? 'stop' : 'play'" />
							</template>
						</ds-btn>
					</ds-btn-group>
					<ds-tooltip>
						<template #icon>
							<div>
								<a
									data-testid="remove-widget-step"
									class="btn clickable-icon btn-hover ml-2"
									:class="widgetInstanceIds.length === 1 ? 'disabled' : ''"
									@click="removeStep">
									<ds-icon class="img-container" name="icon remove" alt="Remove step" />
								</a>
							</div>
						</template>
						<template #tooltip>
							{{ $t('editor.removeStep') }}
						</template>
					</ds-tooltip>
					<div class="d-flex justify-content-end ml-auto align-items-center">
						<div class="custom-handle my-2 mx-3">
							<ds-icon name="icon drag" alt="Drag" fill="display-content-400" />
						</div>
						<ds-tooltip>
							<template #icon>
								<ds-icon
									name="ds-icon-duplicate-section"
									fill="display-content-400"
									alt="Duplicate"
									class="custom-hover cursor-pointer"
									@click="duplicatePageInstance" />
							</template>
							<template #tooltip>
								{{ $t('editor.duplicateSection') }}
							</template>
						</ds-tooltip>
						<ds-tooltip class="mx-3">
							<template #icon>
								<ds-icon
									name="icon bin"
									alt="Delete"
									data-testid="delete-widget"
									class="custom-hover cursor-pointer"
									fill="display-content-400"
									:disabled="pageWidgetInstanceIds.length <= 1"
									@click="showDeleteModal = true" />
							</template>
							<template #tooltip>
								{{ $t('editor.deleteSection') }}
							</template>
						</ds-tooltip>
					</div>
				</div>
			</template>
			<slot />
		</ds-card>
		<ds-modal :show="insightsModal">
			<template #modal-title>
				<h4>{{ $t('t_yourInsights') }}</h4>
			</template>
			<template #modal-text>
				<app-loading :loading="insightsLoading">
					<div
						v-for="(insight, index) in insights"
						:key="pageWidgetInstanceId + '-insight-' + index"
						class="bg-white my-3 ml-3 mr-0 p-3"
						style="border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.15) 0 1px 5px">
						<div class="m-0 pb-3 border-bottom border-secondary d-flex justify-content-between align-items-center">
							<h5 class="text-left m-0">
								{{ insight.name }}
								<span
									v-if="(insight.latestResult !== null && insight.latestResult.insights.length > 1)"
									class="border rounded-circle px-2 py-1 ml-2">
									{{ insight.latestResult !== null ? insight.latestResult.insights.length : '' }}</span>
							</h5>
							<button class="btn btn-white m-0" @click="addInsight(insight)">
								{{ $t('t_AddInsight') }}
							</button>
						</div>
						<app-widget-preview-wrapper
							:preview-configuration="insightConfiguration(insight.id, insight.latestResult)"
							widget-type="widget_insight_formula"
							class="pt-3"
							style="height: 140px !important" />
					</div>
				</app-loading>
			</template>
			<template #modal-footer>
				<div class="mb-3 justify-content-start d-flex">
					<button class="btn btn-action" @click="addInsight(null)">
						{{ $t('t_addNewInsight') }}
					</button>
					<button class="btn btn-white border" @click="insightsModal = false">
						<fa-icon :icon="['fal', 'times']" />
						{{ $t('t_Close') }}
					</button>
				</div>
			</template>
		</ds-modal>
		<ds-modal :show="embedModal">
			<template #modal-title>
				<h4>{{ $t('t_shareOnYourPage') }}</h4>
			</template>
			<template #modal-text>
				<app-loading class="text-center" :loading="publishLoading">
					<h6>{{ $t('t_embedCode') }}:</h6>
					<div class="input-group my-3">
						<input
							:value="embedCode"
							class="form-control bg-white text-primary"
							type="text"
							readonly>
						<div class="input-group-append">
							<button
								v-clipboard:copy="embedCode"
								v-clipboard:success="onCopy"
								class="btn btn-third m-0 border">
								<fa-icon :icon="['fal','clipboard']" />
							</button>
						</div>
					</div>
				</app-loading>
			</template>
			<template #modal-footer>
				<div class="mb-3 justify-content-start d-flex">
					<button class="btn btn-white border" @click="embedModal = false">
						<fa-icon :icon="['fal', 'times']" />
						{{ $t('t_Close') }}
					</button>
				</div>
			</template>
		</ds-modal>
		<ds-modal
			:show="showDeleteModal"
			header-text="modals.deleteSectionTitle"
			confirmText="modals.delete"
			cancelText="modals.cancel"
			@ok="$emit('deleteSection')"
			@cancel="showDeleteModal = false">
			<template #modal-text>
				<ds-text variant="body">
					{{ $t('modals.deleteSection?') }}
				</ds-text>
			</template>
		</ds-modal>
		<ds-modal
			:show="showMoveStepModal"
			:header-text="$t('modals.moveStepTitle')"
			:confirmText="$t('modals.move')"
			:cancelText="$t('modals.cancel')"
			:confirmEnabled="sectionToMove !== null"
			:loading="loadingMoveStep"
			@ok="moveStepToSection"
			@cancel="showMoveStepModal = false">
			<template #modal-text>
				<ds-select
					:initialValue="$t('modals.selectSection')"
					:items="sectionsFormatted"
					:clear-btn="false"
					placement="bottom"
					@input="sectionToMove = $event" />
			</template>
			<template #modal-footer>
				<app-loading v-if="loadingMoveStep" :loading="loadingMoveStep" relative-parent />
			</template>
		</ds-modal>
	</div>
</template>

<script>
import {columnVisibilityState, dataTypes, isDataType} from '@/util/queryBuilder';
import {mapActions, mapGetters} from 'vuex';
import AppLoading from '@/components/design/AppLoading.vue';
import AppPagination from '@/components/design/AppPagination.vue';
import AppWidgetPreviewWrapper from '@/modules/story/components/editor/AppWidgetPreviewWrapper.vue';
import sectionStackingVariants, {sectionStackingModes} from '@/util/consts/sectionStackingVariants';
import {visibilities} from '@/util/consts/publisherConsts';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import {notify} from '@kyvg/vue3-notification';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {notificationTypes} from '@/util/consts/notificationTypes';

export default {
	name: 'AppSection',
	components: {
		AppLoading,
		AppPagination,
		AppWidgetPreviewWrapper
	},
	inject: ['appConfig'],
	props: {
		icon: {
			type: Array,
			default: null
		},
		text: {
			type: String,
			default: null
		},
		pageWidgetInstanceId: {
			type: String,
			default: null
		},
		publishToken: {
			type: String,
			default: null
		},
		pageWidgetInstanceIds: {
			type: Array,
			default: null
		}
	},
	emits: ['deleteSection', 'openSectionPopup'],
	data() {
		return {
			deleting: false,
			step: 1,
			modal: false,
			storyType: 'visual-data-story',
			embedModal: false,
			insightsModal: false,
			showMoveStepModal: false,
			storyHeight: 600,
			storyWidth: 1000,
			sectionToMove: null,
			sectionStackingVariants: null,
			showDeleteModal: false,
			loadingMoveStep: false,
			widgetTypes
		};
	},
	computed: {
		...mapGetters('storyDetail', {
			story: 'story',
			publishLoading: 'publishLoading'
		}),
		...mapGetters('widgetInstances', {
			instance: 'instance'
		}),
		...mapGetters('insights', {
			insights: 'insights',
			insightsLoading: 'loading'
		}),
		widgetInstanceIds() {
			return this.pageWidgetInstanceId ? this.$store.getters['widgetInstances/widgetInstanceIds'][this.pageWidgetInstanceId] ?? [] : [];
		},
		selectedWidgetInstanceId() {
			return this.pageWidgetInstanceId
				? this.$store.getters['widgetInstances/selectedWidgetInstanceIds'][this.pageWidgetInstanceId] ?? (this.widgetInstanceIds[0] ?? null)
				: null;
		},
		selectedStep() {
			if (this.selectedWidgetInstanceId) {
				const index = this.widgetInstanceIds.indexOf(this.selectedWidgetInstanceId);
				return index < 0 ? 1 : index + 1;
			}
			return 1;
		},
		isSelectedTimelineChart() {
			return this.$store.getters['widgetTimeline/hasId'](this.widgetInstanceIds[this.selectedStep - 1]);
		},
		playState() {
			return this.$store.getters['widgetTimeline/playState'](this.widgetInstanceIds[this.selectedStep - 1]);
		},
		embedCode() {
			return `<iframe width="100%" height=${this.storyHeight}`
				+ ` style="overflow:hidden; border: 0 none" src="${this.publishStorySectionUrl()}"></iframe>`;
		},
		stacking() {
			return this.$store.getters['widgetInstances/configuration'](this.pageWidgetInstanceId)?.options?.stacking ?? 'animated';
		},
		isSectionFull() {
			return this.sectionStackingVariants[this.stacking].configuration.length === this.widgetInstanceIds.length && this.stacking !== 'animated';
		},
		showInsights() {
			return this.appConfig?.widget?.showInsights;
		},
		sectionsFormatted() {
			const {sections} = this.story;
			// Filtering sections which aren't currently selected + have free space in stacking or are animated
			const filteredSections = sections.flatMap((section, index) => {
				if ((section.id !== this.pageWidgetInstanceId)
					&& (this.sectionStackingVariants?.[section?.configuration?.stacking]?.configuration?.length > section.widgets.length
						|| section.configuration?.stacking === sectionStackingModes.ANIMATED || typeof section.configuration?.stacking === 'undefined')) {
					return [
						{
							selectLabel: `${index + 1} - ${section.name}`,
							value: section.id
						}
					];
				}
				return [];
			});
			return filteredSections;
		},
		realIndex() {
			return this.selectedStep - 1;
		},
		currentSection() {
			return this.story?.sections?.find((section) => this.pageWidgetInstanceId === section.id) ?? null;
		},
		isNextWidgetExplainer() {
			return this.currentSection?.widgets?.[this.realIndex + 1]?.widgetType === widgetTypes.EXPLAINER;
		},
		currentWidgetType() {
			return this.currentSection?.widgets?.[this.realIndex]?.widgetType;
		},
		canMoveStepToAnotherSection() {
			return this.widgetInstanceIds.length === 1
				|| (this.widgetInstanceIds.length === 2 && this.isNextWidgetExplainer)
				|| this.currentWidgetType === widgetTypes.EXPLAINER;
		},
		sectionToMoveName() {
			return this.story?.sections?.find((section) => this.sectionToMove === section.id)?.name ?? '';
		}
	},
	watch: {
		selectedStep: {
			handler(newVal) {
				this.$nextTick(() => {
					this.step = newVal;
				});
			},
			deep: true
		},
		stacking() {
			this.stackSection();
		},
		widgetInstanceIds: {
			handler(oldValue, newValue) {
				if (!isEqual(oldValue, newValue)) {
					this.stackSection();
				}
			},
			deep: true
		}
	},
	created() {
		this.sectionStackingVariants = sectionStackingVariants;
	},
	methods: {
		...mapActions('widgetInstances', [
			'selectWidgetInstance',
			'createNewInstance',
			'addPage',
			'removeInstance',
			'setConfiguration',
			'reorderWidgets',
			'duplicateSection',
			'moveStepToAnotherSection'
		]),
		...mapActions('flashMessages', ['addMessage']),
		...mapActions('insights', ['loadInsights']),
		...mapActions('insightData', ['createNewInsight']),
		...mapActions('storyDetail', ['setVisibility']),
		stepChange(stepIndex) {
			if (!this.$store.getters['widgetData/data'](this.widgetInstanceIds[stepIndex - 1])) {
				this.$store.dispatch('widgetData/loadData', {widgetInstanceId: this.widgetInstanceIds[stepIndex - 1]});
			}
			this.selectWidgetInstance(this.widgetInstanceIds[stepIndex - 1]);
			this.step = stepIndex;
		},
		async actualMovement(widgetId, showToasts = true, lastOperation = true) {
			try {
				await this.moveStepToAnotherSection({
					storyId: this.story.id,
					sectionId: this.pageWidgetInstanceId,
					widgetId,
					newParent: this.sectionToMove
				});
				if (lastOperation) {
					this.showMoveStepModal = false;
				}
				if (showToasts) {
					const sectionName = this.sectionToMoveName;
					notify({
						type: notificationTypes.SUCCESS,
						title: this.$t('editor.stepMoved'),
						message: this.$t('editor.moveTo', {sectionName}),
						duration: 8000
					});
				}
			} catch (error) {
				this.showMoveStepModal = false;
				this.loadingMoveStep = false;
				if (showToasts) {
					notify({
						type: notificationTypes.DANGER,
						message: this.$t('errors.stepMovedFailed'),
						duration: 8000
					});
				}
			}
		},
		async moveStepToSection() {
			this.loadingMoveStep = true;
			const hasExplainerId = this.checkForExplainer();
			if (hasExplainerId === '') {
				await this.actualMovement(this.selectedWidgetInstanceId);
			} else {
				await this.actualMovement(this.selectedWidgetInstanceId, false, false);
				await this.actualMovement(hasExplainerId, true, true);
			}
			// timeout to keep the loader visible while the modal is not really closed
			setTimeout(() => {
				this.loadingMoveStep = false;
			}, 2000);
		},
		async duplicatePageInstance() {
			try {
				await this.duplicateSection({storyId: this.story.id, sectionId: this.pageWidgetInstanceId});
				notify({
					type: 'success',
					text: this.$t('editor.duplicatedSection'),
					duration: 5000
				});
			} catch (error) {
				notify({
					type: 'danger',
					text: this.$t('errors.duplicateSection'),
					duration: 5000
				});
			}
		},
		addStep(notification) {
			this.selectWidgetInstance(this.selectedWidgetInstanceId);

			let configuration = this.$store.getters['widgetInstances/configuration'](this.selectedWidgetInstanceId) ?? null;
			if (configuration) {
				configuration = cloneDeep(pick(configuration, [
					'data',
					'staticFilter',
					'options'
				]));
				const instance = this.instance(this.selectedWidgetInstanceId);
				if (instance.name) {
					configuration.name = instance.name;
				}
			}
			this.createNewInstance({
				widgetType: notification ? 'widget_explainer' : this.$store.getters['widgetInstances/widgetType'](this.selectedWidgetInstanceId),
				configuration: notification || !configuration
					? null
					: configuration,
				index: this.selectedStep
			});
		},
		checkForExplainer() {
			return this.isNextWidgetExplainer ? this.currentSection?.widgets?.[this.realIndex + 1]?.id : '';
		},
		insightConfiguration(insightId, latestResult = null) {
			return {
				options: {
					// eslint-disable-next-line max-len
					format: 'Looking at {dimensionValue}\'s {metricName} over the past {intervalDays} days, {aggregationPhrase}, the values has {changeVerb} throughout the last {periodDays} days, {rateOfChangeVerb} from {previousValue} to {currentValue} (by {changePercent}%).',
					position: 'bottom',
					betterColor: 'rgb(174,243,89)',
					worseColor: 'rgb(204,19,19)',
					betterText: 'Better',
					worseText: 'Worse',
					sparklineVisible: true,
					sentimentVisible: true,
					insightId,
					latestResult,
					invertSentiment: false
				},
				data: null,
				staticFilter: null
			};
		},
		// eslint-disable-next-line max-lines-per-function, max-statements
		addInsight(insight = null) {
			this.insightsModal = false;
			this.selectWidgetInstance(this.selectedWidgetInstanceId);

			let fallbackDataset = null;
			let fallbackDimension = null;
			let fallbackMetric = null;
			let fallbackDate = null;
			if (insight === null) {
				let validDatasets = this.story.datasets.filter((dataset) => {
					let dimensionColumn = false;
					let dateColumn = false;
					let metricColumn = false;
					for (const column of dataset.columns) {
						dimensionColumn = dimensionColumn || (isDataType(dataTypes.TEXT, column.dataType)
							&& column.visibilityState !== columnVisibilityState.INTERNAL);
						dateColumn = dateColumn || (isDataType(dataTypes.DATE_TYPE, column.dataType)
							&& column.visibilityState !== columnVisibilityState.INTERNAL);
						metricColumn = metricColumn || (isDataType(dataTypes.NUMBER, column.dataType)
							&& column.visibilityState !== columnVisibilityState.INTERNAL);
					}

					return dimensionColumn && metricColumn && dateColumn;
				});

				if (validDatasets.length > 0) {
					let sectionWidgetInstanceIds = this.widgetInstanceIds;
					sectionWidgetInstanceIds = sectionWidgetInstanceIds
						.slice(0, sectionWidgetInstanceIds.indexOf(this.selectedWidgetInstanceId))
						.reverse()
						.concat(sectionWidgetInstanceIds.slice(sectionWidgetInstanceIds.indexOf(this.selectedWidgetInstanceId)));

					for (const widgetInstanceId of sectionWidgetInstanceIds) {
						const widgetConfiguration = this.$store.getters['widgetInstances/configuration'](widgetInstanceId);
						// eslint-disable-next-line max-depth
						if (widgetConfiguration.data?.configuration) {
							const dataset = validDatasets.find((tmpDataset) => tmpDataset.id
								=== widgetConfiguration.data.datasetId) ?? null;
							// eslint-disable-next-line max-depth
							if (dataset) {
								fallbackDataset = dataset.id;
								fallbackDimension = dataset.columns.find((column) => isDataType(dataTypes.TEXT, column.dataType)
									&& widgetConfiguration.data?.configuration?.dimensions?.some((dim) => dim.column === column.name) !== null).name;
								fallbackDate = dataset.columns.find((column) => isDataType(dataTypes.DATE_TYPE, column.dataType)
									&& widgetConfiguration.data?.configuration?.dimensions?.some((dim) => dim.column === column.name) !== null).name;
								fallbackMetric = dataset.columns.find((column) => isDataType(dataTypes.NUMBER, column.dataType)
									&& widgetConfiguration.data?.configuration?.dimensions?.some((dim) => dim.column === column.name) !== null).name;
								break;
							}
						}
					}
					validDatasets = validDatasets.filter((validDataset) => validDataset.id !== -1);

					fallbackDataset = fallbackDataset ?? validDatasets[0].id;
					fallbackDimension = fallbackDimension ?? validDatasets[0].columns.find((column) => isDataType(dataTypes.TEXT, column.dataType)).name;
					fallbackDate = fallbackDate ?? validDatasets[0].columns.find((column) => isDataType(dataTypes.DATE_TYPE, column.dataType)).name;
					fallbackMetric = fallbackMetric ?? validDatasets[0].columns.find((column) => isDataType(dataTypes.NUMBER, column.dataType)).name;
					// If we dont have valid dataset throw err
				} else {
					notify({
						type: 'danger',
						text: this.$t('t_cannotCreateInsightNotValidDataset'),
						duration: 5000
					});
					this.insightsModal = false;
					return;
				}
			}
			(
				insight === null
					? this.createNewInsight({
						/* eslint-disable camelcase */
						name: this.insightName ?? 'My insight',
						availabilityMode: 'PRIVATE',
						type: 'PERIOD_OVER_PERIOD',
						datasetId: fallbackDataset,
						configuration: {
							dimensions: [fallbackDimension],
							metric: fallbackMetric,
							aggregationFunction: 'AVG',
							dateColumn: fallbackDate,
							limit: 5000,
							topN: 1,
							periodDays: 7,
							referenceDate: null,
							// eslint-disable-next-line max-len
							format: 'Looking at {dimensionValue}\'s {metricName} over the past {intervalDays} days, {aggregationPhrase}, the values has {changeVerb} throughout the last {periodDays} days, {rateOfChangeVerb} from {previousValue} to {currentValue} (by {changePercent}%).',
							position: 'bottom',
							betterColor: 'rgb(174,243,89)',
							worseColor: 'rgb(204,19,19)',
							betterText: 'Better',
							worseText: 'Worse',
							sparklineVisible: true,
							sentimentVisible: true,
							invertSentiment: false
						}
						/* eslint-enable camelcase */
					})
					: Promise.resolve(insight.id)
			)
				.then((insightId) => this.createNewInstance({
					widgetType: 'widget_insight_formula',
					configuration: this.insightConfiguration(insightId),
					index: this.selectedStep
				}));
		},
		addChart() {
			this.selectWidgetInstance(this.selectedWidgetInstanceId);
			this.$nextTick(() => {
				this.$emit('openSectionPopup', this.selectedStep);
			});
		},
		async removeStep() {
			if (this.widgetInstanceIds.length > 1) {
				await this.removeInstance({widgetInstanceId: this.selectedWidgetInstanceId});
				this.selectWidgetInstance(this.widgetInstanceIds[this.selectedStep === 1 ? 0 : this.selectedStep - 2]);
			}
		},
		toggleState() {
			this.$store.commit('widgetTimeline/setState', {
				id: this.widgetInstanceIds[this.selectedStep - 1],
				playState: this.playState ? 0 : 1
			});
		},
		onCopy() {
			this.addMessage({
				variant: 'success',
				text: 't_copiedToClipboard'
			});
		},
		moveStep(newIndex) {
			const steps = cloneDeep(this.widgetInstanceIds);
			steps.splice(newIndex, 0, steps.splice(steps.indexOf(this.selectedWidgetInstanceId), 1)[0]);
			this.reorderWidgets({
				sectionId: this.pageWidgetInstanceId,
				newOrder: steps
			});
		},
		publishStorySectionUrl() {
			return `${window.location.origin}${this.$router.resolve({
				name: 'story-publish',
				params: {
					token: this.story.id
				}
			}).href}`;
		},
		stackSection() {
			const stackWidgetCount = this.sectionStackingVariants[this.stacking].configuration.length;
			this.widgetInstanceIds.forEach((widgetId, index) => {
				this.$store.dispatch('widgetInstances/setPosition', {
					widgetInstanceId: this.widgetInstanceIds[index],
					position: this.sectionStackingVariants[this.stacking].configuration[index % stackWidgetCount].position
				});
				this.$store.dispatch('widgetInstances/setSize', {
					widgetInstanceId: this.widgetInstanceIds[index],
					size: this.sectionStackingVariants[this.stacking].configuration[index % stackWidgetCount].size
				});
			});
		},
		openInsightsModal() {
			this.loadInsights()
				.then(() => {
					if (this.insights.length === 0) {
						this.insightsModal = false;
						this.addInsight(null);
					}
				});
			this.$nextTick(() => {
				this.insightsModal = true;
			});
		},
		openPublishSectionModal() {
			this.setVisibility({visibilityState: visibilities.SHARED});
			this.embedModal = true;
		}
	}
};
</script>

<style scoped lang="scss">
.section-group-btn {
	width: 36px;
	height: 36px;
}
.section-content {
	color: black;
}

.custom-handle {
	cursor: move;
}

.custom-hover:hover {
	fill: map-get($ds-colors, '$text-dark')
}

.clickable-icon:hover {
	color: black;
}

.clickable-icon {
	cursor: pointer;
}
.border-btn-radius {
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
}
</style>
