<template>
	<notifications position="bottom left" :duration="3000" width="372">
		<template #body="props">
			<ds-box padding-left="L" padding-bottom="S">
				<div
					:class="`ds-border-${props.item.type}`"
					class="flash-msg mt-1">
					<div
						:class="`ds-text-${props.item.type}`"
						class="width-minor">
						<fa-icon :icon="icon(props.item.type)" size="2x" />
					</div>
					<div class="d-flex flex-column justify-content-center align-items-center width-main main-text">
						<span v-if="props.item.title" class="title">
							{{ props.item.title }}
						</span>
						<span>
							{{ props.item.text }}
						</span>
					</div>
					<div class="width-minor">
						<ds-box flex-type="column" class="cursor-pointer" @click="props.close">
							<ds-box>
								<fa-icon :icon="['fal', 'times']" class="mr-0" size="1x" />
							</ds-box>
							<ds-box>
								esc
							</ds-box>
						</ds-box>
					</div>
				</div>
			</ds-box>
		</template>
	</notifications>
</template>

<script>
export default {
	name: 'AppToastMessage',
	methods: {
		icon(type) {
			switch (type) {
				case 'success': return [
					'fas',
					'check-circle'
				];
				case 'danger': return [
					'fas',
					'times-circle'
				];
				case 'warning': return [
					'fas',
					'exclamation-triangle'
				];
				case 'info': return [
					'fas',
					'info-circle'
				];
				default: return [
					'fas',
					'check-circle'
				];
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.flash-msg {
	width: 348px;
	height: 82px;
	border: none;
	border-left: 4px solid;
	border-radius: 4px;
	box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1),
	inset 0 0 0 1px #D0D9DE;
	display: flex;
	text-align: center;
	align-items: center;
	background-color: #FFFFFF;
}

.title {
	font-family: Roboto;
	font-style: normal;
	font-weight: 500;
	font-size: 17px;
	line-height: 28px;
	color: map-get($ds-colors, 'display-content-700');
}

.main-text {
	align-items: start !important;
}

.width-minor {
	width: 15%;
}

.width-main {
	width: 70%;
}
</style>
