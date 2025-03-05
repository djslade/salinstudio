package main

import (
	"fmt"
	"log/slog"
)

type config struct {
	addr int
	env  string
}

type application struct {
	logger *slog.Logger
}

func main() {
	fmt.Println("Hi banana!")
}
