package types

import "github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"

type LeaderboardEntry struct {
	FirstName   string `json:"firstname"`
	LastName    string `json:"lastname"`
	TotalPoints int    `json:"totalPoints"`
}

type LeaderboardInfoResponse struct {
	Message string
	Data    []LeaderboardEntry `json:"data"`
}

type ClubInfoResponse struct {
	Message string       `json:"message"`
	Club    schemas.Club `json:"club"`
}

type AllClubMemebersResponse struct {
	Message string         `json:"message"`
	Members []schemas.User `json:"members"`
}

type AllClubDepartmentsResponse struct {
	Message     string               `json:"message"`
	Departments []schemas.Department `json:"departments"`
}
