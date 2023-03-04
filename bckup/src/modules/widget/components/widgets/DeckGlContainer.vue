<template>
	<div
		class="h-100 widget-padding py-0"
		:class="[readOnly ? 'custom-padding' : haveTimeline ? 'pb-5' : 'pb-0']">
		<div ref="container" class="deckgl-container height-transition" />
	</div>
</template>

<script>
export default {
	name: 'DeckGlContainer',
	props: {
		haveTimeline: {
			type: Boolean,
			default: false
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	}
};
</script>

<style scoped>
.height-transition {
	transition: height .7s ease-out;
}
.deckgl-container {
	width: 100%;
	height: 100%;
}

.custom-padding {
	padding-bottom: 10vh !important;
}
</style>
