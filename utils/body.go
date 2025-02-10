package utils

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/aiomni/wllama/ollama"
	"github.com/valyala/fasthttp"
)

func GetBody(ctx *fasthttp.RequestCtx, params any) error {
	body := ctx.PostBody()

	return json.Unmarshal(body, &params)
}

func GetOllama(ctx *fasthttp.RequestCtx) (client *ollama.OllamaClient, err error) {
	if r, ok := ctx.UserValue("ollama").(*ollama.OllamaClient); ok {
		return r, nil
	}

	return nil, errors.New("ollama not found")
}

func WriteBody(ctx *fasthttp.RequestCtx, body any) {
	message, err := json.Marshal(body)
	if err != nil {
		ctx.Error(err.Error(), 500)
		return
	}

	ctx.Write(message)

}

func WriteBodyStream(w *bufio.Writer, data any) error {
	message, _ := json.Marshal(data)

	fmt.Fprintf(w, "%s\n", message)

	if err := w.Flush(); err != nil {
		return err
	}

	return nil
}
