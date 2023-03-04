<template>
	<ds-col cols="12" class="m-0 p-0 chart-col">
		<button
			class="btn btn-charts chart-btn btn-square btn-block btn-lg d-flex justify-content-start m-0 py-3 px-4"
			@click="isOpen = !isOpen">
			<fa-icon v-if="icon" :icon="['fad', 'alias-' + icon]" class="icon-width mr-2 text-primary" />
			<strong>{{ $t(title).toUpperCase() }}</strong>
			<fa-icon class="ml-auto mr-0 arrow-color" :icon="isOpen ? ['far', 'angle-up'] : ['far', 'angle-down']" />
		</button>
		<ds-collapse :is-open="isOpen">
			<button
				v-for="widget in widgets"
				:key="'widget' + widget.wtuid"
				:data-testid="`dashboard-widget-${widget.wtuid}`"
				class="btn btn-charts btn-square btn-block btn-lg chart-btn d-flex justify-content-start m-0 py-2 px-4"
				@click="$emit('create', widget.wtuid)">
				<ds-icon class="icon-width ml-3" fill="interaction-400" :name="icons[widget.wtuid]" />
				<span class="pl-3 text-left">
					{{ $t(widget.tkTitle) }}
				</span>
			</button>
		</ds-collapse>
	</ds-col>
</template>

<script>
export default {
	name: 'AppWidgetGroup',
	props: {
		icon: {
			type: String,
			default: null
		},
		icons: {
			type: Object,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		widgets: {
			type: Array,
			required: true
		},
		open: {
			type: Boolean,
			required: false
		}
	},
	emits: ['create'],
	data() {
		return {
			isOpen: false
		};
	},
	mounted() {
		if (this.open === true) {
			this.isOpen = true;
		}
	}
};
</script>

<style scoped>
.chart-btn {
	font-size: 14px!important;
}

.chart-col {
	border-top: 1px solid #E2E7EB;
	border-bottom: 1px solid #E2E7EB;
}
.icon-height {
	min-height: 20px;
	height: 20px;
}

.icon-width {
	min-width: 20px;
	width: 20px;
}

.arrow-color {
	color: #AAABAE;
}
</style>
