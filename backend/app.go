package backend

import (
	"context"

	"sLogin/backend/config"
	"sLogin/backend/core"
	"sLogin/backend/model"
	"sLogin/backend/utils"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Shutdown(ctx context.Context) {

}

func (a *App) GetClientIP() string {
	return utils.GetClientIP()
}

func (a *App) DownloadRepo(url string, proxy string) {
	core.DownloadRepo(url, proxy)
}

func (a *App) DownloadRepos(repos []string, proxy string) {
	core.DownloadRepos(repos, proxy)
}

func (a *App) DisplayInfo() *model.DisplayInfo {
	return &model.DisplayInfo{
		Host:    config.HOST,
		Title:   config.TITLE,
		GitHub:  config.GITHUB,
		Author:  config.AUTHOR,
		Version: config.VERSION,
		Proxy:   config.PROXY,
	}
}
