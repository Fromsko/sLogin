package model

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
}

type SchoolLoginResp struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data struct {
		IP  string `json:"ip"`
		UID string `json:"uid"`
	} `json:"data"`
}

type NotifyData struct {
	Data  string `json:"data"`
	Title string `json:"title"`
}
