import AppInput from "@/components/main/input/AppInput.vue";

export default {
    title: 'Inputs/Input',
    component: AppInput,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: {
                type: 'radio'
            },
            options: [
                'text',
                'password',
                'email',
                'number',
                'url',
                'tel',
                'search',
                'range',
                'color',
                'date',
                'time',
                'datetime',
                'datetime-local',
                'month',
                'week'
            ]
        },
        placeholder: {
            control: {
                type: 'text'
            }
        }
    }
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {AppInput},
    template: '<app-input v-bind="$props" />'
});

export const Settings = Template.bind({});
Settings.args = {
    type: 'text',
    placeholder: 'text'
};
