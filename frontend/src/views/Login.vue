<script setup lang="ts">
import LoadingFloat from '@/components/LoadingFloat.vue'
import { useAuth } from '@/utils/composables/useAuth'
import { GlassesOutline, LockClosedOutline, PersonOutline } from '@vicons/ionicons5'
import { onBeforeMount, onUnmounted } from 'vue'
import { WindowSetSize } from '../../wailsjs/runtime'

const { store, loadStoredConfig, attemptNoFeelLogin } = useAuth()

onBeforeMount(async () => {
  await WindowSetSize(400, 500)
  await loadStoredConfig()
  await attemptNoFeelLogin()
})

onUnmounted(async () => {
  if (store.isLogin) {
    const ip = await store.display.clientIp()
    await store.display.notify({
      title: '校园网连接成功',
      data: `IP地址: ${ip}`,
    })
  }
})
</script>

<template>
  <LoadingFloat v-if="store.isAlive" />

  <n-card v-else="store.isAlive" class="Form-Container">
    <n-tabs default-value="signin" size="large" justify-content="space-evenly" type="segment" animated>
      <n-tab-pane name="signin" tab="登录">
        <n-form :model="store.model">
          <n-form-item-row label="用户名">
            <n-input
              type="text"
              :allow-input="store.onlyAllowNumber"
              placeholder="只能输入数字"
              v-model:value="store.model.username"
              @keydown.enter.prevent
              clearable
              round
            >
              <template #prefix>
                <n-icon :component="PersonOutline" />
              </template>
            </n-input>
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input
              type="password"
              placeholder="默认为身份证后6位"
              v-model:value="store.model.password"
              show-password-on="click"
              @keydown.enter.prevent
              round
            >
              <template #prefix>
                <n-icon :component="LockClosedOutline" />
              </template>
              <template #password-visible-icon>
                <n-icon :size="16" :component="GlassesOutline" />
              </template>
            </n-input>
          </n-form-item-row>
          <n-form-item-row label="运营商" class="radio-group-container" size="large">
            <n-radio-group v-model:value="store.model.client" name="radiobuttongroup1" class="flex-group">
              <n-radio-button v-for="cm in store.clientModels" :key="cm.value" :value="cm.value" :label="cm.label" class="radio-button" />
            </n-radio-group>
          </n-form-item-row>
        </n-form>
        <n-button type="primary" round block secondary strong @click="store.handleLogin" :disabled="store.isLogin"> 登录 </n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册" :disabled="true">
        <n-form>
          <n-form-item-row label="用户名">
            <n-input type="text" round clearable>
              <template #prefix>
                <n-icon :component="PersonOutline" />
              </template>
            </n-input>
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input type="password" show-password-on="mousedown" round>
              <template #prefix>
                <n-icon :component="LockClosedOutline" />
              </template>
              <template #password-visible-icon>
                <n-icon :size="16" :component="GlassesOutline" />
              </template>
            </n-input>
          </n-form-item-row>
          <n-form-item-row label="重复密码">
            <n-input type="password" show-password-on="mousedown" round>
              <template #prefix>
                <n-icon :component="LockClosedOutline" />
              </template>
              <template #password-visible-icon>
                <n-icon :size="16" :component="GlassesOutline" />
              </template>
            </n-input>
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong> 注册 </n-button>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style scoped>
.Form-Container {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  user-select: none;
  display: flex;
  padding: 3px;
  width: 300px;
}

.radio-group-container {
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
}

.flex-group {
  display: flex;
  width: 100%;
}

.radio-button {
  flex: 1;
}
</style>
