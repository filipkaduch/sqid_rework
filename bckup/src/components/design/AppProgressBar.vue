<template>
	<ds-inline align-y="center" align="space-between" no-wrap class="w-100">
		<ds-text
			:class="text === null ? 'd-none' : 'w-25'"
			class="pl-2 text-ellipsis pr-1"
			color="secondary-400">
			{{ dynamicText }}<span class="small-info">{{ totalText }}</span>
		</ds-text>
		<ds-box :class="getClass" class="progress-bar">
			<div class="progress" :style="{width: value + '%'}" />
		</ds-box>
	</ds-inline>
</template>

<script>
import {defineComponent, computed} from 'vue';

export default defineComponent({
	name: 'AppProgressBar',
	props: {
		value: {
			type: Number,
			required: true
		},
		hideProgress: {
			type: Boolean,
			default: false
		},
		totalText: {
			type: String,
			default: null
		},
		dynamicText: {
			type: [String, Number],
			default: null
		},
		text: {
			type: Object,
			default: null
		}
	},
	setup(props) {
		const getClass = computed(() => props.text === null ? `w-100 ${props.hideProgress ? 'd-none' : ''}` : `w-75 ${props.hideProgress ? 'd-none' : ''}`);
		return {
			getClass
		};
	}
});
</script>

<style lang="scss" scoped>
	.progress-bar {
		height: 6px;
		background-color: map-get($ds-colors, 'separate-content-100');
		.progress {
			height: 100%;
			background-color: map-get($ds-colors, 'secondary-400');
		}
	}

	.text-ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.small-info {
		color: map-get($ds-colors, 'separate-content-400') !important;
	}

</style>
