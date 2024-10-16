package core

import (
	"fmt"
	"os"
	"path/filepath"
	"sLogin/backend/model"

	"github.com/gocolly/colly/v2"
)

func WithProxy(proxy string) model.Option {
	return func(dh *model.DownHub) {
		dh.ProxyUrl = proxy
	}
}

func WithBaseUrl(url string) model.Option {
	return func(dh *model.DownHub) {
		dh.BaseUrl = url
	}
}

func WithServer(url string) model.Option {
	return func(dh *model.DownHub) {
		dh.Server = url
	}
}

func WithDownDir(dir ...string) model.Option {
	return func(dh *model.DownHub) {
		var (
			dirPath     string
			basePath, _ = os.Getwd()
		)

		if dirs := len(dir); dirs > 0 {
			dirPath = filepath.Join(
				basePath,
				filepath.Join(dir...),
			)
			if err := os.MkdirAll(dirPath, 0644); err != nil {
				fmt.Printf("create folders %v", err)
			}
		} else {
			dirPath = filepath.Join(
				basePath,
				dh.DownDir,
			)
			_ = os.Mkdir(dirPath, 0644)
		}
		dh.DownDir = dirPath
	}
}

func WithDefaultSpider() model.Option {
	return func(dh *model.DownHub) {
		if dh.Spider == nil {
			dh.Spider = colly.NewCollector()
		}

		dh.Spider.Async = true
		dh.Spider.Limit(&colly.LimitRule{
			DomainGlob:  "*",
			Parallelism: 20,
		})
	}
}

func NewDownHub(opts ...model.Option) *model.DownHub {
	dh := &model.DownHub{
		DownDir:  "source",
		DownType: new(model.DownType),
	}

	for _, opt := range opts {
		opt(dh)
	}

	if dh.ProxyUrl != "" {
		if dh.Spider == nil {
			dh.Spider = colly.NewCollector()
		}
		dh.Spider.SetProxy(dh.ProxyUrl)
	}

	if dh.Server == "" {
		dh.Server = "https://github.com"
	}

	return dh
}
