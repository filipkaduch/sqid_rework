export const scrollToSec = (refs, index) => {
	if (typeof refs?.[`section-${index}`]?.$el !== 'undefined') {
		refs[`section-${index}`].$el.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
	}
};
