// stores/useAuth.ts
import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'

import { useClient, useDisplay } from '@/api/request'
import { LoginModel } from '@/models/client'
import { useStorage } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
    const client = useClient()
    const router = useRouter()
    const display = useDisplay()
    const storage = useStorage()

    const isLogin = ref(true)
    const isAlive = ref(false)
    const model = ref<LoginModel>({ username: '', password: '', client: '' })
    const clientModels = ['移动', '联通', '电信'].map((s) => ({
        value: s.toLowerCase(),
        label: s,
    }))

    const haveArray = (items: object) => Object.keys(items).length === 0
    const onlyAllowNumber = (value: string) => /^\d*$/.test(value)

    const handleLogin = async () => {
        const resp = await client.login(model.value)
        if (resp.code === 200) {
            isLogin.value = true
            delayDirect('/home')
            window.$message.success(resp.msg)
            storage.setItem('loginResp', resp.data)
            storage.setItem('loginConfig', toRaw(model.value))
        } else {
            isLogin.value = false
            window.$message.error(resp.msg)
        }
    }

    const attemptNoFeelLogin = async (config: LoginModel, onRedirectBefore: () => void) => {
        const resp = await client.login(config)
        if (resp.code === 200) {
            isLogin.value = true
            isAlive.value = true
            delayDirect('/home', 3000)
            window.$message.success('无感知登录成功')
        } else {
            isLogin.value = false
            isAlive.value = false
            window.$message.warning('无感知登录失败, 请重试!')
            onRedirectBefore()
        }
    }

    const delayDirect = (path: string, delay = 1000) => {
        setTimeout(() => router.push(path), delay)
    }

    return {
        model,
        isLogin,
        isAlive,
        storage,
        display,
        clientModels,
        haveArray,
        onlyAllowNumber,
        handleLogin,
        attemptNoFeelLogin,
    }
})
