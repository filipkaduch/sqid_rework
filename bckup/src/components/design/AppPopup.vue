<template>
	<div class="text-center">
		<button
			v-if="isOneBtnInSection"
			ref="addSectionBtn"
			class="btn rounded-pill"
			:class="`btn-${popupButton.size} btn-${popupButton.variant}`"
			@click="emitButtonClicked(sections[0].buttons[0].widgetType)">
			<fa-icon :icon="sections[0].buttons[0].icon" />{{ $t('t_Add') }} {{ $t('t_' + sections[0].buttons[0].name) }}
		</button>
		<div v-else>
			<ds-collapse :visible="visible" class="mb-1">
				<ds-card class="position-relative" no-body>
					<button type="button" class="close close-icon position-absolute" @click="emitClose">×</button>
					<ds-container class="py-2 ">
						<ds-row v-for="(section, index) in sections" :key="section.title + index">
							<ds-col cols="12" class="text-left">
								<p class="text-muted my-2">{{ $t('t_' + section.title) }}</p>
							</ds-col>
							<ds-col v-for="(button, i) in section.buttons" :key="button.name + i" class="p-0 m-0" :cols="12 / columns">
								<button
									:data-testid="`widget-btn-${index}-${i}`"
									class="btn btn-popup btn-square btn-block text-left m-0"
									@click="emitButtonClicked(button.widgetType)">
									<fa-icon v-if="button.icon" class="ml-2 mr-3" :icon="button.icon" fixed-width />
									<ds-icon
										v-else
										class="inline-svg ml-2 mr-3"
										style="font-size: 1.2rem; width: 1.25em;"
										fill="interaction-400"
										:name="button.widgetType" />
									{{ $t(`widgetTypes.${button.widgetType}_title`) }}
								</button>
							</ds-col>
						</ds-row>
					</ds-container>
				</ds-card>
			</ds-collapse>
			<button
				class="btn border mt-2"
				:class="`btn-${popupButton.size} btn-${popupButton.variant}`"
				style="color: #2D3038;"
				@click="emitBtnClick">
				<fa-icon :icon="popupButton.icon" style="color:#AAABAE;" />{{ $t('t_Add') }} {{ $t('t_' + popupButton.title) }}
			</button>
		</div>
	</div>
</template>

<script>

export default {
	name: 'AppPopup',
	inject: ['appConfig'],
	props: {
		columns: {
			type: Number,
			validator: (value) => value > 0 && value < 5,
			default: 2
		},
		sections: {
			type: Array,
			required: true
		},
		popupButton: {
			type: Object,
			default: () => ({
				variant: 'add-section',
				title: 'section',
				size: 'lg',
				icon: [
					'fas',
					'plus'
				]
			})
		},
		visible: {
			type: Boolean,
			required: true
		},
		creatingSection: {
			type: Boolean,
			default: false
		}
	},
	emits: ['clicked', 'btn-popup-click', 'close'],
	data() {
		return {
			widgetBaseUrl: this.appConfig?.widget?.baseUrl ?? '/'
		};
	},
	computed: {
		isOneBtnInSection() {
			return this.sections.length === 1 && this.sections[0].buttons.length === 1;
		}
	},
	methods: {
		emitButtonClicked(eventName) {
			if (!this.creatingSection) {
				this.$emit('clicked', eventName);
			}
		},
		emitBtnClick() {
			this.$emit('btn-popup-click');
		},
		emitClose() {
			this.$emit('close');
		}
	}
};
</script>

<style lang="scss" scoped>
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins/gradients";
@import "~bootstrap/scss/mixins/box-shadow";
@import "~bootstrap/scss/mixins/hover";
@import "~bootstrap/scss/mixins/buttons";

.btn-popup {
	@include button-variant(white, #F4F6F8);
	color: black;
	border: none;

	&:hover:not(:disabled):not(.disabled),
	&:active:not(disabled):not(.disabled),
	&.active:not(disabled):not(.disabled) {
		color:#2D3038 !important;
	}
}

.btn-add-section {
	@include button-variant(white, #6150FF);

	border: none;
	color: #6150FF;

	box-shadow: 0 1px 5px #0000001F;

	&:active {
		color: #2D3038 !important;
	}
	&:focus {
		box-shadow: 0 1px 5px #0000001F !important;
	}
	&:hover {
		color: #6150FF;
	}
}

.card:after {
	content: "";
	width: 10px;
	height: 10px;
	transform: rotate(-45deg);
	background: #fff;
	border-bottom: 1px solid rgba(0, 0, 0, 0.125);
	border-left: 1px solid rgba(0, 0, 0, 0.125);
	position: absolute;
	z-index: 0;
	bottom: -5px;
	left: calc(50% - 5px);
}

#popup-button {
	width: 40rem;
	margin-bottom: 0.5rem;
}
.close-icon {
	right: 0.5rem;
	top: 0.5rem;
	cursor: pointer;
	z-index: 1;
}
.inline-svg {
	.a, .b {
		fill: currentColor !important;
	}
}
</style>

