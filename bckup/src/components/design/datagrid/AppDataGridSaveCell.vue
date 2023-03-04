<template>
	<ds-dropdown :disabled="disabled">
		<template #triggerContent>
			<button class="btn" :class="['btn-' + variant]">
				<fa-icon class="m-0" icon="thumbtack" />
			</button>
		</template>

		<template #dropdownContent>
			<div class="p-3" style="width: 400px">
				<div class="form-group">
					{{ $t('t_Name') }}
					<ds-input v-model:value="input" type="text" />
				</div>
				<button class="btn btn-secondary" :class="{disabled: !input}" @click.prevent="saveCell">{{ $t('t_SaveCell') }}</button>
				<button class="btn btn-secondary" @click.prevent="removeCell">{{ $t('t_RemoveCell') }}</button>
			</div>
		</template>
	</ds-dropdown>
</template>

<script>
export default {
	name: 'AppDataGridSaveCell',
	props: {
		name: {
			type: String,
			default: ''
		},
		saved: {
			type: Object,
			default: () => ({})
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ['cell:save', 'cell:remove'],
	data() {
		return {
			input: ''
		};
	},
	computed: {
		isSaved() {
			return Boolean(this.name);
		},
		variant() {
			return `clean m-0 custom-cell ${this.isSaved ? 'visible' : ''}`;
		}
	},
	watch: {
		name: {
			immediate: true,
			handler(name) {
				this.input = name;
			}
		}
	},
	methods: {
		saveCell() {
			this.$emit('cell:save', this.input);
		},
		removeCell() {
			this.$emit('cell:remove');
		}
	}
};
</script>

<style lang="scss">
.custom-cell {
	visibility: hidden;
}

td:hover .custom-cell {
	visibility: visible;
}
</style>
