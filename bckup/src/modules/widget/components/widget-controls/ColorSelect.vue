<template>
	<div>
		<div v-if="headingText" class="d-flex">
			<span style="color: #000000; font-size: 1rem">
				{{ $t(headingText) }}
			</span>
		</div>
		<div class="squarebox">
			<template v-for="index in graph.length" :key="index">
				<div
					:class="{'active': current(index), 'inactive': !current(index)}"
					:style="{background: graph[index - 1]}"
					@click="$emit('update:value', index - 1)" />
			</template>
			<div
				v-if="rainbow"
				class="squarebox-s"
				:class="{'active': current('rainbow'), 'inactive': !current('rainbow')}"
				@click="$emit('update:value', 'rainbow')">
				<div :style="{background: graph[0]}" />
				<div :style="{background: graph[1]}" />
				<div :style="{background: graph[2]}" />
				<div :style="{background: graph[3]}" />
			</div>
		</div>
	</div>
</template>

<script>
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';

export default {
	name: 'ColorSelect',
	mixins: [widgetControlComponentMixin],
	props: {
		rainbow: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:value'],
	widgetControlTypes() {
		return ['widget_control_color_select'];
	},
	computed: {
		graph() {
			return this.$store.getters['storyDetail/story'].layoutConfiguration.theme.colors.graph;
		},
		color() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'color') ?? 0;
		}
	},
	methods: {
		current(index) {
			const rainbow = 'rainbow';
			if (index - 1 === this.color) {
				return true;
			}
			return rainbow === index && this.color === rainbow;
		}
	}
};
</script>

<style scoped>
.squarebox {
	display: grid;
	grid-template-columns: repeat(7, 3em);
	grid-auto-rows: 3em;
	grid-gap: .3em;
}

.squarebox-s {
	display: flex;
	width: 3em;
	height: 3em;
	flex-wrap: wrap;
	overflow: hidden;
}

.squarebox-s div {
	width: 50%;
	height: 50%;
}

.active {
	height: 3em;
	box-shadow: 0 1px 5px #00000019;
	border: 2px solid #4E75FD;
	border-radius: 5px;
	opacity: 1;
	cursor: pointer;
}

.inactive {
	border-radius: 5px;
	box-shadow: 0 1px 5px #00000019;
	cursor: pointer;
}
</style>
