<template>
	<component v-bind="$attrs" :is="component" />
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
export default {
	name: 'DataStoriesComponentWrapper',
	props: {
		componentName: {
			type: String,
			required: true
		}
	},
	computed: {
		component() {
			return cloneDeep(this.$store.getters['dependencies/dependency'](this.componentName));
		}
	}
};
</script>
