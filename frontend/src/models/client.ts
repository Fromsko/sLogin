// 登录数据模型
interface LoginModel {
    username: string
    password: string
    client: string
}

// 展示模型
interface display {
    Host: string
    GitHub: string
    Author: string
    Version: string
    Title: string
}

// 响应数据
interface respData {
    ip: string
    uid: string
}

export type {
    LoginModel,
    display,
    respData
}
