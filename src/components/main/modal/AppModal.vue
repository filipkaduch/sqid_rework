<template>
	<transition
		name="modal"
		@before-enter="$emit('show')"
		@after-enter="$emit('shown')"
		@after-leave="$emit('hidden')">
		<div v-if="show" class="modal-wrapper">
			<div class="modal-mask" @click="$emit('cancel')" />
			<div ref="modalTarget" class="modal-container" :style="{left: `calc(50% - ${width / 2}px)`, top: `calc(50% - ${height / 2}px)`}">
				<app-box
					class="app-bg-white"
					:class="`app-modal-${size}`"
					border-radius="basic">
					<app-box
						class="app-bg-separate-content-100 top-radius"
						padding-x="L" padding-y="M" flex-type="row"
						align="space-between">
						<app-box padding-y="XS">
							<app-text color="display-content-700" variant="subheadlineMedium">
								<slot name="modal-title">
									{{ $t(headerText) }}
								</slot>
							</app-text>
						</app-box>
						<app-box class="cursor-pointer" padding-y="XS" @click="$emit('cancel')">
							<app-icon name="app-icon-close" alt="close" color="display-content" />
						</app-box>
					</app-box>
					<app-box padding="L">
						<app-text>
							<slot name="modal-text" />
						</app-text>
					</app-box>
					<app-box v-if="!hideFooter" padding="L" border-top="separate">
						<slot name="modal-footer">
							<app-inline class="m-0">
								<app-box v-if="confirmText" padding-right="M">
									<app-btn variant="secondary" data-testid="modal-yes" :disabled="!confirmEnabled" @click="$emit('ok')">
										{{ $t(confirmText) }}
									</app-btn>
								</app-box>
								<app-btn variant="secondary" @click="$emit('cancel')">
									{{ $t(cancelText) }}
								</app-btn>
							</app-inline>
						</slot>
					</app-box>
				</app-box>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
import {defineComponent, ref, PropType} from 'vue';
import {useElementSize} from '@vueuse/core';

type ModalSize = 'sm' | 'md' | 'lg';

export default defineComponent({
	name: 'AppModal',
	props: {
		show: {
			type: Boolean,
			default: false
		},
		headerText: {
			type: String,
			default: null
		},
		size: {
			type: String as PropType<ModalSize>,
			default: 'sm'
		},
		confirmText: {
			type: String,
			default: 'Yes'
		},
		cancelText: {
			type: String,
			default: 'No'
		},
		confirmEnabled: {
			type: Boolean,
			default: true
		},
		hideFooter: {
			type: Boolean,
			default: false
		}
	},
	emits: ['cancel', 'ok', 'hidden', 'hide', 'show', 'shown'],
	setup(props) {
		const modalTarget = ref(null);
		// @ts-ignore
		const {width, height} = useElementSize(modalTarget);
		return {
			modalTarget,
			width,
			height
		};
	}
});
</script>

<style scoped>
.modal-wrapper {
	position: fixed;
	height: 100%;
	width: 100%;
	z-index: 9997;
	transition: none;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
	transition: none!important;
	position: fixed;
	z-index: 9999;
	filter: drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.1));
}
.app-modal-sm {
	width: 300px !important;
}
.app-modal-md {
	width: 600px !important;
}
.app-modal-lg {
	width: 800px !important;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}
.modal-wrapper {
	transition: all 0.3s ease;
}
.modal-enter-from .modal-wrapper,
.modal-leave-to .modal-wrapper {
	.modal-container {
		-webkit-transform: scale(1.1);
		transform: scale(1.1);
	}
}

.top-radius {
	border-radius: 4px 4px 0 0;
}
</style>
