package main

import (
	"bytes"
	"crypto/rand"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"os"
	"os/exec"

	"github.com/spf13/cobra"
)

var startCmd = &xllamaCommand{
	Command: &cobra.Command{
		Use:     "start",
		GroupID: "process",
		Long:    "xllama start [--config <path> [--watch]",
		Short:   "Starts the Xllama process in the background and then returns",
		RunE:    cmdStart,
	},
	FastRun: func(cmd *xllamaCommand) {
		cmd.Flags().SortFlags = false
		cmd.Flags().StringP("addr", "a", ollama_default_addr, "Ollama Server Address")
	},
}

func cmdStart(cmd *cobra.Command, args []string) (err error) {
	fl := Flags{cmd.Flags()}
	addrFlag := fl.String("addr")
	// watchFlag := fl.Bool("watch")
	if addrFlag == "" && len(args) > 0 {
		addrFlag = args[0]
	}

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return fmt.Errorf("opening listener for success confirmation: %v", err)
	}
	defer ln.Close()

	runCmd := exec.Command(os.Args[0], "run", "--pingback", ln.Addr().String())

	if addrFlag != "" {
		runCmd.Args = append(runCmd.Args, "--addr", addrFlag)
	}

	stdinPipe, err := runCmd.StdinPipe()
	if err != nil {
		fmt.Printf("creating stdin pipe: %v", err)
		return
	}
	runCmd.Stdout = os.Stdout
	runCmd.Stderr = os.Stderr

	// generate the random bytes we'll send to the child process
	expect := make([]byte, 32)
	_, err = rand.Read(expect)
	if err != nil {
		return fmt.Errorf("generating random confirmation bytes: %v", err)
	}

	// begin writing the confirmation bytes to the child's
	// stdin; use a goroutine since the child hasn't been
	// started yet, and writing synchronously would result
	// in a deadlock
	go func() {
		_, _ = stdinPipe.Write(expect)
		stdinPipe.Close()
	}()

	// start the process
	if err = runCmd.Start(); err != nil {
		return fmt.Errorf("starting Xllama process: %v", err)
	}

	if err = savePid(runCmd.Process.Pid); err != nil {
		return fmt.Errorf("starting Xllama process: %v", err)
	}

	// there are two ways we know we're done: either
	// the process will connect to our listener, or
	// it will exit with an error
	success, exit := make(chan struct{}), make(chan error)

	// in one goroutine, we await the success of the child process
	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				if !errors.Is(err, net.ErrClosed) {
					log.Println(err)
				}
				break
			}
			err = handlePingbackConn(conn, expect)
			if err == nil {
				close(success)
				break
			}
			log.Println(err)
		}
	}()

	// in another goroutine, we await the failure of the child process
	go func() {
		err := runCmd.Wait() // don't send on this line! Wait blocks, but send starts before it unblocks
		exit <- err          // sending on separate line ensures select won't trigger until after Wait unblocks
	}()

	// when one of the goroutines unblocks, we're done and can exit
	select {
	case <-success:
		fmt.Printf("Successfully started xllama (name=%s pid=%d) - xllama is running in the background\n", addrFlag, runCmd.Process.Pid)
	case err := <-exit:
		return fmt.Errorf("fastproxy process exited with error: %v", err)
	}

	return
}

// handlePingbackConn reads from conn and ensures it matches
// the bytes in expect, or returns an error if it doesn't.
func handlePingbackConn(conn net.Conn, expect []byte) error {
	defer conn.Close()
	confirmationBytes, err := io.ReadAll(io.LimitReader(conn, 32))
	if err != nil {
		return err
	}
	if !bytes.Equal(confirmationBytes, expect) {
		return fmt.Errorf("wrong confirmation: %x", confirmationBytes)
	}
	return nil
}

func savePid(pid int) error {
	pidSte := fmt.Sprintf("%d", pid)
	if err := os.WriteFile(pidFilePath, []byte(pidSte), 0644); err != nil {
		return err
	}
	return nil
}
