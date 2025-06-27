package types

import "github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"

type DepartmetInfoResponse struct {
	Message    string             `json:"message"`
	Department schemas.Department `json:"department"`
}

type LeadsInfo struct {
	Name   string `json:"name"`
	UserID string `json:"user_id"`
}

type DepartmentLeadsResponse struct {
	Message string      `json:"message"`
	Leads   []LeadsInfo `json:"leads,omitempty"`
}
