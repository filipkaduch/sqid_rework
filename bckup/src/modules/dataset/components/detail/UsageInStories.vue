<template>
	<ds-box>
		<ds-box flex-type="row" padding-bottom="M">
			<ds-text variant="subheadline">{{ $t('datasetDetail.usageInStories') }}</ds-text>
			<!-- TODO Add badge with count once we have proxy component from feature branch -->
			<!-- <ds-inline>{{ listOfStories.length }}</ds-inline> -->
		</ds-box>
		<ds-input
			v-model:value="searchTerm"
			:lg="false"
			placeholder="Search stories"
			class="border-top-radius"
			:debounce="true"
			@update:value="getListOfStories" />
		<!-- TODO Change for table once we have table with pagination from feature branch -->
		<!-- <ds-box>
			<ds-table
				v-if="listOfStories.length"
				:table-header="tableHeader"
				:table-rows="tableRows"
				:data-table="false" />
		</ds-box> -->
		<ds-box v-if="listOfStories.length" padding-top="S">
			<ds-box
				v-for="(story, index) in listOfStories"
				:key="index"
				padding-y="M"
				flex-type="row"
				align="space-between"
				align-y="center"
				:border-bottom="index !== listOfStories.length - 1 ? 'separate' : 'none'"
				:padding-bottom="index === listOfStories.length - 1 ? 'NONE' : 'M'">
				<ds-box flex-type="row" align-y="center">
					<ds-text variant="body">
						{{ story.name }}
					</ds-text>
				</ds-box>
				<ds-inline @click="routeToEditor(story)">
					<ds-icon
						class="svg-image cursor-pointer"
						name="icon-external-link"
						alt="icon" />
				</ds-inline>
			</ds-box>
		</ds-box>
	</ds-box>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue';
import {storyType as storyTypes} from '@/modules/story/consts/storyType';
import {storyServices} from '@/modules/story/storyServices';
import {TELLSTORY_ROW_ID} from '@/modules/dataset/utils/dataset';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';


export default defineComponent({
	setup() {
		const router = useRouter();
		const store = useStore();
		const translate = (word: string) => t(word);

		const datasetDetail = computed(() => store.getters['datasetDetail/dataset']);

		const listOfStories = ref([]);
		const searchTerm = ref('');

		const getListOfStories = async(value: string = '') => {
			listOfStories.value = await storyServices.getAllStories({
				params: {
					searchTerm: value,
					limit: 40,
					offset: 0,
					datasetIds: datasetDetail.value.id
				}
			});
		};

		onMounted(async() => {
			await getListOfStories();
		});

		const columnNames = {
			name: translate('datasetDetail.schemaNames.name'),
			action: translate('datasetDetail.sharing.action')
		};

		const tableHeader = [
			{
				name: columnNames.name,
				type: 'string'
			},
			{
				name: columnNames.action,
				type: 'string'
			}
		];

		const tableRows = computed(() => listOfStories.value.reduce((data: any, item: any) => {
			if (item.name !== TELLSTORY_ROW_ID) {
				data.push({
					[`${columnNames.name}`]: item.name,
					[`${columnNames.action}`]: item.id
				});
			}
			return data;
		}, []));

		const routeToEditor = (story: any) => {
			let route = {};
			if (story.storyType === storyTypes.VISUAL_DATA_STORY) {
				route = {
					name: 'story-editor',
					params: {id: story.id}
				};
			} else {
				route = {
					name: 'dashboard-editor',
					params: {id: story.id}
				};
			}
			window.open(router.resolve(route).href, '_blank');
		};

		return {
			searchTerm,
			getListOfStories,
			listOfStories,
			tableHeader,
			tableRows,
			routeToEditor
		};
	}
});
</script>

<style lang="scss" scoped>
.svg-image {
	fill: map-get($ds-colors, 'display-content-700');
	opacity: 0.702;
}
</style>
