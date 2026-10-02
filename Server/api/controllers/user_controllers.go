package controllers

import (
	"encoding/csv"
	"fmt"
	"log"
	"mime/multipart"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/utils"
	"github.com/Sasank-V/CIMP-Golang-Backend/database"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/Sasank-V/CIMP-Golang-Backend/lib"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var UserColl *mongo.Collection
var userConnect sync.Once

func ConnectUserCollection() {
	userConnect.Do(func() {
		db := database.InitDB()
		schemas.CreateUserCollection(db)
		UserColl = db.Collection(lib.UserCollName)
	})
}

func UserExist(id string) bool {
	ctx, cancel := database.GetContext()
	defer cancel()

	count, err := UserColl.CountDocuments(ctx, bson.M{"id": id})
	if err != nil {
		log.Printf("error checking for existing user: %v", err)
		return false
	}
	return count > 0
}

// Get Functions
func GetUserByID(id string) (schemas.User, error) {
	ctx, cancel := database.GetContext()
	defer cancel()
	var user schemas.User
	err := UserColl.FindOne(ctx, bson.D{{"id", id}}).Decode(&user)
	if err != nil {
		log.Printf("error fetching user data: %v", err)
		return schemas.User{}, err
	}
	return user, nil
}

// GetUsersByIDs fetches multiple users in a single batch query
func GetUsersByIDs(ids []string) (map[string]schemas.User, error) {
	if len(ids) == 0 {
		return make(map[string]schemas.User), nil
	}

	ctx, cancel := database.GetLongContext()
	defer cancel()

	filter := bson.M{"id": bson.M{"$in": ids}}
	cursor, err := UserColl.Find(ctx, filter)
	if err != nil {
		log.Printf("error fetching users in batch: %v", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []schemas.User
	if err = cursor.All(ctx, &users); err != nil {
		log.Printf("cursor error in GetUsersByIDs: %v", err)
		return nil, err
	}

	// Create a map for quick lookup
	userMap := make(map[string]schemas.User, len(users))
	for _, user := range users {
		userMap[user.ID] = user
	}

	return userMap, nil
}

func GetAllUserInClub(id string) ([]schemas.User, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"clubs": bson.M{"$in": []string{id}},
	}

	cursor, err := UserColl.Find(ctx, filter)
	if err != nil {
		log.Printf("error fetching club users: %v", err)
		return []schemas.User{}, err
	}

	var members []schemas.User
	if err = cursor.All(ctx, &members); err != nil {
		log.Printf("cursor error: %v", err)
		return []schemas.User{}, err
	}
	return members, nil
}

func GetAllUserContributions(id string) ([]types.FullContribution, error) {
	user, err := GetUserByID(id)
	if err != nil {
		log.Printf("error fetching user Data: %v", err)
		return []types.FullContribution{}, err
	}

	if len(user.Contributions) == 0 {
		return []types.FullContribution{}, nil
	}

	// Use batch fetching for better performance
	contributions, err := GetContributionsByIDs(user.Contributions)
	if err != nil {
		log.Printf("Error fetching contributions: %v", err)
		return []types.FullContribution{}, err
	}

	// Sort contributions by created_at in descending order (newest first)
	sort.Slice(contributions, func(i, j int) bool {
		return contributions[i].Contribution.CreatedAt.After(contributions[j].Contribution.CreatedAt)
	})

	return contributions, nil
}

//Add/Update Functions

func AddUser(user schemas.User) error {
	ctx, cancel := database.GetContext()
	defer cancel()
	if UserExist(user.ID) {
		return fmt.Errorf("user already exist")
	}
	_, err := UserColl.InsertOne(ctx, user)
	if err != nil {
		log.Printf("error adding user : %v", err)
		return err
	}
	return nil
}

func AddContributionIDToUser(user_id string, cont_id string) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"id": user_id,
	}
	update := bson.M{
		"$push": bson.M{"contributions": cont_id},
	}

	res, err := UserColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error adding contID to user Contributions: %v", err)
		return err
	}

	if res.ModifiedCount == 0 {
		log.Printf("No User found with the given ID")
		return mongo.ErrNoDocuments
	}
	return nil
}

func SetUserHandles(user_id string, handles []string) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"id": user_id,
	}

	update := bson.M{
		"$set": bson.M{
			"handles": handles,
		},
	}

	res, err := UserColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error adding handle to user: %v", err)
		return err
	}
	if res.MatchedCount == 0 {
		log.Printf("No user found with the given user ID")
		return mongo.ErrNoDocuments
	}
	if res.ModifiedCount == 0 {
		log.Printf("No Change in the User Handle")
		return nil
	}
	return nil
}

func UpdateUserTotalPoints(userID string, points int) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	user, err := GetUserByID(userID)
	if err != nil {
		log.Printf("error fetching user: %v", err)
		return err
	}

	if points < 0 && user.TotalPoints < points {
		log.Printf("user points cannot be negative")
		return fmt.Errorf("user points cannot be negative")
	}
	filter := bson.M{
		"id": userID,
	}
	update := bson.M{
		"$inc": bson.M{"total_points": points},
	}
	res, err := UserColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error updating user total_points: %v", err)
		return err
	}

	if res.ModifiedCount == 0 {
		log.Printf("No user found with the given ID")
		return mongo.ErrNoDocuments
	}

	return nil
}

