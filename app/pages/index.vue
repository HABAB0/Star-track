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
  animation: zoomIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes zoomIn {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(3.7);
    opacity: 1;
  }
}
</style>