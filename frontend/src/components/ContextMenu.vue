<template>
    <div class="context-menu" v-if="showMenu" :style="{ top: menuTop + 'px', left: menuLeft + 'px' }">
        <ul>
            <li @click="clearStorage">清除信息</li>
        </ul>
    </div>
</template>

<script setup>
    import { useAuth } from '@/utils/composables/useAuth'
    import { ref } from 'vue'

    const { store } = useAuth()

    const showMenu = ref(false)
    const menuTop = ref(0)
    const menuLeft = ref(0)

    function showContextMenu (event) {
        event.preventDefault()
        showMenu.value = true
        menuTop.value = event.clientY
        menuLeft.value = event.clientX
    }

    function hideContextMenu () {
        showMenu.value = false
    }

    function clearStorage () {
        store.storage.clearAll()
        store.isLogin = false
        hideContextMenu()
    }

    document.addEventListener('contextmenu', showContextMenu)
    document.addEventListener('click', hideContextMenu)

    onUnmounted(() => {
        document.removeEventListener('contextmenu', showContextMenu)
        document.removeEventListener('click', hideContextMenu)
    })
</script>

<style scoped>
    .context-menu {
        position: absolute;
        background-color: #fff;
        border: 1px solid #ccc;
        padding: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 1000;
    }

    .context-menu ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .context-menu li {
        padding: 5px 10px;
        cursor: pointer;
    }

    .context-menu li:hover {
        background-color: #f0f0f0;
    }
</style>