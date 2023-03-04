<!-- eslint-disable max-lines -->
<template>
	<div class="position-relative w-100 h-100 editor-content">
		<ds-rich-text-menu
			v-if="!presentationMode && editEnabled"
			:widget-instance-id="widgetInstanceId"
			:editor="editor"
			:hide-all-sub-menus="hideAllSubMenus">
			<template #default="{toggleMenu, subMenus}">
				<ds-btn-group class="d-flex position-relative" @click.stop.prevent>
					<ds-tooltip v-if="showBgImage">
						<template #icon>
							<ds-btn
								class="m-0 position-relative"
								:class="{'border-radius-right-0': dynamicFacts?.length || dynamicMetrics?.length}"
								padding-x="S"
								padding-y="S"
								variant="secondary"
								width="auto"
								:block="true"
								@click="toggleMenu('backgroundImageActive')">
								<fa-icon :icon="['far', 'image-polaroid']" class="m-0" transform="shrink-2" />
								<ds-box
									v-if="subMenus.backgroundImageActive"
									border="layout"
									class="bg-image-input"
									padding-x="S"
									padding-y="S"
									flex-type="column"
									align="left"
									subMenu>
									<ds-box
										class="w-100"
										align="space-between"
										flex-type="row"
										padding-bottom="M">
										<ds-text>{{ $t('textEditor.imagePosition') }}</ds-text>
										<div>
											<label class="mb-0 mr-3">
												<input v-model="bgImageSize" name="bgSizeOptions" type="radio" value="contain">
												{{ $t('textEditor.contain') }}
											</label>
											<label class="mb-0">
												<input v-model="bgImageSize" name="bgSizeOptions" type="radio" value="cover">
												{{ $t('textEditor.cover') }}
											</label>
										</div>
									</ds-box>
									<ds-box
										class="w-100"
										align="left"
										@click.stop.prevent>
										<ds-text>{{ $t('textEditor.btnBgImageUrlTooltip') }}</ds-text>
										<ds-input
											:debounce="true"
											:value="backgroundImage"
											width="100%"
											:placeholder="$t('textEditor.bgImagePlaceholder')"
											type="url"
											@update:value="editBackgroundUrl" />
									</ds-box>
								</ds-box>
							</ds-btn>
						</template>
						<template #tooltip>
							{{ $t('textEditor.btnBgImageUrlTooltip') }}
						</template>
					</ds-tooltip>

					<ds-dropdown v-if="dynamicFacts?.length" placement="bottom" :container="`.editor-content-${widgetInstanceId}`">
						<template #triggerContent>
							<ds-tooltip>
								<template #icon>
									<ds-btn
										class="m-0"
										variant="secondary"
										:block="true"
										@click="toggleMenu('facts')">
										<fa-icon :icon="['far', 'plus']" class="m-0" transform="shrink-2" />
										{{ $t('textEditor.fact') }}
									</ds-btn>
								</template>
								<template #tooltip>
									{{ $t('textEditor.btnFactsTooltip') }}
								</template>
							</ds-tooltip>
						</template>
						<template #dropdownContent="{hide}">
							<div
								:class="{'active': subMenus.facts}"
								class="border wide p-1 flex-column"
								subMenu
								@click.stop.prevent>
								<bootstrap-select v-model:value="selectedFact" :options="dynamicFacts ?? []" value-field="value" text-field="text" />
								<ds-btn center class="ml-0 mt-1 w-100" @click="selectedFactData(hide)">{{ $t('textEditor.btnFact') }}</ds-btn>
							</div>
						</template>
					</ds-dropdown>

					<ds-dropdown v-if="dynamicMetrics?.length" placement="bottom" :container="`.editor-content-${widgetInstanceId}`">
						<template #triggerContent>
							<ds-tooltip>
								<template #icon>
									<ds-btn
										class="m-0"
										variant="secondary"
										:block="true"
										@click="toggleMenu('metrics')">
										<fa-icon :icon="['far', 'plus']" class="m-0" transform="shrink-2" />
										{{ $t('textEditor.metric') }}
									</ds-btn>
								</template>
								<template #tooltip>
									{{ $t('textEditor.btnMetricsTooltip') }}
								</template>
							</ds-tooltip>
						</template>
						<template #dropdownContent="{hide}">
							<div
								:class="{'active': subMenus.metrics}"
								class="border wide p-1 flex-column"
								subMenu
								@click.stop.prevent>
								<bootstrap-select v-model:value="selectedMetric" :options="dynamicMetrics ?? []" value-field="value" text-field="text" />
								<ds-btn center class="ml-0 mt-1 w-100" @click="selectedMetricData(hide)">{{ $t('textEditor.btnMetric') }}</ds-btn>
							</div>
						</template>
					</ds-dropdown>
				</ds-btn-group>
			</template>
		</ds-rich-text-menu>

		<editor-content
			:class="editorClass"
			:editor="editor"
			:style="editorStyle"
			class="ds-rich-editor-content widget-text-class" />
	</div>
</template>

<script>
import {Editor, EditorContent} from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import DsProtectedNode from '@/components/shared/TextEditor/extensions/dsProtectedNode';
import FontSize from '@/components/shared/TextEditor/extensions/fontSize';
import {componentProps} from '@/components/shared/TextEditor/props/props';
import {DataType, getNode, modifyItem} from '@/components/shared/TextEditor/utils/utils';
import DsRichTextMenu from '@/components/shared/TextEditor/DataStoriesRichTextMenu.vue';
import BootstrapSelect from '@/components/temporary/BootstrapSelect.vue';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

