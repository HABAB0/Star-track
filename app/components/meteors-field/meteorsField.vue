<script setup lang="ts">
import {useElementSize, useIntervalFn, useRafFn} from "@vueuse/core";

interface Props {
  shipPosX: number
  shipPosY: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'loseGame'): void;
}>()

const meteorsBg = [
    '/image/meteorite/base-meteor.png',
    '/image/meteorite/fire-meteor.png',
    '/image/meteorite/moon-meteor.png'
]
const meteorSpace = ref<HTMLElement>()
const { width, height } = useElementSize(meteorSpace)

const meteorField = ref<meteor[]>([
])

interface meteor {
  id: string
  image: string
  x: number
  y: number
  speed: number
  rotation: number
}

const meteorSpawner = () => {
  meteorField.value.push({
    id: crypto.randomUUID(),
    image: meteorsBg[Math.floor(Math.random() * meteorsBg.length)],
    x: Math.random() * width.value,
    y: -100,
    speed: 2 + Math.random() * 3,
    rotation: 0
  })
}


const deleteMeteor = (id: string) => {
  meteorField.value = meteorField.value.filter(meteor => meteor.id !== id)
}

const checkCollision = () => {
  meteorField.value.forEach(meteor => {
    const isCollision =
        meteor.x < props.shipPosX + 130 &&
        meteor.x + 90 > props.shipPosX &&
        meteor.y < props.shipPosY + 170 &&
        meteor.y + 90 > props.shipPosY
    if (isCollision) {
      emit('loseGame')
    }
  })
}

useRafFn(() => {
  meteorField.value.forEach(meteor => {
    meteor.y += meteor.speed
    meteor.rotation += Math.random() * 2
  })
  meteorField.value = meteorField.value.filter(meteor => meteor.y < (height.value + 900))
  checkCollision()
})

const { pause, resume } = useIntervalFn(meteorSpawner, 1000)
</script>

<template>
  <div class="flex relative w-full h-full" ref="meteorSpace">
    <div
        v-for="meteor in meteorField"
        :key="meteor.id"
        class="absolute meteor"
        :style="{
          left: `${meteor.x}px`,
          top: `${meteor.y}px`,
          transform: `rotate(${meteor.rotation}deg)`
        }"
    >
      <img :src="meteor.image" class="meteor-img" alt="метеорит">
    </div>
  </div>
</template>

<style scoped>
.meteor-img {
  width: 90px;
}
</style>