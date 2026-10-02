package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf(".env was not loaded: %v", err)
	}

	connectionString := os.Getenv("CONNECTION_STRING")
	databaseName := os.Getenv("DATABASE_NAME")
	if connectionString == "" || databaseName == "" {
		log.Fatal("CONNECTION_STRING and DATABASE_NAME must be set in Server/.env")
	}

	fmt.Printf("This will permanently delete the entire MongoDB database %q.\n", databaseName)
	fmt.Printf("Type the database name to continue: ")

	input, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil {
		log.Fatal("Could not read confirmation: ", err)
	}
	if strings.TrimSpace(input) != databaseName {
		log.Fatal("Confirmation did not match; nothing was deleted")
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

	if err := client.Database(databaseName).Drop(ctx); err != nil {
		log.Fatal("Could not drop database: ", err)
	}

	fmt.Printf("Database %q was deleted successfully.\n", databaseName)
}