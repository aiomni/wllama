package server

import (
	"bytes"
	"errors"
	"io/fs"
	"net"
	"strings"

	"github.com/valyala/fasthttp"
)

type Server struct {
	WebFiles   fs.FS
	Middleware func(next fasthttp.RequestHandler) fasthttp.RequestHandler
	Routes     map[string]fasthttp.RequestHandler

	fh     *fasthttp.Server
	isInit bool
}

// InitServer 初始化一个 fasthttp.Server
func (s *Server) InitServer() error {
	if s.isInit {
		return nil
	}

	s.fh = &fasthttp.Server{
		Handler: s.Handler,
	}

	s.isInit = true

	return nil
}

func (s *Server) Serve(ln net.Listener) error {
	if err := s.InitServer(); err != nil {
		return err
	}

	return s.fh.Serve(ln)
}

func (s *Server) ServeConn(c net.Conn) error {
	if err := s.InitServer(); err != nil {
		return err
	}

	return s.fh.ServeConn(c)
}

func (s *Server) Shutdown() error {
	if s.fh == nil {
		return errors.New("server is not running")
	}

	return s.fh.Shutdown()
}

func (s *Server) Handler(ctx *fasthttp.RequestCtx) {
	fs := &fasthttp.FS{
		Root:               "/",
		IndexNames:         []string{"index.html"},
		GenerateIndexPages: false,
		Compress:           true,
		PathRewrite: func(ctx *fasthttp.RequestCtx) []byte {
			path := string(ctx.Path())

			if path == "/" || path == "/index.html" {
				return []byte("/web/dist/index.html")
			}

			if strings.HasPrefix(path, "/web/static") || strings.HasPrefix(path, "/web/icons") {
				return bytes.Replace([]byte(path), []byte("/web/"), []byte("/web/dist/"), 1)
			}

			if strings.HasPrefix(path, "/web") {
				return []byte("/web/dist/index.html")
			}

			return []byte(path)
		},
		FS: s.WebFiles,
	}

	staticHandler := fs.NewRequestHandler()

	// 创建请求处理函数
	s.Middleware(func(ctx *fasthttp.RequestCtx) {
		pathname := string(ctx.Path())
		for route, handler := range s.Routes {
			if pathname == route {
				handler(ctx)
				return
			}
		}

		if pathname == "/" || pathname == "/index.html" {
			ctx.Redirect("/web", 301)
			return

		}

		if strings.HasPrefix(pathname, "/web") {
			staticHandler(ctx)
			return
		}

		ctx.NotFound()
	})(ctx)
}
