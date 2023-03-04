<template>
	<ds-box padding-left="M">
		<ds-inline align-y="center" gap="S" no-wrap>
			<ds-text color="display-content">{{ $t('t_noOfValuesToShow') }}</ds-text>
			<ds-tooltip>
				<template #icon>
					<div>
						<ds-icon fill="display-content-300" name="ds-icon-info" />
					</div>
				</template>
				<template #tooltip>
					{{ $t('t_noOfValuesToShowTooltip') }}
				</template>
			</ds-tooltip>
			<ds-box padding-right="M">
				<ds-inline-item :width="136">
					<ds-input
						v-model:value="topNValues"
						width="136px"
						type="number"
						:min="1"
						debounce />
				</ds-inline-item>
			</ds-box>
		</ds-inline>
	</ds-box>
</template>

<script lang="ts">
import {defineComponent, ref, Ref, watch} from 'vue';

export default defineComponent({
	name: 'Limit',
	props: {
		limit: {
			type: Number,
			default: 10
		}
	},
	emits: ['update:value'],
	setup(props, {emit}) {
		const topNValues: Ref<number> = ref(props.limit);

		watch(topNValues, (val) => {
			emit('update:value', val);
		});
		watch(() => props.limit, (val) => {
			if (val !== topNValues.value) {
				topNValues.value = val;
			}
		});

		return {
			topNValues
		};
	}
});

</script>

<style scoped>

</style>
