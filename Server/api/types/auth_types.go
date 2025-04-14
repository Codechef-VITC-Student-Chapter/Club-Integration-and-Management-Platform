package types

import "github.com/golang-jwt/jwt/v5"

type UserSignUpInfo struct {
	RegNumber string `json:"reg_number"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type UserLoginInfo struct {
	RegNumber string `json:"reg_number"`
	Password  string `json:"password"`
}

type TokenPayload struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	IsLead bool   `json:"is_lead"`
}

type CustomClaims struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	IsLead bool   `json:"is_lead"`
	jwt.RegisteredClaims
}

type AuthResponse struct {
	Message string `json:"message"`
	Token   string `json:"token"`
}

type SetNewPassInfo struct {
	RegNo    string `json:"reg_no"`
	OTP      string `json:"otp"`
	Password string `json:"password"`
}
