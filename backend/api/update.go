package api

import (
	"sLogin/backend/config"
	"sLogin/backend/core"
)

func Update() {
	core.DownloadRepo(
		config.PROJECT,
		config.PROXY,
	)
}
