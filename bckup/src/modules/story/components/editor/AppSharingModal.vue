<!-- eslint-disable max-lines -->
<template>
	<ds-modal
		data-testid="storySharingModal"
		:show="showModal"
		size="lg"
		hide-footer
		@hidden="resetData"
		@show="getData"
		@cancel="$emit('closeModal')">
		<template #modal-title>
			<h5 class="my-auto">{{ $t('sharingOptionModal.sharingOptions') }}</h5>
		</template>
		<template #modal-text>
			<app-loading :loading="listLoading">
				<ds-tab-buttons
					:activeTab="activeTab"
					:tabs="dataSourceTypes"
					variant="button"
					@tab-clicked="activeTab = $event" />
				<ds-box v-if="activeTab.name === tabNames.PUBLIC">
					<div class="flex-grow-1">
						{{ $t('sharingOptionModal.description') }}
						<app-input-bar
							v-model:input="publicLinkDescription"
							:pill="true"
							:rounded="true"
							class="placeholder-style"
							:placeholder="$t('sharingOptionModal.addDescriptionToLink')" />
					</div>
					<ds-box padding-top="S">
						<ds-box align="center">
							<ds-btn
								variant="ghost"
								@click="collapse = !collapse">
								{{ $t('sharingOptionModal.advanceOptions') }}
								<fa-icon :icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']" class="ml-3" />
							</ds-btn>
						</ds-box>
						<ds-collapse :is-open="collapse" class="w-100 mt-2 m-0">
							<ds-box flex-type="row" align-y="center">
								<ds-text>
									{{ $t('sharingOptionModal.linkExpires') }}
								</ds-text>
								<ds-box padding-left="S">
									<ds-switch v-model:value="showDateTimePickers" />
								</ds-box>
							</ds-box>
							<ds-box flex-type="row">
								<div class="w-100">
									{{ $t('sharingOptionModal.expirationDate') }}
									<ds-datepicker
										v-model:value="publicLinkExpirationDate"
										:disabled="!showDateTimePickers"
										:placeholder="$t('sharingOptionModal.expirationDatePlaceholder')" />
								</div>
								<!--TODO: create custom time-picker-->
								<!--<div class="ml-2 w-35">-->
								<!--{{ $t('sharingOptionModal.expirationTime') }}-->
								<!--<b-form-timepicker-->
								<!--v-model="publicLinkExpirationTime"-->
								<!--:disabled="!showDateTimePickers"-->
								<!--:placeholder="$t('sharingOptionModal.expirationTimePlaceholder')"-->
								<!--locale="en" />-->
								<!--</div>-->
							</ds-box>
						</ds-collapse>
						<div v-if="!editMode" class="mt-2 d-flex">
							<ds-btn
								variant="primary"
								@click="createPublicLink">
								{{ $t('sharingOptionModal.getLink') }}
							</ds-btn>
						</div>
						<div v-else class="d-flex mt-2">
							<ds-btn
								variant="primary"
								@click="editPublicLink(selectedData)">
								{{ $t('sharingOptionModal.save') }}
							</ds-btn>
							<div class="mx-2" />
							<ds-btn
								variant="secondary"
								@click="resetData">
								{{ $t('sharingOptionModal.cancel') }}
							</ds-btn>
						</div>
					</ds-box>
					<ds-box class="border-width" flex-type="row" padding-top="M" border-bottom="box">
						<template v-for="(item, index) in publicSharingTableFields" :key="index">
							<ds-box :class="`${item.thClass}`">{{ item.label }}</ds-box>
						</template>
					</ds-box>
					<ds-box
						v-for="(item, index) in listOfPublicRecords"
						:key="index" flex-type="row" padding-y="XS"
						:border-bottom="index !== listOfPublicRecords.length - 1 ? 'separate' : 'none'"
						:class="{'ds-bg-warning-200': item.publicToken === selectedData?.publicToken}">
						<ds-box class="w-40">{{ formatString(item.description, false, item) }}</ds-box>
						<ds-box class="w-25">{{ item.expiresAt !== null ? formatString(item.expiresAt, true) : $t('sharingOptionModal.neverExpires') }}</ds-box>
						<ds-box class="w-25">
							<button class="btn btn-clean btn-sm" @click="copyPublicLink(item)">
								<fa-icon :icon="['fal','link']" class="mx-0" />
							</button>
							<button class="btn btn-clean btn-sm" @click="copyPublicLink(item, true)">
								<fa-icon :icon="['fal','code']" class="mx-0" />
							</button>
							<button class="btn btn-clean btn-sm" @click="openPublicLink(item)">
								<fa-icon :icon="['fal','external-link-alt']" class="mx-0" />
							</button>
							<button class="btn btn-clean btn-sm" @click="startEditPublicLink(item)">
								<fa-icon :icon="['fal', 'pencil']" class="mx-0" />
							</button>
							<button class="btn btn-clean btn-sm" @click="deletePublicLink(item)">
								<fa-icon :icon="['fal', 'times']" class="mx-0" />
							</button>
						</ds-box>
						<ds-box class="w-10">
							<ds-switch v-model:value="item.isActive" @update="editPublicLink(data.item, $event, true)" />
						</ds-box>
					</ds-box>
				</ds-box>
				<ds-box v-if="activeTab.name === tabNames.COMPANY">
					<ds-box
						v-if="oneIntegrationEnabled"
						data-testid="storySharingCompanyInvitation"
						:title="$t('sharingOptionModal.companyInvitation')"
						:title-item-class="'tabs-spacing'">
						<ds-box padding-top="M">
							<div v-if="listOfCompanyRecords.length > 0" class="d-flex mb-2">
								<input v-model="companyRestrictedLink" class="form-control mr-3" readonly>
								<button class="btn btn-clean btn-sm border" @click="copyCompanyRestrictedLink">
									<fa-icon :icon="['fal','link']" class="mx-0" />
								</button>
							</div>
							<span class="input-title-style">{{ $t('sharingOptionModal.searchGroupsOrMembers') }}</span>
							<div class="d-flex mt-1">
								<multiselect
									:model-value="search"
									:options="itemsAll"
									data-testid="sharingCompanySelector"
									:multiple="true"
									:limit="2"
									:limitText="count => `and ${count} more`"
									:optionsLimit="5"
									:placeholder="$t('sharingOptionModal.searchGroupsOrMembers')"
									:deselect-label="''"
									:select-label="''"
									track-by="trackBy"
									:custom-label="getLabelContent"
									:clearOnSelect="false"
									class="flex-grow-1 placeholder-style mr-3"
									@update:model-value="search = $event"
									@search-change="searchForUsers($event)">
									<template #option="props">
										<div data-testid="sharingCompanySelectorItem" class="d-flex">
											<div class="iconDivSize mr-2">
												<fa-icon :icon="['fas',props.option.type === 'Person' ? 'user' : 'users']" class="mx-0" />
											</div>
											{{ getLabelContent(props.option) }}
										</div>
									</template>
								</multiselect>
								<ds-btn
									no-wrap
									white-space="nowrap"
									variant="secondary"
									:disabled="disableAddCompanyShare"
									data-testid="sharingGiveAccessBtn"
									@click="createCompanySharingLink">
									{{ $t('sharingOptionModal.giveAccess') }}
								</ds-btn>
							</div>
							<div class="mt-3">
								<ds-box class="border-width" flex-type="row" padding-top="M" border-bottom="box">
									<template v-for="(item, index) in companySharingTableFields" :key="index">
										<ds-box :class="`${item.thClass ?? 'flex-grow-1'}`">{{ item.label }}</ds-box>
									</template>
								</ds-box>
								<ds-box
									v-for="(item, index) in listOfCompanyRecords"
									:key="index" flex-type="row" padding-y="XS"
									:border-bottom="index !== listOfPublicRecords.length - 1 ? 'separate' : 'none'">
									<ds-box class="flex-grow-1" flex-type="row">
										<div class="iconDivSize mr-2">
											<fa-icon :icon="['fas', item.type === 'Person' ? 'user' : 'users']" class="mx-0" />
										</div>
										{{ item.name }}
									</ds-box>
									<ds-box class="w-10">
										<button class="btn btn-clean btn-sm" @click="deletePrivateLink(item)">
											<fa-icon :icon="['fal', 'times']" class="mx-0" />
										</button>
									</ds-box>
								</ds-box>
							</div>
						</ds-box>
					</ds-box>
				</ds-box>
			</app-loading>
		</template>
	</ds-modal>
