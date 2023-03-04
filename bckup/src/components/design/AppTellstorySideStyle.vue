<template>
	<ds-col cols="7" class="d-none d-md-block background-rectangle">
		<div class="red-rectangle" />
		<div class="blue-rectangle" />
		<div class="bubble bubble-red" />
		<div class="bubble bubble-white" />
		<div class="bubble bubble-cookie" />
		<div class="bubble bubble-blue" />
	</ds-col>
</template>

<script>
export default {
	name: 'AppTellstorySideStyle'
};
</script>

<style scoped>
.red-rectangle {
  z-index: -3;
  background-color: rgba(240, 74, 76, 0.1);
  position: fixed;
  width: 200vw;
  height: 200vh;
  top: -10%;
  left: -89%;
  transform: rotate(252deg);
}

.blue-rectangle {
  z-index: -2;
  background-color: rgba(84, 196, 202, 0.1);
  position: fixed;
  width: 200vw;
  height: 200vh;
  top: 37%;
  left: -14%;
  transform: rotate(162deg);
}

.background-rectangle {
  background-color: #070047;
  z-index: -4;
}
.bubble {
  z-index: -1;
  border-radius: 100%;
  position: fixed;
}

.bubble-red {
  background-color: #f04a4c;
  width: 7.5vw;
  height: 7.5vw;
  top: 57%;
  left: 62%;
}

.bubble-cookie {
  background-color: #fdd1a9;
  width: 6vw;
  height: 6vw;
  top: 10%;
  left: 47%;
}

.bubble-blue {
  background-color: #54c4ca;
  width: 35vw;
  height: 35vw;
  top: 56%;
  left: 71%;
}

.bubble-white {
  background-color: #ffffff;
  width: 13vw;
  height: 13vw;
  top: 17%;
  left: 80%;
}
</style>
