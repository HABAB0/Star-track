<script setup lang="ts">
import {useElementSize, useIntervalFn, useRafFn} from "@vueuse/core";
import type {bullet, meteor} from "@/components/types/types.ts"

interface Props {
  shipPosX: number
  shipPosY: number
  bullets: bullet[]
  inMenu: boolean
  difficulty: 'easy' | 'normal' | 'hard'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'loseGame'): void;
  (e: 'destroyMeteor'): void;
}>()

const meteorsBg = [
    '/image/meteorite/base-meteor.png',
    '/image/meteorite/fire-meteor.png',
    '/image/meteorite/moon-meteor.png'
]
const meteorSpace = ref<HTMLElement>()
const { width, height } = useElementSize(meteorSpace)

const meteorField = ref<meteor[]>([])

const speed = () => {
  if (props.difficulty === 'easy') return 1
  if (props.difficulty === 'hard') return 6
  return 3
}

const meteorSpawner = () => {
  if (props.inMenu) return
  meteorField.value.push({
    id: crypto.randomUUID(),
    image: meteorsBg[Math.floor(Math.random() * meteorsBg.length)],
    x: Math.random() * width.value,
    y: -100,
    speed: 2 + Math.random() * speed(),
    rotation: 0
  })
}


const deleteMeteor = (id: string) => {
  meteorField.value = meteorField.value.filter(meteor => meteor.id !== id)
}

const checkCollision = () => {
  let gameOver = false
  if (props.inMenu) return

  meteorField.value = meteorField.value.filter(meteor => {
    const hitShip =
        meteor.x < props.shipPosX + 130 &&
        meteor.x + 90 > props.shipPosX &&
        meteor.y < props.shipPosY + 170 &&
        meteor.y + 90 > props.shipPosY

    if (hitShip) {
      gameOver = true
    }

    let hitByBullet = false
    if (props.bullets) {
      hitByBullet = props.bullets.some(bullet =>
          meteor.x < bullet.x + 3 &&
          meteor.x + 90 > bullet.x &&
          meteor.y < bullet.y + 6 &&
          meteor.y + 90 > bullet.y
      )
    }

    if (hitByBullet) {
      emit("destroyMeteor")
      return false
    }

    return true
  })

  if (gameOver) {
    emit('loseGame')
  }
}

useRafFn(() => {
  if (props.inMenu) return
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
  <div class="flex absolute w-full h-full" ref="meteorSpace">
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