<template>
	<ds-box
		class="w-100 ds-bg-white"
		border="box" border-radius="basic" padding="S" padding-right="NONE">
		<v-ace-editor
			ref="editor"
			v-model:value="input"
			class="rounded"
			lang="text"
			theme="eclipse"
			style="width: 100%; height: 50px"
			@init="editorInit"
			@update:value="$emit('update:query', input)" />
	</ds-box>
</template>

<script>
import {VAceEditor} from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-eclipse';
import 'ace-builds/src-noconflict/mode-text';

const supportedOperations = [
	{
		name: 'count',
		value: 'count("")'
	},
	{
		name: 'count-distinct',
		value: 'count-distinct("")'
	},
	{
		name: 'sum',
		value: 'sum("")'
	},
	{
		name: 'avg',
		value: 'avg("")'
	},
	{
		name: 'min',
		value: 'min("")'
	},
	{
		name: 'max',
		value: 'max("")'
	}
];
export default {
	name: 'AppQueryEditor',
	components: {
		VAceEditor
	},
	props: {
		query: {
			type: String,
			required: true
		},
		columns: {
			type: Array,
			required: true
		}
	},
	emits: ['update:query'],
	data() {
		return {
			editor: null,
			input: this.query
		};
	},
	watch: {
		query(query) {
			this.input = query;
		}
	},
	methods: {
		// need to add placeholder like this because vue2-ace-editor doesn't support placeholder option
		update() {
			const shouldShow = !this.editor.session.getValue().length;
			let node = this.editor.renderer.emptyMessageNode;
			if (!shouldShow && node) {
				this.editor.renderer.scroller.removeChild(this.editor.renderer.emptyMessageNode);
				this.editor.renderer.emptyMessageNode = null;
			} else if (shouldShow && !node) {
				// eslint-disable-next-line no-multi-assign
				node = this.editor.renderer.emptyMessageNode = document.createElement('div');
				node.textContent = this.$t('t_CustomDefinition');
				node.style.padding = '0 9px';
				node.style.position = 'absolute';
				node.style.zIndex = 9;
				node.style.opacity = 0.3;
				this.editor.renderer.scroller.appendChild(node);
			}
		},
		editorInit(editor) {
			this.editor = editor;
			editor.setOptions({
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: true,
				highlightActiveLine: false,
				showGutter: false,
				fontFamily: 'Roboto Mono',
				cursorStyle: 'slim',
				indentedSoftWrap: false,
				fontSize: '10pt',
				showPrintMargin: true,
				wrap: true
			});
			const {session} = editor;
			session.setMode('ace/mode/text', () => {
				const rules = session.$mode.$highlightRules.getRules();
				for (const operation of supportedOperations) {
					rules.start.unshift({
						token: 'keyword',
						regex: operation.name
					});
				}
				rules.start.unshift({
					token: 'comment',
					regex: '\\"(.*?)\\"'
				});
				// force recreation of tokenizer
				session.$mode.$tokenizer = null;
				session.bgTokenizer.setTokenizer(session.$mode.getTokenizer());
				// force re-highlight whole document
				session.bgTokenizer.start(0);
			});
			editor.completers = [
				{
					// eslint-disable-next-line max-params, @typescript-eslint/no-shadow
					getCompletions(editor, session, pos, prefix, callback) {
						if (session.$mode.completer) {
							return session.$mode.completer.getCompletions(editor, session, pos, prefix, callback);
						}
						const state = editor.session.getState(pos.row);
						let keywordCompletions = null;
						if (prefix === prefix.toUpperCase()) {
							keywordCompletions = session.$mode.getCompletions(state, session, pos, prefix);
							keywordCompletions = keywordCompletions.map((obj) => {
								const copy = obj;
								copy.value = obj.value.toUpperCase();
								return copy;
							});
						} else {
							keywordCompletions = session.$mode.getCompletions(state, session, pos, prefix);
						}
						return callback(null, keywordCompletions);
					}
				},
				{
					// eslint-disable-next-line max-params, @typescript-eslint/no-shadow, max-statements
					getCompletions: (editor, session, pos, prefix, callback) => {
						const completions = this.columns.filter((column) => column?.visibilityState !== 'INTERNAL')
							.map((column) => ({
								caption: `${column.name} (${this.$t(`t_Datatype${column.dataType ?? column.type}`)})`,
								value: column.name,
								meta: this.$t('t_Column')
							}))
							.concat(supportedOperations.map((operation) => ({
								caption: operation.name,
								value: operation.value,
								meta: 'function'
							})))
							.filter((completion) => completion !== null)
							?? [];
						callback(null, completions);
					}
				}
			];
			editor.on('input', this.update);
			setTimeout(this.update, 100);
		}
	}
};
</script>
