package main

import (
	"embed"
	"fmt"
	"io"
	"net"
	"os"

	"github.com/aiomni/xllama/app"
	"github.com/aiomni/xllama/ollama"
	"github.com/spf13/cobra"
)

//go:embed web/dist/*
var webFiles embed.FS

const ollama_default_addr = "http://localhost:11434"

var runCmd = &xllamaCommand{
	Command: &cobra.Command{
		Use:     "run",
		GroupID: "process",
		Long:    "fp run [--config <path> [--watch]",
		Short:   "Starts the Xllama process and blocks indefinitely",
		RunE:    cmdRun,
	},
	FastRun: func(cmd *xllamaCommand) {
		cmd.Flags().StringP("addr", "a", ollama_default_addr, "Ollama Server Address")
		cmd.Flags().StringP("pingback", "", "", "Echo confirmation bytes to this address on success")
	},
}

func cmdRun(cmd *cobra.Command, args []string) (err error) {
	fl := Flags{cmd.Flags()}
	addrFlag := fl.String("addr")
	pingbackFlag := fl.String("pingback")

	client := ollama.NewOllamaClientWithAddr(addrFlag)
	err = client.Heartbeat(cmd.Context())
	if err != nil {
		fmt.Printf("Ollama Error: %v\n", err)
		fmt.Println("Please ensure that Ollama is installed and running. You can install it from https://ollama.com or use the addr flag to specify a custom server.")
		return
	}

	a := &app.App{
		Addr:         "localhost:5187",
		OllamaClient: client,
		WebFiles:     webFiles,
	}

	return startApp(a, pingbackFlag)
}

func startApp(app *app.App, pingbackFlag string) error {
	if pingbackFlag != "" {
		confirmationBytes, err := io.ReadAll(os.Stdin)
		if err != nil {
			return fmt.Errorf("reading confirmation bytes from stdin: %v", err)
		}
		conn, err := net.Dial("tcp", pingbackFlag)
		if err != nil {
			return fmt.Errorf("dialing confirmation address: %v", err)
		}
		defer conn.Close()
		_, err = conn.Write(confirmationBytes)
		if err != nil {
			return fmt.Errorf("writing confirmation bytes to %s: %v", pingbackFlag, err)
		}
	}

	app.Start()
	return nil
}
