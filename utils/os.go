package utils

import (
	"bufio"
	"os"
)

func CheckFileExists(filename string) bool {
	_, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return err == nil
}

// CheckOrCreateDir if dir exists do nothing if not exists create one
func CheckOrCreateDir(dir string) error {
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		if err := os.MkdirAll(dir, os.ModePerm); err != nil {
			return err
		}
	}
	return nil
}

// ReadFile Content from filePath
func ReadFile(filePath string) ([]byte, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	content := []byte{}
	for scanner.Scan() {
		content = append(content, scanner.Bytes()...)
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return content, nil
}
