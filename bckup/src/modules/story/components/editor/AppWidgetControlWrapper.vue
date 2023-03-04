<template>
	<app-loading v-show="props.show" :loading="!initialized || loadingComponent">
		<ds-component-wrapper v-bind="props" :component-name="componentName" :groupHeadOption="groupHeadOption" @update:value="setOption($event)" />
	</app-loading>
</template>

<script>
import AppLoading from '@/components/design/AppLoading.vue';

import {mapActions} from 'vuex';
import {optionsHandler} from '@/modules/story/components/editor/utils/optionsHandler';
import {chartConstants} from '@/util/consts/chartsConstants';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';

export default {
	name: 'AppWidgetControlWrapper',
	components: {AppLoading},
	props: {
		optionsName: {
			type: String,
			required: true
		},
		widgetInstanceId: {
			type: String,
			required: true
		},
		groupHeadOption: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			initialized: false
		};
	},
	computed: {
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
		},
		widgetControlType() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType).options[this.optionsName].type;
		},
		widgetControlDefault() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType).options[this.optionsName].default;
		},
		widgetControlMetadata() {
			return this.$store.getters['widgetMetadata/widgetControlMetadata'](this.widgetControlType);
		},
		widgetTypeMetadata() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType);
		},
		isMap() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType).configuration?.data?.mapType ?? false;
		},
		controlSetting() {
			return optionsHandler(this.optionsName, this.widgetInstanceId, this.widgetTypeMetadata.options[this.optionsName]?.props);
		},
		componentName() {
			return this.widgetControlMetadata?.component;
		},
		loadingComponent() {
			return this.$store.getters['dependencies/loading'](this.componentName);
		},
		storeOptionName() {
			return this.optionsName.split('.')[0];
		},
		storeOptionKey() {
			return this.optionsName.split('.')[1] ?? null;
		},
		storeValueByOptionName() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, this.storeOptionName);
		},
		storeValueByOptionNameAndKey() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, this.storeOptionName)?.[this.storeOptionKey];
		},
		storeDefaultValue() {
			return this.getValue(this.$store.getters['widgetInstances/option'](this.widgetInstanceId, this.optionsName), this.widgetControlDefault);
		},
		isLabelOrientationType() {
			return this.storeOptionName === widgetOptionName.LABEL_ROTATE || this.storeOptionName === widgetOptionName.VERTICAL_LABEL;
		},
		props() {
			let val = null;
			if (this.isLabelOrientationType) {
				val = this.getLabelOrientationValue(this.storeValueByOptionName, this.widgetControlDefault);
			} else {
				val = this.getValue(this.storeValueByOptionName, this.widgetControlDefault);
			}
			return {
				...(this.widgetTypeMetadata.options[this.optionsName]?.props ?? {}),
				show: this.controlSetting.show,
				options: this.controlSetting.options,
				disabled: this.controlSetting.disabled,
				...(this.controlSetting.default ? {default: this.controlSetting?.default} : {}),
				value: this.isMap ? this.getStoreValueForMap() : val,
				widgetInstanceId: this.widgetInstanceId
			};
		}
	},
	mounted() {
		this.loadComponent(this.componentName);
		this.initialized = true;
	},
	methods: {
		...mapActions('dependencies', {loadComponent: 'loadDependency'}),
		setOption(value) {
			const newValue = this.storeOptionKey === null
				? value
				: {
					...(this.$store.getters['widgetInstances/option'](this.widgetInstanceId, this.storeOptionName)),
					[this.storeOptionKey]: value
				};
			this.$store.dispatch('widgetInstances/setOption', {
				widgetInstanceId: this.widgetInstanceId,
				optionName: this.storeOptionKey === null ? this.optionsName : this.storeOptionName,
				value: newValue
			});
		},
		getValue(value, defaultValue) {
			return value ?? defaultValue;
		},
		getLabelOrientationValue(value, defaultValue) {
			return value === true ? chartConstants.chartConst.VERTICAL : value === false ? chartConstants.chartConst.HORIZONTAL : value ?? defaultValue;
		},
		getStoreValueForMap() {
			return this.storeOptionKey === null ? this.storeDefaultValue : this.storeValueByOptionNameAndKey;
		}
	}
};
</script>
