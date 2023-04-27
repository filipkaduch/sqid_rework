import AppButton from "@/components/main/button/AppButton.vue";
import AppBox from "@/components/main/layout/box/AppBox.vue";
import Inline from "@/components/main/layout/inline/Inline.vue";
export default {
  title: 'Buttons/AppButton',
  component: AppButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: {}
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {AppButton, AppBox},
  template: '<app-box flex-type="row" align-y="center"><app-button v-bind="$props">{{ $props.label }}</app-button></app-box>'
});
export const Primary = Template.bind({});
Primary.args = {
    variant: 'primary',
    label: 'Primary',
    disabled: false,
    pressed: false,
    pill: true,
    center: true
};

export const Ghost = Template.bind({});
Ghost.args = {
    variant: 'ghost',
    label: 'Ghost',
    disabled: false,
    pressed: false,
    pill: true,
    center: true
};

