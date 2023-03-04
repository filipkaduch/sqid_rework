import {mergeAttributes, Node} from '@tiptap/core';
import {CommandProps, VueNodeViewRenderer} from '@tiptap/vue-3';
import DataStoriesProtectedContent from '@/components/shared/TextEditor/DataStoriesProtectedContent.vue';

export default Node.create({
	name: 'protectedItem',
	group: 'inline',
	content: 'inline*',
	inline: true,
	atom: true,

	addAttributes() {
		return {
			id: {
				default: 0
			},
			txt: {
				default: '...'
			},
			referenceName: {
				default: 'Ref'
			}
		};
	},

	parseHTML() {
		return [
			{
				tag: 'span[data-type="ds-protected"]'
			}
		];
	},

	renderHTML({HTMLAttributes}) {
		return [
			'span',
			mergeAttributes(HTMLAttributes, {'data-type': 'ds-protected'}),
			0
		];
	},

	addNodeView() {
		// eslint-disable-next-line new-cap
		return VueNodeViewRenderer(DataStoriesProtectedContent as any);
	},

	addCommands(): any {
		return {
			insertProtectedNode: (attributes: any) => ({commands, editor}: CommandProps) => commands.insertContent({
				type: 'protectedItem',
				attrs: {
					...attributes
				}
			})
		};
	}
});
