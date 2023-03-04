<template>
	<ds-box border="box" border-radius="basic">
		<ds-text color="display-content">{{ title }}</ds-text>
		<ds-inline no-wrap align-y="center">
			<ds-box
				v-for="toggle in items"
				:key="toggle.value"
				class="toggle ds-bg-white align-center"
				align-y="center"
				border-radius="basic"
				padding="XS"
				:class="{'disabled': disabled}"
				@click="disabled ? null : selected = toggle.value">
				<ds-box align-y="center" class="h-100 w-100 toggle-item" padding="XS" :class="{'selected': toggle.value === selected}">
					<ds-box align-y="center" padding-x="S">
						<ds-text
							v-if="!toggle.icon"
							:color="toggle.value === selected ? 'secondary-600' : 'display-content'"
							variant="bodyMedium"
							align="center"
							class="overflow-ellipsis">
							{{ $t(toggle.label) }}
						</ds-text>
						<ds-box v-else align="center" align-y="center">
							<ds-tooltip>
								<template #icon>
									<ds-icon :fill="toggle.value === selected ? 'secondary-600' : 'display-content'" :name="toggle.icon" />
								</template>
								<template #tooltip>
									<ds-box v-if="toggle.label">
										{{ toggle.label }}
									</ds-box>
								</template>
							</ds-tooltip>
						</ds-box>
					</ds-box>
				</ds-box>
			</ds-box>
		</ds-inline>
	</ds-box>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, onMounted, PropType, reactive, toRefs, watch} from 'vue';
// eslint-disable-next-line no-unused-vars
import {SelectItem} from '@/components/main/Dropdown/types';

export default defineComponent({
	name: 'DataStoriesToggleBar',
	props: {
		default: {
			type: [String, Boolean, Number]
		},
		title: {
			type: String,
			default: ''
		},
		items: {
			type: Array as PropType<SelectItem[]>,
			required: true
		},
		value: {
			type: [String, Boolean, Number]
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ['selected'],
	setup(props, {emit}) {
		const state = reactive({
			selected: props.default ? props.default : typeof props.default === 'boolean' ? props.default : null
		});
		onMounted(() => {
			if (props.value) {
				state.selected = props.value;
			}
		});
		watch(() => state.selected, (newVal, oldVal) => {
			if (newVal !== oldVal && oldVal !== false) {
				emit('selected', newVal);
			}
		});
		watch(() => props.value, (val) => {
			if (val && props.items.find((el) => el.value === val)) {
				state.selected = val;
			}
		});

		return {
			...toRefs(state)
		};
	}
});
</script>

<style lang="scss" scoped>
.toggle {
	height: 34px;
	cursor: pointer;
	user-select: none;
	color: map-get($ds-colors, 'secondary-600');
}
.disabled {
	opacity: 0.6;
	cursor: default;
}
.overflow-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1; /* number of lines to show */
	line-clamp: 1;
	-webkit-box-orient: vertical;
}
.toggle-item:hover:not(.selected):not(.disabled)  {
	background-color: map-get($ds-colors, 'secondary-0');
	border-radius: 2px;
}

.selected{
	background-color: map-get($ds-colors, 'secondary-100');
	border-radius: 2px;
}

.border-selected {
	align-items: center;
	width: 100%;
}
.text-color-inherit {
	color: inherit;
}
.align-center {
	text-align: center;
}
</style>
