package utils

import (
	"fmt"
	"time"
)

func GetTaskID(userID string) string {
	return "TID" + userID[3:] + fmt.Sprintf("%d", time.Now().UnixMilli())
}
