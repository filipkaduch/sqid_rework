<template>
	<transition name="slide-fade">
		<div class="position-sticky sidebar-active">
			<div
				class="p-2 m-0 col-resize d-flex align-items-center justify-content-between menu-header-sides no-wrap">
				<div class="title ml-4">
					{{ $t('presenterHeader.tableOfContets') }}
				</div>
				<div>
					<!-- TODO Unhide when we actually need it -->
					<!-- <ds-btn class="p-0 mr-3" variant="secondary" @click="expandedTest = !expandedTest">
						<ds-icon v-if="expandedTest" name="icon-expand" alt="Expand" />
						<ds-icon v-else name="icon-collapse" alt="Collapse" />
					</ds-btn> -->
					<ds-btn
						class="p-0 ml-0 mr-4"
						variant="secondary"
						@click="$emit('sidebar-keep-active')">
						<ds-icon v-if="sidebarActiveKeep" name="icon-dock_open" alt="Open" />
						<ds-icon v-else name="icon-dock_closed" alt="Closed" />
					</ds-btn>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'PresenterNavBarLeftMenu',
	props: {
		sidebarActiveKeep: {
			required: true,
			type: Boolean
		},
		sidebarActive: {
			required: true,
			type: Boolean
		}
	},
	emits: ['sidebar-keep-active'],
	data() {
		return {
			expandedTest: false
		};
	}
};
</script>

<style lang="scss" scoped>

@media (max-width: 1280px) {
	.title {
		font-size: 0.725rem !important;
	}
}

.button-color-base{
	// TODO: to global styles
	background-color: #F6F8F9
}
.sidebar-active {
	z-index: 2500;
}
.title {
	font-size: 17px;
	line-height: 1.75rem;
	background-color: map-get($ds-colors, 'separate-content-0');
	color: map-get($ds-colors, 'display-content');
}

.menu-header-sides {
	border-right: 1px solid map-get($ds-colors, 'separate-content-200');
	white-space: nowrap;
	background-color: map-get($ds-colors, 'separate-content-0');
}

.btn {
	height: 20px;
	background-color: map-get($ds-colors, 'separate-content-0');
	cursor: pointer;
	display: inline-block;
	font-weight: 400;
	text-align: center;
	vertical-align: middle;
	user-select: none;
	font-size: 0.8rem;
	line-height: 1.5;

}
.slide-fade-enter-active {
	transition: all 200ms ease;
}
.slide-fade-leave-active {
	transition: all 100ms cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter-from, .slide-fade-leave-to {
	transform: translateX(10px);
	opacity: 0;
}
.col-resize {
	width: 100%;
}
</style>
