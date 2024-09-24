package api

import (
	"fmt"
	"net/http"
	"sLogin/backend/config"
	"sLogin/backend/model"
	"sLogin/backend/utils"
	"strconv"

	"github.com/Fromsko/gouitls/knet"
	"golang.org/x/exp/rand"
)

type SchoolClient struct {
	host string
}

func NewSchoolClient() *SchoolClient {
	return &SchoolClient{
		host: config.HOST,
	}
}

func (sc *SchoolClient) random() int {
	return rand.Intn(10000) + 500
}

func (sc *SchoolClient) Login(userInfo model.UserInfo) (result *model.SchoolLoginResp) {
	setLoginParams := func(userInfo model.UserInfo) string {
		switch userInfo.Client {
		case "移动":
			userInfo.Client = "@cmcc"
		case "联通":
			userInfo.Client = "@unicom"
		case "电信":
			userInfo.Client = "@telecom"
		case "教职工":
			userInfo.Client = ""
		}
		return fmt.Sprintf("DDDDD=%s&upass=%s&0MKKey=123456&R1=0&R2=&R3=0&R6=0&para=00&v6ip=&terminal_type=1&lang=zh-cn&jsVersion=4.2&v=%s&lang=zh",
			userInfo.Username+userInfo.Client,
			userInfo.Password,
			strconv.Itoa(sc.random()),
		)
	}
	loginURL := fmt.Sprintf(
		"http://%s/drcom/login?callback=dr1003&%s",
		sc.host,
		setLoginParams(userInfo),
	)
	spider := knet.SendRequest{
		FetchURL: loginURL,
	}
	spider.Send(func(resp []byte, cookies []*http.Cookie, err error) {
		result = utils.ParserResp(resp)
	})

	return result
}

func (sc *SchoolClient) Logout() (result *model.SchoolLoginResp) {
	logoutURL := fmt.Sprintf(
		"http://%s/drcom/logout?callback=dr1003&jsVersion=4.2&v=%s&lang=zh",
		sc.host,
		strconv.Itoa(sc.random()),
	)
	spider := knet.SendRequest{
		FetchURL: logoutURL,
	}
	spider.Send(func(resp []byte, cookies []*http.Cookie, err error) {
		result = &model.SchoolLoginResp{
			Code: 200,
			Msg:  "登出成功",
		}
		if err != nil {
			result.Code = 200
			result.Msg = err.Error()
		}
	})
	return result
}
