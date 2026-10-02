package utils

import (
	"regexp"
	"testing"
)

func TestPasswordHashingAndLegacyUpgrade(t *testing.T) {
	password := "correct horse battery staple"
	hash, err := HashPassword(password)
	if err != nil {
		t.Fatalf("HashPassword() error = %v", err)
	}
	if valid, legacy := VerifyPassword(password, hash); !valid || legacy {
		t.Fatalf("VerifyPassword() = (%v, %v), want (true, false)", valid, legacy)
	}
	if valid, _ := VerifyPassword("wrong password", hash); valid {
		t.Fatal("VerifyPassword() accepted an incorrect password")
	}

	for _, legacyHash := range []string{
		HashSHA256(password),
		HashSHA256(HashSHA256(password)),
	} {
		if valid, legacy := VerifyPassword(password, legacyHash); !valid || !legacy {
			t.Fatalf("VerifyPassword() = (%v, %v), want (true, true) for a legacy hash", valid, legacy)
		}
	}
}

func TestOTPGenerationAndHashing(t *testing.T) {
	otp, err := GenerateOTP()
	if err != nil {
		t.Fatalf("GenerateOTP() error = %v", err)
	}
	if !regexp.MustCompile(`^[0-9]{6}$`).MatchString(otp) {
		t.Fatalf("GenerateOTP() = %q, want six digits", otp)
	}

	hash, err := HashOTP(otp)
	if err != nil {
		t.Fatalf("HashOTP() error = %v", err)
	}
	if !VerifyOTP(otp, hash) {
		t.Fatal("VerifyOTP() rejected the generated OTP")
	}
	if VerifyOTP("000000", hash) {
		t.Fatal("VerifyOTP() accepted an incorrect OTP")
	}
	if !VerifyOTP(otp, HashSHA256(otp)) {
		t.Fatal("VerifyOTP() did not accept a legacy OTP hash")
	}
}
