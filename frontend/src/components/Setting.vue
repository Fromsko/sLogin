<template>
  <n-page-header title="设置" class="page-header" />

  <div class="layout">
    <n-card class="settings-card">
      <n-space vertical size="large">
        <n-space align="center">
          <n-switch v-model:value="store.isProxyEnabled" />
          <span>是否开启代理</span>
        </n-space>

        <n-space align="center" v-if="store.isProxyEnabled" style="width: 160px">
          <n-input v-model:value="store.proxyValue" :disabled="!store.canEditProxy" placeholder="代理地址" />
          <n-button @click="toggleCanEditProxy">{{ store.canEditProxy ? '锁定' : '修改' }}</n-button>
        </n-space>

        <n-space align="center">
          <n-switch v-model:value="store.autoUpdateEnabled" />
          <span>自动更新</span>
        </n-space>

        <n-space align="center">
          <n-switch v-model:value="store.showVersions" />
          <span>显示版本列表</span>
        </n-space>

        <n-space align="center">
          <span>当前版本: </span>
          <strong>{{ store.localVersion }}</strong>
        </n-space>
      </n-space>
    </n-card>

    <n-card v-if="store.showVersions" class="version-list">
      <template v-if="store.versions.length === 0">
        <n-empty>
          <template #extra>
            <n-button type="primary" size="medium" round @click="fetchVersions()" :loading="store.loading"> 获取版本列表 </n-button>
          </template>
        </n-empty>
      </template>
      <template v-else>
        <n-modal-provider>
          <n-modal v-model:show="store.modalConf.isOpen" :mask-closable="false">
            <n-card class="custom-card" :title="`版本更新 ${selectParams.version}`">
              <div class="content">
                <n-card class="update-message">
                  <strong>更新内容: </strong>
                  <ul v-for="(log, index) of store.versions[selectParams.index].changelog" :key="index">
                    <li>{{ log }}</li>
                  </ul>
                </n-card>
              </div>

              <div class="actions">
                <n-space :gap="8">
                  <n-button type="primary" @click="updateVersion(selectParams.version)">下载</n-button>
                  <n-button @click="toggleCancel">取消</n-button>
                </n-space>
              </div>
            </n-card>
          </n-modal>
        </n-modal-provider>

        <n-list>
          <n-list-item v-for="(versionItem, index) in store.versions" :key="versionItem.version" clickable>
            <n-card class="version-card" align="start" hoverable>
              <n-space justify="center">
                <div>
                  <span style="font-size: 16px"
                    >版本号：<strong>{{ versionItem.version }}</strong></span
                  ><br />
                </div>
                <n-button style="margin-top: 10px" round type="primary" size="small" @click="store.viewVersion(versionItem.version, index)">
                  获取安装包
                </n-button>
              </n-space>
            </n-card>
          </n-list-item>
        </n-list>
      </template>
    </n-card>
  </div>

  <ActionMenu v-show="!store.modalConf.isOpen" />
</template>

<script lang="ts" setup>
import { useSettings } from '@/utils/composables/useSettings'
import { onBeforeMount } from 'vue'
import { WindowSetSize } from '../../wailsjs/runtime'

const { store, selectParams, fetchVersions, toggleCancel, updateVersion, toggleCanEditProxy } = useSettings()

onBeforeMount(async () => {
  await WindowSetSize(700, 490)
})
</script>

<style scoped>
.custom-card {
  height: 300px;
  width: 410px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.update-message {
  height: 170px;
  overflow: auto;
}

.content {
  flex-grow: 1;
  padding-bottom: 12px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 8px;
}

.page-header {
  display: flex;
  justify-content: center;
}

.layout {
  display: flex;
  width: 500px;
  gap: 12px 16px;
  grid-template-columns: 1fr 2fr;
}

.settings-card {
  user-select: none;
  padding: 16px;
  height: 280px;

  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.version-list {
  height: 280px;
  overflow-y: auto;
  border-radius: 12px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.version-list::-webkit-scrollbar {
  display: none;
}

.version-card {
  height: 115px;
  border-radius: 12px;
  /* background-color: rgba(255, 255, 255, 0.9); */
  box-shadow: 8px rgba(0, 0, 0, 0.08);
  /* background: linear-gradient(200deg, #72afd3, #96fbc4); */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>
