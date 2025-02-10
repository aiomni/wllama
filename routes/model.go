package routes

import (
	"github.com/aiomni/xllama/utils"
	"github.com/valyala/fasthttp"
)

func ListModels(ctx *fasthttp.RequestCtx) {
	client, _ := utils.GetOllama(ctx)

	models, err := client.ListModels(ctx)
	if err != nil {
		ctx.Error(err.Error(), 500)
		return
	}

	utils.WriteBody(ctx, models)
}
