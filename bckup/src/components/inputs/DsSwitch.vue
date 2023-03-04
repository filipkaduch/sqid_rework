<template>
	<ds-inline align="center">
		<ds-box v-if="title">
			<ds-text variant="subheadlineMedium">{{ title }}</ds-text>
		</ds-box>
		<ds-box padding-y="XS" flex-type="row" align-y="center">
			<span
				class="toggle-wrapper"
				role="checkbox"
				:aria-checked="value"
				tabindex="0"
				:class="{'disabled': disabled}"
				@click="toggle"
				@keydown.space.prevent="toggle">
				<span
					class="toggle-background"
					:class="{'ds-bg-success-500': value, 'ds-bg-display-content-300': !value, 'toggle-disabled': disabled}" />
				<span
					:class="{'disabled': disabled}"
					class="toggle-indicator"
					:style="indicatorStyles" />
			</span>
		</ds-box>
	</ds-inline>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';

export default defineComponent({
	name: 'DsSwitch',
	props: {
		value: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: null
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update', 'update:value'],
	setup(props, {emit}) {
		const indicatorStyles = computed(() => ({transform: props.value ? 'translateX(100%)' : 'translateX(0)'}));
		const toggle = () => {
			if (!props.disabled) {
				emit('update:value', !props.value);
				emit('update', !props.value);
			}
		};
		return {
			indicatorStyles,
			toggle
		};
	}
});
</script>

<style lang="scss" scoped>
.disabled {
	pointer-events: none;
}
.toggle-disabled {
	background-color: map-get($ds-colors, 'display-content-200');
}
.toggle-wrapper {
	display: inline-block;
	position: relative;
	cursor: pointer;
	width: 36px;
	height: 20px;
	border-radius: 9999px;
}

.toggle-wrapper:focus {
	outline: 0;
}

.toggle-background {
	display: inline-block;
	border-radius: 9999px;
	height: 100%;
	width: 100%;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
	transition: background-color .4s ease;
}

.toggle-indicator {
	position: absolute;
	height: 16px;
	width: 16px;
	left: 2px;
	bottom: 2px;
	background-color: map-get($ds-colors, 'white');
	border-radius: 50%;
	box-shadow:  0 2px 4px rgba(0, 0, 0, 0.1);
	transition: transform .4s ease;
}
</style>
