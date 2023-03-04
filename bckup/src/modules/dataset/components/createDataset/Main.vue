<template>
	<div class="w-100 overflow-auto" :style="{height: contentHeight + 'px'}">
		<div>
			<ds-page-header>
				<ds-text variant="headline1">
					{{ $t('t_AddDataSet') }}
				</ds-text>
			</ds-page-header>

			<ds-box v-if="!oneIntegration && saasLimitsState.getAlertVisibilityStatus('datasetCreateInfoAlert')" padding-top="L" align="center">
				<data-stories-limits-info type="datasetCreateInfoAlert" class="w-75">
					<template #default>
						<ds-text variant="subheadline">
							{{ $t('limits.createDatasetInfoBox.title') }}
						</ds-text>
						<ds-text>{{ $t('limits.createDatasetInfoBox.message') }}</ds-text>
					</template>
					<template #button>
						<data-stories-button center variant="secondary" @click="$router.push({name: 'billing'})">{{ $t('limits.createDatasetInfoBox.button') }}</data-stories-button>
					</template>
				</data-stories-limits-info>
			</ds-box>

			<ds-box padding-top="L" align="center">
				<ds-card body-class="m-0 p-0" class="p-5 mb-3 border-0 w-75">
					<ds-box padding-bottom="L">
						<ds-text variant="subheadline">
							1. {{ $t('datasetUpload.cardHeadlines.datasetSource') }}
						</ds-text>
						<ds-text variant="paragraph" color="display-content">
							{{ $t('datasetUpload.cardHeadlines.howToUpload') }}
						</ds-text>
					</ds-box>
					<upload-types />
					<router-view v-slot="{Component}">
						<keep-alive>
							<component :is="Component" />
						</keep-alive>
					</router-view>
				</ds-card>
				<div id="upload-form-portal" class="w-75" />
			</ds-box>
		</div>
	</div>
</template>

<script lang="ts">
import {
	ref,
	defineComponent,
	onMounted,
	onUnmounted,
	computed,
	inject
} from 'vue';
import UploadTypes from '@/modules/dataset/components/createDataset/UploadTypes.vue';
import DsCloseButton from '@/components/main/button/DsCloseButton.vue';
import DataStoriesButton from '@/components/main/DataStoriesButton.vue';
import {useSaasLimits} from '@/modules/limits/store/limits';
import DataStoriesLimitsInfo from '@/modules/limits/components/DataStoriesLimitsInfo.vue';

export default defineComponent({
	name: 'Main',
	components: {
		DataStoriesButton,
		DsCloseButton,
		UploadTypes,
		DataStoriesLimitsInfo
	},
	setup() {
		const contentHeight = ref(window.innerHeight);
		const getContentHeight = () => {
			contentHeight.value = window.innerHeight;
		};
		const appConfig = inject('appConfig');
		const oneIntegration = computed(() => appConfig?.oneIntegration);
		const saasLimitsState = useSaasLimits();
		onMounted(() => {
			window.addEventListener('resize', getContentHeight);
			getContentHeight();
		});

		onUnmounted(() => {
			window.removeEventListener('resize', getContentHeight);
		});

		return {
			contentHeight,
			getContentHeight,
			saasLimitsState,
			oneIntegration
		};
	}
});
</script>
