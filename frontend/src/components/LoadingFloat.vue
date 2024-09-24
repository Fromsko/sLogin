<template>
  <div class="loader">
    <div class="spinner"></div>
    <div class="text">Loading</div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'LoadingFloat',
})
</script>

<style scoped>
.loader {
  /* 禁止选取 */
  user-select: none;
}
.loader .spinner {
  position: relative;
  width: 160px;
  height: 160px;
}
.loader .spinner::before,
.loader .spinner::after {
  content: '';
  position: absolute;
}
/* 图形 */
.loader .spinner::before {
  width: 100%;
  height: 100%;
  background-color: #7edde6;
  /* 执行动画：动画名 时长 贝塞尔曲线 无限次播放 */
  animation: spinner 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite;
}
/* 投影 */
.loader .spinner::after {
  width: 100%;
  height: 4px;
  border-radius: 50%;
  background-color: #333;
  bottom: -40px;
  animation: shadow 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite;
}
/* loading文字 */
.loader .text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 32px;
  text-transform: uppercase;
  font-weight: 100;
  animation: text 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite;
}

/* 定义动画 */
@keyframes spinner {
  50% {
    border-radius: 50%;
    background-color: #f5e866;
    transform: rotate(360deg) scale(0.5);
  }
  100% {
    background-color: #7edde6;
    transform: rotate(720deg);
  }
}
@keyframes shadow {
  50% {
    transform: scale(0.5);
  }
}
@keyframes text {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1, 1);
  }
  50% {
    transform: translate(-50%, -50%) scale(0.5, 0.5);
    color: #000;
  }
}
</style>
