package controllers

import (
	"fmt"
	"log"
	"sync"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/Sasank-V/CIMP-Golang-Backend/database"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/Sasank-V/CIMP-Golang-Backend/lib"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var TaskColl *mongo.Collection
var TaskConnect sync.Once

func ConnectTaskCollection() {
	TaskConnect.Do(func() {
		db := database.InitDB()
		schemas.CreateTaskCollection(db)
		TaskColl = db.Collection(lib.TaskCollName)
	})
}

func GetTaskByID(id string) (types.FullTask, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	var task schemas.Task
	err := TaskColl.FindOne(ctx, bson.M{"id": id}).Decode(&task)
	if err != nil {
		log.Printf("Error getting task by ID: %v", err)
		return types.FullTask{}, err
	}

	var wg sync.WaitGroup
	wg.Add(3)

	var club schemas.Club
	var dept schemas.Department
	var user schemas.User
	var clubErr, deptErr, userErr error

	go func(clubID string) {
		defer wg.Done()
		club, clubErr = GetClubByID(clubID)
	}(task.ClubID)
	go func(deptID string) {
		defer wg.Done()
		dept, deptErr = GetDepartmentByID(deptID)
	}(task.DepartmentID)
	go func(userID string) {
		defer wg.Done()
		user, userErr = GetUserByID(userID)
	}(task.CreatedBy)

	wg.Wait()

	if clubErr != nil {
		return types.FullTask{}, clubErr
	}
	if deptErr != nil {
		return types.FullTask{}, deptErr
	}
	if userErr != nil {
		return types.FullTask{}, userErr
	}

	return types.FullTask{
		Task:           task,
		ClubName:       club.Name,
		DepartmentName: dept.Name,
		CreatedByUser:  user.FirstName + " " + user.LastName,
	}, nil
}

func GetAllTasksByClubID(clubID string) ([]types.FullTask, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	cursor, err := TaskColl.Find(ctx, bson.M{"club_id": clubID})
	if err != nil {
		log.Printf("Error getting tasks by club_id: %v", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var fullTasks []types.FullTask
	for cursor.Next(ctx) {
		var task schemas.Task
		if err := cursor.Decode(&task); err != nil {
			log.Printf("Error decoding task: %v", err)
			return nil, err
		}

		// Fetch club, department, and creator concurrently
		var wg sync.WaitGroup
		wg.Add(3)

		var club schemas.Club
		var dept schemas.Department
		var user schemas.User
		var clubErr, deptErr, userErr error

		go func(clubID string) {
			defer wg.Done()
			club, clubErr = GetClubByID(clubID)
		}(task.ClubID)
		go func(deptID string) {
			defer wg.Done()
			dept, deptErr = GetDepartmentByID(deptID)
		}(task.DepartmentID)
		go func(userID string) {
			defer wg.Done()
			user, userErr = GetUserByID(userID)
		}(task.CreatedBy)

		wg.Wait()

		if clubErr != nil {
			return nil, clubErr
		}
		if deptErr != nil {
			return nil, deptErr
		}
		if userErr != nil {
			return nil, userErr
		}

		fullTasks = append(fullTasks, types.FullTask{
			Task:           task,
			ClubName:       club.Name,
			DepartmentName: dept.Name,
			CreatedByUser:  user.FirstName + " " + user.LastName,
		})
	}

	return fullTasks, nil
}

func GetAllTasksByDepartmentID(deptID string) ([]types.FullTask, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	cursor, err := TaskColl.Find(ctx, bson.M{"department_id": deptID})
	if err != nil {
		log.Printf("Error getting tasks by department_id: %v", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var fullTasks []types.FullTask
	for cursor.Next(ctx) {
		var task schemas.Task
		if err := cursor.Decode(&task); err != nil {
			log.Printf("Error decoding task: %v", err)
			return nil, err
		}

		// Fetch club, department, and creator concurrently
		var wg sync.WaitGroup
		wg.Add(3)

		var club schemas.Club
		var dept schemas.Department
		var user schemas.User
		var clubErr, deptErr, userErr error

		go func(clubID string) {
			defer wg.Done()
			club, clubErr = GetClubByID(clubID)
		}(task.ClubID)
		go func(deptID string) {
			defer wg.Done()
			dept, deptErr = GetDepartmentByID(deptID)
		}(task.DepartmentID)
		go func(userID string) {
			defer wg.Done()
			user, userErr = GetUserByID(userID)
		}(task.CreatedBy)

		wg.Wait()

		if clubErr != nil {
			return nil, clubErr
		}
		if deptErr != nil {
			return nil, deptErr
		}
		if userErr != nil {
			return nil, userErr
		}

		fullTasks = append(fullTasks, types.FullTask{
			Task:           task,
			ClubName:       club.Name,
			DepartmentName: dept.Name,
			CreatedByUser:  user.FirstName + " " + user.LastName,
		})
	}

	return fullTasks, nil
}

func AddTask(task schemas.Task) (string, error) {
	ctx, cancel := database.GetContext()
	defer cancel()

	res, err := TaskColl.InsertOne(ctx, task)
	if err != nil {
		log.Printf("Error adding the Task: %v", err)
		return "", err
	}

	var newTask schemas.Task
	err = TaskColl.FindOne(ctx, bson.M{"_id": res.InsertedID}).Decode(&newTask)
	if err != nil {
		log.Printf("Error fetching the newly added task: %v", err)
		return "", err
	}

	return newTask.ID, nil
}

func UpdateTaskDetails(taskID string, update types.TaskUpdateInfo) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	updateFields := bson.M{}
	if update.Title != nil {
		updateFields["title"] = *update.Title
	}
	if update.Points != nil {
		updateFields["points"] = *update.Points
	}
	if update.ClubID != nil {
		updateFields["club_id"] = *update.ClubID
	}
	if update.DepartmentID != nil {
		updateFields["department_id"] = *update.DepartmentID
	}
	if update.IsActive != nil {
		updateFields["is_active"] = *update.IsActive
	}

	if len(updateFields) == 0 {
		log.Print("No fields given to update")
		return fmt.Errorf("no fields given to update")
	}

	filter := bson.M{"id": taskID}
	updateDoc := bson.M{"$set": updateFields}

	result, err := TaskColl.UpdateOne(ctx, filter, updateDoc)
	if err != nil {
		log.Printf("Error updating task: %v", err)
		return fmt.Errorf("error updating task: %v", err)
	}

	if result.MatchedCount == 0 {
		log.Printf("No Task found with the given ID")
		return mongo.ErrNoDocuments
	}

	return nil
}

func DeleteTask(taskID string) error {
	ctx, cancel := database.GetContext()
	defer cancel()

	res, err := TaskColl.DeleteOne(ctx, bson.M{"id": taskID})
	if err != nil {
		log.Printf("Error deleting task: %v", err)
		return err
	}

	if res.DeletedCount == 0 {
		log.Printf("No Task found with the given ID")
		return mongo.ErrNoDocuments
	}

	return nil
}