func UploadMemberHandles(file *multipart.FileHeader, lead_user_id string) error {
	src, err := file.Open()
	if err != nil {
		log.Printf("Error opening file: %v", err)
		return err
	}
	defer src.Close()

	reader := csv.NewReader(src)
	records, err := reader.ReadAll()
	if err != nil {
		log.Printf("Error reading records from the file: %v", err)
		return err
	}

	var errChan = make(chan error, len(records))
	var wg sync.WaitGroup

	for i, row := range records {
		if i == 0 {
			continue
		}
		user := types.CSVUserData{
			// Dept:       strings.TrimSpace(row[0]),
			RollNo: strings.TrimSpace(row[1]),
			// Name:       strings.TrimSpace(row[2]),
			CodeChef:   strings.TrimSpace(row[3]),
			CodeForces: strings.TrimSpace(row[4]),
			LeetCode:   strings.TrimSpace(row[5]),
		}
		var handles []string
		if user.CodeChef != "" {
			handles = append(handles, user.CodeChef)
		}
		if user.CodeForces != "" {
			handles = append(handles, user.CodeForces)
		}
		if user.LeetCode != "" {
			handles = append(handles, user.LeetCode)
		}
		wg.Add(1)
		userID := utils.GetUserIDFromRegNumber(user.RollNo)
		go func(id string, handles []string) {
			defer wg.Done()
			if UserExist(id) {
				log.Printf("User: %v", id)
				err := SetUserHandles(id, handles)
				if err != nil {
					errChan <- err
				}
			}
		}(userID, handles)
	}

	wg.Wait()
	close(errChan)

	var finalErr error
	for err := range errChan {
		if err != nil {
			finalErr = err
			break
		}
	}
	return finalErr
}

//OTP and Pass Reset Functions

func SetResetOTPToUser(user_id string, otp string) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"id": user_id,
	}
	update := bson.M{
		"$set": bson.M{
			"otp": otp,
		},
	}
	res, err := UserColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error setting up user OTP: %v", err)
		return err
	}
	if res.ModifiedCount == 0 {
		log.Printf("No User found to set OTP")
		return mongo.ErrNoDocuments
	}
	return nil
}

func SetLoginOTPToUser(user_id string, otp string, expiry time.Time) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"id": user_id,
	}
	update := bson.M{
		"$set": bson.M{
			"login_otp":        otp,
			"login_otp_expiry": expiry,
		},
	}
	res, err := UserColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error setting up user Login OTP: %v", err)
		return err
	}
	if res.ModifiedCount == 0 {
		log.Printf("No User found to set Login OTP")
		return mongo.ErrNoDocuments
	}
	return nil
}

func ClearLoginOTP(user_id string) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"id": user_id,
	}
	update := bson.M{
		"$unset": bson.M{
			"login_otp":        "",
			"login_otp_expiry": "",
		},
	}
	res, err := UserColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error clearing Login OTP: %v", err)
		return err
	}
	if res.MatchedCount == 0 {
		log.Printf("No User found to clear Login OTP")
		return mongo.ErrNoDocuments
	}
	return nil
}

func IncreaseUserOTPRetries(user_id string) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"id": user_id,
	}
	update := bson.M{
		"$inc": bson.M{
			"otp_retries": 1,
		},
	}
	res, err := UserColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error increasing the opt retry count: %v", err)
		return err
	}
	if res.ModifiedCount == 0 {
		log.Printf("No User found with the given ID")
		return mongo.ErrNoDocuments
	}
	return nil
}

func LockUserAccountPasswordReset(user_id string, time time.Time) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"id": user_id,
	}
	update := bson.M{
		"$set": bson.M{
			"locked_till": time,
		},
	}

	res, err := UserColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error locking the account: %v", err)
		return err
	}
	if res.ModifiedCount == 0 {
		log.Printf("No User found to lock")
		return mongo.ErrNoDocuments
	}
	return nil
}

func ResetOTPandLockValuesForUser(user_id string) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"id": user_id,
	}
	update := bson.M{
		"$unset": bson.M{
			"otp":         "",
			"locked_till": nil,
			"otp_retries": 0,
		},
	}
	res, err := UserColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error reseting the Values: %v", err)
		return err
	}
	if res.ModifiedCount == 0 {
		log.Printf("No user found with the ID to reset")
		return mongo.ErrNoDocuments
	}
	return nil
}

func SetNewPasswordToUser(user_id string, pass string) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"id": user_id,
	}
	update := bson.M{
		"$set": bson.M{
			"password": pass,
		},
	}
	res, err := UserColl.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error setting up new password to user")
		return err
	}
	if !res.Acknowledged {
		log.Printf("No User was set the new Password: %v", res)
		return mongo.ErrNoDocuments
	}
	return nil

}

// Delete Functions

func DeleteUser(user_id string) error {
	ctx, cancel := database.GetContext()
	defer cancel()
	res := UserColl.FindOneAndDelete(ctx, bson.D{{"id", user_id}})
	if err := res.Err(); err != nil {
		log.Printf("error deleting user: %v", err)
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("no User found with the given ID")
		}
		return fmt.Errorf("error deleting user: %w", err)
	}
	return nil
}
