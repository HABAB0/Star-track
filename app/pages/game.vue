<script setup lang="ts">
import {useEventListener, useIntervalFn} from "@vueuse/core";
import Bullets from "~/components/bullets/bullets.vue";
import type {bullet, difficulty} from "@/components/types/types.ts"

const gameSpace = ref<HTMLElement>()
const inMenu = ref<boolean>(false)
const posY = ref<number>(0)
const posX = ref<number>(0)
const bullets = ref<bullet[]>([])
const gameTime = ref(0)
const score = ref<number>(0)
const gameKey = ref<number>(0)
const isLose = ref<boolean>(false)
const inSettings = ref<boolean>(false)
const difficulty = ref<difficulty>('normal')

const options = [
  { value: 'easy', label: 'EASY' },
  { value: 'normal', label: 'MID' },
  { value: 'hard', label: 'HARD' },
]

const closeMenu = () => {
  inMenu.value = false
}

const exit = () => {
  navigateTo('/')
}

const settings = () => {
  inSettings.value = true
}

const goBack = () => {
  inSettings.value = false
}

const loseGame = () => {
  isLose.value = true
}

const resetGame = () => {
  score.value = 0
  gameTime.value = 0
  gameKey.value ++
  isLose.value = false
  closeMenu()
}

const addScore = () => {
  score.value += 100
}

const formattedTime = computed(() => {
  const minutes = Math.floor(gameTime.value / 60)
  const seconds = gameTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const { pause, resume } = useIntervalFn(() => {
  gameTime.value++
}, 1000)


watch(inMenu, (paused) => {
  if (paused) {
    pause()
  } else {
    resume()
  }
})

watch(isLose, (lost) => {
  if (lost) {
    pause()
  } else {
    resume()
  }
})

useEventListener(window, 'keydown', (event) => {
  if (event.code === 'Escape') {
    inMenu.value = !inMenu.value
  }
})
</script>

<template>
  <div class="w-screen h-screen bg-black">
    <div
        class="main"
        :style="{ backgroundImage: `url('${useImg('/image/machine-zoomed.png')}')` }"
    >
      <div class="game" ref="gameSpace" :key="gameKey" :style="{ backgroundImage: `url('${useImg('/image/game-bg.png')}')` }">
        <p class="absolute p-8 text-3xl">{{ formattedTime }} | {{ score }}</p>
        <div
            v-show="isLose"
            class="game-over"
            @click="resetGame"
          >
          <p class="game-over__title">GAME OVER</p>
          <p class="game-over__hint">click to restart</p>
        </div>
        <div v-if="inMenu" class="absolute z-10 flex justify-center items-center w-full h-full bg-black opacity-80">
            <div class="flex flex-col gap-10">
              <button class="menu-item" @click="closeMenu">Resume</button>
              <button class="menu-item" @click="resetGame">Restart</button>
              <button class="menu-item" @click="settings">Settings</button>
              <button class="menu-item" @click="exit">Exit</button>
            </div>
        </div>
        <div
            v-if="inSettings"
            class="settings absolute z-20"
        >
          <p class="settings__title">Settings</p>
          <div class="settings__row">
            <span class="settings__label">Difficulty</span>
            <div class="segment" >
              <button
                  v-for="option in options"
                  :key="option.value"
                  class="segment__btn"
                  :class="{ 'segment__btn--active': difficulty === option.value }"
                  @click="difficulty = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <button class="settings__back" @click="goBack">Back</button>
        </div>
        <div>
          <meteors-field
              :ship-pos-x="posX"
              :ship-pos-y="posY"
              @lose-game=""
              :bullets="bullets"
              :inMenu="inMenu"
              :game-over="isLose"
              @destroy-meteor="addScore"
              :difficulty="difficulty"
              @loseGame="loseGame"
          />
        </div>
        <div>
          <bullets
              v-model:bullets="bullets"
              :ship-pos-x="posX"
              :ship-pos-y="posY"
              :inMenu="inMenu"
              :game-over="isLose"
          />
        </div>
        <div class="">
          <ship
              :game-space="gameSpace"
              v-model:pos-x="posX"
              v-model:pos-y="posY"
              :inMenu="inMenu"
              :game-over="isLose"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  align-items: center;
  justify-content: center;
}

.game {
  width: 42%;
  height: 54%;
  border-radius: 15% 15% 4% 4% / 10% 10% 4% 4%;
  margin-bottom: 7%;
  overflow: hidden;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.game-over {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  border-radius: inherit;
  cursor: pointer;
}

.game-over__title {
  color: #fff;
  font-size: 56px;
  -webkit-text-stroke: 2px #000;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 0, 0, 0.6), 0 0 4px rgba(255, 255, 255, 0.8);
}

.game-over__hint {
  color: #fff;
  font-size: 16px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  color: white;
  font-size: 40px;
  border: 3px solid white;
  width: 100%;
}
.settings {
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100vw;
  height: 100vh;
  padding: 50px;
  background: #000;
  box-sizing: border-box;
}

.settings__title {
  margin: 0;
  font-size: 48px;
  color: #fff;
}

.settings__row {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings__label {
  font-size: 24px;
  color: #8a8a8a;
  letter-spacing: 0.05em;
}

.segment {
  display: flex;
  gap: 12px;
  width: fit-content;
}

.segment__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  padding: 0;
  font-family: inherit;
  font-size: 18px;
  line-height: 1.2;
  color: #6e6e6e;
  background: #141414;
  border: 2px solid #2e2e2e;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s;
}

.segment__btn:hover {
  color: #a8a8a8;
  background: #1e1e1e;
  border-color: #454545;
}

.segment__btn--active {
  color: #e8e8e8;
  background: #262626;
  border-color: #6a6a6a;
  box-shadow: 0 0 0 1px #3a3a3a, inset 0 0 12px rgba(255, 255, 255, 0.04);
}

.segment__btn--active:hover {
  color: #fff;
  background: #2c2c2c;
  border-color: #7a7a7a;
}

.settings__back {
  width: fit-content;
  padding: 12px 28px;
  font-family: inherit;
  font-size: 24px;
  color: #c8c8c8;
  background: #121212;
  border: 2px solid #3a3a3a;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.settings__back:hover {
  color: #fff;
  background: #1c1c1c;
  border-color: #555;
}
</style>