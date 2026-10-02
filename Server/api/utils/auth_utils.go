package utils

import (
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"fmt"
	"math/big"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	if len([]byte(password)) > 72 {
		return "", fmt.Errorf("password must not exceed 72 bytes")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func VerifyPassword(password string, encoded string) (valid bool, legacy bool) {
	if strings.HasPrefix(encoded, "$2") {
		if len([]byte(password)) > 72 {
			return false, false
		}
		return bcrypt.CompareHashAndPassword([]byte(encoded), []byte(password)) == nil, false
	}

	// Older client versions sent a SHA-256 digest that the server hashed again.
	singleHash := HashSHA256(password)
	doubleHash := HashSHA256(singleHash)
	if len(encoded) != len(singleHash) {
		return false, false
	}
	if subtle.ConstantTimeCompare([]byte(encoded), []byte(singleHash)) == 1 ||
		subtle.ConstantTimeCompare([]byte(encoded), []byte(doubleHash)) == 1 {
		return true, true
	}
	return false, false
}

func HashOTP(otp string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(otp), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func VerifyOTP(otp string, encoded string) bool {
	if strings.HasPrefix(encoded, "$2") {
		return bcrypt.CompareHashAndPassword([]byte(encoded), []byte(otp)) == nil
	}
	legacyHash := HashSHA256(otp)
	if len(encoded) != len(legacyHash) {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(encoded), []byte(legacyHash)) == 1
}

func HashSHA256(input string) string {
	hash := sha256.Sum256([]byte(input))
	return hex.EncodeToString(hash[:])
}

func GenerateOTP() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(900000))
	if err != nil {
		return "", fmt.Errorf("generate OTP: %w", err)
	}
	return fmt.Sprintf("%06d", n.Int64()+100000), nil
}
