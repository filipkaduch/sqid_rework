<template>
	<ds-box
		align-y="center"
		align="center"
		border-radius="basic"
		border="disabled"
		class="ds-bg-display-content-0 empty-story-card">
		<ds-box padding-bottom="S">
			<ds-text variant="headline1" color="display-content-700">
				{{ $t(`emptyStates.${type}.noContent`) }}
			</ds-text>
		</ds-box>
		<ds-text align="center" color="display-content-400" class="empty-text-container">
			{{ $t(`emptyStates.${type}.needToUploadDataset`) }}
		</ds-text>
		<ds-box padding-top="L">
			<ds-btn variant="primary" @click="createStory">
				{{ $t(`emptyStates.${type}.createNew`) }}
			</ds-btn>
		</ds-box>
	</ds-box>
</template>

<script>

export default {
	name: 'AppNewStoryCard',
	props: {
		storyType: {
			type: String,
			default: 'all'
		}
	},
	computed: {
		type() {
			return this.storyType ? this.storyType : 'all';
		}
	},
	methods: {
		createStory() {
			this.$router.push({name: 'create-story'});
		}
	}
};
</script>

<style scoped>
.empty-story-card {
	height: 400px;
}
.empty-text-container {
	max-width: 250px;
}
</style>
