<template>
	<app-loading :loading="loading">
		<ds-box padding-top="L" padding-bottom="M">
			<ds-text variant="bodyMedium">{{ $t('t_ImportDQHeading') }}</ds-text>
		</ds-box>
		<ds-row>
			<ds-col cols="12" :lg="modal ? 12 : 6" class="pr-2">
				<radio-card-group horizontal :items="dqActiveTypes" :selected="selectedDqType" @selected="selectedDqType = $event" />
			</ds-col>
		</ds-row>
		<teleport v-if="showPortal && !modal" to="#upload-form-portal">
			<ds-card v-if="selectedDqType === 'monitoringProject'" body-class="p-0" class="p-5 mb-3 border-0 w-100" :class="modal ? '' : ''">
				<ds-box padding-bottom="L">
					<ds-text variant="subheadline">
						2. {{ $t('datasetUpload.cardHeadlines.monitoringProject') }}
					</ds-text>
				</ds-box>
				<ds-row>
					<ds-col cols="12" md="6">
						<app-loading :loading="loadingMonitoringProjects">
							{{ $t('t_ChooseMonitoringProject') }}
							<multiselect
								:model-value="projectChoices"
								:options="projects"
								:multiple="true"
								:deselect-label="''"
								:placeholder="$t('datasetUpload.importDQ.findDQProjects')"
								:select-label="''"
								track-by="projectId"
								label="name"
								@update:model-value="projectChoices = $event" />
						</app-loading>
						<app-loading v-if="projectChoices.length > 0" :loading="loadingCatalogItems">
							{{ $t('t_SelectCatalogItem') }}
							<ds-inline no-wrap gap="S" align-y="center">
								<ds-box
									v-for="selected in selectedProjectCatalogItems" :key="selected.catalogItemId" border-radius="basic"
									padding-x="S" class="bg-color">
									<ds-text align="center" color="white">{{ selected.name }}</ds-text>
								</ds-box>
							</ds-inline>
						</app-loading>
					</ds-col>
				</ds-row>
			</ds-card>
			<ds-card v-else body-class="p-0" class="p-5 mb-3 border-0 w-100">
				<ds-box padding-bottom="L">
					<ds-text variant="subheadline">
						2. {{ $t('datasetUpload.cardHeadlines.catalogItem') }}
					</ds-text>
				</ds-box>
				<ds-row>
					<ds-col cols="12" md="6">
						{{ $t('t_SelectCatalogItem') }}
						<multiselect
							:model-value="selectedCatalogItems"
							:options="catalogItems"
							:multiple="true"
							:deselect-label="''"
							placeholder="Type text to find in catalog items.."
							:select-label="''"
							track-by="catalogItemId"
							label="name"
							:clearOnSelect="false"
							@search-change="searchForCatalogItems($event)"
							@update:model-value="selectedCatalogItems = $event" />
					</ds-col>
				</ds-row>
			</ds-card>
			<ds-card v-if="!modal" body-class="p-0" class="p-5 mb-3 border-0 w-100">
				<ds-box padding-bottom="L">
					<ds-text variant="subheadline">
						3. {{ $t('datasetUpload.cardHeadlines.dataImportFrom') }}
					</ds-text>
				</ds-box>
				<ds-row>
					<ds-col cols="12" md="6">
						<ds-datepicker v-model:value="importCatalogItemsFrom" format="EEEE, MMMM dd, yyyy" :max-date="new Date()" />
					</ds-col>
				</ds-row>
			</ds-card>
			<ds-card v-if="!modal" body-class="p-0" class="p-5 mb-3 border-0 w-100">
				<ds-box padding-bottom="L">
					<ds-text variant="subheadline">
						4. {{ $t('datasetUpload.cardHeadlines.datasetPrefix') }}
					</ds-text>
				</ds-box>
				<ds-row>
					<ds-col cols="12" md="6">
						<app-input-bar
							v-model:input="datasetPrefix"
							placeholder="Type prefix" />
					</ds-col>
				</ds-row>
			</ds-card>
			<ds-card v-if="!modal" body-class="p-0" class="p-5 mb-3 border-0 w-100">
				<ds-box padding-bottom="L">
					<ds-text variant="subheadline">
						5. {{ $t('datasetUpload.cardHeadlines.autoUpdateCycle') }}
					</ds-text>
				</ds-box>
				<auto-update-types v-model:scheduling="scheduling" />
			</ds-card>
			<create-dataset-card
				:disabled="isCreateDisabled"
				:modal="modal"
				@cancel="resetForm"
				@upload="importDataset" />
		</teleport>
		<teleport v-if="showPortal && modal && isMounted" to="#reupload-form-portal">
			<ds-card v-if="selectedDqType === 'monitoringProject'" body-class="p-0" class="border-0 w-100" :class="modal ? 'modal-card' : ''">
				<ds-row>
					<ds-col cols="12" class="pt-3">
						<app-loading :loading="loadingMonitoringProjects">
							{{ $t('t_ChooseMonitoringProject') }}
							<ds-multi-select
								:items="projects"
								placement="bottom"
								:create-btn="false"
								:clear-btn="false"
								:show-labels="true"
								container=".modal-content"
								:placeholder="$t('datasetUpload.importDQ.findDQProjects')"
								:has-search="true"
								@update:selected="chooseProjects" />
						</app-loading>
						<app-loading v-if="projectChoices.length > 0" :loading="loadingCatalogItems">
							<ds-box padding-top="M">
								<ds-tags
									:placement="'bottom'"
									container=".modal-content"
									:placeholder="$t('t_AddCatalogItem')"
									:items="projectCatalogItems"
									@update:selected="selectedProjectCatalogItems" />
							</ds-box>
						</app-loading>
					</ds-col>
				</ds-row>
			</ds-card>
			<ds-row v-else>
				<ds-col cols="12" class="pt-3">
					{{ $t('t_SelectCatalogItem') }}
					<ds-multi-select
						:items="catalogItems"
						placement="bottom"
						:create-btn="false"
						:clear-btn="false"
						:show-labels="true"
						container=".modal-content"
						:placeholder="$t('datasetUpload.importDQ.findDQProjects')"
						:has-search="true"
						@update:selected="chooseCatalogs"
						@search-change="searchForCatalogItems($event)" />
				</ds-col>
			</ds-row>
		</teleport>
		<teleport v-if="showPortal && modal && isMounted" to="#upload-form-portal">
			<create-dataset-card
				:disabled="isCreateDisabled"
				:modal="modal"
				@cancel="resetForm"
				@upload="importDataset" />
		</teleport>
	</app-loading>
