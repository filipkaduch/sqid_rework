<template>
	<div
		:class="[
			`col${cols ? `-${cols}` : ''}
			${xxl ? 'col-xxl-' + xxl : ''}
			${xl ? 'col-xl-' + xl : ''}
			${lg ? 'col-lg-' + lg : ''}
			${md ? 'col-md-' + md : ''}
			${sm ? 'col-sm-' + sm : ''}`
		]">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'DataStoriesColumn',
	props: {
		cols: {
			type: [
				Number,
				String
			],
			default: 0
		},
		xxl: {
			type: [
				Number,
				String
			],
			default: null
		},
		xl: {
			type: [
				Number,
				String
			],
			default: null
		},
		lg: {
			type: [
				Number,
				String
			],
			default: null
		},
		md: {
			type: [
				Number,
				String
			],
			default: null
		},
		sm: {
			type: [
				Number,
				String
			],
			default: null
		}
	}
};
</script>

<style scoped>

</style>
