import Clipboard from 'clipboard'

function clipboardSuccess() {
    window.$message.success('复制成功')
}

function clipboardError() {
    window.$message.error('复制失败')
}

export default function handleClipboard(text: string, event?: any) {
    const clipboard = new Clipboard('#app', {
        text: () => text
    })
    clipboard.on('success', () => {
        console.log("复制成功");

        clipboardSuccess()
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        console.log("复制失败");
        clipboardError()
        clipboard.destroy()
    })
}
