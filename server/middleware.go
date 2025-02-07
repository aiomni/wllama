package server

import (
	"bytes"

	"github.com/aiomni/wllama/ollama"
	"github.com/valyala/fasthttp"
)

func WrapOllamaMiddleware(ollama *ollama.OllamaClient) func(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(next fasthttp.RequestHandler) fasthttp.RequestHandler {
		return func(ctx *fasthttp.RequestCtx) {
			if !bytes.HasPrefix(ctx.Path(), []byte("/web")) {
				ctx.SetUserValue("ollama", ollama)
			}

			next(ctx)
		}
	}

}
