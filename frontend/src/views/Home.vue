<!--
  File: Home.vue
  Author: Fromsko
  Created At: 2024-09-22
  GitHub: https://github.com/fromsko
  Description: 主页
-->

<template>
  <n-space>
    <Loading />
  </n-space>
</template>

<script lang="ts">
import Loading from '@/components/Loading.vue'
import { useRouter } from 'vue-router'

export default {
  methods: {
    LoginPage: () => {
      const router = useRouter()
      router.push('/login')
    },
  },
}
</script>

<style scoped>
h1 {
  user-select: none;
  text-align: center;
}
</style>
