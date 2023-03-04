<template>
	<tr>
		<td v-for="column in columns" :key="`${column}-${index}`">
			<div class="d-flex align-items-center">
				<span>{{ format(types[column]) }}{{ item[column] }}</span>

				<div class="flex-grow-1" />

				<save-cell
					:field="column"
					:index="index"
					:saved="savedCells"
					:initial-name="savedCells[`${column}_${index}`]"
					@cell:save="saveCell"
					@cell:remove="removeCell" />
			</div>
		</td>
	</tr>
</template>

<script>
export default {
	name: 'AppDataGridRow',
	props: {
		columns: {
			type: Array,
			required: true
		}
	}
};
</script>
