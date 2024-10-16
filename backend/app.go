package backend

import (
	"context"
	"sLogin/backend/config"
	"sLogin/backend/core"
	"sLogin/backend/model"
	"sLogin/backend/utils"

	"github.com/electricbubble/go-toast"
	"github.com/getlantern/systray"
	"github.com/getlantern/systray/example/icon"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	systray.Run(
		onReady(
			config.AUTHOR,
			config.TITLE,
			a.ctx,
		), func() {},
	)
}

func (a *App) Shutdown(ctx context.Context) {

}

func onReady(title string, desc string, context context.Context) func() {
	return func() {
		systray.SetTemplateIcon(icon.Data, icon.Data)
		systray.SetTitle(title)
		systray.SetTooltip(desc)

		mShrink := systray.AddMenuItem("隐藏", "Shrink to bar")
		systray.AddSeparator()
		mShow := systray.AddMenuItem("显示", "Show app ui")
		mQuit := systray.AddMenuItem("退出", "Quit the whole app")

		mQuit.SetIcon(icon.Data)
		for {
			select {
			case <-mShrink.ClickedCh:
				runtime.WindowHide(context)
			case <-mShow.ClickedCh:
				runtime.WindowShow(context)
			case <-mQuit.ClickedCh:
				systray.Quit()
				runtime.Quit(context)
				return
			}
		}
	}
}

func (a *App) Notify(msg model.NotifyData) {
	_ = toast.Push(
		msg.Data,
		toast.WithIcon("C:\\Users\\16143\\Desktop\\sLogin\\frontend\\src\\assets\\images\\logo.png"),
		toast.WithTitle(msg.Title),
		toast.WithAppID(config.TITLE),
		toast.WithProtocolAction("🎉 Finished"),
	)
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
