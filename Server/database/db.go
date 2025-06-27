package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"slices"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var (
	DBClient   *mongo.Client
	clientOnce sync.Once
)

func InitDB() *mongo.Database {
	connectDB()
	DBname := os.Getenv("DATABASE_NAME")
	if DBname == "" {
		log.Fatal("No DATBASE_NAME found in env.")
	}
	return DBClient.Database(DBname)
}

func connectDB() *mongo.Client {
	clientOnce.Do(func() {
		uri := os.Getenv("CONNECTION_STRING")
		if uri == "" {
			log.Fatal("Set your 'CONNECTION_STRING' environment variable. ")
		}
		dbClient, err := mongo.Connect(options.Client().
			ApplyURI(uri))
		if err != nil {
			log.Fatal("[MONGO-DB] Failed to connect to MongoDB: ", err)
		}
		if err := dbClient.Ping(context.TODO(), nil); err != nil {
			log.Fatal("[MONGO-DB] MongoDB connection test failed: ", err)
		}
		fmt.Printf("[MONGO-DB] MongoDB Connected\n")
		DBClient = dbClient
	})
	return DBClient
}

func SetUniqueKeys(coll *mongo.Collection, uniqueFields []string) error {
	ctx, cancel := GetContext()
	defer cancel()

	for _, field := range uniqueFields {
		indexModel := mongo.IndexModel{
			Keys:    bson.D{{field, 1}},
			Options: options.Index().SetUnique(true),
		}
		_, err := coll.Indexes().CreateOne(ctx, indexModel)
		if err != nil {
			return err
		}
	}
	return nil
}

func GetContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), 5*time.Second)
}

func CollectionExists(db *mongo.Database, collName string) (bool, error) {
	ctx, cancel := GetContext()
	defer cancel()

	collections, err := db.ListCollectionNames(ctx, bson.M{})
	if err != nil {
		return false, err
	}
	if slices.Contains(collections, collName) {
		return true, nil
	}
	return false, nil
}
