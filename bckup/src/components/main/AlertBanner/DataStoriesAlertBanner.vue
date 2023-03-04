<template>
	<ds-box
		v-if="displayBanner"
		class="w-100 alert-content"
		:class="`ds-bg-${alertStyle.background} ds-border-${alertStyle.border}`"
		flexType="row"
		:padding="padding"
		:align="align">
		<ds-box flex-type="row" :align="align">
			<slot name="badge" />
			<ds-box>
				<slot />
				<ds-text v-if="message" variant="body" :color="alertStyle.text">
					{{ message }}
				</ds-text>
			</ds-box>
		</ds-box>
		<ds-close-button v-if="enableClose" @click="closeBanner" />
	</ds-box>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {computed, ComputedRef, defineComponent, PropType, ref} from 'vue';
// eslint-disable-next-line no-unused-vars
import {ColorVariant, ColorStyle} from '@/components/main/consts/interfaces';
// eslint-disable-next-line no-unused-vars
import {getVariantStyles} from './utils';
import {Align, PositiveSpaceUnit} from '@/components/main/layout/utils/types';
import DsCloseButton from '@/components/main/button/DsCloseButton.vue';


export default defineComponent({
	components: {DsCloseButton},
	props: {
		variant: {
			type: String as PropType<ColorVariant>,
			default: 'success'
		},
		message: {
			type: String,
			default: ''
		},
		align: {
			type: String as PropType<Align>,
			default: 'left'
		},
		padding: {
			type: String as PropType<PositiveSpaceUnit>,
			default: 'L'
		},
		enableClose: {
			type: Boolean,
			default: false
		}
	},
	emits: ['close'],
	setup(props: any, {emit}) {
		const alertStyle: ComputedRef<ColorStyle> = computed(() => getVariantStyles(props.variant));
		const displayBanner = ref(true);

		const closeBanner = () => {
			displayBanner.value = false;
			emit('close');
		};

		return {
			alertStyle,
			displayBanner,
			closeBanner
		};
	}
});
</script>

<style lang="scss" scoped>
.alert-content {
	border-width: 1px;
	border-style: solid;
	align-items: center;
}

</style>
