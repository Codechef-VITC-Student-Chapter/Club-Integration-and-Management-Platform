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
	"go.mongodb.org/mongo-driver/v2/mongo/options"
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
	err := ContColl.FindOne(ctx, bson.M{"id": id}).Decode(&cont)
	if err != nil {
		log.Printf("error getting contribution data: %v", err)
		return types.FullContribution{}, err
	}

	// Collect all lead user IDs (target + secTargets)
	leadUserIDs := []string{cont.Target}
	leadUserIDs = append(leadUserIDs, cont.SecTargets...)

	var wg sync.WaitGroup
	wg.Add(3 + len(leadUserIDs)) // club, dept, user + all lead users

	var club schemas.Club
	var dept schemas.Department
	var user schemas.User
	var clubErr, deptErr, userErr error

	// Fetch club, department, and submitted user
	go func(clubID string) {
		defer wg.Done()
		club, clubErr = GetClubByID(clubID)
	}(cont.ClubID)

	go func(deptID string) {
		defer wg.Done()
		dept, deptErr = GetDepartmentByID(deptID)
	}(cont.Department)

	go func(userID string) {
		defer wg.Done()
		user, userErr = GetUserByID(userID)
		if userErr != nil {
			log.Print("User error here 2", cont.UserID)
		}
	}(cont.UserID)

	// Fetch all lead users
	leadUsers := make([]schemas.User, len(leadUserIDs))
	leadUserErrors := make([]error, len(leadUserIDs))

	for i, leadUserID := range leadUserIDs {
		go func(index int, userID string) {
			defer wg.Done()
			leadUsers[index], leadUserErrors[index] = GetUserByID(userID)
		}(i, leadUserID)
	}

	wg.Wait()

	if clubErr != nil {
		return types.FullContribution{}, clubErr
	}
	if deptErr != nil {
		return types.FullContribution{}, deptErr
	}
	if userErr != nil {
		return types.FullContribution{}, userErr
	}

	// Check for lead user errors
	for _, leadErr := range leadUserErrors {
		if leadErr != nil {
			return types.FullContribution{}, leadErr
		}
	}

	// Build lead user names array
	leadUserNames := make([]string, len(leadUsers))
	for i, leadUser := range leadUsers {
		leadUserNames[i] = leadUser.FirstName + " " + leadUser.LastName
	}

	return types.FullContribution{
		Contribution:   cont,
		ClubName:       club.Name,
		DepartmentName: dept.Name,
		UserName:       user.FirstName + " " + user.LastName,
		LeadUserNames:  leadUserNames,
	}, nil
}

func GetContributionsWithTarget(id string) ([]types.FullContribution, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"$or": []bson.M{
			{"target": id},
			{"secTargets": bson.M{"$in": []string{id}}},
		},
	}

	// Add sorting by created_at in descending order (newest first)
	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := ContColl.Find(ctx, filter, opts)
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

			// Collect all lead user IDs (target + secTargets)
			leadUserIDs := []string{cont.Target}
			leadUserIDs = append(leadUserIDs, cont.SecTargets...)

			var wg1 sync.WaitGroup
			wg1.Add(3 + len(leadUserIDs)) // club, dept, user + all lead users

			var club schemas.Club
			var dept schemas.Department
			var user schemas.User
			var clubErr, deptErr, userErr error

			// Fetch club, department, and submitted user
			go func(clubID string) {
				defer wg1.Done()
				club, clubErr = GetClubByID(clubID)
			}(cont.ClubID)

			go func(deptID string) {
				defer wg1.Done()
				dept, deptErr = GetDepartmentByID(deptID)
			}(cont.Department)

			go func(userID string) {
				defer wg1.Done()
				user, userErr = GetUserByID(userID)
			}(cont.UserID)

			// Fetch all lead users
			leadUsers := make([]schemas.User, len(leadUserIDs))
			leadUserErrors := make([]error, len(leadUserIDs))

			for i, leadUserID := range leadUserIDs {
				go func(index int, userID string) {
					defer wg1.Done()
					leadUsers[index], leadUserErrors[index] = GetUserByID(userID)
				}(i, leadUserID)
			}

			wg1.Wait()

			if clubErr != nil {
				errChan <- clubErr
				return
			}

			if deptErr != nil {
				errChan <- deptErr
				return
			}

			if userErr != nil {
				errChan <- userErr
				return
			}

			// Check for lead user errors
			for _, leadErr := range leadUserErrors {
				if leadErr != nil {
					errChan <- leadErr
					return
				}
			}

			// Build lead user names array
			leadUserNames := make([]string, len(leadUsers))
			for i, leadUser := range leadUsers {
				leadUserNames[i] = leadUser.FirstName + " " + leadUser.LastName
			}

			reqChan <- types.FullContribution{
				Contribution:   cont,
				ClubName:       club.Name,
				DepartmentName: dept.Name,
				UserName:       user.FirstName + " " + user.LastName,
				LeadUserNames:  leadUserNames,
			}
		}(cont)
	}

	wg.Wait()
	close(reqChan)
	close(errChan)

	// Drain error channel safely after close; avoid reading zero-value nil
	var firstErr error
	for err := range errChan {
		if err != nil {
			firstErr = err
			break
		}
	}
	if firstErr != nil {
		log.Printf("Error fetching contributions with target: %v", firstErr)
		return []types.FullContribution{}, fmt.Errorf("error fetching contributions with targets: %w", firstErr)
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
	err = ContColl.FindOne(ctx, bson.M{"_id": res.InsertedID}).Decode(&newCont)
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
