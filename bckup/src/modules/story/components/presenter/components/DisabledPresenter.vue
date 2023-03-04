<template>
	<ds-box class="vh-100" flex-type="column">
		<ds-box align-y="bottom" align="center">
			<ds-box padding-bottom="M">
				<img src="@/assets/frown.png" alt="Sad smile">
			</ds-box>
			<ds-box padding="M">
				<ds-text variant="subheadline">
					{{ message }}
				</ds-text>
			</ds-box>
			<ds-box>
				<ds-inline-item :width="480">
					<ds-text variant="ds-paragraphLarge" align="center" color="display-content">
						{{ subMessage }}
						<a class="active-link" :href="redirectRoute">{{ $t('base.appName') }}</a>
					</ds-text>
				</ds-inline-item>
			</ds-box>
		</ds-box>

		<ds-box align="center" align-y="bottom" padding-bottom="XL">
			<ds-text variant="caption" color="display-content">
				<a class="disabled-link" href="https://ataccama.com/platform/data-stories">Data Stories </a> by Ataccama.
			</ds-text>
			<ds-text variant="caption" color="display-content">
				<a class="disabled-link" href="mailto:datastories@ataccama.com">{{ $t('disabledPresenter.t_contactUs') }}</a>
				{{ $t('disabledPresenter.t_forPricing') }}.
				{{ $t('disabledPresenter.t_joinOur') }} <a class="disabled-link" href="https://community.ataccama.com/data-stories-5">
					{{ $t('disabledPresenter.t_community') }}</a>
			</ds-text>
		</ds-box>
	</ds-box>
</template>

<script>
import {computed, onMounted, reactive, toRefs} from 'vue';
import {useRoute} from 'vue-router';

export default {
	name: 'DisabledPresenter',
	setup() {
		const route = useRoute();
		const state = reactive({
			message: '',
			subMessage: ''
		});
		const redirectRoute = computed(() => window?.location?.origin ?? '');
		onMounted(() => {
			state.message = route?.params?.msg;
			state.subMessage = route?.params?.sub;
		});
		return {
			...toRefs(state),
			redirectRoute
		};
	}
};
</script>

<style lang="scss" scoped>
.disabled-link {
	color: map-get($ds-colors, 'display-content-500');
	text-decoration: underline;
}

.active-link {
	color: map-get($ds-colors, 'secondary');
}
</style>
