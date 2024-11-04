package core

import (
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"sLogin/backend/model"
	"strings"
	"time"

	v2 "github.com/Fromsko/gouitls/knet/v2"
	"github.com/Fromsko/gouitls/logs"
	"github.com/gocolly/colly/v2"
	"github.com/k0kubun/go-ansi"
	"github.com/schollz/progressbar/v3"
	"github.com/sirupsen/logrus"
)

type Spider struct {
	link   string
	log    *logrus.Logger
	regexp *regexp.Regexp
	hub    *model.DownHub
}

func NewSpider(downHub *model.DownHub) (spider *Spider) {

	if downHub == nil {
		return nil
	} else {
		spider = &Spider{
			hub: downHub,
			log: logs.InitLogger(),
		}
	}

	// init for github repo info
	spider.addLink()
	spider.parserUrl()
	spider.createRepoDir()
	// start task
	spider.fetch()

	return spider
}

func (spider *Spider) createRepoDir() *Spider {
	if spider.hub.DownDir == "" {
		return nil
	} else {
		spider.hub.DownDir = filepath.Join(
			spider.hub.DownDir,
			spider.hub.RepoName,
		)
		_ = os.Mkdir(
			spider.hub.DownDir,
			fs.FileMode(os.O_WRONLY),
		)

	}
	return spider
}

func (spider *Spider) parserUrl() *Spider {
	spider.regexp = regexp.MustCompile(spider.link)
	return spider
}

func (spider *Spider) addLink() *Spider {

	baseLink := strings.Split(
		spider.hub.BaseUrl,
		spider.hub.Server,
	)[1]

	repo := strings.Split(spider.hub.BaseUrl, "/")
	spider.hub.RepoName = repo[len(repo)-1]
	spider.link = baseLink + "/archive/refs/tags/.*"

	return spider
}

func (spider *Spider) fetch() *Spider {
	// spider with gocolly
	spider.hub.Spider.OnHTML("a.Link--muted[href]", func(e *colly.HTMLElement) {
		if spider.regexp.MatchString(e.Attr("href")) {
			spider.filter(
				spider.hub.DownType,
				e.Request.AbsoluteURL(
					e.Attr("href"),
				),
			)
		}
	})

	spider.hub.Spider.OnHTML("h2.f4.d-inline a.Link--primary", func(e *colly.HTMLElement) {
		spider.hub.LastTag = e.Text
	})

	spider.hub.Spider.OnScraped(func(r *colly.Response) {
		nxp := spider.hub.BaseUrl + "/tags?after=" + spider.hub.LastTag

		if r.Request.URL.String() != nxp {
			spider.log.Info("Next repo :> ", nxp)
			spider.hub.Spider.Visit(nxp)
		}
	})

	err := spider.hub.Spider.Visit(spider.hub.BaseUrl + "/tags")
	if err != nil {
		spider.log.Error("Visiting URL:", spider.hub.BaseUrl, "-", err)
	} else {
		spider.log.Info("Visiting  :> ", spider.hub.BaseUrl)
	}

	defer spider.hub.Spider.Wait()
	defer spider.log.Info(
		"Finished tasks!",
	)

	return spider
}

func (spider *Spider) SaveToJson() *Spider {
	type save struct {
		Name string          `json:"repo_name"`
		Url  string          `json:"repo_url"`
		Tags *model.DownType `json:"download_sources"`
	}

	fileName := filepath.Join(
		spider.hub.DownDir,
		spider.hub.RepoName+".json",
	)
	f, _ := os.Create(fileName)

	json.NewEncoder(f).Encode(save{
		Name: spider.hub.RepoName,
		Url:  spider.hub.BaseUrl,
		Tags: spider.hub.DownType,
	})

	defer f.Close()

	return spider
}

func (spider *Spider) DownloadFile(fetchUrl string) (err error) {
	// downloadFile
	tokens := strings.Split(
		fetchUrl, "/",
	)
	fileName := tokens[len(tokens)-1]

	request := v2.NewRequest(
		v2.WithURL(fetchUrl),
		v2.WithMethod(http.MethodGet),
		v2.WithProxy(spider.hub.ProxyUrl),
	)

	request.Send(func(resp v2.IResponse, _ error) {
		originResp := resp.(*v2.Response).Resp

		if originResp.ContentLength != -1 {
			out, _ := os.Create(
				filepath.Join(
					spider.hub.DownDir,
					fileName,
				),
			)
			spider.downloadBar(
				fmt.Sprintf("[cyan]Download: [reset]%s ", fileName),
				out,
				originResp,
				func() {
					spider.log.Info("下载完成: " + fileName)
				},
			)
			defer out.Close()
		} else {
			errMsg := "由于访问问题，无法下载指定文件!"
			err = fmt.Errorf("error: %v", errMsg)
		}
	})

	return err
}

func (spider *Spider) filter(dt *model.DownType, url string) *Spider {
	switch {
	case strings.HasSuffix(url, ".zip"):
		dt.Zip = append(dt.Zip, url)

	case strings.HasSuffix(url, ".tar.gz"):
		dt.TarGz = append(dt.TarGz, url)

	case strings.HasSuffix(url, ".exe"):
		dt.Installer = append(dt.Installer, url)
	}

	return spider
}

func (spider *Spider) downloadBar(desc string, f *os.File, resp *http.Response, callback func()) {
	bar := progressbar.NewOptions(int(resp.ContentLength),
		progressbar.OptionSetWriter(ansi.NewAnsiStdout()), // ANSI 颜色输出
		progressbar.OptionEnableColorCodes(true),          // 启用颜色编码
		progressbar.OptionShowBytes(true),                 // 显示已下载的字节数
		progressbar.OptionSetWidth(20),                    // 设置进度条的宽度
		progressbar.OptionSetDescription(desc),            // 描述信息
		progressbar.OptionSetTheme(progressbar.Theme{
			Saucer:        "[green]=[reset]", // 进度条的填充
			SaucerHead:    "[green]>[reset]", // 进度条的头部
			SaucerPadding: " ",               // 进度条的填充空白
			BarStart:      "[",               // 进度条开始符号
			BarEnd:        "]",               // 进度条结束符号
		}),
		progressbar.OptionThrottle(65*time.Millisecond), // 控制进度条更新的频率
		progressbar.OptionShowCount(),                   // 显示当前进度计数
		progressbar.OptionOnCompletion(func() { // 完成时的回调函数
			fmt.Fprint(os.Stderr, "\n")
			callback()
		}),
	)

	io.Copy(io.MultiWriter(f, bar), resp.Body)
}
