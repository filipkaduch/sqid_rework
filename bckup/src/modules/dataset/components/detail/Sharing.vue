<template>
	<div>
		<ds-box padding-bottom="M">
			<ds-text v-show="showHeadline" variant="subheadline">{{ $t('datasetDetail.sharingOptions') }}</ds-text>
		</ds-box>
		<ds-box flex-type="row">
			<multiselect
				:model-value="selectedEntity"
				:options="entities"
				:multiple="false"
				:optionsLimit="5"
				:placeholder="$t('sharingOptionModal.searchGroupsOrMembers')"
				:deselect-label="''"
				:select-label="''"
				track-by="trackBy"
				:custom-label="getLabelContent"
				:clearOnSelect="false"
				class="flex-grow-1 placeholder-style mr-3"
				@update:model-value="selectedEntity = $event"
				@search-change="searchForUsers" />
			<ds-box align="right">
				<ds-btn
					title="Give Access"
					variant="secondary"
					:disabled="selectedEntity === null"
					center
					@click="createSharingRecord">
					<ds-text variant="body" no-wrap white-space="nowrap">
						{{ $t('datasetDetail.sharing.giveAccess') }}
					</ds-text>
				</ds-btn>
			</ds-box>
		</ds-box>
		<ds-box v-if="sharingRecords.length > 0" padding-top="S">
			<ds-box
				padding-bottom="S"
				padding-top="M"
				flex-type="row"
				align="space-between"
				border-bottom="separate">
				<ds-text variant="bodyMedium">
					{{ $t('datasetDetail.sharing.name') }}
				</ds-text>
				<ds-text variant="bodyMedium">
					{{ $t('datasetDetail.sharing.action') }}
				</ds-text>
			</ds-box>
			<ds-box
				v-for="(record, index) in sharingRecords"
				:key="record.id"
				padding-y="M"
				flex-type="row"
				align="space-between"
				align-y="center"
				:border-bottom="index !== sharingRecords.length - 1 ? 'separate' : 'none'"
				:padding-bottom="index === sharingRecords.length - 1 ? 'NONE' : 'M'">
				<ds-box flex-type="row" align-y="center">
					<ds-avatar
						:bg-color="record.labels.bgColor"
						:text-color="record.labels.textColor"
						:text="record.labels.acronym" />
					<ds-box padding-left="S">
						<ds-text variant="body">
							{{ record.labels.label }}
						</ds-text>
					</ds-box>
				</ds-box>
				<ds-icon
					class="svg-image cursor-pointer"
					name="icon-trash"
					alt="icon"
					@click="deleteRecord(record)" />
			</ds-box>
		</ds-box>
	</div>
</template>

<script lang="ts">
import 'vue-multiselect/dist/vue-multiselect.css';
import '@/styles/_multiselect.scss';
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {shareService} from '@/modules/sharing/shareService';
import {sharingOptions} from '@/util/queryBuilder';
import Multiselect from 'vue-multiselect';
import {debounce} from 'lodash';
import DsAvatar from '@/components/main/DataStoriesAvatar.vue';
import i18n from '@/plugins/i18n/index';
import {useNotification} from '@kyvg/vue3-notification';
const {t} = i18n.global;

export default defineComponent({
	components: {
		DsAvatar,
		Multiselect
	},
	props: {
		showHeadline: {
			type: Boolean,
			default: true
		},
		datasetId: {
			type: String,
			default: null
		}
	},
	// eslint-disable-next-line max-lines-per-function
	setup(props) {
		const translate = (word: string) => t(word);
		const notification = useNotification();

		onMounted(() => {
			searchForUsers();
			getSharingRecords();
		});

		const state = reactive({
			entities: [],
			selectedEntity: null as any,
			sharingRecords: [] as any
		});

		const getLabelContent = (value: any) => value.name ?? `${value.firstName} ${value.lastName}`;

		const getListLabels = (value: any) => {
			const arr = value.entityId.split('.', 2);
			return {
				label: arr.map((item: any) => item.charAt(0).toUpperCase() + item.substring(1, item.length)).join(' '),
				acronym: arr.map((item: any) => item.charAt(0).toUpperCase()).join(''),
				bgColor: value.entityType === sharingOptions.USER ? 'primary-100' : 'interaction-100',
				textColor: value.entityType === sharingOptions.USER ? 'primary' : 'interaction-500'
			};
		};

		const getSharingRecords = async() => {
			state.sharingRecords = await shareService.getDatasetSharingRecords(props.datasetId);
			state.sharingRecords.map((item: any) => {
				item.labels = getListLabels(item);
				return item;
			});
		};

		const createSharingRecord = async() => {
			const entityType = state.selectedEntity.type === sharingOptions.PERSON ? sharingOptions.USER : sharingOptions.USER_GROUP;
			const entityId = state.selectedEntity.type === sharingOptions.PERSON ? state.selectedEntity.username : state.selectedEntity.name;

			state.selectedEntity = null;
			try {
				const result = await shareService.createDatasetSharingRecord(props.datasetId, {
					entityType,
					entityId,
					isActive: true
				});
				result.labels = getListLabels(result);
				state.sharingRecords.push(result);
				// @ts-ignore
				notification.notify({
					type: 'success',
					text: translate('datasetDetail.sharing.createRecordSuccess'),
					duration: 5000
				});
			} catch (err) {
				// @ts-ignore
				notification.notify({
					type: 'danger',
					text: translate('datasetDetail.sharing.createRecordError'),
					duration: 5000
				});
			}
		};

		// eslint-disable-next-line prefer-arrow-callback
		const searchForUsers = debounce(async function search(value: string = '') {
			const result = await shareService.getIdentities({
				params: {
					searchTerm: value
				}
			});
			state.entities = result.map((item: any) => {
				item.trackBy = item.type === sharingOptions.PERSON ? item.id : item.name;
				return item;
			});
		}, 500);

		const deleteRecord = async(record: any) => {
			try {
				await shareService.deleteDatasetRecord(record.datasetId, record.id);
				const index = state.sharingRecords.findIndex((item: any) => item.id === record.id);
				state.sharingRecords.splice(index, 1);
				// @ts-ignore
				notification.notify({
					type: 'success',
					text: translate('datasetDetail.sharing.recordDeleteSuccess'),
					duration: 5000
				});
			} catch (err) {
				// @ts-ignore
				notification.notify({
					type: 'danger',
					text: translate('datasetDetail.sharing.recordDeleteError'),
					duration: 5000
				});
			}
		};

		return {
			...toRefs(state),
			getLabelContent,
			searchForUsers,
			createSharingRecord,
			deleteRecord
		};
	}
});
</script>

<style lang="scss" scoped>
.svg-image {
	fill: map-get($ds-colors, 'display-content-700');
	opacity: 0.702;
}

.button {
	width: 150px;
}
</style>
