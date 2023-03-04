<template>
	<ds-tooltip>
		<template #icon>
			<div>
				<ds-icon name="icon_info" alt="info" />
			</div>
		</template>
		<template #tooltip>
			<table>
				<tr v-for="row in rows" :key="row.name">
					<th class="text-color pr-4">
						{{ $t(row.name) }}
					</th>
					<th>
						{{ new Date(row.value).toDateString() }}
					</th>
				</tr>
			</table>
		</template>
	</ds-tooltip>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';

export default defineComponent({
	props: {
		lastUpdate: {
			type: Boolean,
			default: true
		},
		created: {
			type: Boolean,
			default: true
		},
		nextUpdate: {
			type: Boolean,
			default: true
		},
		dataset: {
			type: Object,
			default: null
		}
	},
	setup(props) {
		const rows = computed(() => {
			const info = [];
			if (props.lastUpdate) {
				info.push({
					name: 'updated',
					value: props.dataset?.updatedAt
				});
			}
			if (props.nextUpdate) {
				info.push({
					name: 'nextUpdate',
					value: null
				});
			}
			if (props.created) {
				info.push({
					name: 'created',
					value: props.dataset?.createdAt
				});
			}
			return info;
		});
		return {
			rows
		};
	}
});
</script>

<style lang="scss" scoped>
.icon-size {
	font-size: 21px;
}
.text-color {
	color: map-get($ds-colors, 'display-content-400');
}
</style>
