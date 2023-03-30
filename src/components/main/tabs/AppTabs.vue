<template>
  <div id="tab-line" ref="tabLinebar" :class="{'tab-style-height': isTabVariant, 'limit-tabs': limitChars && showArrows}">
    <app-inline
        class="d-flex"
        :class="{'tab-style': isTabVariant, 'border-bottom-0': icons, 'prelimit-tabs': limitChars && showArrows}">
      <app-box
          v-for="(tab, index) in tabs"
          :id="`tab-${tab.name}`"
          :key="tab.name + index"
          :data-testid="tab.name"
          class="cursor-pointer"
          :padding-x="isTabVariant && !icons ? 'M' : ''"
          :padding-right="tabsPaddingRight"
          @click="handleActiveTab(tab)">
        <app-tooltip class="h-100" height="100%" :disabled="!tab.tooltip">
          <template #icon>
            <app-inline :class="icons ? 'justify-content-center h-100 align-items-center' : ''">
              <ds-box
                  flex-type="row"
                  :padding-y="icons ? '' : 'S'">
                <ds-text
                    v-if="!icons"
                    variant="body"
                    :class="{'btn-active': isEqual(tab, activeTab) && !isTabVariant, 'tab-text-max ': limitChars}">
                  {{ tab.name }}
                </ds-text>
                <ds-icon v-else :name="tab.icon" :fill="isEqual(tab, activeTab) ? 'display-content' : ''" />
                <slot name="countBadge" :tab="tab" />
              </ds-box>
              <ds-box :padding-left="icons ? '' : 'S'" class="tab-actions">
                <slot :tab="tab" name="tab-actions" />
              </ds-box>
            </app-inline>
          </template>
          <template #tooltip>
            {{ tab.tooltip }}
          </template>
        </app-tooltip>
      </app-box>
      <slot name="rightSlot" />
    </app-inline>
    <template v-for="(tab, index) in tabs" :key="index">
      <div v-if="tab.name === activeTab">
        <slot :name="tab.name" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref, watch, nextTick} from 'vue';
import isEqual from 'lodash/isEqual';

type Tab = {
  [key: string]: any,
  name: string,
  tooltip?: string,
  icon?: string
}
type Variant = 'tab' | 'button';

export default defineComponent({
  name: 'AppTabs',
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    isClosable: {
      type: Boolean,
      default: false
    },
    canAdd: {
      type: Boolean,
      default: false
    },
    showArrows: {
      type: Boolean,
      default: false
    },
    limitChars: {
      type: Boolean,
      default: false
    },
    icons: {
      type: Boolean,
      default: false
    },
    tabWidth: {
      type: Number,
      default: null
    },
    allTabs: {
      type: Number,
      default: 0
    },
    tabs: {
      type: Array as PropType<Tab[]>,
      required: true
    },
    activeTab: {
      type: [Object],
      required: true
    },
    variant: {
      type: String as PropType<Variant>,
      required: false,
      default: () => 'tab'
    }
  },
  emits: ['add', 'update:activeTab', 'tabClicked'],
  setup(props, {emit}) {
    const handleActiveTab = (tab: Tab) => {
      emit('update:activeTab', tab);
      emit('tabClicked', tab);
    };
    const isTabVariant = computed(() => props.variant === 'tab');

    const tabsPaddingRight = computed(() => {
      if (!isTabVariant.value && !props.icons) {
        return 'L';
      } else if (!props.icons) {
        return 'S';
      }
      return '';
    });


    return {
      handleActiveTab,
      isTabVariant,
      tabsPaddingRight,
      isEqual
    };
  }
});
</script>

<style lang="scss" scoped>
.btn-active {
  border-bottom: solid 2px map-get($app-colors, 'primary');
}
.tab-style {
  width: 100%;
  height: 100%;
  background-color: map-get($app-colors, 'white');
  border-bottom: 1px solid map-get($app-colors, 'separate-content-200');
}
.tab-style-height{
  width: 100%;
  height: 36px;
}
.tab-active {
  background-color: map-get($app-colors, 'separate-content-0');
  border-right: 1px solid map-get($app-colors, 'display-content-0');
  border-bottom: 0;
  position: relative;
}
.tab-active::before {
  width: 100%;
  height: 2px;
  position: absolute;
  content: "";
  background-color: map-get($app-colors, 'display-content-0');
  bottom: -2px;
  left: 0;
}
.tab-icon-active {
  background-color: map-get($app-colors, 'white') !important;
  border-bottom: 0 !important;
}
.tab-icon {
  justify-content: center;
  border-top: 1px solid map-get($app-colors, 'separate-content-200');
  background-color: map-get($app-colors, 'separate-content-0');
  border-bottom: 1px solid map-get($app-colors, 'separate-content-200');
}
.tab-text-flow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tab-text-max {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 30ch;
  min-width: 4ch;
}
.limit-tabs {
  // 56px for left navbar and 76 for arrows
  width: calc(100vw - 56px - 74px);
  overflow-x: hidden;
  overflow-y: hidden;
}
.prelimit-tabs {
  width: 100vw;
}
.tab {
  height: 100%;
  border-right: 1px solid map-get($app-colors, 'separate-content-200');
}
.tab-actions {
  opacity: 0;
}
.tab:hover {
  .tab-actions {
    opacity: 1;
  }
}
</style>
