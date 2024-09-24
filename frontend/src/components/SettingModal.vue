<!--
  File: SettingModal.vue
  Author: Fromsko
  Created At: 2024-09-23
  GitHub: https://github.com/fromsko
  Description: 设置模态框
-->

<template>
  <n-modal
    v-model:show="showModalRef"
    :mask-closable="false"
    preset="dialog"
    title="设置"
    content="这里将来会集成一些设置进来!"
    positive-text="确认"
    negative-text="算了"
    @positive-click="clickEvent.onPositiveClick"
    @negative-click="clickEvent.onNegativeClick"
  />
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const showModalRef = ref(props.isOpen)
const clickEvent = {
  onNegativeClick() {
    window.$message.success('Cancel')
    showModalRef.value = false
  },
  onPositiveClick() {
    window.$message.success('Submit')
    showModalRef.value = false
  },
}
</script>

<style scoped></style>
