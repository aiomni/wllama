package main

import (
	"fmt"

	"github.com/spf13/cobra"
)

// Version Will be replace when build
var Version = "v0.0.0"

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
	fmt.Printf("xllama version: %s\n", Version)
	return nil
}
