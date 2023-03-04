<template>
	<div :class="[fluid ? 'container-fluid' : 'container']">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'DataStoriesContainer',
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
