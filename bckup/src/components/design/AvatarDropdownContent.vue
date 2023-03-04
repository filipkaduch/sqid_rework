<template>
	<ds-box padding-y="XS">
		<ds-box padding-x="GROUP" padding-y="S">
			<ds-text variant="subheadlineMedium">
				{{ user.name }}
			</ds-text>
			<ds-text variant="body" color="display-content">
				{{ user.email }}
			</ds-text>
		</ds-box>
		<ds-box
			v-if="!oneIntegration"
			class="dd-item" padding-y="S" padding-x="GROUP"
			@click="$router.push({name: 'billing'})">
			<ds-inline align-y="center" gap="M" no-wrap>
				<ds-icon fill="icon-default" name="ds-icon-document" />
				<ds-text variant="body" color="display-content" no-wrap> {{ $t('Licence information') }} </ds-text>
			</ds-inline>
		</ds-box>
		<ds-box class="dd-item" padding-y="S" padding-x="GROUP" @click="$router.push({name: 'version'})">
			<ds-inline align-y="center" gap="M" no-wrap>
				<ds-icon fill="icon-default" name="ds-icon-info" />
				<ds-text variant="body" color="display-content" no-wrap> {{ $t('version.info') }} </ds-text>
			</ds-inline>
		</ds-box>
		<ds-box class="dd-item" padding-y="S" padding-x="GROUP" @click="$router.push({name: 'logout'})">
			<ds-inline align-y="center" gap="M" no-wrap>
				<ds-icon fill="icon-default" name="ds-icon-log-out" />
				<ds-text variant="body" color="display-content" no-wrap> {{ $t('Logout') }} </ds-text>
			</ds-inline>
		</ds-box>
	</ds-box>
</template>

<script setup lang="ts">
import {computed, inject} from 'vue';
import {useStore} from 'vuex';

const store = useStore();

const appConfig = inject('appConfig');
// @ts-ignore
const oneIntegration = appConfig?.oneIntegration;

const user = computed(() => store.getters['authLogin/tokenData'] ?? {
	name: null,
	email: null
});

</script>

<style scoped lang="scss">
.dd-item:hover, .dd-item:focus {
	cursor: pointer;
	text-decoration: none;
	background-color: map-get($ds-colors, 'separate-content-0');
}

.dd-item.active, .dd-item:active {
	background-color: map-get($ds-colors, 'separate-content-0');
}
</style>
