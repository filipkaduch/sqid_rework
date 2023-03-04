<template>
	<div class="ds-btn-group">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'DataStoriesButtonGroup'
};
</script>

<style lang="scss" scoped>
.ds-btn-group > ::v-deep(button:nth-child(n):not(:first-child):not(:last-child)) {
	border-left: 0;
	border-radius: 0;
}

.ds-btn-group > ::v-deep(button:first-child:not(:last-child)) {
	border-bottom-right-radius: 0;
	border-top-right-radius: 0;
}

.ds-btn-group > ::v-deep(button:last-child:not(:first-child)) {
	border-left: 0;
	border-bottom-left-radius: 0;
	border-top-left-radius: 0;
}
</style>
