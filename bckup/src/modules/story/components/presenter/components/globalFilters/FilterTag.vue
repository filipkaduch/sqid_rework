<template>
	<div class="filter-tag position-relative d-inline-flex">
		<div class="filter-label">
			{{ (operation ? operation + ' ' : '') + value }}
		</div>
		<div
			v-if="deletable"
			class="d-flex align-items-center justify-content-center position-absolute delete-btn p-0 cursor-pointer"
			@click="$emit('remove-filter')">
			<ds-icon name="icon-close-white" alt="Remove" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'FilterTag',
	props: {
		operation: {
			type: String,
			default: null
		},
		value: {
			type: [
				String,
				Array
			],
			required: true
		},
		deletable: {
			type: Boolean,
			default: false
		}
	},
	emits: ['remove-filter']
};
</script>

<style lang="scss" scoped>
.filter-tag:hover {
	.delete-btn {
		opacity: 100;
	}
	.filter-label {
		background: map-get($ds-colors, 'secondary-700');
	}
}
.filter-label {
	transition: all 200ms ease-out;
	display: inline-flex;
	align-items: center;
	height: 22px;
	font-size: 12px;
	font-weight: 500!important;
	background: map-get($ds-colors, 'secondary');
	padding: 3px 8px;
	color: white;
	border-radius: 2px;
}

.delete-btn {
	transition: all 200ms ease-out;
	opacity: 0;
	color: white;
	background-color: map-get($ds-colors, 'secondary-700');
	top: 1px;
	right: 1px;
	width: 20px;
	height: 20px;
	border-radius: 0 1px 1px 0;
}

.delete-btn:hover {
	background-color: map-get($ds-colors, 'secondary-400');
}

</style>
