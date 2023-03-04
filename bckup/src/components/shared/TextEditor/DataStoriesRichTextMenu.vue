<template>
	<ds-btn-group v-if="editor" class="ds-rich-editor-menu position-fixed" :class="`rich-editor-menu-${widgetInstanceId}`">
		<ds-btn-group class="mr-1 ds-btn-grp d-flex">
			<ds-tooltip container=".ds-rich-editor-menu" placement="bottom">
				<template #icon>
					<ds-btn
						class="m-0 border-radius-right-0"
						:class="{'is-active': editor.isActive('bold')}"
						variant="secondary"
						icon-only
						@click="editApply('toggleBold')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'bold']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnBold') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-0"
						:class="{'is-active': editor.isActive('italic')}"
						variant="secondary"
						icon-only
						@click="editApply('toggleItalic')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'italic']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnItalic') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-0"
						:class="{'is-active': editor.isActive('underline')}"
						variant="secondary"
						icon-only
						@click="editApply('toggleUnderline')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'underline']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnUnderline') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-0"
						:class="{'is-active': editor.isActive('strike')}"
						variant="secondary"
						icon-only
						@click="editApply('toggleStrike')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'strikethrough']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnStrikeThrough') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-0"
						:class="{'is-active': editor.isActive('code')}"
						variant="secondary"
						icon-only
						@click="editApply('toggleCode')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'terminal']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnMonospaced') }}
				</template>
			</ds-tooltip>

			<ds-dropdown placement="bottom" :container="`.editor-content-${widgetInstanceId}`">
				<template #triggerContent>
					<ds-tooltip container=".ds-rich-editor-menu" :disabled="subMenus.fontSizeActive">
						<template #icon>
							<ds-btn
								class="m-0 position-relative border-left-0 border-radius-0"
								variant="secondary"
								width="auto"
								padding-x="S"
								padding-y="S"
								@click="toggleMenu('fontSizeActive')">
								<fa-icon class="m-0" :icon="['far', 'text-size']" transform="shrink-2" />
								<fa-icon class="m-0" :icon="['far', 'angle-down']" transform="shrink-2" />
							</ds-btn>
						</template>
						<template #tooltip>
							{{ $t('textEditor.btnFontSize') }}
						</template>
					</ds-tooltip>
				</template>
				<template #dropdownContent="{hide}">
					<ds-btn-group subMenu :class="{'active': subMenus.fontSizeActive}" class="d-flex">
						<ds-tooltip placement="bottom">
							<template #icon>
								<ds-btn
									class="m-0 border-radius-right-0"
									:class="{'is-active': editor.isActive('fontSize', 20)}"
									variant="secondary"
									width="auto"
									padding-x="S"
									padding-y="S"
									:no-wrap="true"
									@click.stop="editApply('setFontSize', 20, hide)">
									20px
								</ds-btn>
							</template>
							<template #tooltip>
								20
							</template>
						</ds-tooltip>
						<ds-tooltip placement="bottom">
							<template #icon>
								<ds-btn
									class="m-0 border-left-0 border-radius-0"
									:class="{'is-active': editor.isActive('fontSize', 24)}"
									variant="secondary"
									width="auto"
									padding-x="S"
									padding-y="S"
									:no-wrap="true"
									@click="editApply('setFontSize', 24, hide)">
									24px
								</ds-btn>
							</template>
							<template #tooltip>
								24
							</template>
						</ds-tooltip>
						<ds-tooltip placement="bottom">
							<template #icon>
								<ds-btn
									class="m-0 border-left-0 border-radius-0"
									:class="{'is-active': editor.isActive('fontSize', 36)}"
									variant="secondary"
									width="auto"
									padding-x="S"
									padding-y="S"
									:no-wrap="true"
									@click.stop="editApply('setFontSize', 36, hide)">
									36px
								</ds-btn>
							</template>
							<template #tooltip>
								36
							</template>
						</ds-tooltip>
						<ds-tooltip placement="bottom">
							<template #icon>
								<ds-btn
									class="m-0 border-left-0 border-radius-0"
									:class="{'is-active': editor.isActive('fontSize', 52)}"
									variant="secondary"
									width="auto"
									padding-x="S"
									padding-y="S"
									:no-wrap="true"
									@click.stop="editApply('setFontSize', 52, hide)">
									52px
								</ds-btn>
							</template>
							<template #tooltip>
								52
							</template>
						</ds-tooltip>
						<ds-tooltip placement="bottom">
							<template #icon>
								<ds-btn
									class="m-0 border-left-0 border-radius-left-0"
									:class="{'is-active': editor.isActive('fontSize', 70)}"
									variant="secondary"
									width="auto"
									padding-x="S"
									padding-y="S"
									:no-wrap="true"
									@click.stop="editApply('setFontSize', 70, hide)">
									70px
								</ds-btn>
							</template>
							<template #tooltip>
								70
							</template>
						</ds-tooltip>
					</ds-btn-group>
				</template>
			</ds-dropdown>

			<ds-tooltip container=".ds-rich-editor-menu" :disabled="subMenus.colorsActive">
				<template #icon>
					<ds-btn
						class="m-0 position-relative border-left-0 border-radius-0"
						variant="secondary"
						width="auto"
						padding-x="S"
						padding-y="S"
						@click="toggleMenu('colorsActive')">
						<fa-icon class="m-0" :icon="['far', 'palette']" transform="shrink-2" />
						<ds-btn-group subMenu class="border" :class="{'active': subMenus.colorsActive}">
							<div @click.stop.prevent>
								<compact-picker
									ref="picker"
									class="color-picker"
									:modelValue="'#6d5af9'"
									:palette="colorPalette"
									@update:model-value="editChangeTextColor" />
							</div>
						</ds-btn-group>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnTextColor') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-left-0"
						variant="secondary"
						icon-only
						@click="editApply('unsetAllMarks')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'remove-format']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnRemoveFormatting') }}
				</template>
			</ds-tooltip>
		</ds-btn-group>

		<ds-btn-group class="mr-1 d-flex">
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-radius-right-0"
						:class="{'is-active': editor.isActive({textAlign: 'left'})}"
						variant="secondary"
						icon-only
						@click="editApply('setTextAlign', 'left')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'align-left']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnAlignTextLeft') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-0"
						:class="{'is-active': editor.isActive({textAlign: 'center'})}"
						variant="secondary"
						icon-only
						@click="editApply('setTextAlign', 'center')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'align-center']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnAlignTextCenter') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-0"
						:class="{'is-active': editor.isActive({textAlign: 'right'})}"
						variant="secondary"
						icon-only
						@click="editApply('setTextAlign', 'right')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'align-right']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnAlignTextRight') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-left-0"
						:class="{'is-active': editor.isActive({textAlign: 'justify'})}"
						variant="secondary"
						icon-only
						@click="editApply('setTextAlign', 'justify')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'align-justify']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnJustifyText') }}
				</template>
			</ds-tooltip>
		</ds-btn-group>

		<ds-btn-group class="mr-1 d-flex">
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-radius-right-0"
						:class="{'is-active': editor.isActive('paragraph')}"
						variant="secondary"
						icon-only
						@click="editApply('setParagraph')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'paragraph']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnParagraph') }}
				</template>
			</ds-tooltip>

			<ds-dropdown placement="bottom" :container="`.editor-content-${widgetInstanceId}`">
				<template #triggerContent>
					<ds-tooltip container=".ds-rich-editor-menu" :disabled="subMenus.headingActive">
						<template #icon>
							<ds-btn
								class="m-0 position-relative border-left-0 border-radius-0"
								variant="secondary"
								width="auto"
								padding-x="S"
								padding-y="S"
								@click="toggleMenu('headingActive')">
								<fa-icon class="m-0" :icon="['far', 'heading']" transform="shrink-2" />
								<fa-icon class="m-0" :icon="['far', 'angle-down']" transform="shrink-2" />
							</ds-btn>
						</template>
						<template #tooltip>
							{{ $t('textEditor.btnHeading') }}
						</template>
					</ds-tooltip>
				</template>
				<template #dropdownContent="{hide}">
					<ds-btn-group subMenu :class="{'active': subMenus.headingActive}" class="d-flex">
						<ds-tooltip placement="bottom">
							<template #icon>
								<ds-btn
									class="m-0 border-radius-right-0"
									:class="{'is-active': editor.isActive('heading', {level: 1})}"
									variant="secondary"
									icon-only
									@click.stop="editApply('toggleHeading', {level: 1}, hide)">
									<template #icon>
										<fa-icon class="m-0" :icon="['far', 'h1']" transform="shrink-2" />
									</template>
								</ds-btn>
							</template>
							<template #tooltip>
								{{ $t('textEditor.btnHeaderH1') }}
							</template>
						</ds-tooltip>
						<ds-tooltip placement="bottom">
							<template #icon>
								<ds-btn
									class="m-0 border-left-0 border-radius-0"
									:class="{'is-active': editor.isActive('heading', {level: 2})}"
									variant="secondary"
									icon-only
									@click.stop="editApply('toggleHeading', {level: 2}, hide)">
									<template #icon>
										<fa-icon class="m-0" :icon="['far', 'h2']" transform="shrink-2" />
									</template>
								</ds-btn>
							</template>
							<template #tooltip>
								{{ $t('textEditor.btnHeaderH2') }}
							</template>
						</ds-tooltip>
						<ds-tooltip placement="bottom">
							<template #icon>
								<ds-btn
									class="m-0 border-left-0 border-radius-0"
									:class="{'is-active': editor.isActive('heading', {level: 3})}"
									variant="secondary"
									icon-only
									@click.stop="editApply('toggleHeading', {level: 3}, hide)">
									<template #icon>
										<fa-icon class="m-0" :icon="['far', 'h3']" transform="shrink-2" />
									</template>
								</ds-btn>
							</template>
							<template #tooltip>
								{{ $t('textEditor.btnHeaderH3') }}
							</template>
						</ds-tooltip>
						<ds-tooltip placement="bottom">
							<template #icon>
								<ds-btn
									class="m-0 border-left-0 border-radius-left-0"
									:class="{'is-active': editor.isActive('heading', {level: 4})}"
									variant="secondary"
									icon-only
									@click.stop="editApply('toggleHeading', {level: 4}, hide)">
									<template #icon>
										<fa-icon class="m-0" :icon="['far', 'h4']" transform="shrink-2" />
									</template>
								</ds-btn>
							</template>
							<template #tooltip>
								{{ $t('textEditor.btnHeaderH4') }}
							</template>
						</ds-tooltip>
					</ds-btn-group>
				</template>
			</ds-dropdown>

			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-0"
						:class="{'is-active': editor.isActive('bulletList')}"
						variant="secondary"
						icon-only
						@click="editApply('toggleBulletList')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'list']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnBulletList') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-0"
						:class="{'is-active': editor.isActive('orderedList')}"
						variant="secondary"
						icon-only
						@click="editApply('toggleOrderedList')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'list-ol']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnOrderedList') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-left-0"
						variant="secondary"
						icon-only
						@click="editApply('clearNodes')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'eraser']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnClearAllNodes') }}
				</template>
			</ds-tooltip>
		</ds-btn-group>

		<ds-btn-group class="mr-1 d-flex">
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-radius-right-0"
						:class="{'is-active': editor.isActive('codeBlock')}"
						variant="secondary"
						icon-only
						@click="editApply('toggleCodeBlock')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'code']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnCodeBlock') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-0"
						:class="{'is-active': editor.isActive('blockquote')}"
						variant="secondary"
						icon-only
						@click="editApply('toggleBlockquote')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'quote-left']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnBlockQuote') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-left-0"
						variant="secondary"
						icon-only
						@click="editApply('setHorizontalRule')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'horizontal-rule']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnHorizontalRule') }}
				</template>
			</ds-tooltip>
		</ds-btn-group>

		<ds-btn-group class="mr-1 d-flex">
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-radius-right-0"
						variant="secondary"
						icon-only
						@click="editApply('undo')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'undo']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnUndo') }}
				</template>
			</ds-tooltip>
			<ds-tooltip container=".ds-rich-editor-menu">
				<template #icon>
					<ds-btn
						class="m-0 border-left-0 border-radius-left-0"
						variant="secondary"
						icon-only
						@click="editApply('redo')">
						<template #icon>
							<fa-icon class="m-0" :icon="['far', 'redo']" transform="shrink-2" />
						</template>
					</ds-btn>
				</template>
				<template #tooltip>
					{{ $t('textEditor.btnRedo') }}
				</template>
			</ds-tooltip>
		</ds-btn-group>

		<slot :toggleMenu="toggleMenu" :subMenus="subMenus" />
	</ds-btn-group>
