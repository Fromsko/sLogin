<!--
  File: MenuBar.vue
  Author: Fromsko
  Created At: 2024-09-23
  GitHub: https://github.com/fromsko
  Description: 阿里云贴边栏
-->
<template>
  <div class="container">
    <div class="left-box" ref="leftBox">
      <ul>
        <li class="item active" @click="setActive($event.target)">
          <i class="icon icon-file"></i>
          文件
        </li>
        <li class="item" @click="setActive($event.target)">
          <i class="icon icon-album"></i>
          相册
        </li>
        <li class="item" @click="setActive($event.target)">
          <i class="icon icon-like"></i>
          收藏夹
        </li>
        <li class="item" @click="setActive($event.target)">
          <i class="icon icon-vault"></i>
          保险箱
        </li>
        <li class="item" @click="setActive($event.target)">
          <i class="icon icon-favorite"></i>
          订阅
        </li>
        <li class="item" @click="setActive($event.target)">
          <i class="icon icon-trash"></i>
          回收站
        </li>
        <hr />
        <li class="item" @click="setActive($event.target)">
          <i class="icon icon-transfer"></i>
          传输列表
        </li>
      </ul>
      <div class="user-info">
        <img src="https://q.qlogo.cn/g?b=qq&nk=1614355756&s=100" alt="" @click="router.back" />
        <span>草帽小子</span>
        <i class="icon icon-gear" @click="openSettingModal">
          <SettingModal v-if="showModal" :isOpen="showModal" />
        </i>
      </div>
    </div>
    <div class="right-box">
      <div class="top">
        <span class="current-tag">{{ currentTag }}</span>
      </div>
      <!-- <div class="middle">i'm xiaohuihui</div> -->
      <RouterView class="middle"></RouterView>
      <div class="handler" ref="handler" @click="toggleLeftBox"></div>
      <ActionMenu />
    </div>
  </div>
</template>

<script setup lang="ts">
import ActionMenu from '@/components/ActionMenu.vue'
import SettingModal from '@/components/SettingModal.vue'
import router from '@/router'
import { onBeforeMount, onMounted, ref } from 'vue'
import { WindowSetSize } from '../../wailsjs/runtime/runtime'

onBeforeMount(async () => {
  await WindowSetSize(700, 490)
})

const showModal = ref(false)
const currentTag = ref('文件')
const leftBoxWidth = ref('185px')
const items = ref<NodeListOf<Element> | null>(null)
const currentTagRef = ref<HTMLElement | null>(null)
const handlerRef = ref<HTMLElement | null>(null)
const leftBoxRef = ref<HTMLElement | null>(null)

function setActive(target: EventTarget | null) {
  if (items.value && currentTagRef.value && target instanceof Element) {
    items.value.forEach((item) => {
      item.classList.remove('active')
    })
    target.classList.add('active')
    console.log(target.getAttribute('value'), target.textContent)

    currentTag.value = target.textContent as string
    currentTagRef.value.innerText = target.textContent as string
  }
}

function toggleLeftBox() {
  if (handlerRef.value && leftBoxRef.value) {
    if (!handlerRef.value.classList.contains('close')) {
      leftBoxWidth.value = '0'
      handlerRef.value.classList.add('close')
    } else {
      leftBoxWidth.value = '185px'
      handlerRef.value.classList.remove('close')
    }
    leftBoxRef.value.style.width = leftBoxWidth.value
  }
}

const openSettingModal = () => {
  showModal.value = true
  console.log(showModal.value)
}

onMounted(() => {
  items.value = document.querySelectorAll('.item')
  currentTagRef.value = document.querySelector('.current-tag')
  handlerRef.value = document.querySelector('.handler')
  leftBoxRef.value = document.querySelector('.left-box')
})
</script>

<style scoped>
* {
  /* 初始化 */
  margin: 0;
  padding: 0;
  user-select: none;
  /* overflow: hidden; */
}
.container {
  width: 100vw;
  height: 100vh;
  /* 弹性布局 水平排列 */
  overflow: auto;
  display: flex;
}
/* 字体图标 */
.icon {
  color: #fff;
  font-size: 24px;
}
/* 左侧导航栏 */
.left-box {
  width: 185px;
  height: 100%;
  /* 半透明背景 */
  background-color: rgba(0, 0, 0, 0.65);
  /* 背景模糊（毛玻璃） */
  backdrop-filter: blur(30px);
  /* 相对定位 */
  position: relative;
  color: #fff;
  font-size: 14px;
  /* 弹性布局 垂直排列 */
  display: flex;
  flex-direction: column;
  /* 设置过渡 */
  transition: 0.5s ease;
  /* 不让文字换行 */
  white-space: nowrap;
  overflow: hidden;
}
.left-box ul {
  list-style: none;
  width: 90%;
  margin: 25px auto;
  /* 高度铺满 */
  flex: 1;
}
.left-box li {
  height: 46px;
  /* 弹性布局 垂直居中 */
  display: flex;
  align-items: center;
  padding-left: 12px;
  border-radius: 10px;
  cursor: pointer;
  /* 过渡 */
  transition: 0.3s;
}
/* 选中态样式 */
.left-box li.active,
.left-box li.active:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.left-box li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.left-box hr {
  width: 90%;
  margin: 18px auto;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.left-box .icon {
  margin-right: 16px;
}
/* 用户信息区域 */
.user-info {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  padding: 24px;
}
.user-info img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 14px;
}
.user-info span {
  flex: 1;
}
.user-info .icon {
  font-size: 20px;
  margin-right: 0;
}
/* 右侧区域 */
.right-box {
  /* background-color: #0f0f11; */
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}
.right-box .top {
  margin: 25px 35px;
  display: flex;
  align-items: center;
  height: 46px;
}
.right-box .top .current-tag {
  flex: 1;
  color: #fff;
  font-weight: 600;
}

.right-box .middle {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #222;
  font-size: 6vw;
  font-weight: bold;
  text-transform: uppercase;
}

/* 展开收起开关 */
.right-box .handler {
  width: 10px;
  height: 50px;
  /* 绝对定位 垂直居中 */
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  /* 光标变小手 */
  cursor: pointer;
  /* 默认不透明度为0 */
  opacity: 0;
  /* 过渡 */
  transition: opacity 0.3s;
}
.right-box .handler::before,
.right-box .handler::after {
  content: '';
  background-color: rgba(41, 194, 214, 0.5);
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  border-radius: 10px 10px 0 0;
  /* 过渡 */
  transition: 0.2s;
}
.right-box .handler::after {
  bottom: 0;
  border-radius: 0 0 10px 10px;
}
.right-box:hover .handler {
  opacity: 1;
}
.right-box .handler:hover::before {
  transform: skewX(-15deg);
}
.right-box .handler:hover::after {
  transform: skewX(15deg);
}
.right-box .handler.close:hover::before {
  transform: skewX(15deg);
}
.right-box .handler.close:hover::after {
  transform: skewX(-15deg);
}
</style>
