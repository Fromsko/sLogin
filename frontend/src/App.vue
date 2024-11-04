<template>
  <div>
    <Header />
    <n-message-provider>
      <content />
    </n-message-provider>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import '@/assets/fonts/font.css'
import { defineComponent } from 'vue'
import Content from './components/Content.vue'
import Header from './components/Header.vue'
</script>

<style>
html,
body {
  margin: 0;
  font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}
#app {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: center;
  background: linear-gradient(200deg, #72afd3, #96fbc4);
}
</style>
