package utils

import "strings"

func GetUserIDFromRegNumber(reg string) string {
	return "UID" + strings.ToUpper(reg)
}
