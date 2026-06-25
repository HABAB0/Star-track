<script setup lang="ts">
import {useEventListener, useRafFn} from "@vueuse/core";
import type {bullet, meteor, sleeve} from "@/components/types/types.ts"

interface Props {
  shipPosX: number
  shipPosY: number
  bullets: bullet[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:bullets', bullets: bullet[]): void;
}>()

const bullets = ref<bullet[]>([])
const sleeves = ref<sleeve[]>([])

const bulletSpawner = () => {
  bullets.value.push({
    id: crypto.randomUUID(),
    x: (props.shipPosX + (144 / 2)),
    y: props.shipPosY,
  })
  bullets.value.push({
    id: crypto.randomUUID(),
    x: (props.shipPosX + (40 / 2)),
    y: props.shipPosY,
  })

  sleeves.value.push({
    id: crypto.randomUUID(),
    x: (props.shipPosX + (80 / 2)),
    y: props.shipPosY + 90,
    rotation: 0
  })
}

useRafFn(() => {
  bullets.value.forEach(bullet => {
    bullet.y -= 15
  })

  sleeves.value.forEach(sleeve => {
    sleeve.y += 10
    sleeve.x += 5
    sleeve.rotation += Math.random() * 20
  })
  sleeves.value = sleeves.value.filter(meteor => meteor.y < (900))
  bullets.value = bullets.value.filter(bullet => bullet.y > (-20))
  emit('update:bullets', bullets.value)
})

useEventListener(window, 'keydown',(event) => {
  if (event.code === 'Space') {
    bulletSpawner()
  }
})
</script>

<template>
  <div class="absolute">
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
    <div
        v-for="sleeve in sleeves"
        :key="sleeve.id"
        class="absolute w-10"
        :style="{
          left: `${sleeve.x}px`,
          top: `${sleeve.y}px`,
          transform: `rotate(${sleeve.rotation}deg)`
        }"
    >
      <img src="/image/banana/sleeves.png" alt="гильза">
    </div>
  </div>
</template>

<style scoped>

</style>