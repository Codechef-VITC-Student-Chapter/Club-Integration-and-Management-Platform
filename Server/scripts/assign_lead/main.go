package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

const clubID = "codechefvitc"

func main() {
	registrationNumber := flag.String("reg", "", "lead registration number, for example 23ABC1234")
	departmentID := flag.String("department", "", "department ID, for example technical-cp")
	flag.Parse()

	if strings.TrimSpace(*registrationNumber) == "" || strings.TrimSpace(*departmentID) == "" {
		flag.Usage()
		log.Fatal("both -reg and -department are required")
	}

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

	userID := "UID" + strings.ToUpper(strings.TrimSpace(*registrationNumber))
	department := strings.TrimSpace(*departmentID)
	db := client.Database(databaseName)

	var user bson.M
	if err := db.Collection("users").FindOne(ctx, bson.M{"id": userID}).Decode(&user); err != nil {
		if err == mongo.ErrNoDocuments {
			log.Fatalf("No user found for registration number %q; the user must sign up first", *registrationNumber)
		}
		log.Fatal("Could not find user: ", err)
	}

	var departmentRecord bson.M
	if err := db.Collection("departments").FindOne(ctx, bson.M{"id": department, "club_id": clubID}).Decode(&departmentRecord); err != nil {
		if err == mongo.ErrNoDocuments {
			log.Fatalf("No department found with ID %q; run the department seed script first", department)
		}
		log.Fatal("Could not find department: ", err)
	}

	_, err = db.Collection("users").UpdateOne(ctx, bson.M{"id": userID}, bson.M{
		"$set": bson.M{"is_lead": true},
		"$addToSet": bson.M{
			"departments": department,
			"clubs":       clubID,
		},
	})
	if err != nil {
		log.Fatal("Could not update user lead status: ", err)
	}

	_, err = db.Collection("departments").UpdateOne(ctx, bson.M{"id": department}, bson.M{
		"$addToSet": bson.M{"leads": userID},
	})
	if err != nil {
		log.Fatal("Could not assign lead to department: ", err)
	}

	_, err = db.Collection("clubs").UpdateOne(ctx, bson.M{"id": clubID}, bson.M{
		"$addToSet": bson.M{"leads": userID, "departments": department},
	})
	if err != nil {
		log.Fatal("Could not update club lead references: ", err)
	}

	fmt.Printf("Assigned %s (%s) as a lead for department %q.\n", userID, *registrationNumber, department)
}