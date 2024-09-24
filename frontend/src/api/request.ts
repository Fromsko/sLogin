import { display, LoginModel } from '@/models/client';
import { GetAuthor, GetGithub, GetHost, GetTitle, GetVersion } from '../../wailsjs/go/api/DisplayConfig';
import { Login, Logout } from '../../wailsjs/go/api/SchoolClient';
import { GetClientIP, Notify } from '../../wailsjs/go/backend/App';


const useDisplay = () => {
    return {
        async config() {
            let conf: display = {
                Host: await GetHost(),
                GitHub: await GetGithub(),
                Version: await GetVersion(),
                Title: await GetTitle(),
                Author: await GetAuthor(),
            }
            return conf
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

export {
    useClient,
    useDisplay
};
