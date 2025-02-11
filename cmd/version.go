package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var version = os.Getenv("XLLAMA_VERSION")

var versionCmd = &xllamaCommand{
	Command: &cobra.Command{
		Use:   "version",
		Long:  "xllama version",
		Short: "Get xllama version",
		RunE:  cmdVersion,
	},
	FastRun: func(cmd *xllamaCommand) {
	},
}

func cmdVersion(cmd *cobra.Command, args []string) (err error) {
	if version == "" {
		version = "v0.0.0"
	}

	fmt.Printf("xllama version: %s\n", version)
	return nil
}
