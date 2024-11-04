// utils/composables/useAuth.ts
import { LoginModel } from '@/models/client'
import { useAuthStore } from '@/utils/stores/auth'

export const useAuth = () => {
    const store = useAuthStore()
    const resp = store.storage.getItem('loginResp')
    const config = store.storage.getItem('loginConfig') as LoginModel

    const loadStoredConfig = async () => {
        if (config) {
            store.model = config
        }
    }

    const attemptNoFeelLogin = async () => {
        if (!store.haveArray(resp)) {
            await store.attemptNoFeelLogin(config, loadStoredConfig)
        }
    }

    const handleLogin = async () => {
        await store.handleLogin()
    }

    return {
        store,
        resp,
        config,
        model: store.model,
        display: store.display,
        isLogin: store.isLogin,
        isAlive: store.isAlive,
        clientModels: store.clientModels,
        onlyAllowNumber: store.onlyAllowNumber,
        loadStoredConfig,
        handleLogin,
        attemptNoFeelLogin,
    }
}
