package ollama

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
)

const (
	Byte = 1

	KiloByte = Byte * 1000
	MegaByte = KiloByte * 1000
	GigaByte = MegaByte * 1000
	TeraByte = GigaByte * 1000

	KibiByte = Byte * 1024
	MebiByte = KibiByte * 1024
	GibiByte = MebiByte * 1024

	maxBufferSize = 512 * KiloByte
)

type OllamaClient struct {
	Addr    string
	baseURL *url.URL
	*http.Client
}

func NewOllamaClient() *OllamaClient {
	return &OllamaClient{
		Client: &http.Client{},
	}
}

func NewOllamaClientWithAddr(addr string) *OllamaClient {
	return &OllamaClient{
		Addr:   addr,
		Client: &http.Client{},
	}
}

// getFullURL constructs the full URL for a given endpoint.
func (c *OllamaClient) getFullURL(endpoint string) (*url.URL, error) {
	if c.baseURL != nil {
		return c.baseURL.ResolveReference(&url.URL{Path: endpoint}), nil
	}

	if c.Addr == "" {
		portStr := os.Getenv("OLLAMA_PORT")
		if portStr == "" {
			portStr = "11434"
		}
		c.Addr = fmt.Sprintf("http://localhost:%s", portStr)
	}

	u, err := url.Parse(c.Addr)
	if err != nil {
		return nil, fmt.Errorf("Error when parsing server address: %v", err)
	}

	c.baseURL = u

	return c.baseURL.ResolveReference(&url.URL{Path: endpoint}), nil
}

func (c *OllamaClient) fetch(ctx context.Context, method string, path string, reqData, respData any) error {
	var reqBody io.Reader
	var data []byte
	var err error

	switch reqData := reqData.(type) {
	case io.Reader:
		// reqData is already an io.Reader
		reqBody = reqData
	case nil:
		// noop
	default:
		data, err = json.Marshal(reqData)
		if err != nil {
			return err
		}

		reqBody = bytes.NewReader(data)
	}

	requestURL, err := c.getFullURL(path)
	if err != nil {
		return err
	}

	request, err := http.NewRequestWithContext(ctx, method, requestURL.String(), reqBody)
	if err != nil {
		return err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "application/json")

	respObj, err := c.Do(request)
	if err != nil {
		return err
	}
	defer respObj.Body.Close()

	respBody, err := io.ReadAll(respObj.Body)
	if err != nil {
		return err
	}

	if err := checkError(respObj, respBody); err != nil {
		return err
	}

	if len(respBody) > 0 && respData != nil {
		if err := json.Unmarshal(respBody, respData); err != nil {
			return err
		}
	}
	return nil
}

func (c *OllamaClient) stream(ctx context.Context, method, path string, reqData any, fn func([]byte) error) error {
	var reqBody io.Reader
	var data []byte
	var err error

	switch reqData := reqData.(type) {
	case io.Reader:
		// reqData is already an io.Reader
		reqBody = reqData
	case nil:
		// noop
	default:
		data, err = json.Marshal(reqData)
		if err != nil {
			return err
		}

		reqBody = bytes.NewReader(data)
	}

	requestURL, err := c.getFullURL(path)
	if err != nil {
		return err
	}
	request, err := http.NewRequestWithContext(ctx, method, requestURL.String(), reqBody)
	if err != nil {
		return err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "application/x-ndjson")

	response, err := c.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	scanner := bufio.NewScanner(response.Body)
	// increase the buffer size to avoid running out of space
	scanBuf := make([]byte, 0, maxBufferSize)
	scanner.Buffer(scanBuf, maxBufferSize)
	for scanner.Scan() {
		var errorResponse struct {
			Error string `json:"error,omitempty"`
		}

		bts := scanner.Bytes()
		if err := json.Unmarshal(bts, &errorResponse); err != nil {
			return fmt.Errorf("unmarshal: %w", err)
		}

		if errorResponse.Error != "" {
			return errors.New(errorResponse.Error)
		}

		if response.StatusCode >= http.StatusBadRequest {
			return StatusError{
				StatusCode:   response.StatusCode,
				Status:       response.Status,
				ErrorMessage: errorResponse.Error,
			}
		}

		if err := fn(bts); err != nil {
			return err
		}
	}

	return nil
}
