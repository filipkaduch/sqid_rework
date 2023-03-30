import {LocaleMessages} from 'vue-i18n';

export const SUBMENU_COMPONENT_TYPES = {
    COMPONENT: 'component',
    DROPDOWN: 'dropdown',
    SELECT: 'select'
};

type SubmenuComponentType = 'component' | 'dropdown' | 'select'

export type SelectItem = {
    value: string | number | boolean
    label: string | LocaleMessages<string>
    order?: string | LocaleMessages<string>
    group?: string
    icon?: string
    smallIcon?: boolean
    selected?: Boolean
    disabled?: boolean
    properties?: {
        tooltipText?: string | LocaleMessages<string>
        // submenu is the name of emitted action from submenu
        submenu?: string,
        // submenuType sets the type of submenu component
        submenuType?: SubmenuComponentType
        // optional if you want to use component as a submenu and pass it some props
        submenuComponentProps?: any,
        // use this when you want to use component as a submenu item (e.g. 'column-select-number')
        submenuComponent?: string
        // Set the Select item color text
        color?: string
        // Add extra padding on Y axis to Select item
        extraPadding?: boolean
        // Hide bottom border of Select item
        hideBorder?: boolean
        clearBtnText?: string | LocaleMessages<string>
        clearBtnIcon?: string | LocaleMessages<string>
        clearBtn?: boolean
        // Items for submenu use with submenuType dropdown or select
        submenuItems?: any
        // If you want to split submenu into groups
        submenuGroups?: any
        // Subtext for select item
        subText?: string
    }
};