</template>

<script>
import 'vue-multiselect/dist/vue-multiselect.css';
import '@/styles/_multiselect.scss';
import {mapGetters} from 'vuex';
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import AppLoading from '@/components/design/AppLoading.vue';
import Multiselect from 'vue-multiselect';
import {debounce} from 'lodash';
import {sharingOptions} from '@/util/queryBuilder';
import axios from '@/plugins/axios';
import DsSwitch from '@/components/inputs/DsSwitch.vue';
import DsTabButtons from '@/components/main/button/DsTabButtons.vue';
import {useNotification} from '@kyvg/vue3-notification';
import i18n from '@/plugins/i18n';
const {t} = i18n.global;

const tabNames = {
	PUBLIC: t('sharingOptionModal.publicLink'),
	COMPANY: t('sharingOptionModal.companyInvitation')
};

export default {
	// TODO: REFACTOR this FILE !!
	name: 'AppSharingModal',
	components: {
		DsSwitch,
		DsTabButtons,
		AppInputBar,
		AppLoading,
		Multiselect
	},
	inject: ['appConfig'],
	props: {
		showModal: {
			type: Boolean,
			default: false
		}
	},
	emits: ['changeCompanyShare', 'closeModal'],
	// eslint-disable-next-line max-lines-per-function
	data() {
		return {
			tabNames,
			activeTab: {name: tabNames.PUBLIC},
			editMode: false,
			selectedData: null,
			publicLinkDescription: '',
			publicLinkExpirationDate: null,
			publicLinkExpirationTime: null,
			search: [],
			itemsAll: [],
			listLoading: true,
			listOfCompanyRecords: [],
			listOfPublicRecords: [],
			publicSharingTableFields: [
				{
					key: 'description',
					label: 'Description',
					thClass: 'w-40'
				},
				{
					key: 'expiresAt',
					label: 'Expiration date',
					thClass: 'w-25'
				},
				{
					key: 'actions',
					label: 'Actions',
					thClass: 'w-25'
				},
				{
					key: 'active',
					label: 'Active',
					thClass: 'w-10'
				}
			],
			companySharingTableFields: [
				{
					key: 'name',
					label: 'Name'
				},
				{
					key: 'actions',
					label: 'Actions',
					thClass: 'w-10'
				}
			],
			showDateTimePickers: false,
			companyPublicToken: null,
			companyRecordId: null,
			toast: {
				msg: null,
				variant: null,
				delay: 1000
			},
			collapse: false,
			notification: useNotification()
		};
	},
	computed: {
		...mapGetters('storyDetail', {
			story: 'story'
		}),
		disableAddCompanyShare() {
			return !this.search || this.search?.length === 0;
		},
		oneIntegrationEnabled() {
			return this.appConfig?.oneIntegration;
		},
		sharePublicLinkEnabled() {
			return this.appConfig?.sharePublicLink;
		},
		companyRestrictedLink() {
			return this.publishStorySectionUrl(this.companyPublicToken, true);
		},
		dataSourceTypes() {
			return [
				{name: tabNames.PUBLIC},
				...this.oneIntegrationEnabled ? [{name: tabNames.COMPANY}] : []
			];
		}
	},
	methods: {
		publishStorySectionUrl(publicToken, restricted = false) {
			let presenterType = null;
			if (this.story.storyType === 'visual-data-story') {
				presenterType = restricted ? 'story-publish-restricted' : 'story-publish';
			} else if (this.story.layoutConfiguration.dimensions.height > this.story.layoutConfiguration.dimensions.width) {
				presenterType = restricted ? 'dashboard-vertical-publish-restricted' : 'story-publish-dashboard-vertical';
			} else {
				presenterType = restricted ? 'dashboard-publish-restricted' : 'story-publish-dashboard';
			}
			return `${window.location.origin}${this.$router.resolve({
				name: presenterType,
				params: {
					token: publicToken
				}
			}).href}`;
		},
		searchForUsers: debounce(function getUsers(value) {
			// eslint-disable-next-line no-invalid-this
			axios.get('v0/integrations/gen2/identities', {
				params: {
					searchTerm: value
				}
			})
				.then(({data}) => {
					// eslint-disable-next-line no-invalid-this
					this.itemsAll = data.data.map((item) => {
						item.trackBy = item.id;
						return item;
					});
				});
		}, 300),
		createCompanySharingLink() {
			const persons = this.search?.filter((item) => item.type === sharingOptions.PERSON).map((item) => item.id);
			const groups = this.search?.filter((item) => item.type === sharingOptions.GROUP_ROLE).map((item) => item.id);
			axios.post(`v0/stories/${this.story.id}/sharing-records${this.companyRecordId ? `/${this.companyRecordId}` : ''}`, {
				recordType: sharingOptions.GEN2_PERSONS_GROUPS,
				settings: {
					type: sharingOptions.GEN2_PERSONS_GROUPS,
					persons: this.companyRecordId
						? persons.concat(this.listOfCompanyRecords.filter((item) => item.type === sharingOptions.PERSON).map((item) => item.id))
						: persons,
					groups: this.companyRecordId
						? groups.concat(this.listOfCompanyRecords.filter((item) => item.type === sharingOptions.GROUP_ROLE).map((item) => item.id))
						: groups
				},
				isActive: true
			})
				.then(() => {
					this.getData();
				});

			this.search = null;
		},
		getData() {
			if (this.oneIntegrationEnabled) {
				this.searchForUsers();
			}

			axios.get(`v0/stories/${this.story.id}/sharing-records`, {
				params: {
					// searchTerm: value
				}
			})
				.then(async({data}) => {
					this.listOfPublicRecords = data.data.filter((item) => item.recordType === 'PUBLIC-LINK').map((item) => {
						/* eslint-disable no-underscore-dangle */
						item._rowVariant = item.isActive ? null : 'secondary';
						return item;
					})
						.reverse();

					const [companyRecord] = data.data.filter((item) => item.recordType === sharingOptions.GEN2_PERSONS_GROUPS);

					if (companyRecord) {
						this.companyPublicToken = companyRecord.publicToken;
						const records = await axios.get(`/v0/integrations/gen2/identities/story-sharing-records/${companyRecord.id}`, {
							params: {
							}
						});
						this.listOfCompanyRecords = records.data.data.map((item) => {
							if (item.type === sharingOptions.GROUP_ROLE) {
								return {
									type: sharingOptions.GROUP_ROLE,
									id: item.id,
									name: item.name
								};
							}
							return {
								type: sharingOptions.PERSON,
								id: item.id,
								name: `${item.firstName ?? ''} ${item.lastName ?? ''}`
							};
						});
						this.$emit('changeCompanyShare', this.listOfCompanyRecords.length);
						this.companyRecordId = companyRecord.id;
					}
				});
			this.listLoading = false;
		},
		startEditPublicLink(data) {
			this.resetData();
			data._rowVariant = 'warning';
			this.editMode = true;
			this.publicLinkDescription = data.description ?? '';
			if (data.expiresAt) {
				this.showDateTimePickers = true;
				this.publicLinkExpirationDate = data.expiresAt.substring(
					0,
					data.expiresAt.indexOf('T')
				);
				this.publicLinkExpirationTime = data.expiresAt.substring(
					data.expiresAt.indexOf('T') + 1,
					data.expiresAt.lastIndexOf('+')
				);
			}
			this.selectedData = data;
		},
		resetData() {
			this.listOfPublicRecords.forEach((item) => {
				item._rowVariant = item.isActive ? null : 'secondary';
			});
			this.editMode = false;
			this.showDateTimePickers = false;
			this.selectedData = null;
			this.publicLinkExpirationTime = null;
			this.publicLinkExpirationDate = null;
			this.publicLinkDescription = '';
		},
		createPublicLink() {
			let expirationDate = null;
			if (this.showDateTimePickers && this.publicLinkExpirationDate !== null) {
				expirationDate = new Date(`${this.publicLinkExpirationDate}T${this.publicLinkExpirationTime ?? '00:00:00'}Z`).toISOString();
			}

			axios.post(`v0/stories/${this.story.id}/sharing-records`, {
				recordType: 'PUBLIC-LINK',
				description: this.publicLinkDescription,
				expiresAt: expirationDate,
				isActive: true
			})
				.then(({data}) => {
					this.resetData();
					this.getData();
					this.copyPublicLink(data.data);
				});
		},
		copyPublicLink(data, embeded = false) {
			const url = this.publishStorySectionUrl(data.publicToken);
			const toCopy = embeded
				? '<iframe width="100%" height=600'
					+ ` style="overflow:hidden; border: 0 none" src="${url}"></iframe>`
				: url;
			navigator.clipboard.writeText(toCopy);

			this.notification.notify({
				type: 'success',
				text: t('t_copiedToClipboard'),
				duration: 3000
			});
		},
		openPublicLink(data) {
			window.open(this.publishStorySectionUrl(data.publicToken));
		},
		copyCompanyRestrictedLink() {
			const url = this.publishStorySectionUrl(this.companyPublicToken, true);
			navigator.clipboard.writeText(url);

			this.notification.notify({
				type: 'success',
				text: t('t_copiedToClipboard'),
				duration: 3000
			});
		},
		deletePublicLink(data) {
			axios.delete(`v0/stories/${this.story.id}/sharing-records/${data.id}`)
				.then(() => {
					const removeIndex = this.listOfPublicRecords.map((item) => item.id).indexOf(data.id);
					this.listOfPublicRecords.splice(removeIndex, 1);
					this.resetData();

					this.notification.notify({
						type: 'success',
						text: t('t_successfullyDeletedStorySharingLink'),
						duration: 3000
					});
				})
				.catch(() => {
					this.notification.notify({
						type: 'danger',
						text: t('t_cannotDeleteStorySharingLink'),
						duration: 3000
					});
				});
		},
		deletePrivateLink(data) {
			const persons = this.listOfCompanyRecords.filter((item) => item.type === sharingOptions.PERSON).map((item) => item.id);
			const groups = this.listOfCompanyRecords.filter((item) => item.type === sharingOptions.GROUP_ROLE).map((item) => item.id);
			if (data.type === sharingOptions.PERSON) {
				persons.splice(persons.indexOf(data.id), 1);
			} else {
				groups.splice(groups.indexOf(data.id), 1);
			}

			if (this.listOfCompanyRecords.length > 1) {
				axios.post(`v0/stories/${this.story.id}/sharing-records/${this.companyRecordId}`, {
					recordType: sharingOptions.GEN2_PERSONS_GROUPS,
					settings: {
						type: sharingOptions.GEN2_PERSONS_GROUPS,
						persons,
						groups
					},
					isActive: true
				})
					.then(() => {
						const removeIndex = this.listOfCompanyRecords.map((item) => item.id).indexOf(data.id);
						this.listOfCompanyRecords.splice(removeIndex, 1);
					});
			} else {
				axios.delete(`v0/stories/${this.story.id}/sharing-records/${this.companyRecordId}`)
					.then(() => {
						this.listOfCompanyRecords = [];
						this.companyRecordId = null;
						this.$bvToast.show('example-toast');
						this.toast.msg = 't_successDeletedCompanySharingLink';
						this.toast.variant = 'success';
						this.$emit('changeCompanyShare', 0);
					});
			}
		},
		editPublicLink(data, activeState = true, useOldConf = false) {
			let expirationDate = null;
			if (this.showDateTimePickers && this.publicLinkExpirationDate !== null) {
				expirationDate = new Date(`${this.publicLinkExpirationDate}T${this.publicLinkExpirationTime ?? '00:00:00'}Z`).toISOString();
			}

			axios.post(`v0/stories/${this.story.id}/sharing-records/${data.id}`, {
				description: useOldConf ? data.description : `${this.publicLinkDescription}`,
				expiresAt: useOldConf ? data.expiresAt : expirationDate,
				isActive: useOldConf ? activeState : data.isActive
			})
				.then((result) => {
					const editIndex = this.listOfPublicRecords.map((item) => item.id).indexOf(data.id);
					const toSave = result.data.data;
					toSave._rowVariant = toSave.isActive ? null : 'secondary';
					this.listOfPublicRecords.splice(editIndex, 1, toSave);
					this.resetData();
					this.notification.notify({
						type: 'success',
						text: t('t_successfullyEditedStorySharingLink'),
						duration: 3000
					});
				});
		},
		getLabelContent(value) {
			return value.name ?? `${value.firstName} ${value.lastName}`;
		},
		formatString(value, isDate = false, item = null) {
			const options = {
				year: 'numeric',
				month: 'short',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				timeZone: 'UTC',
				hour12: true
			};
			if (isDate) {
				return new Intl.DateTimeFormat('en-US', options).format(new Date(value));
			}


			return value.length > 55
				? `${value.substring(0, 55)}...`
				: value.length === 0
					? `-- Published on ${new Intl.DateTimeFormat('en-US', options).format(new Date(item.createdAt))} --`
					: value;
		},
		getName({item}) {
			if (item.type === sharingOptions.GROUP_ROLE) {
				return item.id;
			}

			/*
			axios.get('v0/integrations/gen2/persons', {
				params: {
					persons: item.id
				}
			})
				.then((dataInside) => {
					console.log(dataInside);
				});
			*/
			return item.id;
		}
	}
};
</script>

<style lang="scss" scoped>

:deep(.btn) {
	margin: 0 !important;
}

:deep(th.table-b-table-default) {
	color: #67686F !important;
	background-color: #FFFFFF !important;
	font-weight: 400;
}

:deep(.table th) {
	border-top: 0 !important;
}

.btn-height {
	height: 36px;
}

.iconDivSize {
	width: 18px;
	text-align: center;
}

.border-width {
	border-width: 2px !important;
}

// ::v-deep .multiselect__tag {
// background-color: #D6056D;
// }

// ::v-deep .multiselect__tag-icon:hover, .multiselect__tag-icon:focus {
// background-color: #D6056D;
// }

:deep(.multiselect__tags-wrap) {
	display: inline-flex;
}

:deep(.multiselect__strong) {
	min-width: 85px;
}

:deep(.modal-custom-height) {
	height: 420px;
}

:deep(.modal-custom-height-collapse) {
	height: 500px;
}

:deep(.w-10) {
    width: 10% !important;
}

:deep(.w-25) {
    width: 25% !important;
}

:deep(.w-35) {
    width: 35% !important;
}

:deep(.w-40) {
    width: 40% !important;
}

:deep(.w-65) {
    width: 65% !important;
}
</style>
