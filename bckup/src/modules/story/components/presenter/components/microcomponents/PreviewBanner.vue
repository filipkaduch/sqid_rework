<template>
	<div v-if="!isPublicRoute && showWarn" class="preview-warn" :class="isDashboard ? 'top-0' : 'top-visual-story'">
		<div class="position-relative">
			<p><b class="font-weight-bolder">{{ $t('warnings.preview.mode') }}</b> {{ $t('warnings.preview.warn') }}</p>
			<button type="button" class="position-absolute close close-icon button-position" @click="showWarn = false" @touchend="showWarn = false">×</button>
		</div>
	</div>
</template>

<script>
import {
	publicRouteName,
	publicRouteNameDashboard,
	restricted,
	restriced,
	restrictedDashboard, restrictedDashboardVertical, publicRouteNameDashboardVertical
} from '@/modules/story/components/presenter/consts';

export default {
	name: 'PreviewBanner',
	props: {
		isDashboard: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			showWarn: true
		};
	},
	computed: {
		isPublicRoute() {
			const publicRoutes = [publicRouteName, restricted, restriced, restrictedDashboard, restrictedDashboardVertical, publicRouteNameDashboard, publicRouteNameDashboardVertical];
			return publicRoutes.includes(this.$route.name);
		}
	}
};
</script>

<style lang="scss" scoped>
.preview-warn {
	position: absolute;
	color: map-get($ds-colors, 'warning-600');
	background: map-get($ds-colors, 'warning-100');
	width: 100vw;
	height: 36px;
	text-align: center;
	line-height: 36px;
	z-index: 999;
}

.top-visual-story {
	top: 52px;
}

.button-position {
	right: 26px;
	top: 8px;
}
</style>
