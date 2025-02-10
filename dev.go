//go:build dev

package main

import "fmt"

func init() {
	isDev = true
	fmt.Println("Running in development mode")
}
