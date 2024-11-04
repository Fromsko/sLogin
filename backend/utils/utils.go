package utils

import (
	"net"
	"os"
	"path/filepath"
	"sLogin/backend/model"
	"strings"
	"syscall"

	"github.com/Fromsko/gouitls/logs"
	"github.com/tidwall/gjson"
)

var Log = logs.InitLogger()

func ParserResp(response []byte) *model.SchoolLoginResp {
	var result = &model.SchoolLoginResp{
		Code: 400,
		Msg:  "登录失败",
		Data: model.UserData{},
	}

	// 提取JSON字符串
	jsonString := string(response)
	startIndex := strings.Index(jsonString, "(")
	endIndex := strings.LastIndex(jsonString, ")")
	if startIndex >= 0 && endIndex >= 0 && endIndex > startIndex {
		jsonString = jsonString[startIndex+1 : endIndex]
	}

	gjson.Get(jsonString, "")
	data := gjson.Parse(jsonString)
	if code := data.Get("result"); code.Int() == 1 {
		result.Code = 200
		result.Msg = "登录成功"
		result.Data.IP = data.Get("v46ip").String()
		result.Data.UID = data.Get("uid").String()
	} else {
		result.Data.IP = data.Get("ss5").String()
	}
	return result
}

func IsWin11System() bool {
	var (
		modkernel32    = syscall.NewLazyDLL("kernel32.dll")
		procGetVersion = modkernel32.NewProc("GetVersion")
	)

	ret, _, _ := procGetVersion.Call()
	version := uint32(ret)
	print(version)
	return version >= 22000
}

func GetClientIP() (ipAddress string) {
	ipAddress = "127.0.0.1"

	interfaces, err := net.Interfaces()
	if err != nil {
		return
	}

	for _, iface := range interfaces {
		if strings.HasPrefix(iface.Name, "WLAN") {
			addrs, err := iface.Addrs()
			if err != nil {
				return
			}

			for _, addr := range addrs {
				ipNet, ok := addr.(*net.IPNet)
				if ok && ipNet.IP.To4() != nil {
					return ipNet.IP.String()
				}
			}
		}
	}

	return ipAddress
}

func ReadFromFile(file string) (urlList []string) {

	basePath, err := filepath.Abs(file)
	if err != nil {
		Log.Error("Convert path: ", err)
	}

	exists := func(filename string) bool {
		info, err := os.Stat(filename)
		if os.IsNotExist(err) {
			return false
		}
		return !info.IsDir()
	}

	if !exists(basePath) {
		Log.Errorf(
			"%s not found!", filepath.Base(basePath),
		)
	} else {
		f, err := os.ReadFile(basePath)
		if err != nil {
			Log.Error("ReadFile Error: ", err)
		}
		urlList = strings.Split(strings.TrimSpace(string(f)), "\n")
	}
	return
}
