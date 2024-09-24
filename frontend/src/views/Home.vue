<!--
  File: Home.vue
  Author: Fromsko
  Created At: 2024-09-22
  GitHub: https://github.com/fromsko
  Description: 主页
-->

<template>
  <h1>Wellcome to Home Page.</h1>
  <n-space>
    <n-button type="info" @click="LoadingPage"> Loading页面 </n-button>
    <n-button type="info" @click="ActionMenuPage"> Menu页面 </n-button>
    <n-button type="info" @click="MenuBarPage"> MenuBar页面 </n-button>
    <n-button type="success" @click="LoginPage"> 登录页面 </n-button>
    <n-button type="error" @click="NotFoundPage"> 404 页面 </n-button>
  </n-space>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { WindowSetSize } from '../../wailsjs/runtime'

const router = useRouter()

const LoadingPage = () => {
  router.push('/loading')
}

const ActionMenuPage = () => {
  router.push('/menu')
}

const MenuBarPage = () => {
  router.push('/menu_bar')
}

const LoginPage = () => {
  router.push('/login')
}

const NotFoundPage = () => {
  router.push('/no')
}

onMounted(() => {
  WindowSetSize(750, 520)
})

defineComponent({
  name: 'Home',
})
</script>

<style scoped>
h1 {
  user-select: none;
  text-align: center;
}
</style>
