import DOMPurify from 'dompurify';
export const $sanitizeHtml = (html) => DOMPurify.sanitize(html, {
	ALLOWED_TAGS: [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'a',
		'p',
		'br',
		'span',
		'hr',
		'em',
		'strong',
		'b',
		'sup',
		'sub',
		'u',
		's',
		'ul',
		'li',
		'ol',
		'pre',
		'code',
		'blockquote'
	],
	ALLOWED_ATTR: [
		'class',
		'style',
		'href',
		'rel',
		'target',
		'data',
		'data-attr',
		'id',
		'txt',
		'referencename',
		'referenceName'
	]
});
