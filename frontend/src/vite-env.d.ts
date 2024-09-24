/// <reference types="vite/client" />
import { VNodeChild } from 'vue'

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

// 定义 native-ui 的 message 组件
type MessageRenderMessage = (props: {
    content?: string | number | (() => VNodeChild)
    icon?: () => VNodeChild
    closable: boolean
    type: 'info' | 'success' | 'warning' | 'error' | 'loading'
    onClose?: () => void
}) => VNodeChild

type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading'

declare global {
    interface Window {
        $message: {
            [key in MessageType]: (content: string | number | (() => VNodeChild), options?: any, onClose?: () => void) => void
        }
    }
}
