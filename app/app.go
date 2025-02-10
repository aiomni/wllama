package app

import (
	"fmt"
	"io/fs"
	"net"
	"os"
	"os/signal"
	"syscall"

	"github.com/aiomni/xllama/ollama"
	"github.com/aiomni/xllama/routes"
	"github.com/aiomni/xllama/server"
	"github.com/valyala/fasthttp"
)

type App struct {
	Addr         string
	OllamaClient *ollama.OllamaClient
	WebFiles     fs.FS

	server      *server.Server
	stopSigChan chan os.Signal
	errChan     chan error
}

func (app *App) Start() error {
	// 创建一个用于接收信号的通道
	app.stopSigChan = make(chan os.Signal, 1)
	// 创建一个用于通信错误的通道
	app.errChan = make(chan error, 1)
	// 注册我们感兴趣的信号，这里是 SIGUSR1
	signal.Notify(app.stopSigChan, syscall.SIGTERM)

	ln, err := net.Listen("tcp", app.Addr)
	if err != nil {
		return nil
	}

	go func(ln net.Listener) {
		app.server = &server.Server{
			WebFiles:   app.WebFiles,
			Middleware: server.WrapOllamaMiddleware(app.OllamaClient),
			Routes: map[string]fasthttp.RequestHandler{
				"/api/version":          routes.Version,
				"/api/models":           routes.ListModels,
				"/api/chat/completions": routes.Chat,
			},
		}
		fmt.Printf("server start %+v\n", ln.Addr().String())

		err = app.server.Serve(ln)
		if err != nil {
			fmt.Printf("Server error on err: %s\n", err)
			app.errChan <- fmt.Errorf("start xllama server error: %w", err)
		}
	}(ln)

	select {
	case <-app.stopSigChan: // Received a stop signal, shutdown gracefully
		app.server.Shutdown()
		return nil
	case err := <-app.errChan: // Received an error from one of the servers
		return err
	}
}

func (app *App) ReStart() {
	app.stopSigChan <- syscall.SIGTERM
	app.Start()
}

func (app *App) Shutdown() {
	close(app.stopSigChan)
	close(app.errChan)
}
