package controllers

import (
	"log"
	"sync"

	"github.com/Sasank-V/CIMP-Golang-Backend/database"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/Sasank-V/CIMP-Golang-Backend/lib"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var ClubColl *mongo.Collection
var ClubConnect sync.Once

func ConnectClubCollection() {
	ClubConnect.Do(func() {
		db := database.InitDB()
		schemas.CreateClubCollection(db)
		ClubColl = db.Collection(lib.ClubCollName)
	})
}

// Get Functions

func GetClubByID(id string) (schemas.Club, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	var club schemas.Club
	err := ClubColl.FindOne(ctx, bson.D{{"id", id}}).Decode(&club)
	if err != nil {
		log.Printf("error getting club data: %v", err)
		return schemas.Club{}, err

	}
	return club, nil
}
