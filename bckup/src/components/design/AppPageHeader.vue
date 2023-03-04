<template>
	<div class="d-flex py-3 page-header align-items-center">
		<div
			:class="{
				'mr-auto': !headingTextCenter,
				'justify-content-start': !headingTextCenter,
				'w-100': headingTextCenter
			}">
			<h2 class="text-page-heading m-0" style="font-size: 24px;" :class="{'text-center': headingTextCenter}">
				<slot name="heading">
					{{ headingText }}
					<span v-if="pills" class="badge badge-badge-primary font-weight-light align-middle" style="font-size: 12px;">{{ pills }}</span>
				</slot>
			</h2>
		</div>
		<div v-if="$slots.actions && !headingTextCenter" class="justify-content-end"><slot name="actions" /></div>
	</div>
</template>

<script>
export default {
	name: 'AppPageHeader',
	props: {
		headingText: {
			type: String,
			default: null
		},
		headingTextCenter: {
			type: Boolean,
			default: false
		},
		pills: {
			type: Number,
			default: null
		}
	}
};
</script>
