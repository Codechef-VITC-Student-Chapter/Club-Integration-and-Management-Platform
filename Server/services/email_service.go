package services

import (
	"log"
	"os"

	"gopkg.in/gomail.v2"
)

var dialer *gomail.Dialer
var smtpSender gomail.SendCloser
var err error

func SetUpEmailDialer() {
	dialer = gomail.NewDialer("smtp.gmail.com", 465, os.Getenv("CLUB_EMAIL"), os.Getenv("CLUB_EMAIL_APP_PASSWORD"))
	dialer.SSL = true
	smtpSender, err = dialer.Dial()
	if err != nil {
		log.Printf("Error setting up email dialer: %v", err)
		return
	}
	log.Printf("Email Dialer Set")
}

func SendEmailFromClub(to string, subject string, body string) error {
	m := gomail.NewMessage()

	m.SetHeader("From", os.Getenv("CLUB_EMAIL"))
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	if err := gomail.Send(smtpSender, m); err != nil {
		log.Printf("Error sending email: %v", err)
		return err
	}
	return nil
}
