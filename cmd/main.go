package main

import (
	"fmt"
	"os"
	"path"

	"github.com/aiomni/xllama/utils"
	"github.com/spf13/cobra"
)

var (
	basePath    = "/.xllama"
	pidFilePath = "./pid"
)

func init() {
	// 初始化 根目录
	home := os.Getenv("FASTPROXY_HOME")
	if home != "" {
		basePath = home
	} else {
		homeDir, _ := os.UserHomeDir()
		basePath = path.Join(homeDir, basePath)
	}

	if err := utils.CheckOrCreateDir(basePath); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	pidFilePath = path.Join(basePath, pidFilePath)

	cobra.EnableCaseInsensitive = true
	cobra.EnableCommandSorting = false
}

var rootCmd = &xllamaCommand{
	Command: &cobra.Command{
		Use: "xllama",
		Run: func(cmd *cobra.Command, args []string) {
			// Do Stuff Here
		},
	},
	FastRun: func(cmd *xllamaCommand) {
		cmd.Flags().SortFlags = false

		cmd.AddGroup(&cobra.Group{ID: "process", Title: "Process Commands:"})
		// cmd.AddGroup(&cobra.Group{ID: "setting", Title: "Setting Commands:"})

		cmd.AddCommand(startCmd)
		cmd.AddCommand(runCmd)
		cmd.AddCommand(stopCmd)
	},
}

func main() {
	if len(os.Args) == 0 {
		fmt.Printf("[FATAL] no arguments provided by OS; args[0] must be command\n")
		os.Exit(1)
	}

	cobra.CheckErr(rootCmd.Execute())
}
