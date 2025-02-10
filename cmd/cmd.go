package main

import "github.com/spf13/cobra"

type xllamaCommand struct {
	*cobra.Command
	FastRun func(cmd *xllamaCommand)
}

func (cmd *xllamaCommand) AddCommand(cmds ...*xllamaCommand) {
	for _, sc := range cmds {
		if sc.FastRun != nil {
			sc.FastRun(sc)
		}
		cmd.Command.AddCommand(sc.Command)
	}
}

func (cmd *xllamaCommand) Execute() error {
	if cmd.FastRun != nil {
		cmd.FastRun(cmd)
	}
	return cmd.Command.Execute()
}
