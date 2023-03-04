<template>
  <app-box padding-y="XS">
    <ul class="m-0">
      <li
          v-for="(item, index) in items"
          :key="item.value"
          v-close-popper
          class="dd-item user-select-none cursor-pointer"
          :class="{disabled: item.disabled}"
          @click="emitSelected(item)">
        <app-box
            :class="item.properties?.subText ? 'h-auto' : ''"
            padding-y="S"
            padding-x="GROUP"
            align-y="center"
            :border-bottom="showUnderline(index) ? 'disabled' : 'none'">
          <app-inline align-y="center" no-wrap>
            <app-box v-if="item.icon" padding-right="S">
              <app-icon :name="`${item.icon}${darkIcon && item.value === 'reupload' ? '-dark' : ''}`" :alt="item.icon" class="icon" />
            </app-box>
            <app-box align-y="center">
              <app-text :variant="item.properties?.subText ? 'bodyMedium' : 'body'" class="d-inline-flex">
                {{ item.label }}
              </app-text>
            </app-box>
          </app-inline>
          <app-box v-if="item.properties?.subText" padding-y="XS" align-y="center">
            <app-text color="display-content-500" variant="body">
              {{ item.properties.subText }}
            </app-text>
          </app-box>
        </app-box>
      </li>
    </ul>
  </app-box>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, PropType} from 'vue';
// eslint-disable-next-line no-unused-vars
import {SelectItem} from '@/components/main/Dropdown/types';

export default defineComponent({
  name: 'AppDropdownMenu',
  props: {
    items: {
      type: Array as PropType<SelectItem[]>,
      required: true
    },
    selected: {
      type: Object as PropType<SelectItem| null>,
      default: null
    },
    darkIcon: {
      type: Boolean,
      default: false
    },
    last: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:selected', 'selected'],
  setup(props, {emit}) {
    const emitSelected = (item: SelectItem) => {
      if (item.value !== props.selected?.value) {
        emit('update:selected', item);
        emit('selected', item);
      }
    };
    const showUnderline = (index: number) => (index !== props.items.length - 1 && !props.last)
        || (props.last && index === props.items.length - 2);

    return {
      emitSelected,
      showUnderline
    };
  }
});
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;
}
.icon {
  height: 20px;
  width: 20px;
  fill: map-get($app-colors, 'display-content');
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.dd-item:hover, .dd-item:focus {
  text-decoration: none;
  background-color: map-get($app-colors, 'separate-content-0');
}

.dd-item.active, .dd-item:active {
  background-color: map-get($app-colors, 'separate-content-0');
}
</style>
