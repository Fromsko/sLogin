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
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRaw,
} from 'vue'
import { useRouter } from 'vue-router'
import { model } from 'wailsjs/go/models'

const display = useDisplay()
const router = useRouter()
const client = useClient()
const state = reactive({
  // 登录按钮
  isLogin: false,
  // 是否存活
  isAlive: false,
  // 连接模式
  model: ref<LoginModel>({
    username: '',
    password: '',
    client: '',
  }),
  // 运营商模式
  clientModels: [
    { value: '移动', label: '移动' },
    { value: '联通', label: '联通' },
    { value: '电信', label: '电信' },
  ].map((s) => {
    s.value = s.value.toLowerCase()
    return s
  }),
  // 只允许输入数字
  onlyAllowNumber: (value: string) => {
    return !value || /^\d+$/.test(value)
  },
  haveArray: (items: object) => {
    return Object.keys(items).length === 0
  },
  delayDirect: (path: string, delay: number = 1000) => {
    let timer = setTimeout(async () => {
      await router.push(path)
      clearTimeout(timer)
    }, delay)
  },
})

// 登录响应器
const handleLogin = async () => {
  let resp = await client.login(state.model)

  if (resp.code === 200) {
    state.isLogin = true
    state.delayDirect('/home')
    window.$message.success(resp.msg)
    storage.setItem('loginResp', resp.data)
    storage.setItem('loginConfig', toRaw(state.model))
  } else {
    state.isLogin = false
    window.$message.error(resp.msg)
    storage.clearItem('loginResp')
    storage.clearItem('userConfig')
  }
}

onMounted(async () => {
  const ip = await display.clientIp()

  if (ip.includes('127.0.0.1')) {
    window.$message.error('请连接校园网')
  } else {
    let noFeelresp: model.SchoolLoginResp
    let resp = storage.getItem('loginResp')
    let conf = storage.getItem('loginConfig')

    if (!state.haveArray(resp) && !state.haveArray(conf)) {
      state.isAlive = true

      noFeelresp = await client.login(conf as LoginModel)
      if (noFeelresp.code === 200) {
        state.isLogin = true
        state.delayDirect('/home', 3000)
        window.$message.success('无感知登录成功')
        return
      }
      state.isLogin = false
      state.isAlive = false
      window.$message.warning('无感知登录失败, 请重试!')
    }
  }
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

defineComponent({
  name: 'FormTab',
})
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
              :allow-input="state.onlyAllowNumber"
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
