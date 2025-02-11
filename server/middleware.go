package server

import (
	"bytes"

	"github.com/aiomni/xllama/ollama"
	"github.com/valyala/fasthttp"
)

func WrapOllamaMiddleware(ollama *ollama.OllamaClient) func(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(next fasthttp.RequestHandler) fasthttp.RequestHandler {
		return func(ctx *fasthttp.RequestCtx) {
			if !bytes.HasPrefix(ctx.Path(), []byte("/web")) {
				ctx.SetUserValue("ollama", ollama)
			}

			ctx.Response.Header.Add("Access-Control-Allow-Origin", "*")
			ctx.Response.Header.Add("Access-Control-Allow-Methods", "*")
			ctx.Response.Header.Add("Access-Control-Allow-Headers", "*")
			ctx.Response.Header.Add("Access-Control-Max-Age", "86400")

			next(ctx)
		}
	}
}
