<template>
	<ds-tooltip>
		<template #icon>
			<ds-box
				align="center"
				align-y="center"
				padding-x="XS"
				border-radius="big"
				class="ds-bg-separate-content-100">
				<ds-text variant="caption" color="display-content">
					{{ text }}
				</ds-text>
			</ds-box>
		</template>
		<template v-if="toolTip" #tooltip>
			{{ $t(toolTip) }}
		</template>
	</ds-tooltip>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
	name: 'DataStoriesBadgeRounder',
	props: {
		text: {
			type: [Number, String],
			required: true
		},
		toolTip: {
			type: String,
			default: null
		}
	}
});
</script>

<style scoped>

</style>
