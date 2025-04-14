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

type User struct {
	ID            string    `bson:"id" json:"id"`
	RegNumber     string    `bson:"reg_number" json:"reg_number"`
	FirstName     string    `bson:"first_name" json:"first_name"`
	LastName      string    `bson:"last_name" json:"last_name"`
	Email         string    `bson:"email" json:"email"`
	OTP           string    `bson:"otp,omitempty" json:"otp,omitempty"`
	OTPRetries    int       `bson:"otp_retries,omitempty" json:"otp_retries,omitempty"`
	LockedTill    time.Time `bson:"locked_till" json:"locked_till"`
	Password      string    `bson:"password" json:"password"`
	IsLead        bool      `bson:"is_lead" json:"is_lead"`
	Departments   []string  `bson:"departments,omitempty" json:"departments,omitempty"`
	Clubs         []string  `bson:"clubs,omitempty" json:"clubs,omitempty"`
	Contributions []string  `bson:"contributions,omitempty" json:"contributions,omitempty"`
	Handles       []string  `bson:"handles,omitempty" json:"handles,omitempty"`
	TotalPoints   int       `bson:"total_points" json:"total_points"`
	LastUpdated   time.Time `bson:"last_updated" json:"last_updated"`
}

func CreateUserCollection(db *mongo.Database) {
	ctx, cancel := database.GetContext()
	defer cancel()

	exist, err := database.CollectionExists(db, lib.UserCollName)
	if err != nil {
		log.Fatal("Error checking the existing collection: ", err)
		return
	}
	if exist {
		log.Printf("User Collection Already Exist , Skipping Creation...\n")
		return
	}

	jsonSchema := bson.M{
		"bsonType": "object",
		"required": []string{"id", "reg_number", "first_name", "last_name", "email", "password", "is_lead"},
		"properties": bson.M{
			"id": bson.M{
				"bsonType": "string",
			},
			"reg_number": bson.M{
				"bsonType": "string",
			},
			"first_name": bson.M{
				"bsonType": "string",
			},
			"last_name": bson.M{
				"bsonType": "string",
			},
			"email": bson.M{
				"bsonType": "string",
			},
			"otp": bson.M{
				"bsonType": "string",
			},
			"otp_retries": bson.M{
				"bsonType": "string",
			},
			"locked_till": bson.M{
				"bsonType": "date",
			},
			"password": bson.M{
				"bsonType": "string",
			},
			"is_lead": bson.M{
				"bsonType": "bool",
			},
			"departments": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
			"clubs": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
			"contributions": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
			"handles": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
			"total_points": bson.M{
				"bsonType": "int",
			},
			"last_updated": bson.M{
				"bsonType": "date",
			},
		},
	}

	validator := bson.M{
		"$jsonSchema": jsonSchema,
	}

	opts := options.CreateCollection().SetValidator(validator)
	err = db.CreateCollection(ctx, lib.UserCollName, opts)
	if err != nil {
		log.Fatal("Failed to Create User Collection: ", err)
		return
	}

	if err := database.SetUniqueKeys(db.Collection(lib.UserCollName), []string{"id"}); err != nil {
		log.Fatal("Error setting up User Unique Keys: ", err)
	}
}
