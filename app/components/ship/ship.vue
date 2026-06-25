<script setup lang="ts">
import {useEventListener, useRafFn} from "@vueuse/core";

interface Props {
  gameSpace: HTMLElement
  inMenu: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:posX', posX: number): void;
  (e: 'update:posY', posY: number): void;
}>()

const ship = ref<HTMLElement>()

const posY = ref<number>(400)
const posX = ref<number>(400)
const speed = 4

const buttons = {
  w: false,
  a: false,
  s: false,
  d: false,
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.code === 'KeyW') buttons.w = true
  if (event.code === 'KeyA') buttons.a = true
  if (event.code === 'KeyS') buttons.s = true
  if (event.code === 'KeyD') buttons.d = true
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.code === 'KeyW') buttons.w = false
  if (event.code === 'KeyA') buttons.a = false
  if (event.code === 'KeyS') buttons.s = false
  if (event.code === 'KeyD') buttons.d = false
}

useRafFn(() => {
  if (props.inMenu) return
  const spaceW = props.gameSpace.offsetWidth || 0
  const spaceH = props.gameSpace.offsetHeight || 0
  const shipW = ship.value?.offsetWidth || 0
  const shipH = ship.value?.offsetHeight || 0

  const minX = 0
  const maxX = spaceW - shipW
  const minY = 0
  const maxY = spaceH - shipH

  if (buttons.w) posY.value -= speed
  if (buttons.a) posX.value -= speed
  if (buttons.s) posY.value += speed
  if (buttons.d) posX.value += speed
  posX.value = Math.max(minX, Math.min(maxX, posX.value))
  posY.value = Math.max(minY, Math.min(maxY, posY.value))

  emit('update:posX', posX.value)
  emit('update:posY', posY.value)
})

useEventListener(window, 'keydown', handleKeyDown)
useEventListener(window, 'keyup', handleKeyUp)

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
  position: absolute;
  width: 130px;
  height: 170px;
  transition: 0.0092s ease;
}
</style>