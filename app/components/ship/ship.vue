<script setup lang="ts">
import {useEventListener} from "@vueuse/core";

interface Props {
  gameSpace: HTMLElement
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:posX', posX: number): void;
  (e: 'update:posY', posY: number): void;
}>()

const ship = ref<HTMLElement>()

const posY = ref<number>(400)
const posX = ref<number>(400)
const speed = 20

useEventListener(window, 'keydown', (event) => {

  const spaceW = props.gameSpace.offsetWidth || 0
  const spaceH = props.gameSpace.offsetHeight || 0
  const shipW = ship.value?.offsetWidth || 0
  const shipH = ship.value?.offsetHeight || 0

  const minX = 0
  const maxX = spaceW - shipW
  const minY = 0
  const maxY = spaceH - shipH

  if (event.code === 'KeyS') {
    posY.value += speed
  }
  if (event.code === 'KeyW') {
    posY.value -= speed
  }
  if (event.code === 'KeyD') {
    posX.value += speed
  }
  if (event.code === 'KeyA') {
    posX.value -= speed
  }
  posX.value = Math.max(minX, Math.min(maxX, posX.value))
  posY.value = Math.max(minY, Math.min(maxY, posY.value))

  emit('update:posX', posX.value)
  emit('update:posY', posY.value)
})

onMounted(() => {
  if (props.gameSpace && ship.value) {
    const spaceW = props.gameSpace.offsetWidth
    const spaceH = props.gameSpace.offsetHeight
    const shipW = ship.value.offsetWidth
    const shipH = ship.value.offsetHeight
  }
})
</script>

<template>
    <img class="ship" :style="{ top: `${posY}px`, left: `${posX}px` }" ref="ship" src="/image/ship.png" alt="корабль">
</template>

<style scoped>
.ship {
  position: relative;
  width: 130px;
  height: 170px;
  transition: 0.0092s ease;
}
</style>