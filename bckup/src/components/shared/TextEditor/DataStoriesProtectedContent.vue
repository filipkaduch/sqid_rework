<template>
	<node-view-wrapper class="ds-non-editable text label" :reference-name="node.attrs.referenceName" contenteditable="false">
		{{ node.attrs.txt }}
	</node-view-wrapper>
</template>

<script>
import {nodeViewProps, NodeViewWrapper} from '@tiptap/vue-3';

export default {
	name: 'DataStoriesProtectedContent',
	components: {
		NodeViewWrapper
	},
	props: {
		nodeViewProps
	}
};
</script>

<style lang="scss" scoped>
.ds-non-editable {
	display: inline-block;
	position: relative;

	&.text {
		background: rgba(245, 245, 220, 0.5);
		box-shadow: 0 0 10px 5px rgba(245, 245, 220, 0.5);
	}

	&.label::before {
		content: attr(reference-name);
		color: grey;
		background: rgba(245, 245, 220, 0.5);
		box-shadow: 0 0 10px 5px rgba(245, 245, 220, 0.5);
		font-size: 10px;
		height: 15px;
		overflow: hidden;
		position: absolute;
		right: 0;
		top: -10px;
		white-space: nowrap;
	}
}

.presentation .ds-non-editable {
	&.text {
		background: none;
		box-shadow: none;
	}

	&.label::before {
		content: none;
	}
}
</style>
