package core

import (
	"sLogin/backend/model"
	"sync"

	"github.com/panjf2000/ants/v2"
)

var wg sync.WaitGroup

func DownloadRepo(url, proxy string, opts ...model.Option) {
	spider := NewSpider(
		NewDownHub(
			WithBaseUrl(url),
			WithProxy(proxy),
			WithDownDir("source"),
			WithDefaultSpider(),
		),
	)

	poolSize := len(spider.hub.Zip)
	pool, _ := ants.NewPool(poolSize)

	for _, zipUrl := range spider.hub.Zip {
		wg.Add(1)

		_ = pool.Submit(func() {
			spider.DownloadFile(zipUrl)
			spider.SaveToJson()
			defer wg.Done()
		})
	}

	wg.Wait()
	defer pool.Release()
}

func DownloadRepos(repos []string, proxy string) {

	for _, repoUrl := range repos {
		if repoUrl != "" {
			DownloadRepo(repoUrl, proxy)
		}
	}
}
