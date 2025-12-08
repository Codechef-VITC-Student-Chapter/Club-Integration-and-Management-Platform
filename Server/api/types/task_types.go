package types

import "github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"

type FullTask struct {
	Task           schemas.Task `json:"task"`
	ClubName       string       `json:"club_name,omitempty"`
	DepartmentName string       `json:"department_name,omitempty"`
	CreatedByUser  string       `json:"created_by_user,omitempty"`
}

type TasksResponse struct {
	Message string     `json:"message"`
	Tasks   []FullTask `json:"tasks"`
}

type TaskInfo struct {
	Title        string `json:"title"`
	Points       int    `json:"points"`
	ClubID       string `json:"club_id"`
	DepartmentID string `json:"department_id"`
	CreatedBy    string `json:"created_by"`
}

type TaskUpdateInfo struct {
	Title        *string `json:"title,omitempty"`
	Points       *int    `json:"points,omitempty"`
	ClubID       *string `json:"club_id,omitempty"`
	DepartmentID *string `json:"department_id,omitempty"`
	IsActive     *bool   `json:"is_active,omitempty"`
}

type AddTaskResponse struct {
	Message string `json:"message"`
	TaskID  string `json:"task_id"`
}
