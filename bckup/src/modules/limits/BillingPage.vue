<template>
	<div class="h-100vh w-100vw">
		<ds-page-header>
			<ds-inline align="space-between" align-y="center">
				<ds-text padding-right="M" variant="headline1light">
					{{ $t('billing.licenseInformation') }}
				</ds-text>
			</ds-inline>
		</ds-page-header>

		<ds-box class="container" padding-bottom="XL" padding-top="XXL">
			<ds-row no-gutter>
				<ds-col class="p-0" cols="12" md="5" xl="3">
					<ds-box
						border="separate-light" border-radius="basic" padding-bottom="L"
						padding-top="NONE" padding-x="M">
						<ds-box align="space-between" flex-type="row" padding-bottom="M" padding-top="L">
							<ds-text color="display-content-700" variant="headline2">{{ $t('billing.basicPlan.title') }}</ds-text>
							<data-stories-badge
								:text="$t('billing.basicPlan.badge')"
								style="max-width: fit-content; flex-grow: 0"
								variant="success" />
						</ds-box>
						<ds-text color="display-content" variant="caption">{{ $t('billing.basicPlan.subtitle') }}</ds-text>
						<ds-box align="space-between" flex-type="row" padding-bottom="M" padding-top="M">
							<ds-box flex-type="row">
								<ds-icon fill="success-500" name="icon-check-medium" style="flex-shrink: 0" />
								<ds-box padding-left="S">
									<ds-text variant="body">{{ $t('billing.basicPlan.item1') }}</ds-text>
								</ds-box>
							</ds-box>
						</ds-box>
						<ds-box align="space-between" flex-type="row" padding-bottom="M">
							<ds-box flex-type="row">
								<ds-icon fill="success-500" name="icon-check-medium" style="flex-shrink: 0" />
								<ds-box padding-left="S">
									<ds-text variant="body">{{ $t('billing.basicPlan.item2') }}</ds-text>
								</ds-box>
							</ds-box>
						</ds-box>
						<ds-box align="space-between" flex-type="row" padding-bottom="M">
							<ds-box flex-type="row">
								<ds-icon fill="success-500" name="icon-check-medium" style="flex-shrink: 0" />
								<ds-box padding-left="S">
									<ds-text variant="body">{{ $t('billing.basicPlan.item3') }}</ds-text>
								</ds-box>
							</ds-box>
						</ds-box>
						<ds-box align="space-between" flex-type="row" padding-bottom="M">
							<ds-box flex-type="row">
								<ds-icon fill="success-500" name="icon-check-medium" style="flex-shrink: 0" />
								<ds-box padding-left="S">
									<ds-text variant="body">{{ $t('billing.basicPlan.item4') }}</ds-text>
								</ds-box>
							</ds-box>
						</ds-box>
						<ds-box align="space-between" flex-type="row" padding-bottom="M">
							<ds-box flex-type="row">
								<ds-icon fill="success-500" name="icon-check-medium" style="flex-shrink: 0" />
								<ds-box padding-left="S">
									<ds-text variant="body">{{ $t('billing.basicPlan.item5') }}</ds-text>
								</ds-box>
							</ds-box>
						</ds-box>
						<ds-box align="space-between" flex-type="row" padding-bottom="M">
							<ds-box flex-type="row">
								<ds-icon fill="success-500" name="icon-check-medium" style="flex-shrink: 0" />
								<ds-box padding-left="S">
									<ds-text variant="body">{{ $t('billing.basicPlan.item6') }}</ds-text>
								</ds-box>
							</ds-box>
						</ds-box>
						<ds-box padding-top="M">
							<data-stories-button
								block center variant="primary"
								@click="navigateToExternalUrl('https://www.ataccama.com/contact/sales')">
								{{ $t('billing.basicPlan.button') }}
							</data-stories-button>
						</ds-box>
					</ds-box>
				</ds-col>
				<ds-col class="p-0" cols="12" md="1" xl="1" />
				<ds-col class="p-0" cols="12" md="6" xl="8">
					<ds-box padding-bottom="XL" padding-x="S">
						<ds-text variant="headline2">{{ $t('billing.platformInfo.learnMore') }}</ds-text>
					</ds-box>
					<ds-row no-gutter>
						<ds-col class="p-0" cols="12" xl="4">
							<ds-box padding="S" class="cursor-pointer" @click="navigateToExternalUrl('https://www.ataccama.com/platform/data-catalog')">
								<ds-box
									align="center" border-radius="none" box-shadow="low"
									padding="XL" style="background: white">
									<ds-icon name="data-catalog-m" />
									<ds-text align="center" class="subheadline" variant="subheadlineMedium">
										{{ $t('billing.platformInfo.dataCatalog') }}
									</ds-text>
									<ds-text align="center" color="display-content" no-hyphen variant="paragraph">
										{{ $t('billing.platformInfo.dataCatalogInfo') }}
									</ds-text>
								</ds-box>
							</ds-box>
						</ds-col>
						<ds-col class="p-0" cols="12" xl="4">
							<ds-box padding="S" class="cursor-pointer" @click="navigateToExternalUrl('https://www.ataccama.com/platform/data-quality')">
								<ds-box
									align="center" border-radius="none" box-shadow="low"
									padding="XL" style="background: white">
									<ds-icon name="data-quality-m" />
									<ds-text align="center" class="subheadline" variant="subheadlineMedium">
										{{ $t('billing.platformInfo.dataQuality') }}
									</ds-text>
									<ds-text align="center" color="display-content" no-hyphen variant="paragraph">
										{{ $t('billing.platformInfo.dataQualityInfo') }}
									</ds-text>
								</ds-box>
							</ds-box>
						</ds-col>
						<ds-col class="p-0" cols="12" xl="4">
							<ds-box padding="S" class="cursor-pointer" @click="navigateToExternalUrl('https://www.ataccama.com/platform/data-integration')">
								<ds-box
									align="center" border-radius="none" box-shadow="low"
									padding="XL" style="background: white">
									<ds-icon name="data-integration-m" />
									<ds-text align="center" class="subheadline" variant="subheadlineMedium">
										{{ $t('billing.platformInfo.dataIntegration') }}
									</ds-text>
									<ds-text align="center" color="display-content" no-hyphen variant="paragraph">
										{{ $t('billing.platformInfo.dataIntegrationInfo') }}
									</ds-text>
								</ds-box>
							</ds-box>
						</ds-col>
					</ds-row>

					<ds-box align-y="center" flex-type="row" padding-top="L">
						<ds-box padding="S" padding-right="M">
							<ds-icon name="logo-ataccama" style="width: 32px; height: fit-content;" />
						</ds-box>
						<ds-text variant="body">
							<span
								v-html="$t('billing.platformInfo.visitLink', {
									'url': '<a href=\'https://www.ataccama.com\' target=\'_blank\'>www.ataccama.com</a>'
								})" />
						</ds-text>
					</ds-box>
				</ds-col>
			</ds-row>
		</ds-box>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import DataStoriesButton from '@/components/main/DataStoriesButton.vue';
import DataStoriesBadge from '@/components/main/Badge/DataStoriesBadge.vue';

export default defineComponent({
	name: 'BillingPage',
	components: {
		DataStoriesBadge,
		DataStoriesButton
	},
	setup() {
		const navigateToExternalUrl = (url: string) => {
			window.open(url, '_blank');
		};

		return {
			navigateToExternalUrl
		};
	}
});
</script>

<style scoped>
.subheadline {
	text-decoration: underline;
	padding-bottom: 8px;
}
</style>
