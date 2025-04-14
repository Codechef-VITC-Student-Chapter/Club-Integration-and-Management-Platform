package controllers

import (
	"fmt"
	"log"
	"sync"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/utils"
	"github.com/Sasank-V/CIMP-Golang-Backend/database"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/Sasank-V/CIMP-Golang-Backend/lib"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var ContColl *mongo.Collection
var ContConnect sync.Once

func ConnectContributionCollection() {
	ContConnect.Do(func() {
		db := database.InitDB()
		schemas.CreateContributionCollection(db)
		ContColl = db.Collection(lib.ContributionCollName)
	})
}

// Get Functions

func GetContributionByID(id string) (types.FullContribution, error) {
	ctx, cancel := database.GetContext()
	defer cancel()
	var cont schemas.Contribution
	err := ContColl.FindOne(ctx, bson.D{{"id", id}}).Decode(&cont)
	if err != nil {
		log.Printf("error getting contribution data: %v", err)
		return types.FullContribution{}, err
	}

	var wg sync.WaitGroup
	wg.Add(2)

	var club schemas.Club
	var dept schemas.Department
	var clubErr, deptErr error

	go func() {
		club, clubErr = GetClubByID(cont.ClubID)
		defer wg.Done()
	}()

	go func() {
		dept, deptErr = GetDepartmentByID(cont.Department)
		defer wg.Done()
	}()

	wg.Wait()

	if clubErr != nil {
		return types.FullContribution{}, err
	}
	if deptErr != nil {
		return types.FullContribution{}, err
	}

	return types.FullContribution{
		Contribution:   cont,
		ClubName:       club.Name,
		DepartmentName: dept.Name,
	}, nil
}

func GetContributionsWithTarget(id string) ([]types.FullContribution, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.D{
		{"$or", bson.A{
			bson.D{{"target", id}},
			bson.D{{"secTargets", bson.M{"$in": bson.A{id}}}},
		}},
	}

	cursor, err := ContColl.Find(ctx, filter)
	if err != nil {
		log.Printf("error getting lead requests: %v", err)
		return []types.FullContribution{}, err
	}
	defer cursor.Close(ctx)

	var wg sync.WaitGroup
	reqChan := make(chan types.FullContribution, 10)
	errChan := make(chan error, 10)

	for cursor.Next(ctx) {
		var cont schemas.Contribution
		if err := cursor.Decode(&cont); err != nil {
			return []types.FullContribution{}, err
		}

		wg.Add(1)
		go func(cont schemas.Contribution) {
			defer wg.Done()
			var wg1 sync.WaitGroup
			wg1.Add(2)

			var club schemas.Club
			var dept schemas.Department
			var clubErr, deptErr error

			go func() {
				defer wg1.Done()
				club, clubErr = GetClubByID(cont.ClubID)
			}()

			go func() {
				defer wg1.Done()
				dept, deptErr = GetDepartmentByID(cont.Department)
			}()

			wg1.Wait()

			if clubErr != nil {
				errChan <- clubErr
				return
			}

			if deptErr != nil {
				errChan <- deptErr
				return
			}

			reqChan <- types.FullContribution{
				Contribution:   cont,
				ClubName:       club.Name,
				DepartmentName: dept.Name,
			}

		}(cont)
	}

	go func() {
		wg.Wait()
		close(reqChan)
		close(errChan)
	}()

	select {
	case err := <-errChan:
		log.Printf("Error fetching contributions with target: %v", err)
		return []types.FullContribution{}, fmt.Errorf("error fetching contributions with targets: %w", err)
	default:
	}

	var requests []types.FullContribution
	for req := range reqChan {
		requests = append(requests, req)
	}

	return requests, nil
}

//Add/Update Functions

func AddContribution(cont schemas.Contribution) (string, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	res, err := ContColl.InsertOne(ctx, cont)
	if err != nil {
		log.Printf("Error adding the Contribution: %v", err)
		return "", err
	}
	var newCont schemas.Contribution
	err = ContColl.FindOne(ctx, bson.D{{"_id", res.InsertedID}}).Decode(&newCont)
	if err != nil {
		log.Printf("Error fetching the newly added contribution: %v", err)
		return "", err
	}
	return newCont.ID, nil
}

func UpdateContributionDetails(cont types.ContributionUpdateInfo) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	updateFields := bson.M{}
	if cont.Title != nil {
		updateFields["title"] = *cont.Title
	}
	if cont.Points != nil {
		updateFields["points"] = *cont.Points
	}
	if cont.Description != nil {
		updateFields["description"] = *cont.Description
	}
	if cont.ProofFiles != nil {
		updateFields["proof_files"] = *cont.ProofFiles
	}
	if cont.Target != nil {
		updateFields["target"] = *cont.Target
	}
	if cont.SecTargets != nil {
		updateFields["secTargets"] = *cont.SecTargets
	}
	if cont.Department != nil {
		updateFields["department"] = *cont.Department
	}
	if cont.ClubID != nil {
		updateFields["club_id"] = *cont.ClubID
	}

	if len(updateFields) == 0 {
		log.Print("No Fields given to update")
		return fmt.Errorf("no fields given to update")
	}

	filter := bson.M{"id": cont.ContributionID}
	update := bson.M{"$set": updateFields}

	result, err := ContColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error updating contribution: %v", err)
		return fmt.Errorf("error updating contribution: %v", err)
	}
	if result.MatchedCount == 0 {
		log.Printf("No Contribution found with the given ID")
		return mongo.ErrNoDocuments
	}

	return nil
}

func UpdateContributionStatus(contID string, status string, reason string) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	if !utils.IsValidStatus(status) {
		log.Printf("Invalid Status given")
		return fmt.Errorf("invalid status given")
	}

	updatedFeilds := bson.M{
		"status": status,
		"reason": reason,
	}

	filter := bson.M{
		"id": contID,
	}
	update := bson.M{
		"$set": updatedFeilds,
	}

	res, err := ContColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error updating the status: %v", err)
		return err
	}
	if res.ModifiedCount == 0 {
		log.Printf("No Contribution found with the give ID")
		return mongo.ErrNoDocuments
	}
	return nil
}

//Delete Functions
