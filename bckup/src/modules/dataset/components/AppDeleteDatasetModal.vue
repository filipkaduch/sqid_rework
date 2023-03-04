<template>
	<ds-modal
		:show="showModal"
		:headerText="$t('modals.deleteDatasetTitle')"
		@hidden="reset"
		@cancel="closeModal">
		<template v-if="!infoText" #modal-text>
			{{ forceDelete ? message : $t('modals.deleteDataset?') }}
			<ds-box v-if="forceDelete">
				{{ $t('t_RelatedStoriesCount') + relatedStories.cntStories }}
				<ul class="m-0">
					<li v-for="(key, index) in Object.keys(relatedStories.stories)" :key="`relatedStory-${index}`">
						<router-link target="_blank" :to="{name: 'story-editor', params: {id: key}}">
							{{ relatedStories.stories[key] }}
						</router-link>
					</li>
					<li v-if="relatedStories.cntStories > 5">
						...
					</li>
				</ul>
				<p class="my-2">{{ $t('t_ForceDeleteDatasetConfirmation') }}</p>
			</ds-box>
		</template>
		<template v-else #modal-text>
			{{ forceDelete ? message : $t('t_deleteDatasetConfirmation') }}
			{{ $t('modals.cannotBeUndone') }}
		</template>
		<template #modal-footer>
			<button class="btn btn-action" @click="deleteDataset">{{ $t('modals.delete') }}</button>
			<button class="btn btn-white" @click="closeModal">{{ $t('modals.cancel') }}</button>
		</template>
	</ds-modal>
</template>

<script>
import axios from '@/plugins/axios';
import {notify} from '@kyvg/vue3-notification';

export default {
	name: 'AppDeleteDatasetModal',
	props: {
		datasetId: {
			type: String,
			required: true
		},
		returnToDatasets: {
			type: Boolean,
			default: false
		},
		infoText: {
			type: Boolean,
			default: false
		},
		ownedByUser: {
			type: Boolean,
			default: true
		},
		showModal: {
			type: Boolean,
			default: false
		}
	},
	emits: ['deleted', 'closeModal'],
	data() {
		return {
			forceDelete: false,
			relatedStories: {},
			message: ''
		};
	},
	methods: {
		reset() {
			this.forceDelete = false;
			this.relatedStories = {};
			this.message = '';
		},
		closeModal() {
			this.reset();
			this.$emit('closeModal');
		},
		deleteDataset() {
			if (!this.ownedByUser) {
				notify({
					type: 'danger',
					text: this.$t('t_deleteDatasetNotOwner'),
					duration: 5000
				});
				this.closeModal();
				return;
			}

			axios.delete(`/v0/datasets/${this.datasetId}${this.forceDelete ? '?force_delete=true' : ''}`)
				.then((value) => {
					if (value !== false) {
						notify({
							type: 'success',
							text: this.$t('t_successfullyDeletedDataset'),
							duration: 5000
						});
						this.$store.commit('datasets/removeDataset', this.datasetId);
						this.closeModal();
						if (this.returnToDatasets) {
							this.$router.push({
								name: 'dataset-list'
							});
						}
					}
				})
				.then(() => {
					this.$emit('deleted');
				})
				.catch((err) => {
					if (err.response.status === 400) {
						this.message = err.response.data.error.message;
						this.forceDelete = true;
						this.relatedStories = err.response.data.error.extra;
					} else {
						notify({
							type: 'danger',
							text: this.$t('t_deleteDatasetError'),
							duration: 5000
						});
						this.closeModal();
					}
				});
		}
	}
};
</script>
