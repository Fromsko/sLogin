import router from '@/router';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import en from './langurage/en';
import zh from './langurage/zh';

let messages = {
    zh,
    en
}

const i18n = createI18n({
    legacy: false,  // 设置为 false，启用 composition API 模式
    messages,
    locale: 'en'  // 设置默认语言
})

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)
app.mount('#app')
