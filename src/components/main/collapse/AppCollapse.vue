<template>
  <collapse :when="showContent" class="collapse-transition">
    <slot />
  </collapse>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from 'vue';
import {Collapse} from 'vue-collapsed';

export default defineComponent({
  name: 'AppCollapse',
	components: {Collapse},
	props: {
		isOpen: {
			type: Boolean,
			default: false
		},
		visible: {
			type: Boolean,
			default: false
		}
	},
	setup(props) {
		const isInitialShow = ref(true);
		watch(() => props.isOpen, () => {
			isInitialShow.value = false;
		});
		const showContent = computed(() => props.isOpen || (props.visible && isInitialShow.value));
		return {
			isInitialShow,
			showContent
		};
	}
});
</script>

<style lang="scss">
.collapse-transition {
	transition: height 350ms ease;
}
</style>
