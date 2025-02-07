package ollama

import (
	"context"
	"net/http"
)

func (c *OllamaClient) Version(ctx context.Context) (Version, error) {
	var version Version
	err := c.fetch(ctx, http.MethodGet, "/api/version", nil, &version)

	return version, err
}
