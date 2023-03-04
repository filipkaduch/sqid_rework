<template>
	<div>
		<span
			v-if="original"
			class="p-2 switch-bar pull-right"
			:class="{'switch-bar-enabled': enabled, 'switch-bar-disabled': !enabled}"
			@click="onClick">
			<span
				v-if="leftSide"
				class="switch-bar-option py-2"
				:class="{'switch-bar-option-active': !state}">
				<fa-icon v-if="leftSide.icon" :icon="leftSide.icon" class="mr-2" />{{ leftSide.label }}
			</span>

			<fa-icon
				class="switch-bar-icon mx-2"
				:class="{'fa-rotate-180': !state}"
				:icon="['fad', 'toggle-on']" />

			<span
				v-if="rightSide"
				class="switch-bar-option py-2"
				:class="{'switch-bar-option-active': state}">
				<fa-icon v-if="rightSide.icon" :icon="rightSide.icon" class="mr-2" />{{ rightSide.label }}
			</span>
		</span>
		<div v-else>
			<ds-row align-h="between" class="px-0 mx-0">
				<ds-col class="px-0 options-grey-style">
					<span>
						{{ $t(switchText) }}
					</span>
				</ds-col>
				<ds-col class="px-0 mx-0 text-right">
					<div class="custom-control custom-switch b-custom-control-lg mx-0 switch-left">
						<input
							v-model="stacked"
							:disabled="disabled"
							type="checkbox"
							class="custom-control-input">
					</div>
					<div class="custom-control custom-switch b-custom-control-lg mx-0 switch-left">
						<input
							v-model="stacked"
							:disabled="disabled"
							type="checkbox"
							class="custom-control-input mx-0"
							@change="setState">
					</div>
				</ds-col>
			</ds-row>
		</div>
	</div>
</template>

<script>
export default {
	name: 'AppSwitchBar',
	props: {
		leftSide: {
			type: Object,
			default: null
		},
		rightSide: {
			type: Object,
			default: null
		},
		enabled: {
			type: Boolean,
			default: true
		},
		state: {
			type: Boolean,
			default: false
		},
		original: {
			type: Boolean,
			default: false
		},
		switchText: {
			type: String,
			required: true
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:state'],
	data() {
		return {
			stacked: this.state
		};
	},
	methods: {
		onClick() {
			this.$emit('update:state', this.enabled && !this.state);
		},
		setState() {
			this.$emit('update:state', !this.stacked);
		}
	}
};
</script>

<style scoped lang="scss">
.switch-bar {
  user-select: none;
}
.switch-bar-enabled {
  color: get-value($ts-theme-colors, 'secondary', 'text');
  cursor: pointer;
}
.switch-bar-disabled {
  color: $text-muted;
}
.switch-bar-enabled .switch-bar-option:not(.switch-bar-option-active) {
  color: get-value($ts-theme-colors, 'secondary', 'text');
}
.switch-bar-enabled .switch-bar-option.switch-bar-option-active {
  color: $brand-color;
}

.switch-bar-icon {
  font-size: 2rem;
  vertical-align: -20%;
}
.switch-bar-enabled .switch-bar-icon {
  --fa-primary-color: #{get-value($ts-theme-colors, 'primary', 'text')};
  --fa-secondary-color: #{get-value($ts-theme-colors, 'primary', 'background')};
  --fa-primary-opacity: 1;
  --fa-secondary-opacity: 1;
}
</style>
