<script setup lang="ts">

const exit = () => {
  navigateTo('/')
}
</script>

<template>
  <div
      class="flex items-center justify-center w-screen h-screen bg-black"
      @click="exit"
  >
    <p class="text-white text-5xl">GAME OVER</p>
  </div>
</template>

<style scoped>

</style>