<template>
	<div
		class="box mt-4 mx-3"
		:class="{'active': current}"
		:data-testid="`theme-${themeIndex}`"
		@click="showChangeThemeModal = true">
		<p class="theme-name">
			{{ $t(headingText) }}
		</p>
		<div class="ml-3">
			<p class="font-preview-l">
				Aa
			</p>
			<p class="font-preview-s">
				Abcd efg
			</p>
		</div>
		<div class="squarebox">
			<div :style="{background: theme.colors.graph[0], borderTopLeftRadius: '.5em'}" />
			<div :style="{background: theme.colors.graph[1], borderTopRightRadius: '.5em'}" />
			<div :style="{background: theme.colors.graph[2], borderBottomLeftRadius: '.5em'}" />
			<div :style="{background: theme.colors.graph[3], borderBottomRightRadius: '.5em'}" />
		</div>
	</div>
	<ds-modal
		:show="showChangeThemeModal"
		:header-text="$t('modals.changeColorThemeTitle', {theme: theme.name})"
		confirmText="modals.changeTheme"
		cancelText="modals.cancel"
		@ok="changeValue"
		@cancel="showChangeThemeModal = false">
		<template #modal-text>
			<ds-text variant="body">
				{{ $t('modals.changeColorTheme', {theme: theme.name}) }}
			</ds-text>
		</template>
	</ds-modal>
</template>

<script>
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';

export default {
	name: 'ThemePicker',
	mixins: [widgetControlComponentMixin],
	props: {
		theme: {
			type: Object,
			default: null
		},
		themeIndex: {
			type: Number,
			default: null
		}
	},
	emits: ['update:theme'],
	widgetControlTypes() {
		return ['widget_control_theme_picker'];
	},
	data() {
		return {
			showChangeThemeModal: false
		};
	},
	computed: {
		value() {
			return this.theme === null
				? (this.$store.getters['widgetInstances/option'](this.widgetInstanceId, this.name) ?? {
					name: 'Fallback theme',
					theme: {
						colors: {
							background: 'rgb(255, 255, 255)',
							graph: [
								'rgb(44, 133, 248)',
								'rgb(44, 133, 248)',
								'rgb(44, 133, 248)',
								'rgb(44, 133, 248)'
							]
						}
					}
				})
				: this.theme;
		},
		current() {
			return this.$store.getters['storyDetail/story']?.layoutConfiguration?.theme.name === this.theme.name;
		}
	},
	methods: {
		changeValue() {
			const {theme} = this;
			theme.recolor = true;
			if (this.theme === null) {
				this.setOption(theme);
			} else {
				this.$emit('update:theme', theme);
			}
			this.showChangeThemeModal = false;
		}
	}
};
</script>

<style scoped>
.box {
	height: 11em;
	border: 2px solid transparent;
	background: #FFFFFF 0 0 no-repeat padding-box;
	box-shadow: 0 1px 5px #00000019;
	cursor: pointer;
}

.active {
	transition-property: border;
	transition-duration: .5s;
	height: 11em;
	background: #FFFFFF 0 0 no-repeat padding-box;
	box-shadow: 0 1px 5px #00000019;
	border: 2px solid #4E75FD;
	border-radius: 5px;
	opacity: 1;
}

.theme-name {
	font-size: 1.2em;
	margin: .7em 0 1em 1em;
	font-weight: 500;
	color: #000000;
}

.font-preview-l {
	font-size: 4em;
	font-weight: bold;
	line-height: 1em;
	margin: 0 0 0 0;
	color: black;
	user-select: none;
}

.font-preview-s {
	font-size: 1.5em;
	font-weight: normal;
	line-height: 1em;
	margin: 0 0 0 0;
	color: black;
	user-select: none;
}

.squarebox {
	top: -60%;
	left: 66%;
	position: relative;
	display: grid;
	grid-template-columns: 3em 3em;
	grid-template-rows: 3em 3em;
}

</style>
