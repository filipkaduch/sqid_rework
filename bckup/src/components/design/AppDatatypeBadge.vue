<template>
	<span v-if="filterVariant" class="text-nowrap" :class="noMargin ? 'noMargin' : ''">
		<span class="badge badge-secondary mr-1 py-1 px-1 font-weight-bold" style="background-color: #F1F4FE; color: #1D54EC;">
			{{ $t('t_DatatypeBadge' + datatype) }}
		</span>
		<template v-if="showDatatypeText">{{ $t('t_Datatype' + datatype) }}</template>
	</span>
	<span v-else class="text-nowrap" :class="noMargin ? 'noMargin' : ''">
		<span class="badge badge-primary-inverse mr-2 py-1 px-2 font-weight-bold">
			{{ $t('t_DatatypeBadge' + datatype) }}
		</span>
		<template v-if="showDatatypeText">{{ $t('t_Datatype' + datatype) }}</template>
	</span>
</template>

<script>
export default {
	name: 'AppDatatypeBadge',
	props: {
		datatype: {
			type: String,
			required: true
		},
		showDatatypeText: {
			type: Boolean,
			default: true
		},
		filterVariant: {
			type: Boolean,
			default: false
		},
		noMargin: {
			type: Boolean,
			default: false
		}
	}
};
</script>

<style scoped>
	span {
		margin-left: 5px;
	}

	.noMargin {
		margin-left: 0 !important;
	}
</style>
