import DataStoriesButton from '@/components/main/DataStoriesButton.vue';
import DataStoriesButtonGroup from '@/components/main/DataStoriesButtonGroup.vue';
import DataStoriesInput from '@/components/main/DataStoriesInput.vue';
import DataStoriesSearchInput from '@/components/main/DataStoriesSearchInput.vue';
import DataStoriesAlertBanner from '@/components/main/AlertBanner/DataStoriesAlertBanner.vue';
import DataStoriesColumn from '@/components/main/layout/DataStoriesColumn.vue';
import DataStoriesContainer from '@/components/main/layout/DataStoriesContainer.vue';
import DataStoriesRow from '@/components/main/layout/DataStoriesRow.vue';
import DataStoriesCard from '@/components/main/DataStoriesCard.vue';
import DataStoriesModal from '@/components/main/DataStoriesModal.vue';
import DataStoriesText from '@/components/main/Text/DataStoriesText.vue';
import DataStoriesBox from '@/components/main/layout/Box/DataStoriesBox.vue';
import DataStoriesInline from '@/components/main/layout/Inline/Inline.vue';
import DataStoriesInlineItem from '@/components/main/layout/InlineItem/InlineItem.vue';
import DataStoriesTooltip from '@/components/main/DsTooltip.vue';
import DataStoriesPageHeader from '@/components/main/DataStoriesPageHeader.vue';
import DataStoriesTable from '@/components/main/Table/DataStoriesTable.vue';
import DataStoriesToggleBar from '@/components/main/DataStoriesToggleBar.vue';
import DataStoriesSelect from '@/components/main/Select/DataStoriesSelect.vue';
import DataStoriesMultiSelect from '@/components/main/Select/DataStoriesMultiSelect.vue';
import DataStoriesDropdown from '@/components/main/Dropdown/DataStoriesDropdown.vue';
import DataStoriesCheckBox from '@/components/inputs/DataStoriesCheckBox.vue';
import DataStoriesTags from '@/components/main/Tags/DataStoriesTags.vue';
import DataStoriesIcon from '@/components/main/DataStoriesIcon.vue';
import ColumnSelectNumber from '@/components/datatypes/ColumnSelectNumber.vue';
import DataStoriesKebabButton from '@/components/main/button/DataStoriesKebabButton.vue';
import DataStoriesCollapse from '@/components/main/DataStoriesCollapse.vue';
import DataStoriesDatepicker from '@/components/main/DataStoriesDatepicker.vue';
import DataStoriesComponentWrapper from '@/components/DataStoriesComponentWrapper.vue';
import AppTitle from '@/components/design/AppTitle.js';

import {VueConstructor} from 'vue/types/umd';

export class ComponentsInstaller {
	// eslint-disable-next-line max-statements
	static install(Vue: VueConstructor) {
		Vue.component('DsContainer', DataStoriesContainer);
		Vue.component('DsCol', DataStoriesColumn);
		Vue.component('DsRow', DataStoriesRow);
		Vue.component('DsBtn', DataStoriesButton);
		Vue.component('DsBtnGroup', DataStoriesButtonGroup);
		Vue.component('DsInput', DataStoriesInput);
		Vue.component('DsSearchInput', DataStoriesSearchInput);
		Vue.component('DsCard', DataStoriesCard);
		Vue.component('DsModal', DataStoriesModal);
		Vue.component('DsText', DataStoriesText);
		Vue.component('DsBox', DataStoriesBox);
		Vue.component('DsInline', DataStoriesInline);
		Vue.component('DsInlineItem', DataStoriesInlineItem);
		Vue.component('DsTooltip', DataStoriesTooltip);
		Vue.component('DsPageHeader', DataStoriesPageHeader);
		Vue.component('DsAlertBanner', DataStoriesAlertBanner);
		Vue.component('DsTable', DataStoriesTable);
		Vue.component('DsToggleBar', DataStoriesToggleBar);
		Vue.component('DsDropdown', DataStoriesDropdown);
		Vue.component('DsSelect', DataStoriesSelect);
		Vue.component('DsMultiSelect', DataStoriesMultiSelect);
		Vue.component('DsCheckBox', DataStoriesCheckBox);
		Vue.component('DsTags', DataStoriesTags);
		Vue.component('DsIcon', DataStoriesIcon);
		Vue.component('ColumnSelectNumber', ColumnSelectNumber);
		Vue.component('DsKebabBtn', DataStoriesKebabButton);
		Vue.component('DsCollapse', DataStoriesCollapse);
		Vue.component('DsDatepicker', DataStoriesDatepicker);
		Vue.component('DsComponentWrapper', DataStoriesComponentWrapper);
		Vue.component('AppTitle', AppTitle);
	}
}
