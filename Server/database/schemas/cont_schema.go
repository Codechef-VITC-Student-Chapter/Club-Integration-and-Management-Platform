package schemas

import (
	"log"
	"time"

	"github.com/Sasank-V/CIMP-Golang-Backend/database"
	"github.com/Sasank-V/CIMP-Golang-Backend/lib"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Status string

const (
	Pending  Status = "pending"
	Approved Status = "approved"
	Rejected Status = "rejected"
)

type Contribution struct {
	ID          string    `bson:"id" json:"id"`
	Title       string    `bson:"title" json:"title"`
	Points      uint      `bson:"points" json:"points"`
	UserID      string    `bson:"user_id" json:"user_id"`
	Description string    `bson:"description" json:"description"`
	ProofFiles  []string  `bson:"proof_files,omitempty" json:"proof_files"`
	Target      string    `bson:"target" json:"target"`
	SecTargets  []string  `bson:"secTargets,omitempty" json:"secTargets"`
	ClubID      string    `bson:"club_id" json:"club_id"`
	Department  string    `bson:"department" json:"department"`
	Status      Status    `bson:"status" json:"status"`
	Reason      string    `bson:"reason,omitempty" json:"reason"`
	CreatedAt   time.Time `bson:"created_at" json:"created_at"`
}

func CreateContributionCollection(db *mongo.Database) {
	ctx, cancel := database.GetContext()
	defer cancel()

	exist, err := database.CollectionExists(db, lib.ContributionCollName)
	if err != nil {
		log.Fatal("Error checking the existing collection: ", err)
		return
	}
	if exist {
		log.Printf("Contribution Collection Already Exist , Skipping Creation...\n")
		return
	}
	jsonSchema := bson.M{
		"bsonType": "object",
		"required": []string{"id", "title", "points", "user_id", "description", "target", "club_id", "department"},
		"properties": bson.M{
			"id": bson.M{
				"bsonType": "string",
			},
			"title": bson.M{
				"bsonType": "string",
			},
			"points": bson.M{
				"bsonType": "long",
			},
			"user_id": bson.M{
				"bsonType": "string",
			},
			"description": bson.M{
				"bsonType": "string",
			},
			"proof_files": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
			"target": bson.M{
				"bsonType": "string",
			},
			"secTargets": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
			"club_id": bson.M{
				"bsonType": "string",
			},
			"department": bson.M{
				"bsonType": "string",
			},
			"status": bson.M{
				"bsonType": "string",
				"enum":     []string{string(Approved), string(Pending), string(Rejected)},
			},
			"reason": bson.M{
				"bsonType": "string",
			},
			"created_at": bson.M{
				"bsonType": "date",
			},
		},
	}

	validator := bson.M{
		"$jsonSchema": jsonSchema,
	}

	opts := options.CreateCollection().SetValidator(validator)
	err = db.CreateCollection(ctx, lib.ContributionCollName, opts)
	if err != nil {
		log.Fatal("Error creating Contribution Collection: ", err)
		return
	}
	if err = database.SetUniqueKeys(db.Collection(lib.ContributionCollName), []string{"id"}); err != nil {
		log.Fatal("Error setting up Contrubution Unique Keys: ", err)
	}
}
