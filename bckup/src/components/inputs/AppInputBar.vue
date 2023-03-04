<template>
	<div>
		<div v-if="highlight">
			<button class="btn btn-secondary highlightClass" @click="saveHighlight">
				<fa-icon class="mr-2 text-primary" :icon="['fas','highlighter']" />
				Highlight
			</button>
			<button class="btn btn-secondary highlightClass" @click="deleteHighlight">
				<fa-icon class="mr-2 text-primary" :icon="['fal','trash-alt']" />
			</button>
		</div>
		<div
			:style="border === false ? 'border: 0px;' : ''"
			class="input-icon-pill"
			:class="{
				'input-icon-left': leftIcon,
				'input-icon-right': rightIcon
			}">
			<!--suppress HtmlFormInputWithoutLabel -->
			<ds-input
				ref="inputHighlights"
				v-model:value="inputValue"
				:class="rounded ? 'rounded' : 'rounded-top'"
				:type="type"
				:has-border="border"
				:placeholder="placeholder"
				@update:value="$emit('update:input', inputValue)" />
			<span
				v-if="leftIcon"
				class="input-icon-icon input-icon-icon-left"><fa-icon :icon="leftIcon" /></span>
			<span
				v-if="rightIcon"
				:style="border === false ? 'border: 0px;' : ''"
				class="input-icon-icon input-icon-icon-right"><fa-icon :icon="rightIcon" /></span>
			<span
				v-if="widgetControlRightIcon"
				:style="border === false ? 'border: 0px;' : ''"
				class="input-icon-icon input-icon-icon-right controlPanelClass"><fa-icon :icon="widgetControlRightIcon" size="sm" /></span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'AppInputBar',
	props: {
		leftIcon: {
			type: Array,
			default: null
		},
		rightIcon: {
			type: Array,
			default: null
		},
		widgetControlRightIcon: {
			type: Array,
			default: null
		},
		placeholder: {
			type: String,
			default: ''
		},
		input: {
			type: String,
			required: true
		},
		pill: {
			type: Boolean,
			default: true
		},
		highlight: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: 'text'
		},
		rounded: {
			type: Boolean,
			default: true
		},
		border: {
			type: Boolean,
			default: true
		}
	},
	emits: ['update:input', 'addHighlight', 'deleteHighlight'],
	data() {
		return {
			inputValue: this.input
		};
	},
	watch: {
		input(value) {
			this.inputValue = value;
		}
	},
	methods: {
		saveHighlight() {
			const highlightStartIndex = this.$refs.inputHighlights.selectionStart;
			const highlightEndIndex = this.$refs.inputHighlights.selectionEnd;
			const position = [
				highlightStartIndex,
				highlightEndIndex
			];
			this.$emit('addHighlight', position);
		},
		deleteHighlight() {
			this.$emit('deleteHighlight');
		}
	}
};
</script>

<style>
	.highlightClass {
		background-color: #D9E7FC;
		color: #4E75FD;
	}

	.controlPanelClass {
		color: #AAABAE;
		border: 1px solid;
		border-color: #CFD8DD;
	}

	.rounded-top {
		border-radius: 4px 4px 0 0;
	}
</style>>
