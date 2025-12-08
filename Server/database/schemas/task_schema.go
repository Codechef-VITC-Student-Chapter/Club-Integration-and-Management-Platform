package schemas

import (
	"log"

	"github.com/Sasank-V/CIMP-Golang-Backend/database"
	"github.com/Sasank-V/CIMP-Golang-Backend/lib"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Task struct {
	ID           string `bson:"id" json:"id"`
	ClubID       string `bson:"club_id" json:"club_id"`
	DepartmentID string `bson:"department_id" json:"department_id"`
	CreatedBy    string `bson:"created_by" json:"created_by"`
	Title        string `bson:"title" json:"title"`
	Points       int    `bson:"points" json:"points"`
	IsActive     bool   `bson:"is_active" json:"is_active"`
}

func CreateTaskCollection(db *mongo.Database) {
	ctx, cancel := database.GetContext()
	defer cancel()

	exist, err := database.CollectionExists(db, lib.TaskCollName)
	if err != nil {
		log.Fatal("Error checking the existing collection: ", err)
		return
	}
	if exist {
		log.Printf("Task Collection Already Exists, Skipping Creation...\n")
		return
	}

	jsonSchema := bson.M{
		"bsonType": "object",
		"required": []string{"id", "club_id", "department_id", "title", "points", "created_by", "is_active"},
		"properties": bson.M{
			"id": bson.M{
				"bsonType": "string",
			},
			"club_id": bson.M{
				"bsonType": "string",
			},
			"department_id": bson.M{
				"bsonType": "string",
			},
			"created_by": bson.M{
				"bsonType": "string",
			},
			"title": bson.M{
				"bsonType": "string",
			},
			"points": bson.M{
				"bsonType": "int",
			},
			"is_active": bson.M{
				"bsonType": "bool",
			},
		},
	}

	validator := bson.M{
		"$jsonSchema": jsonSchema,
	}

	opts := options.CreateCollection().SetValidator(validator)
	err = db.CreateCollection(ctx, lib.TaskCollName, opts)
	if err != nil {
		log.Fatal("Failed to Create Task Collection: ", err)
		return
	}

	if err := database.SetUniqueKeys(db.Collection(lib.TaskCollName), []string{"id"}); err != nil {
		log.Fatal("Error setting up Task Unique Keys: ", err)
	}
}
