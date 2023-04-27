
// eslint-disable-next-line no-undef
module.exports = {
	env: {
		es2021: true
	},

	overrides: [
		{
			files: ['**/__tests__/*.{j,t}s?(x)']
		},
		{
			files: ['*.vue'],
			rules: {
				indent: 'off',
				'sort-keys': 'off'
			}
		},
		{
			files: ['router.js'],
			rules: {
				'no-inline-comments': 'off'
			}
		}
	],
	parserOptions: {
		parser: '@typescript-eslint/parser'
	},
	plugins: ['@typescript-eslint'],
	root: true,
	rules: {
		'logical-assignment-operators': ['error', 'never'],
		'no-use-before-define': 'off',
		'class-methods-use-this': 'off',
		'multiline-comment-style': 'off',
		'capitalized-comments': 'off',
		'default-case': 'off',
		'dot-location': [
			'error',
			'property'
		],
		'func-names': [
			'error',
			'as-needed'
		],
		'id-length': [
			'error',
			{
				exceptions: [
					'S',
					'M',
					'L',
					'x',
					'y',
					'z',
					'i',
					'j',
					'k',
					'_',
					't'
				]
			}
		],
		indent: [
			'error',
			'tab',
			{
				SwitchCase: 1
			}
		],
		'max-len': [
			'error',
			{
				code: 180,
				tabWidth: 2
			}
		],
		'max-lines': [
			'error',
			{
				max: 1100,
				skipBlankLines: true,
				skipComments: true
			}
		],
		'max-params': [
			'error',
			6
		],
		'max-statements': [
			'error',
			25
		],
		'multiline-ternary': [
			'error',
			'always-multiline'
		],
		'no-confusing-arrow': 'off',
		'no-console': 'off',
		'no-debugger': 'off',
		'no-extra-parens': 'off',
		'no-magic-numbers': 'off',
		'no-nested-ternary': 'off',
		'no-plusplus': [
			'error',
			{
				allowForLoopAfterthoughts: true
			}
		],
		'no-tabs': [
			'error',
			{
				allowIndentationTabs: true
			}
		],
		'sort-imports': 'off',
		'no-process-env': 'off',
		'no-ternary': 'off',
		'no-warning-comments': 'off',
		'one-var': [
			'error',
			'never'
		],
		'operator-linebreak': [
			'error',
			'before'
		],
		'padded-blocks': [
			'error',
			'never'
		],
		'prefer-promise-reject-errors': [
			'error',
			{
				allowEmptyReject: true
			}
		],
		'quote-props': [
			'error',
			'as-needed'
		],
		quotes: [
			'error',
			'single'
		],
		'space-before-function-paren': [
			'error',
			'never'
		],
		'sort-keys': 'off',
		'sort-vars': 'off',
		'vue/array-bracket-spacing': 'error',
		'vue/arrow-spacing': 'error',
		'vue/attribute-hyphenation': [
			0,
			{
				ignore: ['custom-prop']
			}
		],
		'vue/brace-style': 'error',
		'vue/camelcase': 'error',
		'vue/comma-dangle': 'error',
		'vue/no-v-for-template-key-on-child': 2,
		'vue/component-name-in-template-casing': [
			2,
			'kebab-case',
			{
				registeredComponentsOnly: false
			}
		],
		'vue/eqeqeq': 'error',
		'vue/html-closing-bracket-newline': [
			'error',
			{
				multiline: 'never',
				singleline: 'never'
			}
		],
		'vue/html-closing-bracket-spacing': [
			'error',
			{
				endTag: 'never',
				selfClosingTag: 'always',
				startTag: 'never'
			}
		],
		'vue/html-indent': [
			'error',
			'tab'
		],
		'vue/key-spacing': 'error',
		'vue/match-component-file-name': [
			'error',
			{
				extensions: [
					'vue',
					'jsx',
					'js'
				],
				shouldMatchCase: true
			}
		],
		'vue/max-attributes-per-line': [
			'error',
			{
				singleline: 4,
				multiline: 4
			}
		],
		'vue/no-restricted-syntax': 'error',
		'vue/object-curly-spacing': 'error',
		'vue/require-direct-export': 'off',
		'vue/script-indent': [
			'error',
			'tab',
			{
				switchCase: 1
			}
		],
		'vue/singleline-html-element-content-newline': 'off',
		'vue/space-infix-ops': 'error',
		'vue/space-unary-ops': 'error',
		'vue/v-on-function-call': 'error',
		'function-call-argument-newline': 0,
		'require-unicode-regexp': 'off',
		'newline-per-chained-call': 'off',
		'lines-around-comment': 'off',
		'max-lines-per-function': 'off',
		'array-bracket-newline': ['error', {multiline: true}],
		'array-element-newline': ['error', 'consistent'],
		'object-curly-newline': [
			'error', {
				consistent: true,
				multiline: true
			}
		],
		'object-property-newline': [
			'error', {
				allowAllPropertiesOnSameLine: true
			}
		],
		'no-unused-vars': 'off',
		'guard-for-in': 'off',
		'no-promise-executor-return': 'off',
		'linebreak-style': 'off',
		'vue/multi-word-component-names': 'off',
		'vue/no-v-for-template-key': 'off',
		'vue/no-v-model-argument': 'off',
		'vue/no-reserved-component-names': 'off',
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'error',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				ignoreRestSiblings: true,
				args: 'none',
				destructuredArrayIgnorePattern: 'key'
			}
		],
		'vue/no-deprecated-v-on-native-modifier': 'warn',
		'vue/no-deprecated-dollar-listeners-api': 'warn',
		'vue/no-deprecated-filter': 'warn',
		'no-await-in-loop': 'off'
	},
	extends: [
		'plugin:vue/vue3-recommended',
		'eslint:all',
		'@vue/eslint-config-typescript'
	]
};
