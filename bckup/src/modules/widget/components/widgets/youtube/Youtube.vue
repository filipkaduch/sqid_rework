<template>
	<div :id="playerId" ref="player" />
</template>

<script lang="ts">

import YouTubePlayer from 'youtube-player';
import {defineComponent, PropType} from 'vue';

type boolNumber = 0 | 1;

export interface YoutubeVariables {
	autoplay: string,
	controls: boolNumber,
	rel: boolNumber,
	modestbranding: boolNumber,
	fs: boolNumber
}

export default defineComponent({
	name: 'Youtube',
	props: {
		videoId: {
			type: String,
			required: true

		},
		playerVars: {
			type: Object as PropType<YoutubeVariables>,
			default: () => ({})
		}
	},
	emits: ['ended', 'paused', 'played'],
	data() {
		return {
			playerId: '',
			player: null
		};
	},
	watch: {
		videoId() {
			this.player.loadVideoById(this.videoId);
			this.player.playVideo();
		}
	},
	created() {
		this.playerId = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	},
	mounted() {
		// eslint-disable-next-line new-cap
		this.player = YouTubePlayer(this.playerId, {
			host: 'https://www.youtube.com',
			videoId: this.videoId,
			playerVars: this.playerVars
		});

		this.player.on('stateChange', (evt: any) => {
			if (evt.data === window.YT.PlayerState.ENDED) {
				this.$emit('ended');
			} else if (evt.data === window.YT.PlayerState.PAUSED) {
				this.$emit('paused');
			} else if (evt.data === window.YT.PlayerState.PLAYING) {
				this.$emit('played');
			}
		});
	},
	unmounted() {
		this.player.destroy();
		delete this.player;
	}
});
</script>
