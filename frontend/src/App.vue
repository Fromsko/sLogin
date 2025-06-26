<template>
  <div>
    <n-message-provider>
      <content />
    </n-message-provider>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script setup lang="ts">
import "@/assets/fonts/font.css";
import Content from "@/components/Content.vue";
</script>

<style>
html,
body {
  margin: 0;
  font-family:
    "Nunito",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    sans-serif;
}
#app {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(200deg, #72afd3, #96fbc4);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
