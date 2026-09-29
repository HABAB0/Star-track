<script setup lang="ts">
import {useEventListener} from "@vueuse/core";

const clickToStart = ref<boolean>(true)
const handleListener = () => {
  if (clickToStart.value) {
    clickToStart.value = false
  }
}

const onAnimationEnd = () => {
  navigateTo('/game')
}

useEventListener(window,'keydown', handleListener)
useEventListener(window,'click', handleListener)
</script>
<template>
    <div
        class="main"
        :class="{ zoom: !clickToStart }"
        :style="{ backgroundImage: `url('${useImg('/image/main-bg.png')}')` }"
        @animationend="onAnimationEnd"
    >
      <p
          v-if="clickToStart"
          class="flex justify-center items-center mb-50 text-5xl text-white h-full w-full opacity-80 bg-black overflow-hidden"
      >
        Press any button
      </p>
      <div v-if="!clickToStart" class="warp-flash" aria-hidden="true"></div>
    </div>
</template>
<style>
.main {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform-origin: 50% 29%;
  overflow: hidden;
}

.zoom {
  overflow: hidden;
  animation: warpZoom 1.8s cubic-bezier(0.33, 1, 0.68, 1) forwards;
}

@keyframes warpZoom {
  0% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  55% {
    transform: scale(2.3) rotate(1deg);
    filter: brightness(1.4);
  }
  100% {
    transform: scale(6.5) rotate(-2deg);
    filter: brightness(2.8);
  }
}

.warp-flash {
  position: absolute;
  inset: -10%;
  background: radial-gradient(circle at 50% 29%, rgba(255, 255, 255, 0) 25%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0.95) 100%);
  pointer-events: none;
  animation: flashOut 1.8s ease-in forwards;
  z-index: 2;
}

@keyframes flashOut {
  0% {
    opacity: 0;
  }
  65% {
    opacity: 0.9;
  }
  100% {
    opacity: 1;
  }
}
</style>