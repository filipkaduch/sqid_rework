<template>
	<div>
		<template v-if="loading">
			<div v-if="noOverlay" class="progress-bar--container visible" />
			<div v-else class="d-flex align-items-center justify-content-center h-100" :class="{'position-relative': relativeParent}">
				<ds-icon class="spinner" name="ds-icon-loader-big" />
			</div>
		</template>
		<slot v-else />
	</div>
</template>

<script>
export default {
	name: 'AppLoading',
	props: {
		loading: {
			type: Boolean,
			required: true
		},
		noOverlay: {
			type: Boolean,
			default: false
		},
		relativeParent: {
			type: Boolean,
			default: false
		}
	}
};
</script>

<style lang="scss" scoped>
.spinner {
	position: absolute;
	top: 50%;
	left: 50%;
	margin-left: -10px;
	margin-top: -10px;
	z-index: 0;
	animation: spin 1s linear infinite;
}

.position-relative {
	position: relative;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

/* stolen from https://codepen.io/apptum/pen/GNGXZj */
.progress-bar--container {
  width: 100%;
  height: 4px;
  background-color: rgba($primary, .3);
  display: none;
  position: absolute;
  top: 0;
  overflow: hidden;
  transition: opacity 0.1s ease-out;
  opacity: 1;
}

.progress-bar--container::after {
  background-color: $primary;
  content: "";
  position: absolute;
  width: inherit;
  height: inherit;
  transform-origin: left;
}

.progress-bar--container.visible {
  display: block;
  animation: progress-bar--container_fadeIn 0.2s ease-in;
}

.progress-bar--container.visible::after {
  display: block;
  animation: progress-bar_fill 2s linear;
  animation-iteration-count: infinite;
}

@keyframes progress-bar_fill {
  0% {
    transform: scaleX(0) translateX(0);
  }
  1% {
    transform: scaleX(0) translateX(0);
  }
  33% {
    transform: scaleX(0.66) translateX(16.5%);
  }
  75% {
    transform: scaleX(1.5) translateX(66%);
  }
  100% {
    transform: scaleX(2) translateX(150%);
  }
}

@keyframes progress-bar--container_fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
