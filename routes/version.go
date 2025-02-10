package routes

import (
	"github.com/aiomni/xllama/utils"
	"github.com/valyala/fasthttp"
)

func Version(ctx *fasthttp.RequestCtx) {
	ollama, _ := utils.GetOllama(ctx)

	version, err := ollama.Version(ctx)
	if err != nil {
		ctx.Error(err.Error(), 500)
		return
	}

	utils.WriteBody(ctx, version)
}
