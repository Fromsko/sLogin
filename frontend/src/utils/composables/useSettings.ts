// utils/composables/useSettings.ts
import { useSettingsStore } from '@/utils/stores/settings'

export const useSettings = () => {
    const store = useSettingsStore()
    const selectParams = store.modalConf.params

    const toggleProxy = () => {
        store.isProxyEnabled = !store.isProxyEnabled
    }

    const toggleCanEditProxy = () => {
        store.canEditProxy = !store.canEditProxy
    }

    const toggleAutoUpdate = () => {
        store.autoUpdateEnabled = !store.autoUpdateEnabled
    }

    const toggleVersionList = () => {
        store.showVersions = !store.showVersions
    }

    const toggleCancel = () => {
        store.modalConf.isOpen = !store.modalConf.isOpen
    }

    return {
        store,
        selectParams,
        toggleProxy,
        toggleCanEditProxy,
        toggleCancel,
        toggleAutoUpdate,
        toggleVersionList,
        viewVersion: store.viewVersion,
        updateVersion: store.updateVersion,
        fetchVersions: store.fetchVersions
    }
}
