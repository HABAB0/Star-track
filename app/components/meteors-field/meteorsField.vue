<script setup lang="ts">
import {useElementSize, useIntervalFn, useRafFn} from "@vueuse/core";
import type {bullet, meteor} from "@/components/types/types.ts"

interface Props {
  shipPosX: number
  shipPosY: number
  bullets: bullet[]
  inMenu: boolean
  gameOver: boolean
  difficulty: 'easy' | 'normal' | 'hard'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'loseGame'): void;
  (e: 'destroyMeteor'): void;
}>()

const meteorsBg = [
    useImg('/image/meteorite/base-meteor.png'),
    useImg('/image/meteorite/fire-meteor.png'),
    useImg('/image/meteorite/moon-meteor.png')
]
const meteorSpace = ref<HTMLElement>()
const { width, height } = useElementSize(meteorSpace)

const METEOR_SIZE = 90
const METEOR_RADIUS = 33

const SHIP_W = 130
const SHIP_H = 170
const SHIP_INSET_X = 8
const SHIP_INSET_TOP = 10
const SHIP_INSET_BOTTOM = 14

const BULLET_SIZE = 40
const BULLET_RADIUS = 8

const circleHitsRect = (cx: number, cy: number, r: number, rx1: number, ry1: number, rx2: number, ry2: number) => {
  const nx = Math.max(rx1, Math.min(cx, rx2))
  const ny = Math.max(ry1, Math.min(cy, ry2))
  const dx = cx - nx
  const dy = cy - ny
  return dx * dx + dy * dy <= r * r
}

const circleHitsCircle = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) => {
  const dx = x1 - x2
  const dy = y1 - y2
  const r = r1 + r2
  return dx * dx + dy * dy <= r * r
}

const meteorField = ref<meteor[]>([])

const speed = () => {
  if (props.difficulty === 'easy') return 1
  if (props.difficulty === 'hard') return 6
  return 3
}

const meteorSpawner = () => {
  if (props.inMenu || props.gameOver) return
  meteorField.value.push({
    id: crypto.randomUUID(),
    image: meteorsBg[Math.floor(Math.random() * meteorsBg.length)],
    x: width.value > METEOR_SIZE
        ? Math.random() * (width.value - METEOR_SIZE)
        : 0,
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
  if (props.inMenu || props.gameOver) return

  const shipLeft = props.shipPosX + SHIP_INSET_X
  const shipRight = props.shipPosX + SHIP_W - SHIP_INSET_X
  const shipTop = props.shipPosY + SHIP_INSET_TOP
  const shipBottom = props.shipPosY + SHIP_H - SHIP_INSET_BOTTOM

  meteorField.value = meteorField.value.filter(meteor => {
    const mx = meteor.x + METEOR_SIZE / 2
    const my = meteor.y + METEOR_SIZE / 2

    const hitShip = circleHitsRect(mx, my, METEOR_RADIUS, shipLeft, shipTop, shipRight, shipBottom)

    if (hitShip) {
      gameOver = true
    }

    let hitByBullet = false
    if (props.bullets) {
      hitByBullet = props.bullets.some(bullet =>
          circleHitsCircle(mx, my, METEOR_RADIUS, bullet.x + BULLET_SIZE / 2, bullet.y + 11, BULLET_RADIUS)
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
  if (props.inMenu || props.gameOver) return
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
.meteor {
  width: 90px;
  height: 90px;
}

.meteor-img {
  width: 100%;
  height: 100%;
  padding: 8px;
  object-fit: contain;
}
</style>