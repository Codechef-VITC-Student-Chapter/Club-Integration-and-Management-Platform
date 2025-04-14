package lib

import (
	"fmt"
	"strings"
	"time"
)

func GetOTPTemplate(otp string) string {
	var styledOTP strings.Builder
	for _, digit := range otp {
		styledOTP.WriteString(fmt.Sprintf(
			`<span style="display:inline-block;padding:8px 16px;margin:0 4px;background-color:#3D5A80;color:white;border-radius:4px;font-size:24px;font-weight:bold">%c</span>`,
			digit))
	}
	emailTemplate := fmt.Sprintf(`
		<div style="width:100%%;max-width:600px;margin:0px auto;padding:20px;font-family:Arial,sans-serif">
			<div style="text-align:center;background-color:#3D5A80;border-radius:10px;color:white;padding:20px 0px">
				<img src="https://ci3.googleusercontent.com/meips/ADKq_NaWIdXaGhuSO6djFzdCWicfU_M-YkxmsaqIp9pCX-NN09-gVhLQJWYJ_AcliWFQR0EzEFakr91Bp4YQNtaIlXP2jSkUiWo7QjeLJLwjaunct8CRZq7CfJ3onAQbgfSX2MRRCFdNvwkgCUPEDBXuJksSSA=s0-d-e1-ft#https://res.cloudinary.com/dxu5hlgvd/image/upload/v1720609534/FINAL_LOGO-CMZ27HCT_rvrnax.png" alt="CIMP_Logo" style="margin-bottom:10px;height: 100px;width: 100px;"/>
				<h1 style="margin:0px;font-size:24px">🔐 Password Reset Verification 🔐</h1>
			</div>

			<div style="padding:30px;background-color:#ffffff;border-radius:10px;margin-top:20px">
				<h2 style="color:#3D5A80;text-align:center;margin-bottom:20px">Verify Your Identity</h2>

				<p style="color:#555555;font-size:16px;line-height:1.5;margin-bottom:25px;text-align:center">
					A password reset was requested for your CIMP account. Please use the following verification code to complete the process:
				</p>

				<div style="text-align:center;margin:30px 0">
					%s
				</div>

				<p style="color:#555555;font-size:14px;line-height:1.5;margin-top:25px;text-align:center">
					If you didn't request this password reset, please ignore this email or contact support if you have concerns.
				</p>
			</div>

			<div style="margin-top:20px;padding:20px;background-color:#E0FBFC;border-radius:10px">
				<p style="color:#555555;font-size:14px;line-height:1.4;margin:0;text-align:center">
					<strong>Security Tip:</strong> Never share your OTP with anyone.<br>CIMP will never ask for your OTP through phone or email.
				</p>
			</div>

			<div style="text-align:center;padding:20px;color:#777777">
				<p style="margin:5px 0">© %d CIMP. All rights reserved.</p>
				<p style="margin:5px 0">This is an automated message, please do not reply.</p>
			</div>
		</div>`, styledOTP.String(), time.Now().Year())

	return emailTemplate
}