</template>

<script lang="ts">
import 'vue-multiselect/dist/vue-multiselect.css';
import '@/styles/_multiselect.scss';
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import AppLoading from '@/components/design/AppLoading.vue';
import Multiselect from 'vue-multiselect';
import RadioCardGroup from '@/modules/dataset/components/createDataset/RadioCardGroup.vue';
import CreateDatasetCard from '@/modules/dataset/components/createDataset/CreateDatasetCard.vue';
import AutoUpdateTypes from '@/modules/dataset/components/createDataset/AutoUpdateTypes.vue';
import {
	onMounted,
	computed,
	defineComponent,
	onActivated,
	onDeactivated,
	reactive,
	toRefs,
	watch,
	inject
} from 'vue';
import {datasetCreateService} from '@/modules/dataset/components/createDataset/datasetCreateService';
import {SelectItem} from '@/components/main/Dropdown/types';
import {PopupListItem} from '@/components/main/layout/utils/types';
import {useDebounceFn} from '@vueuse/core';
import {useNotification} from '@kyvg/vue3-notification';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';

interface Project {
	projectId: string,
	name: string
}
interface CatalogItem {
	catalogItemId: string,
	name: string
}

type DqTypes = 'monitoringProject' | 'catalogItems';

export default defineComponent({
	name: 'ImportDQ',
	components: {
		AutoUpdateTypes,
		CreateDatasetCard,
		AppLoading,
		AppInputBar,
		Multiselect,
		RadioCardGroup
	},
	props: {
		modal: {
			type: Boolean,
			default: false
		},
		reuploadName: {
			type: String,
			default: null
		},
		integrationId: {
			type: String,
			default: null
		},
		updateId: {
			type: String,
			default: null
		}
	},
	emits: ['cancel'],
	// eslint-disable-next-line max-lines-per-function
	setup(props, {emit}) {
		const appConfig = inject('appConfig');
		const {t} = useI18n();
		const router = useRouter();
		const notification = useNotification();
		const state = reactive({
			loading: true,
			search: '',
			showPortal: true,
			selectedDqType: 'monitoringProject' as DqTypes,
			monitoringProjects: [] as Project[],
			projectCatalogItems: [] as PopupListItem<string>[],
			catalogItems: [] as SelectItem[],
			selectedProjectCatalogItems: [] as CatalogItem[],
			loadingMonitoringProjects: false,
			loadingCatalogItems: false,
			isMounted: false
		});
		const form = reactive({
			datasetPrefix: '',
			selectedCatalogItems: [],
			project: null as Project | null,
			projectChoices: [] as any,
			importCatalogItemsFrom: null,
			importProjectsFrom: null,
			scheduling: null
		});

		// @ts-expect-error
		const enableMonitorProject = appConfig?.dqMonitorProject;
		// @ts-expect-error
		const enableCatalogItem = appConfig?.dqCatalogItem;
		const dqActiveTypes = computed(() => {
			const types = {} as any;
			if (enableMonitorProject) {
				types.monitoringProject = {
					text: 'datasetUpload.importDQ.monitoringProject',
					icon: 'icon-project'
				};
			}
			if (enableCatalogItem) {
				types.catalogItems = {
					text: 'datasetUpload.importDQ.catalogItems',
					icon: 'icon-project'
				};
			}
			return types;
		});

		const resetForm = () => {
			form.datasetPrefix = '';
			form.selectedCatalogItems = [];
			form.project = null;
			form.projectChoices = [];
			form.importCatalogItemsFrom = null;
			form.importProjectsFrom = null;
			form.scheduling = null;
			if (props.modal) {
				emit('cancel');
			}
		};

		const projects = computed(() => {
			if (props.modal) {
				return state.monitoringProjects?.map((project: Project) => ({
					value: project.projectId,
					selectLabel: project.name
				})) ?? [];
			}
			return state.monitoringProjects?.map((project: Project) => ({
				projectId: project.projectId,
				name: project.name
			})) ?? [];
		});

		const chooseProjects = (event: any) => {
			form.projectChoices = [];
			for (const proj of event) {
				// @ts-ignore
				form.projectChoices.push(proj.value);
			}
		};

		const chooseCatalogs = (event: any) => {
			if (state.selectedDqType === 'catalogItems') {
				// @ts-ignore
				form.selectedCatalogItems = [];
				for (const proj of event) {
					// @ts-ignore
					form.selectedCatalogItems.push(proj.value);
				}
			} else {
				// @ts-ignore
				form.selectedProjectCatalogItems = [];
				for (const proj of event) {
					// @ts-ignore
					form.selectedProjectCatalogItems.push(proj.value);
				}
			}
		};

		const catalogItemCount = computed(() => form.selectedCatalogItems.length === 0 ? '' : `(${form.selectedCatalogItems.length})`);
		const isCreateDisabled = computed(() => state.selectedDqType === 'monitoringProject'
			? state.selectedProjectCatalogItems.length === 0
			: form.selectedCatalogItems.length === 0);

		watch(() => form.project, async() => {
			if (form.project) {
				state.loadingCatalogItems = true;
				try {
					const data = await datasetCreateService.getCatalogItems(form.project.projectId);
					if (props.modal) {
						state.projectCatalogItems = data.catalogItems.map((catalog: CatalogItem) => ({
							catalogItemId: catalog.catalogItemId,
							selectLabel: catalog.name
						}));
						state.selectedProjectCatalogItems = data.catalogItems.map((catalog: CatalogItem) => ({
							catalogItemId: catalog.catalogItemId,
							selectLabel: catalog.name
						}));
					} else {
						// eslint-disable-next-line require-atomic-updates
						state.projectCatalogItems = data.catalogItems;
						// eslint-disable-next-line require-atomic-updates
						state.selectedProjectCatalogItems = data.catalogItems;
					}
				} catch (error: any) {
					notification.notify({
						type: 'danger',
						text: error?.response?.data?.error?.message ?? t('t_UnexpectedError'),
						duration: 5000
					});
				} finally {
					state.loadingCatalogItems = false;
				}
			} else {
				state.projectCatalogItems = [];
				state.selectedProjectCatalogItems = [];
			}
		});

		watch(() => form.projectChoices, async() => {
			if (form.projectChoices.length > 0) {
				state.selectedProjectCatalogItems = [];
				state.projectCatalogItems = [];
				state.loadingCatalogItems = true;
				for (const proj of form.projectChoices) {
					if (props.modal) {
						const data = await datasetCreateService.getCatalogItems(proj);
						for (const catalogItem of data.catalogItems) {
							state.projectCatalogItems.push({
								value: catalogItem.catalogItemId,
								catalogItemId: catalogItem.catalogItemId,
								selectLabel: catalogItem.name
							});
							state.selectedProjectCatalogItems.push(catalogItem);
						}
					} else {
						// TODO unify multiselect and ds-multiselect
						// @ts-ignore
						const data = await datasetCreateService.getCatalogItems(proj?.projectId);
						for (const catalogItem of data.catalogItems) {
							state.projectCatalogItems.push(catalogItem);
							state.selectedProjectCatalogItems.push(catalogItem);
						}
					}
					state.loadingCatalogItems = false;
				}
			}
		});

		onActivated(() => {
			state.showPortal = true;
		});
		onDeactivated(() => {
			state.showPortal = false;
		});
		onMounted(async() => {
			state.isMounted = true;
			try {
				if (enableMonitorProject) {
					// @ts-ignore
					const data = await datasetCreateService.getMonitoringProjects();
					state.monitoringProjects = data.monitoringProjects;
				}
			} catch (error: any) {
				notification.notify({
					type: 'danger',
					text: error?.response?.data?.error?.message ?? t('t_UnexpectedError'),
					duration: 5000
				});
			} finally {
				state.loading = false;
			}
			if (enableCatalogItem) {
				await searchForCatalogItems('');
			}
		});

		const importDataset = () => {
			if (state.selectedDqType === 'monitoringProject') {
				importProject();
			} else {
				importCatalogItems();
			}
		};

		const importProject = async() => {
			try {
				let mappedMonitoringProjects = null;

				if (form.projectChoices.length > 1) {
					mappedMonitoringProjects = form.projectChoices.reduce((result: any, value: any) => ({...result, [value.projectId]: null}), {});
				} else {
					mappedMonitoringProjects = {[form.projectChoices[0].projectId]: state.selectedProjectCatalogItems.map((catalog: CatalogItem) => catalog.catalogItemId)};
				}

				await datasetCreateService.importProject({
					...(form.scheduling ? {scheduling: form.scheduling} : {}),
					datasetPrefix: form.datasetPrefix === '' ? null : form.datasetPrefix,
					...(form.importProjectsFrom ? {onlyRecordsSinceDatetime: new Date(form.importProjectsFrom!).toISOString()} : {}),
					monitoringProjectsMapping: mappedMonitoringProjects
				});

				// @ts-ignore
				notification.notify({
					type: 'success',
					text: t('t_dqUploading'),
					duration: 5000
				});
				router.push({name: 'dataset-list'});
			} catch (error) {
				notification.notify({
					type: 'danger',
					text: t('t_dqSetupFailed'),
					duration: 7500
				});
			}
		};
		const importCatalogItems = async() => {
			try {
				await datasetCreateService.importCatalogItems({
					...(form.scheduling ? {scheduling: form.scheduling} : {}),
					catalogItemIds: form.selectedCatalogItems.map((item: CatalogItem) => item.catalogItemId),
					datasetPrefix: form.datasetPrefix,
					onlyRecordsSinceDatetime: new Date(form.importCatalogItemsFrom!).toISOString()
				});
				// @ts-ignore
				notification.notify({
					type: 'success',
					text: t('t_dqUploading'),
					duration: 5000
				});
				router.push({name: 'dataset-list'});
			} catch (error) {
				notification.notify({
					type: 'danger',
					text: t('t_dqSetupFailed'),
					duration: 7500
				});
			}
		};
		const searchForCatalogItems = useDebounceFn(async(value: string) => {
			try {
				const data = await datasetCreateService.searchForCatalogItems(value);
				if (props.modal) {
					state.catalogItems = data.map((el: any) => ({
						catalogItemId: el.id,
						selectLabel: el.name
					}));
				} else {
					state.catalogItems = data.map((el: any) => ({
						catalogItemId: el.id,
						name: el.name
					}));
				}
			} catch (error) {
				notification.notify({
					type: 'danger',
					text: t('t_catalogItemSearchFailed'),
					duration: 7500
				});
			}
		}, 400);

		return {
			dqActiveTypes,
			...toRefs(state),
			...toRefs(form),
			chooseProjects,
			chooseCatalogs,
			projects,
			catalogItemCount,
			isCreateDisabled,
			importDataset,
			searchForCatalogItems,
			resetForm
		};
	}
});
</script>

<style lang="scss" scoped>
.input-height {
	height: 36px !important;
}

.modal-card {
	box-shadow: none !important;
	height: 100% !important;
}
.bg-color {
	background-color: #4E75FD;
}
</style>
