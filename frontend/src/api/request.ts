import { LoginModel } from "@/models/client"
import { Login, Logout } from "@wails/go/api/SchoolClient"
import {
  DisplayInfo,
  DownloadRepo,
  DownloadRepos,
  GetClientIP,
} from "@wails/go/backend/App"

const useDisplay = () => {
  return {
    async config() {
      return await DisplayInfo()
    },
    async notify(params: any) {},
    async clientIp(): Promise<string> {
      return await GetClientIP()
    },
  }
}

const useClient = () => {
  return {
    async login(params: LoginModel) {
      return await Login(params)
    },
    async logout() {
      return await Logout()
    },
  }
}

const useDownHub = () => {
  return {
    async repo(url: string, proxy: string = "") {
      return await DownloadRepo(url, proxy)
    },
    async repos(urls: Array<string>, proxy: string = "") {
      return await DownloadRepos(urls, proxy)
    },
  }
}

export { useClient, useDisplay, useDownHub }
