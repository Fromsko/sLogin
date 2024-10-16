import { LoginModel } from '@/models/client';
import { Login, Logout } from '../../wailsjs/go/api/SchoolClient';
import { DisplayInfo, DownloadRepo, DownloadRepos, GetClientIP, Notify } from '../../wailsjs/go/backend/App';

const useDisplay = () => {
    return {
        async config() {
            return await DisplayInfo()
        },
        async notify(params: any) {
            await Notify({
                title: params['title'],
                data: params['data'],
            })
        },
        async clientIp(): Promise<string> {
            return await GetClientIP()
        }
    }
}

const useClient = () => {
    return {
        async login(params: LoginModel) {
            return await Login(params)
        },
        async logout() {
            return await Logout()
        }
    }
}

const useDownHub = () => {
    return {
        async repo(url: string, proxy: string = "") {
            return await DownloadRepo(url, proxy)
        },
        async repos(urls: Array<string>, proxy: string = "") {
            return await DownloadRepos(urls, proxy)
        }
    }
}

export {
    useClient,
    useDisplay,
    useDownHub
};

