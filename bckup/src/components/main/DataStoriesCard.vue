<template>
	<div class="card">
		<div v-if="$slots.header" class="card-header" :class="headerClass">
			<slot name="header" />
		</div>
		<div class="card-body" :class="bodyClass instanceof Object ? bodyClass : `${bodyClass} ${noBody ? 'm-0 p-0' : ''}`">
			<h4 v-if="title" class="card-title">{{ title }}</h4>
			<slot />
		</div>
		<div v-if="$slots.footer" class="card-footer" :class="`${footerClass}`">
			<slot name="footer" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'DataStoriesCard',
	props: {
		title: {
			type: String,
			default: null
		},
		bodyClass: {
			type: [String, Object],
			default: ''
		},
		headerClass: {
			type: String,
			default: ''
		},
		noBody: {
			type: Boolean,
			default: false
		},
		footerClass: {
			type: String,
			default: ''
		}
	}
};
</script>

<style scoped>
</style>
