package controllers

import (
	"log"
	"sync"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/Sasank-V/CIMP-Golang-Backend/database"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/Sasank-V/CIMP-Golang-Backend/lib"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var DeptColl *mongo.Collection
var DeptConnect sync.Once

func ConnectDepartmentCollection() {
	DeptConnect.Do(func() {
		db := database.InitDB()
		schemas.CreateDepartmentCollection(db)
		DeptColl = db.Collection(lib.DepartmentCollName)
	})
}

func GetDepartmentByID(id string) (schemas.Department, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	var dept schemas.Department
	err := DeptColl.FindOne(ctx, bson.D{{"id", id}}).Decode(&dept)
	if err != nil {
		log.Printf("error getting deparment data: ", err)
		return schemas.Department{}, err
	}
	return dept, nil
}

func GetAllDepartmentsInClub(id string) ([]schemas.Department, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.M{
		"club_id": id,
	}

	cursor, err := DeptColl.Find(ctx, filter)
	if err != nil {
		log.Printf("Error getting departments in Club: %v", err)
		return []schemas.Department{}, err
	}

	var departments []schemas.Department
	if err = cursor.All(ctx, &departments); err != nil {
		log.Printf("cursor error: %v", err)
		return []schemas.Department{}, err
	}
	return departments, nil
}

func GetDepartmentLeadsByID(id string) ([]types.LeadsInfo, error) {
	dept, err := GetDepartmentByID(id)
	if err != nil {
		log.Printf("error fetching dept Data: %v", err)
		return []types.LeadsInfo{}, err
	}

	// If no leads, return empty array
	if len(dept.Leads) == 0 {
		return []types.LeadsInfo{}, nil
	}
	var leadChan = make(chan types.LeadsInfo, len(dept.Leads))
	var errChan = make(chan error, len(dept.Leads))
	var wg sync.WaitGroup

	for _, leadUserID := range dept.Leads {
		wg.Add(1)
		go func(id string) {
			defer wg.Done()
			user, err := GetUserByID(id)
			if err != nil {
				errChan <- err
				return
			}
			leadChan <- types.LeadsInfo{
				Name:   user.FirstName + " " + user.LastName,
				UserID: user.ID,
			}
		}(leadUserID)
	}

	wg.Wait()
	close(leadChan)
	close(errChan)

	var leadsData []types.LeadsInfo
	for lead := range leadChan {
		leadsData = append(leadsData, lead)
	}

	// Check for errors after collecting successful results
	if len(errChan) > 0 {
		err := <-errChan
		log.Printf("error fetching lead user data: %v", err)
		if len(leadsData) > 0 {
			return leadsData, nil
		}
		return []types.LeadsInfo{}, err
	}
	return leadsData, nil
}

func GetDepartmentByLeadsID(leadID string) (schemas.Department, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	filter := bson.D{
		{"leads", bson.M{"$in": bson.A{leadID}}},
	}

	var dept schemas.Department
	err := DeptColl.FindOne(ctx, filter).Decode(&dept)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("No department found for lead ID: %s", leadID)
			return schemas.Department{}, err
		}
		log.Printf("Error fetching department by lead ID: %v", err)
		return schemas.Department{}, err
	}

	return dept, nil
}
