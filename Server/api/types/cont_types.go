package types

import "github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"

type FullContribution struct {
	Contribution   schemas.Contribution `json:"contribution"`
	ClubName       string               `json:"club_name"`
	DepartmentName string               `json:"department_name"`
}

type ContributionUpdateInfo struct {
	ContributionID string    `json:"cont_id"`
	UserID         string    `json:"user_id"`
	Title          *string   `json:"title,omitempty"`
	Points         *int      `json:"points,omitempty"`
	Description    *string   `json:"description,omitempty"`
	ProofFiles     *[]string `json:"proof_files,omitempty"`
	Target         *string   `json:"target,omitempty"`
	SecTargets     *[]string `json:"secTargets,omitempty"`
	Department     *string   `json:"department,omitempty"`
	ClubID         *string   `json:"club_id,omitempty"`
}

type ContributionInfo struct {
	Title       string   `json:"title"`
	Points      int      `json:"points"`
	UserID      string   `json:"user_id"`
	Description string   `json:"description"`
	ProofFiles  []string `json:"proof_files,omitempty"`
	Target      string   `json:"target"`
	SecTargets  []string `json:"sec_targets,omitempty"`
	ClubID      string   `json:"club_id"`
	Department  string   `json:"department"`
}

type ContributionStatusInfo struct {
	ContributionID string `json:"cont_id"`
	LeadUserID     string `json:"lead_user_id"`
	Status         string `json:"status"`
	Reason         string `json:"reason"`
}

type AddContributionIDUserInfo struct {
	UserID         string `json:"user_id"`
	ContributionID string `json:"cont_id"`
}

type AddContributionResponse struct {
	Message        string `json:"message"`
	ContributionID string `json:"cont_id"`
}

type MessageResponse struct {
	Message string `json:"message"`
}
