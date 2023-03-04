<template>
	<div :class="[fluid ? 'container-fluid' : 'container']">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'AppContainer',
	props: {
		fluid: {
			type: Boolean,
			default: false
		}
	}
};
</script>

<style scoped>

</style>
