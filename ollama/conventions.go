package ollama

import (
	"context"
	"encoding/json"
	"net/http"
)

// GenerateResponseFunc is a function that [Client.Generate] invokes every time
// a response is received from the service. If this function returns an error,
// [Client.Generate] will stop generating and return this error.
type GenerateResponseFunc func(GenerateResponse) error

// Generate generates a response for a given prompt. The req parameter should
// be populated with prompt details. fn is called for each response (there may
// be multiple responses, e.g. in case streaming is enabled).
func (c *OllamaClient) Generate(ctx context.Context, req *GenerateRequest, fn GenerateResponseFunc) error {
	return c.stream(ctx, http.MethodPost, "/api/generate", req, func(bts []byte) error {
		var resp GenerateResponse
		if err := json.Unmarshal(bts, &resp); err != nil {
			return err
		}

		return fn(resp)
	})
}

// ChatResponseFunc is a function that [Client.Chat] invokes every time
// a response is received from the service. If this function returns an error,
// [Client.Chat] will stop generating and return this error.
type ChatResponseFunc func(ChatResponse) error

// Chat generates the next message in a chat. [ChatRequest] may contain a
// sequence of messages which can be used to maintain chat history with a model.
// fn is called for each response (there may be multiple responses, e.g. if case
// streaming is enabled).
func (c *OllamaClient) Chat(ctx context.Context, req *ChatRequest, fn ChatResponseFunc) error {
	return c.stream(ctx, http.MethodPost, "/api/chat", req, func(bts []byte) error {
		var resp ChatResponse
		if err := json.Unmarshal(bts, &resp); err != nil {
			return err
		}

		return fn(resp)
	})
}
