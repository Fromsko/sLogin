package model

import "github.com/gocolly/colly/v2"

type UserInfo struct {
	Client   string `json:"client"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type DisplayInfo struct {
	Host    string `json:"host"`
	Title   string `json:"title"`
	Author  string `json:"author"`
	GitHub  string `json:"github"`
	Version string `json:"version"`
	Proxy   string `json:"proxy"`
}

type UserData struct {
	IP  string `json:"ip"`
	UID string `json:"uid"`
}

type SchoolLoginResp struct {
	Code int      `json:"code"`
	Msg  string   `json:"msg"`
	Data UserData `json:"data"`
}

type NotifyData struct {
	Data  string `json:"data"`
	Title string `json:"title"`
}

// fetch model

type IHubTool interface {
	Filter(dt *DownType, url string)
	AddLink(dh *DownHub) string
}

type DownHub struct {
	*DownType
	Server   string
	DownDir  string
	BaseUrl  string
	ProxyUrl string
	LastTag  string
	RepoName string
	Spider   *colly.Collector
}

type Option func(*DownHub)

type DownType struct {
	TarGz     []string `json:"tar_list,omitempty"`
	Zip       []string `json:"zip_list,omitempty"`
	Installer []string `json:"intsaller_list"`
}
