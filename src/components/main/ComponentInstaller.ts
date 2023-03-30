import AppButton from './button/AppButton.vue';
import AppButtonGroup from './button/AppButtonGroup.vue';
import AppInput from './input/AppInput.vue';
import AppSearchInput from '../design/AppSearchInput.vue';
import AppColumn from './layout/column/AppColumn.vue';
import AppContainer from './layout/container/AppContainer.vue';
import AppRow from './layout/row/AppRow.vue';
import AppCard from './card/AppCard.vue';
import AppModal from './modal/AppModal.vue';
import AppText from './text/AppText.vue';
import AppBox from './layout/box/AppBox.vue';
import AppInline from './layout/inline/Inline.vue';
import AppInlineItem from './layout/inlineItem/InlineItem.vue';
import AppTooltip from './tooltip/AppTooltip.vue';
import AppIcon from './icon/AppIcon.vue';
import AppLink from "@/components/main/link/AppLink.vue";
import AppKebabButton from './button/AppKebabButton.vue';
import AppCollapse from './collapse/AppCollapse.vue';
import AppTabs from "@/components/main/tabs/AppTabs.vue";

// @ts-ignore
import {VueConstructor} from 'vue/types/umd';

export class ComponentsInstaller {
	// eslint-disable-next-line max-statements
	static install(Vue: VueConstructor) {
		Vue.component('AppContainer', AppContainer);
		Vue.component('AppCol', AppColumn);
		Vue.component('AppRow', AppRow);
		Vue.component('AppBtn', AppButton);
		Vue.component('AppBtnGroup', AppButtonGroup);
		Vue.component('AppInput', AppInput);
		Vue.component('AppSearchInput', AppSearchInput);
		Vue.component('AppCard', AppCard);
		Vue.component('AppModal', AppModal);
		Vue.component('AppText', AppText);
		Vue.component('AppBox', AppBox);
		Vue.component('AppInline', AppInline);
		Vue.component('AppInlineItem', AppInlineItem);
		Vue.component('AppTooltip', AppTooltip);
		Vue.component('AppIcon', AppIcon);
		Vue.component('AppLink', AppLink);
		Vue.component('AppCollapse', AppCollapse);
		Vue.component('AppKebabBtn', AppKebabButton);
		Vue.component('AppTabs', AppTabs);
	}
}
