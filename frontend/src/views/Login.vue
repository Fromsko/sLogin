<script setup lang="ts">
import { useClient, useDisplay } from '@/api/request'
import LoadingFloat from '@/components/LoadingFloat.vue'
import { LoginModel } from '@/models/client'
import storage from '@/utils/storage'
import {
  GlassesOutline,
  LockClosedOutline,
  PersonOutline,
} from '@vicons/ionicons5'
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRaw,
} from 'vue'
import { useRouter } from 'vue-router'

const display = useDisplay()
const router = useRouter()
const client = useClient()

// Reactive state
const state = reactive({
  isLogin: false, // 登录状态
  isAlive: false, // 是否存活
  model: ref<LoginModel>({ username: '', password: '', client: '' }), // 登录模型
  clientModels: ['移动', '联通', '电信'].map((s) => ({
    value: s.toLowerCase(),
    label: s,
  })),
})

// Helper functions
const onlyAllowNumber = (value: string) => /^\d*$/.test(value)

const haveArray = (items: object) => Object.keys(items).length === 0

const delayDirect = (path: string, delay = 1000) => {
  setTimeout(() => router.push(path), delay)
}

const loadStoredConfig = () => {
  const config = storage.getItem('loginConfig')
  if (config && !haveArray(config)) {
    state.model = config as LoginModel
  }
}

const handleLogin = async () => {
  const resp = await client.login(state.model)
  if (resp.code === 200) {
    state.isLogin = true
    delayDirect('/home')
    window.$message.success(resp.msg)
    storage.setItem('loginResp', resp.data)
    storage.setItem('loginConfig', toRaw(state.model))
  } else {
    state.isLogin = false
    window.$message.error(resp.msg)
    storage.clearItem('loginResp')
    storage.clearItem('loginConfig')
  }
}

const attemptNoFeelLogin = async (config: LoginModel) => {
  const resp = await client.login(config)
  if (resp.code === 200) {
    state.isLogin = true
    state.isAlive = true
    delayDirect('/home', 3000)
    window.$message.success('无感知登录成功')
  } else {
    state.isLogin = false
    state.isAlive = false
    window.$message.warning('无感知登录失败, 请重试!')
    loadStoredConfig() // 载入存储的用户信息
  }
}

// Lifecycle hooks
onMounted(async () => {
  const storedResp = storage.getItem('loginResp')
  const config = storage.getItem('loginConfig')

  if (!haveArray(storedResp)) {
    await attemptNoFeelLogin(config as LoginModel)
  }
})

onBeforeUnmount(async () => {
  const ip = await display.clientIp()
  if (ip === '127.0.0.1') {
    window.$message.error('请检查是否连接校园网!')
  }
  loadStoredConfig()
})

onUnmounted(async () => {
  if (state.isLogin) {
    const ip = await display.clientIp()
    await display.notify({
      title: '校园网连接成功',
      data: `IP地址: ${ip}`,
    })
  }
})

defineComponent({ name: 'FormTab' })
</script>

<template>
  <LoadingFloat v-if="state.isAlive" />

  <n-card v-else="state.isAlive" class="Form-Container">
    <n-tabs
      default-value="signin"
      size="large"
      justify-content="space-evenly"
      type="segment"
      animated
    >
      <n-tab-pane display-directive="show:lazy" name="signin" tab="登录">
        <n-form :model="state.model">
          <n-form-item-row label="用户名">
            <n-input
              type="text"
              :allow-input="onlyAllowNumber"
              placeholder="只能输入数字"
              v-model:value="state.model.username"
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
              v-model:value="state.model.password"
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
          <n-form-item-row
            label="运营商"
            class="radio-group-container"
            size="large"
          >
            <n-radio-group
              v-model:value="state.model.client"
              name="radiobuttongroup1"
              class="flex-group"
            >
              <n-radio-button
                v-for="cm in state.clientModels"
                :key="cm.value"
                :value="cm.value"
                :label="cm.label"
                class="radio-button"
              />
            </n-radio-group>
          </n-form-item-row>
        </n-form>
        <n-button
          type="primary"
          round
          block
          secondary
          strong
          @click="handleLogin"
          :disabled="state.isLogin"
        >
          登录
        </n-button>
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
