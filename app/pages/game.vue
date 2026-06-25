<script setup lang="ts">
import {useEventListener} from "@vueuse/core";
import Bullets from "~/components/bullets/bullets.vue";
import type {bullet} from "@/components/types/types.ts"

const gameSpace = ref<HTMLElement>()

const inMenu = ref<boolean>(false)
const posY = ref<number>(0)
const posX = ref<number>(0)
const speed = 30
const bullets = ref<bullet[]>([])

const closeMenu = () => {
  inMenu.value = false
}
const exit = () => {
  navigateTo('/')
}
const test = () => {
  navigateTo('/test')
}

const loseGame = () => {
  navigateTo('/test')
}

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
    >
      <div class="game" ref="gameSpace">
        <div v-if="inMenu" class="absolute z-10 flex justify-center items-center w-full h-full bg-black opacity-80">
            <div class="flex flex-col gap-20">
              <button class="menu-item" @click="closeMenu">Возобнови́ть</button>
              <button class="menu-item" @click="test">Настройки</button>
              <button class="menu-item" @click="exit">Выход</button>
            </div>
        </div>
        <div>
          <meteors-field
              :ship-pos-x="posX"
              :ship-pos-y="posY"
              @lose-game=""
              :bullets="bullets"
          />
        </div>
        <div>
          <bullets
              v-model:bullets="bullets"
              :ship-pos-x="posX"
              :ship-pos-y="posY"
          />
        </div>
        <div class="">
          <ship
              :game-space="gameSpace"
              v-model:pos-x="posX"
              v-model:pos-y="posY"
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
  background-image: url("/image/machine-zoomed.png");
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
  background-image: url("/image/game-bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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

</style>