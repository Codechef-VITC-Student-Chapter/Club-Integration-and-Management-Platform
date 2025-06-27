package types

import (
	"mime/multipart"

	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
)

type GetUserResponse struct {
	Message string       `json:"message"`
	User    schemas.User `json:"user,omitempty"`
}

type GetUserContributionsResponse struct {
	Message       string             `json:"message"`
	Contributions []FullContribution `json:"contributions"`
}

type GetLeadUserRequestsResponse struct {
	Message  string             `json:"message"`
	Requests []FullContribution `json:"requests"`
}

type MakeUserLeadResponse struct {
	Message string `json:"message"`
}

type UploadMembersHandlesInfo struct {
	LeadUserID string                `json:"lead_user_id"`
	CSVFile    *multipart.FileHeader `form:"csv_file" binding:"required"`
}

type CSVUserData struct {
	Dept       string
	RollNo     string
	Name       string
	CodeChef   string
	CodeForces string
	LeetCode   string
	Other      string
	Analytics  string
}
