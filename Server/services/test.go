// #file:test.go
package services

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/controllers"
	"github.com/Sasank-V/CIMP-Golang-Backend/database"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/lpernett/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("Error loading .env: %v", err)
	}
	log.Println("✅ ENV Loaded")

	controllers.ConnectContributionCollection()
	controllers.ConnectUserCollection()

	contributions, err := getAllContributions()
	if err != nil {
		log.Fatal("Error fetching contributions:", err)
	}

	file, err := os.Create("contributions.csv")
	if err != nil {
		log.Fatal("Error creating CSV file:", err)
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	header := []string{
		"ContributionID",
		"Title",
		"Points",
		"UserID",
		"UserName",
		"UserRegNumber",
		"UserEmail",
		"Description",
		"ProofFiles",
		"TargetID",
		"TargetName",
		"TargetRegNumber",
		"SecTargets",
		"ClubID",
		"Department",
		"Status",
		"Reason",
		"CreatedAt",
		"UpdatedAt",
	}
	writer.Write(header)

	for _, c := range contributions {
		record := buildCSVRecord(c)
		if err := writer.Write(record); err != nil {
			log.Println("Error writing record:", err)
		}
	}

	log.Println("✅ contributions.csv successfully generated!")
}

// getAllContributions fetches all contributions using the controllers
func getAllContributions() ([]schemas.Contribution, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	coll := controllers.ContColl
	cursor, err := coll.Find(ctx, map[string]interface{}{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var contributions []schemas.Contribution
	if err := cursor.All(ctx, &contributions); err != nil {
		return nil, err
	}

	return contributions, nil
}

// buildCSVRecord converts a contribution into a CSV row using controller functions
func buildCSVRecord(c schemas.Contribution) []string {
	user, err := controllers.GetUserByID(c.UserID)
	if err != nil {
		user = schemas.User{}
	}
	target, err := controllers.GetUserByID(c.Target)
	if err != nil {
		target = schemas.User{}
	}

	var secTargets []string
	for _, sec := range c.SecTargets {
		st, err := controllers.GetUserByID(sec)
		if err == nil && st.FirstName != "" {
			secTargets = append(secTargets, fmt.Sprintf("%s %s (%s)", st.FirstName, st.LastName, st.RegNumber))
		}
	}

	return []string{
		c.ID,
		c.Title,
		fmt.Sprintf("%d", c.Points),
		c.UserID,
		fmt.Sprintf("%s %s", user.FirstName, user.LastName),
		user.RegNumber,
		user.Email,
		c.Description,
		fmt.Sprintf("%v", c.ProofFiles),
		c.Target,
		fmt.Sprintf("%s %s", target.FirstName, target.LastName),
		target.RegNumber,
		fmt.Sprintf("%v", secTargets),
		c.ClubID,
		c.Department,
		string(c.Status), // convert enum to string
		c.Reason,
		c.CreatedAt.Format(time.RFC3339),
	}
}
