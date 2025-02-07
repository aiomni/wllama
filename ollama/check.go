package ollama

import (
	"context"
	"net/http"
)

func (c *OllamaClient) Heartbeat(ctx context.Context) error {
	err := c.fetch(ctx, http.MethodHead, "/", nil, nil)
	return err
}
