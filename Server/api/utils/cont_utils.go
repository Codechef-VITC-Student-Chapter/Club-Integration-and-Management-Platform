package utils

import (
	"fmt"
	"time"

	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
)

func IsValidStatus(status string) bool {
	switch schemas.Status(status) {
	case schemas.Approved, schemas.Pending, schemas.Rejected:
		return true
	default:
		return false
	}
}

func GetContributionID(userID string) string {
	return "CID" + userID[3:] + fmt.Sprintf("%d", time.Now().UnixMilli())
}
