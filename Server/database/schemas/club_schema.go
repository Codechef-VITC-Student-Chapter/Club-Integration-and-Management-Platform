package schemas

import (
	"log"

	"github.com/Sasank-V/CIMP-Golang-Backend/database"
	"github.com/Sasank-V/CIMP-Golang-Backend/lib"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Club struct {
	ID          string   `bson:"id" json:"id" `
	Name        string   `bson:"name" json:"name"`
	Leads       []string `bson:"leads" json:"leads"`
	Departments []string `bson:"departments,omitempty" json:"departments,omitempty"`
}

func CreateClubCollection(db *mongo.Database) {
	ctx, cancel := database.GetContext()
	defer cancel()

	exist, err := database.CollectionExists(db, lib.ClubCollName)
	if err != nil {
		log.Fatal("Error checking the existing collection: ", err)
		return
	}
	if exist {
		log.Printf("Club Collection Already Exist , Skipping Creation...\n")
		return
	}

	jsonSchema := bson.M{
		"bsonType": "object",
		"required": []string{"id", "name"},
		"properties": bson.M{
			"id": bson.M{
				"bsonType": "string",
			},
			"name": bson.M{
				"bsonType": "string",
			},
			"leads": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
			"departments": bson.M{
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
	opts := options.CreateCollection().SetValidator(validator)
	err = db.CreateCollection(ctx, lib.ClubCollName, opts)
	if err != nil {
		log.Fatal("Error creating Club Collection: ", err)
		return
	}
	if err = database.SetUniqueKeys(db.Collection(lib.ClubCollName), []string{"id"}); err != nil {
		log.Fatal("Error setting up Club unique keys: ", err)
	}

}