export default {
	name: 'DataStoriesRichTextInput',
	components: {
		BootstrapSelect,
		EditorContent,
		DsRichTextMenu
	},
	props: componentProps,
	emits: ['updated:bgUrl', 'updated:bgSize', 'updated', 'updated:content'],
	data() {
		return {
			selectedFact: '',
			selectedMetric: null,
			bgImageSize: this.backgroundSize,
			editor: null,
			metricsLocal: null,
			hideAllSubMenus: 0,
			checkFacts: null
		};
	},
	computed: {
		dynamicFacts() {
			return this.facts?.length
				? [
					{
						value: null,
						text: this.$t('textEditor.factSelect'),
						disabled: true
					}, ...this.facts
				]
				: null;
		},
		dynamicMetrics() {
			return this.metrics?.length
				? [
					{
						value: null,
						text: this.$t('textEditor.metricSelect'),
						disabled: true
					}, ...this.metrics
				]
				: null;
		}
	},
	watch: {
		presentationMode: {
			immediate: true,
			handler(val) {
				if (val && this.editor) {
					this.editor.setEditable(false);
				}
			}
		},
		editEnabled(val) {
			// eslint-disable-next-line no-unused-expressions
			this.editor?.setEditable(val && !this.presentationMode);
		},
		bgImageSize(val) {
			this.editBackgroundSize(val);
		},
		metrics: {
			handler(newVal, oldVal) {
				if (this.editor) {
					this.updateDynamicData(newVal, DataType.METRIC, !isEqual(newVal, oldVal));
				}
			},
			deep: true
		},
		facts: {
			handler(val) {
				if (this.editor) {
					this.updateDynamicData(val, DataType.FACT, !isEqual(val, this.checkFacts));
				}
			},
			deep: true
		}
	},
	mounted() {
		this.editor = new Editor({
			extensions: [
				StarterKit.configure({
					paragraph: {
						HTMLAttributes: {
							class: 'ds-text-paragraph'
						}
					},
					heading: {
						HTMLAttributes: {
							class: 'ds-text-heading'
						}
					}
				}),
				TextAlign.configure({
					types: [
						'heading',
						'paragraph'
					],
					defaultAlignment: 'left'
				}),
				Placeholder.configure({
					showOnlyCurrent: true,
					showOnlyWhenEditable: true,
					placeholder: this.placeholder
				}),
				Underline,
				Color,
				TextStyle,
				Link,
				FontSize,
				DsProtectedNode
			],
			editorProps: {
				attributes: {
					class: 'prose-custom'
				}
			},
			onFocus: () => {
				this.hideAllSubMenus = Math.random();
			},
			onBlur: (obj) => {
				this.$emit('updated', obj.editor.getHTML());
			},
			onUpdate: (obj) => {
				this.$emit('updated:content', obj.editor.getHTML());
			},
			content: this.html,
			editable: !this.presentationMode
		});
		this.updateDynamicData(this.metrics, DataType.METRIC, true);
		this.updateDynamicData(this.facts, DataType.FACT, true);
	},
	beforeUnmount() {
		// eslint-disable-next-line no-unused-expressions
		this.editor?.destroy();
	},
	methods: {
		selectedFactData(hide) {
			if (this.selectedFact) {
				this.editor.chain().focus()
					.insertProtectedNode(getNode(this.facts, this.selectedFact, DataType.FACT))
					.run();
				this.$emit('updated', this.editor.getHTML());
				hide();
				this.hideAllSubMenus = Math.random();
			}
		},
		selectedMetricData(hide) {
			if (this.selectedMetric) {
				this.editor.chain().focus()
					.insertProtectedNode(getNode(this.metrics, this.selectedMetric, DataType.METRIC))
					.run();
				this.$emit('updated', this.editor.getHTML());
				hide();
				this.hideAllSubMenus = Math.random();
			}
		},
		updateDynamicData(data, type, emitChange = true) {
			let emit = emitChange;
			if (data) {
				const editorJson = this.editor.getJSON();
				if (type === DataType.METRIC) {
					let diff = null;
					if (this.metricsLocal) {
						diff = data.find((elm, index) => elm.dataValue !== this.metricsLocal[index].dataValue);
					} else {
						this.metricsLocal = [...data];
						emit = true;
					}
					if (diff) {
						this.metricsLocal = [...data];
					} else {
						emit = false;
					}
				}

				if (emit) {
					for (const item of data) {
						modifyItem(editorJson.content, item.value, item.dataValue, type);
					}
					if (type === DataType.FACT) {
						this.checkFacts = cloneDeep(data);
					}
					this.editor.commands.setContent(editorJson, false);
					this.$emit('updated', this.editor.getHTML());
				}
			}
		},
		editBackgroundUrl(data) {
			this.$emit('updated:bgUrl', data);
		},
		editBackgroundSize(data) {
			this.$emit('updated:bgSize', data);
		}
	}
};
</script>

<style lang="scss" scoped>
.ds-rich-editor-content {
	align-items: center;
	display: flex;
	height: 100%;
	justify-content: center;
	width: 100%;
}

.bg-image-input {
	width: 300px;
}
</style>
