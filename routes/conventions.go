package routes

import (
	"bufio"
	"encoding/json"

	"github.com/aiomni/xllama/ollama"
	"github.com/aiomni/xllama/utils"
	"github.com/valyala/fasthttp"
)

func Chat(ctx *fasthttp.RequestCtx) {
	client, _ := utils.GetOllama(ctx)

	var req ollama.ChatRequest

	json.Unmarshal(ctx.Request.Body(), &req)

	ctx.SetBodyStreamWriter(func(w *bufio.Writer) {
		client.Chat(ctx, &req, func(resp ollama.ChatResponse) error {
			return utils.WriteBodyStream(w, resp)
		})
	})
}
