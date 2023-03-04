<template>
	<div class="check-box-wrapper">
		<fa-layers v-if="!outline" class="fa-2x fa-fw check-box m-1" @click.prevent="onClick">
			<fa-icon :icon="['fas', 'square']" class="fas fa-square" />
			<fa-icon v-if="state" :icon="['fal', 'check']" transform="right-3 up-2" />
		</fa-layers>
		<ds-box
			v-else
			flex-type="row"
			align-y="center"
			align="center"
			class="check-box m-1"
			:class="{'disabled-check': disabled}"
			@click.self="onClick">
			<ds-box class="check-cover" :style="disabled ? 'background-color: #E7ECEE;' : !state ? '' : 'width: 0;'" />
			<ds-icon class="check-mark" fill="display-content-700" name="ds-icon-checkmark" />
		</ds-box>
		<div class="hover-effect" />
	</div>
</template>

<script>

export default {
	name: 'DataStoriesCheckBox',
	props: {
		state: {
			type: Boolean,
			required: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		outline: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:state'],
	methods: {
		onClick() {
			this.$emit('update:state', !this.state);
		}
	}
};
</script>

<style lang="scss" scoped>
.check-box-wrapper {
	position: relative;
	width: fit-content;
}
.check-box:not([disabled]):hover + .hover-effect {
	box-shadow: rgb(200 212 218) 0 0 0 4px;
	background-color: rgb(200, 212, 218);
}
.hover-effect {
	display: block;
	z-index: 0;
	position: absolute;
	left: -2px;
	top: -2px;
	width: 28px;
	height: 28px;
	border-radius: 50%;
	transition: 0.12s background-color, 0.12s box-shadow;
 }
.check-box {
	user-select: none;
	cursor: pointer;
	height: 16px;
	width: 16px;
	position: relative;
	z-index: 1;
	border-radius: 2px;
	background-color: map-get($ds-colors, 'white');
	border: 1px solid map-get($ds-colors, 'separate-content-400');
	padding: 3px 2px 3px 2px;
}

.fa-square {
	color: #F0F3FF;
}

.check-cover {
	height: 14px;
	width: 14px;
	position: absolute;
	z-index: 0;
	left: 0;
	background: map-get($ds-colors, 'white');
	transition: width .12s linear;
	border-radius: 2px;
}

.check-mark {
	z-index: -1;
	position: relative;
}

.disabled-check {
	background-color: map-get($ds-colors, 'separate-content-100');
	border-color: map-get($ds-colors, 'separate-content-300');
	cursor: not-allowed;
}

</style>
