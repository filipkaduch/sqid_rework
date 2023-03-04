<template>
	<div
		class="mx-0 mb-0 mt-4 p-0 col-12 section-wrapper">
		<ds-btn
			variant="ghost"
			class="w-100 h-100 m-0 p-0 bg-white border-5"
			@click="toggleCollapse">
			<span class="d-flex justify-content-between align-items-center">
				<span class="d-inline-flex align-items-center p-2 control-banner-font">
					<span class="icon-style">
						<slot name="icon" />
					</span>
					{{ title }}
				</span>
			</span>
			<template #rightIcon>
				<ds-box padding-right="S">
					<fa-icon class="chevron-size" :icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']" />
				</ds-box>
			</template>
		</ds-btn>
		<ds-collapse :is-open="collapse" class="w-100 mt-1 pb-2 pl-3 pr-3 bg-white">
			<slot />
		</ds-collapse>
	</div>
</template>

<script>
export default {
	name: 'AppSectionControlsWrapper',
	props: {
		title: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			collapse: false
		};
	},
	methods: {
		toggleCollapse() {
			this.collapse = !this.collapse;
		}
	}
};
</script>

<style scoped>
/*TODO: tp- refactor all the controls section to this wrapper and normalise styles*/
.icon-style {
	border-radius: 50%;
	background-color: #D3E0FC;
	height: 35px;
	width: 35px;
	color: #1357E9;
	padding: 8px;
	justify-content: center;
	display: inline-flex;
	margin-right: 5px
}
.chevron-size {
	height: 19.2px;
	width: 17px;
}
.section-wrapper {
	border-radius: 5px; box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15); background-color: white
}
.control-banner-font {
	color: #2D3038; font-size: 17px; font-weight: bold;
}
</style>
