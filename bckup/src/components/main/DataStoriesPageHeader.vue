<template>
	<ds-box :class="{'sticky-top': sticky}">
		<slot name="banner" />
		<ds-box
			align-y="center"
			padding-x="XL"
			class="ds-bg-white header-height"
			border-bottom="separate">
			<slot />
		</ds-box>
	</ds-box>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
	name: 'DataStoriesPageHeader',
	props: {
		sticky: {
			type: Boolean,
			default: true
		}
	}
});
</script>

<style scoped>
.header-height {
	height: 80px;
}
</style>
