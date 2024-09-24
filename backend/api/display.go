package api

import (
	"context"
	"sLogin/backend/config"
	"sLogin/backend/model"
)

type DisplayConfig struct {
	model.DisplayInfo
	ctx context.Context
}

func NewDisplayConfig() *DisplayConfig {
	return &DisplayConfig{
		DisplayInfo: model.DisplayInfo{
			Host:    config.HOST,
			Title:   config.TITLE,
			GitHub:  config.GITHUB,
			Author:  config.AUTHOR,
			Version: config.VERSION,
		},
	}
}

func (dc *DisplayConfig) GetTitle() string {
	return dc.Title
}

func (dc *DisplayConfig) GetAuthor() string {
	return dc.Author
}

func (dc *DisplayConfig) GetGithub() string {
	return dc.GitHub
}

func (dc *DisplayConfig) GetVersion() string {
	return dc.Version
}

func (dc *DisplayConfig) GetHost() string {
	return dc.Host
}
