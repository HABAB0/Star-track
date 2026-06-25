<script setup lang="ts">
import {useEventListener, useRafFn} from "@vueuse/core";


interface bullet {
  id: string
  x: number
  y: number
}

interface Props {
  shipPosX: number
  shipPosY: number
}

const props = defineProps<Props>()

const bullets = ref<bullet[]>([])

const bulletSpawner = () => {
  bullets.value.push({
    id: crypto.randomUUID(),
    x: (props.shipPosX + (140 / 2)),
    y: props.shipPosY,
  })
  bullets.value.push({
    id: crypto.randomUUID(),
    x: (props.shipPosX + (60 / 2)),
    y: props.shipPosY,
  })
}

useRafFn(() => {
  bullets.value.forEach(bullet => {
    bullet.y -= 15
  })
  bullets.value = bullets.value.filter(bullet => bullet.y > (-20))
})

useEventListener(window, 'keydown',(event) => {
  if (event.code === 'Space') {
    bulletSpawner()
  }
})
</script>

<template>
  <div
      v-for="bullet in bullets"
      :key="bullet.id"
      class="absolute w-10"
      :style="{
          left: `${bullet.x}px`,
          top: `${bullet.y}px`,
        }"
  >
    <img src="/image/banana/ammo.png" alt="пуля">
  </div>
</template>

<style scoped>

</style>