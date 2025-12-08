package services

import (
	"os"

	"github.com/resend/resend-go/v3"
)

// var dialer *gomail.Dialer
// var smtpSender gomail.SendCloser
// var err error

// Dev
// func SetUpEmailDialer() {
// 	dialer = gomail.NewDialer("smtp.gmail.com", 465, os.Getenv("CLUB_EMAIL"), os.Getenv("CLUB_EMAIL_APP_PASSWORD"))
// 	dialer.SSL = true
// 	smtpSender, err = dialer.Dial()
// 	if err != nil {
// 		log.Printf("Error setting up email dialer: %v", err)
// 		return
// 	}
// 	log.Printf("Email Dialer Set")
// }

// func SetUpEmailDialer() {
// 	dialer = gomail.NewDialer(
// 		os.Getenv("SMTP_HOST"),
// 		587, // Port (use STARTTLS)
// 		os.Getenv("SMTP_LOGIN"),
// 		os.Getenv("SMTP_PASSWORD"),
// 	)
// 	smtpSender, err = dialer.Dial()
// 	if err != nil {
// 		log.Printf("Error setting up email dialer: %v", err)
// 		return
// 	}
// 	log.Printf("Email Dialer Set")
// }

// func SendEmailFromClub(to string, subject string, body string) error {
// 	m := gomail.NewMessage()

// 	m.SetHeader("From", os.Getenv("CLUB_EMAIL"))
// 	m.SetHeader("To", to)
// 	m.SetHeader("Subject", subject)
// 	m.SetBody("text/html", body)

// 	if err := gomail.Send(smtpSender, m); err != nil {
// 		log.Printf("Error sending email: %v", err)
// 		return err
// 	}
// 	return nil
// }

// Prod
// func SendEmailFromClub(to string, subject string, body string) error {
// 	// Create fresh dialer for each email
// 	dialer := gomail.NewDialer(
// 		os.Getenv("SMTP_HOST"),
// 		587,
// 		os.Getenv("SMTP_LOGIN"),
// 		os.Getenv("SMTP_PASSWORD"),
// 	)

// 	m := gomail.NewMessage()
// 	m.SetHeader("From", os.Getenv("CLUB_EMAIL"))
// 	m.SetHeader("To", to)
// 	m.SetHeader("Subject", subject)
// 	m.SetBody("text/html", body)

// 	// Use DialAndSend - creates fresh connection and closes it automatically
// 	if err := dialer.DialAndSend(m); err != nil {
// 		log.Printf("Error sending email: %v", err)
// 		return err
// 	}

//		log.Printf("Email sent successfully to %s", to)
//		return nil
//	}
func SendEmailFromClub(to string, subject string, body string) error {
	client := resend.NewClient(os.Getenv("RESEND_API_KEY"))

	params := &resend.SendEmailRequest{
		From:    os.Getenv("CLUB_EMAIL"), // must be a verified domain/sender in Resend
		To:      []string{to},
		Subject: subject,
		Html:    body,
	}

	_, err := client.Emails.Send(params)
	if err != nil {
		return err
	}

	return nil
}
