<template>
	<div v-bind="$attrs" class="row" :class="{'no-gutters': noGutter}">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'AppRow',
	props: {
		noGutter: {
			defaults: false,
			type: Boolean
		}
	}
};
</script>

<style scoped>

</style>
