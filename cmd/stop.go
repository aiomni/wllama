package main

import (
	"fmt"
	"os"
	"strconv"
	"syscall"

	"github.com/spf13/cobra"
)

var stopCmd = &xllamaCommand{
	Command: &cobra.Command{
		Use:     "stop",
		GroupID: "process",
		Long:    "xllama [--pid <PID>]",
		Short:   "Gracefully stops a started Xllama process",
		RunE:    cmdStop,
	},
	FastRun: func(cmd *xllamaCommand) {
		pid, _ := getPid()
		cmd.Flags().IntP("pid", "p", pid, "Server pid")
	},
}

func cmdStop(cmd *cobra.Command, args []string) (err error) {
	fl := Flags{cmd.Flags()}
	pidFlag := fl.Int("pid")

	if pidFlag == 0 {
		return fmt.Errorf("pid flat is empty.")
	}

	syscall.Kill(pidFlag, syscall.SIGTERM)
	os.Remove(pidFilePath)
	fmt.Printf("Xllama App Stopped (pid=%d).\n", pidFlag)

	return
}

func getPid() (int, error) {
	content, err := os.ReadFile(pidFilePath)
	if err != nil {
		return 0, err
	}
	contentStr := string(content)

	pid, err := strconv.Atoi(contentStr)

	return pid, err
}
