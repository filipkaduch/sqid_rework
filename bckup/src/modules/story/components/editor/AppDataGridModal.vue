<template>
	<ds-modal
		:show="showModal"
		size="lg"
		@cancel="$emit('closeModal')">
		<template #modal-title>
			<h6 style="font-size: 17px; background-color: #F4F6F8;" class="m-0">
				<strong>{{ $t('t_dataPreview') }}</strong>
			</h6>
		</template>
		<template #modal-text>
			<app-data-grid :widget-instance-id="widgetInstanceId" />
		</template>
		<template #modal-footer>
			<ds-btn variant="secondary" @click="$emit('closeModal')">
				{{ $t('ok') }}
			</ds-btn>
		</template>
	</ds-modal>
</template>

<script>
import AppDataGrid from '@/components/design/datagrid/AppDataGrid.vue';

export default {
	name: 'AppDataGridModal',
	components: {
		AppDataGrid
	},
	props: {
		showModal: {
			type: Boolean,
			default: false
		},
		widgetInstanceId: {
			type: String,
			required: true
		}
	},
	emits: ['closeModal']
};
</script>
