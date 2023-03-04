import {CommandProps, Extension} from '@tiptap/vue-3';

/**
 * FontSize - Custom Extension
 * editor.commands.setFontSize(e.target.value) :set the font-size.
 */
export default Extension.create({
	name: 'fontSize',
	addOptions() {
		return {
			types: ['textStyle']
		};
	},
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					fontSize: {
						default: null,
						parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ''),
						renderHTML: (attributes) => {
							if (!attributes.fontSize) {
								return {};
							}
							return {
								style: `font-size: ${attributes.fontSize}`
							};
						}
					}
				}
			}
		];
	},
	addCommands(): any {
		return {
			setFontSize: (fontSize: number) => ({chain}: CommandProps) => chain()
				.setMark('textStyle', {fontSize: `${fontSize}px`})
				.run(),
			unsetFontSize: () => ({chain}: CommandProps) => chain()
				.setMark('textStyle', {fontSize: null})
				.removeEmptyTextStyle()
				.run()
		};
	}
});
