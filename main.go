package main

import (
	"context"
	"flag"
	"fmt"
	"os"

	"github.com/aiomni/wllama/ollama"
	"github.com/aiomni/wllama/routes"
	"github.com/aiomni/wllama/server"
	"github.com/valyala/fasthttp"
)

const ollama_default_addr = "http://localhost:11434"

func main() {
	addrFlag := flag.String("addr", ollama_default_addr, "")
	flag.Parse()

	ctx := context.Background()
	client := ollama.NewOllamaClientWithAddr(*addrFlag)

	err := client.Heartbeat(ctx)
	if err != nil {
		fmt.Printf("Ollama Error: %v\n", err)
		fmt.Println("Please ensure that Ollama is installed and running. You can install it from https://ollama.com or use the addr flag to specify a custom server.")
		return
	}

	webFS := os.DirFS("./web/dist")
	s := server.Server{
		Port:       5187,
		WebFiles:   webFS,
		Middleware: server.WrapOllamaMiddleware(client),
		Routes: map[string]fasthttp.RequestHandler{
			"/api/version": routes.Version,
		},
	}

	go func() {
		s.Start()
	}()

	fmt.Printf("Server started on  http://localhost:%d\n", s.Port)

	select {}
}
