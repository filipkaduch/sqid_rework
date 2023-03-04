<template>
	<router-view v-if="appConfig?.explorer" />
</template>

<script>
import {inject} from 'vue';

export default {
	name: 'Main',
	setup() {
		return {
			appConfig: inject('appConfig')
		};
	}
};
</script>
