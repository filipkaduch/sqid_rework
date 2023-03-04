<template>
	<app-loading :loading="loadMoreLoading">
		<div class="my-2 text-center">
			<button
				:disabled="!loadMoreEnabled"
				class="btn btn-secondary rounded-pill btn-icon"
				@click="$emit('loadMore')">
				<fa-icon :icon="['fas', 'angle-double-down']" />
			</button>
		</div>
	</app-loading>
</template>

<script>
import AppLoading from '@/components/design/AppLoading.vue';

export default {
	name: 'AppLoadMoreButton',
	components: {AppLoading},
	props: {
		loadMoreLoading: {
			type: Boolean,
			required: true
		},
		loadMoreEnabled: {
			type: Boolean,
			default: true
		}
	},
	emits: ['loadMore']
};
</script>
