<template>
	<div>
		<span v-if="value.length < 16" class="text-nowrap">
			{{ value }}
		</span>
		<div v-else class="position-relative hovering">
			<span
				class="mx-1 my-xxl-0 my-1 filterLabel"
				style="padding: 2px 4px;"
				@mouseover="hover = true"
				@mouseout="hover = false">
				{{ value.substring(0,16) }}...
			</span>
			<div
				v-if="hover"
				class="mx-1 position-absolute d-flex filterLabel"
				:style="dropDirection === 'bottom' ? '' : 'top: -25px;'"
				style="z-index: 1001;">
				{{ value }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'AppValueResizer',
	props: {
		value: {
			type: String,
			required: true
		},
		dropDirection: {
			type: String,
			default: 'bottom'
		}
	},
	data() {
		return {
			hover: false
		};
	}
};
</script>
