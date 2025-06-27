package controllers

import (
	"fmt"
	"os"
	"time"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(payload types.TokenPayload) (string, error) {
	claims := types.CustomClaims{
		ID:     payload.ID,
		Name:   payload.Name,
		IsLead: payload.IsLead,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(6 * time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("JWT_SECRET_KEY")
	if secret == "" {
		return "", fmt.Errorf("JWT_SECRET_KEY is not set")
	}
	return token.SignedString([]byte(secret))
}

func VerifyToken(tokenString string) (types.CustomClaims, error) {
	secret := os.Getenv("JWT_SECRET_KEY")
	if secret == "" {
		return types.CustomClaims{}, fmt.Errorf("JWT_SECRET_KEY is not set")
	}
	token, err := jwt.ParseWithClaims(tokenString, &types.CustomClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil {
		return types.CustomClaims{}, err
	}
	if claims, ok := token.Claims.(*types.CustomClaims); ok && token.Valid {
		return *claims, nil
	}
	return types.CustomClaims{}, fmt.Errorf("invalid Token")
}
