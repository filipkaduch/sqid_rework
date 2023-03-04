<template>
	<div />
</template>

<script>

export default {
	name: 'Hidden',
	props: {
		value: {
			type: Object,
			default: null
		}
	},
	widgetControlTypes() {
		return ['widget_control_hidden'];
	}
};
</script>
