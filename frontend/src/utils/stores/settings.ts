// stores/settings.ts
import { useDisplay } from '@/api/request';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
    const display = useDisplay()
    const loading = ref(false)
    const proxyValue = ref('')
    const localVersion = ref('')
    const showVersions = ref(false)
    const canEditProxy = ref(false)
    const isProxyEnabled = ref(false)
    const autoUpdateEnabled = ref(false)
    const versions = ref<Array<{
        version: string;
        changelog: Array<string>
    }>>([])
    const modalConf = ref({
        isOpen: false,
        params: {
            index: 0,
            version: '',
        },
    })

    const config = display.config().then(config => {
        proxyValue.value = config.proxy
        localVersion.value = config.version
        return config
    })

    const viewVersion = (version: string, index: number) => {
        modalConf.value.isOpen = true
        modalConf.value.params = { version, index }
    }

    const fetchVersions = () => {
        loading.value = true
        setTimeout(() => {
            versions.value = [
                { version: '1.0.1', changelog: ['修复了一些 bug'] },
                { version: '1.0.2', changelog: ['增加了新功能'] },
            ]
            loading.value = false
        }, 2000)
    }

    const updateVersion = async (version: string) => {

    }

    return {
        isProxyEnabled,
        proxyValue,
        canEditProxy,
        localVersion,
        autoUpdateEnabled,
        showVersions,
        versions,
        modalConf,
        loading,
        config,
        viewVersion,
        updateVersion,
        fetchVersions,
    }
})
