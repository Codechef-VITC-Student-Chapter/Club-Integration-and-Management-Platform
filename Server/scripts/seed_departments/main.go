package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

const clubID = "codechefvitc"

type departmentSeed struct {
	ID   string
	Name string
}

// var departments = []departmentSeed{
// 	{ID: "technical-cp", Name: "Technical (CP)"},
// 	{ID: "projects-web-development", Name: "Projects & Web Development"},
// 	{ID: "design", Name: "Design"},
// 	{ID: "outreach", Name: "Outreach"},
// 	{ID: "event-management", Name: "Event Management"},
// 	{ID: "social-media-content", Name: "Social Media & Content"},
// }

var departments = []departmentSeed{
	{ID: "cabinet", Name: "Cabinet"},
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf(".env was not loaded: %v", err)
	}

	connectionString := os.Getenv("CONNECTION_STRING")
	databaseName := os.Getenv("DATABASE_NAME")
	if connectionString == "" || databaseName == "" {
		log.Fatal("CONNECTION_STRING and DATABASE_NAME must be set in Server/.env")
	}

	ctx := context.Background()
	client, err := mongo.Connect(options.Client().ApplyURI(connectionString))
	if err != nil {
		log.Fatal("Could not connect to MongoDB: ", err)
	}
	defer func() {
		if err := client.Disconnect(ctx); err != nil {
			log.Printf("MongoDB disconnect error: %v", err)
		}
	}()

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("MongoDB connection test failed: ", err)
	}

	db := client.Database(databaseName)
	schemas.CreateClubCollection(db)
	schemas.CreateDepartmentCollection(db)

	departmentIDs := make([]string, 0, len(departments))
	for _, department := range departments {
		departmentIDs = append(departmentIDs, department.ID)
		_, err := db.Collection("departments").UpdateOne(
			ctx,
			bson.M{"id": department.ID},
			bson.M{
				"$set": bson.M{
				"id":              department.ID,
				"name":            department.Name,
				"club_id":         clubID,
				},
				"$setOnInsert": bson.M{
				"leads":           bson.A{},
				"sub_departments": bson.A{},
				"tasks":           bson.A{},
			}},
			options.UpdateOne().SetUpsert(true),
		)
		if err != nil {
			log.Fatalf("Could not seed department %q: %v", department.Name, err)
		}
	}

	_, err = db.Collection("clubs").UpdateOne(
		ctx,
		bson.M{"id": clubID},
		bson.M{
			"$set": bson.M{
				"id":          clubID,
				"name":        "CodeChef VITC Student Chapter",
				"departments": departmentIDs,
			},
			"$setOnInsert": bson.M{
				"leads": bson.A{},
			},
		},
		options.UpdateOne().SetUpsert(true),
	)
	if err != nil {
		log.Fatal("Could not update club department references: ", err)
	}

	fmt.Printf("Seeded %d departments for club %q in database %q.\n", len(departments), clubID, databaseName)
	fmt.Println("Department leads and tasks are empty; assign leads before creating tasks or approving requests.")
}