package ollama

import (
	"context"
	"encoding/json"
	"net/http"
)

type OllamaModel struct {
	Name string `json:"name"`
}

// CreateProgressFunc is a function that [Client.Create] invokes when progress
// is made.
// It's similar to other progress function types like [PullProgressFunc].
type CreateProgressFunc func(ProgressResponse) error

// Create creates a model from a [Modelfile]. fn is a progress function that
// behaves similarly to other methods (see [Client.Pull]).
//
// [Modelfile]: https://github.com/ollama/ollama/blob/main/docs/modelfile.md
func (c *OllamaClient) CreateModel(ctx context.Context, req *CreateRequest, fn CreateProgressFunc) error {
	return c.stream(ctx, http.MethodPost, "/api/create", req, func(bts []byte) error {
		var resp ProgressResponse
		if err := json.Unmarshal(bts, &resp); err != nil {
			return err
		}

		return fn(resp)
	})
}

func (c *OllamaClient) ListModels(ctx context.Context) (ListResponse, error) {
	var lr ListResponse
	err := c.fetch(ctx, http.MethodGet, "/api/tags", nil, &lr)

	return lr, err
}

func (c *OllamaClient) ShowModelInfo(ctx context.Context, modelName string, verbose bool) (ShowResponse, error) {
	reqBody := ShowRequest{
		Model:   modelName,
		Verbose: verbose,
	}

	var sr ShowResponse
	err := c.fetch(ctx, http.MethodPost, "/api/show", reqBody, &sr)

	return sr, err
}

func (c *OllamaClient) CopyModel(ctx context.Context, source, destination string) error {
	reqBody := CopyRequest{
		Source:      source,
		Destination: destination,
	}

	err := c.fetch(ctx, http.MethodPost, "/api/copy", reqBody, nil)

	return err
}

func (c *OllamaClient) DeleteModel(ctx context.Context, modelName string) error {
	reqBody := DeleteRequest{
		Model: modelName,
	}

	err := c.fetch(ctx, http.MethodDelete, "/api/delete", reqBody, nil)

	return err
}

func (c *OllamaClient) ListRunning(ctx context.Context) (ProcessResponse, error) {
	var lr ProcessResponse

	err := c.fetch(ctx, http.MethodGet, "/api/ps", nil, &lr)

	return lr, err
}

// PullProgressFunc is a function that [Client.Pull] invokes every time there
// is progress with a "pull" request sent to the service. If this function
// returns an error, [Client.Pull] will stop the process and return this error.
type PullProgressFunc func(ProgressResponse) error

// Pull downloads a model from the ollama library. fn is called each time
// progress is made on the request and can be used to display a progress bar,
// etc.
func (c *OllamaClient) Pull(ctx context.Context, req *PullRequest, fn PullProgressFunc) error {
	return c.stream(ctx, http.MethodPost, "/api/pull", req, func(bts []byte) error {
		var resp ProgressResponse
		if err := json.Unmarshal(bts, &resp); err != nil {
			return err
		}

		return fn(resp)
	})
}
