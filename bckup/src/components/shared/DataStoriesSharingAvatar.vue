<template>
	<ds-tooltip>
		<template #icon>
			<ds-avatar
				bg-color="primary-100"
				text-color="primary"
				class="text-uppercase"
				:text="text" />
		</template>
		<template #tooltip>
			<p>{{ $t('sharedBy') }} {{ firstName }} {{ lastName }}</p>
		</template>
	</ds-tooltip>
</template>

<script>
import DsAvatar from '@/components/main/DataStoriesAvatar.vue';
import {computed, defineComponent} from 'vue';

export default defineComponent({
	components: {
		DsAvatar
	},
	props: {
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const text = computed(() => `${props.firstName.charAt(0)}${props.lastName.charAt(0)}`);
		return {
			text
		};
	}
});
</script>

<style scoped>

</style>