</template>

<script>
import {colorPalette} from '@/components/shared/TextEditor/props/props';
import {Compact} from '@ckpack/vue-color';

export default {
	name: 'DataStoriesRichTextMenu',
	components: {
		'compact-picker': Compact
	},
	props: {
		editor: {
			type: Object,
			default: null
		},
		widgetInstanceId: {
			type: String,
			default: null
		},
		hideAllSubMenus: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			colorPalette,
			subMenus: {
				colorsActive: false,
				headingActive: false,
				fontSizeActive: false,
				backgroundImageActive: false,
				facts: false,
				metrics: false
			}
		};
	},
	watch: {
		hideAllSubMenus() {
			this.hideSubMenus();
		}
	},
	methods: {
		toggleMenu(menuId) {
			this.subMenus[menuId] = !this.subMenus[menuId];
			for (const sub in this.subMenus) {
				if (sub !== menuId) {
					this.subMenus[sub] = false;
				}
			}
		},
		hideSubMenus() {
			for (const sub in this.subMenus) {
				this.subMenus[sub] = false;
			}
		},
		editApply(method, param = null, hide = null) {
			if (param) {
				this.editor.chain().focus()[method](param).run();
			} else {
				this.editor.chain().focus()[method]().run();
			}
			if (hide) {
				hide();
			}
			this.hideSubMenus();
		},
		editChangeTextColor(color) {
			const method = 'setColor';
			this.editor.chain().focus()[method](color.hex).run();
			this.hideSubMenus();
		}
	}
};
</script>

<style lang="scss">
.ds-rich-editor-menu {
	display: flex;
	top: 0;
	z-index: 1;
	flex-flow: wrap;
	justify-content: center;

	> .ds-btn-group {
		margin-bottom: 10px;
	}

	button {
		min-width: 2rem;
		position: relative;
	}

	button.is-active {
		color: map-get($ds-colors, 'primary-400');
	}

	.color-picker {
		box-shadow: none;
		width: 105px;
	}

	.border {
		border: 1px solid map-get($ds-colors, 'display-content-400');
		border-radius: 4px;
	}

	[subMenu] {
		background: white;
		border-radius: 5px;
		display: none;
		left: 50%;
		position: absolute;
		top: calc(100% + 5px);
		transform: translateX(-50%);

		&.active {
			display: flex;
		}

		&.wide {
			width: 300px;
		}
	}
}
</style>
