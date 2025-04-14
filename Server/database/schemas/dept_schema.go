package schemas

import (
	"log"

	"github.com/Sasank-V/CIMP-Golang-Backend/database"
	"github.com/Sasank-V/CIMP-Golang-Backend/lib"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Department struct {
	ID             string   `bson:"id" json:"id"`
	Name           string   `bson:"name" json:"name"`
	ClubID         string   `bson:"club_id" json:"club_id"`
	Leads          []string `bson:"leads" json:"leads"`
	SubDepartments []string `bson:"sub_departments" json:"sub_departments"`
	Tasks          []string `bson:"tasks" json:"tasks"`
}

func CreateDepartmentCollection(db *mongo.Database) {
	exist, err := database.CollectionExists(db, lib.DepartmentCollName)
	if err != nil {
		log.Fatal("Error checking existing collections: ", err)
		return
	}
	if exist {
		log.Printf("Department Collection Already Exist , Skipping Creation...\n")
		return
	}

	jsonSchema := bson.M{
		"bsonType": "object",
		"required": []string{"id", "name", "club_id"},
		"properties": bson.M{
			"id": bson.M{
				"bsonType": "string",
			},
			"name": bson.M{
				"bsonType": "string",
			},
			"club_id": bson.M{
				"bsonType": "string",
			},
			"leads": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
			"sub_departments": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
			"tasks": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
		},
	}

	validator := bson.M{
		"$jsonSchema": jsonSchema,
	}

	ctx, cancel := database.GetContext()
	defer cancel()

	opts := options.CreateCollection().SetValidator(validator)

	err = db.CreateCollection(ctx, lib.DepartmentCollName, opts)
	if err != nil {
		log.Fatal("Error creating Department Collection: ", err)
		return
	}
	err = database.SetUniqueKeys(db.Collection(lib.DepartmentCollName), []string{"id"})
	if err != nil {
		log.Fatal("Error setting up unique Keys: ", err)
		return
	}
}
