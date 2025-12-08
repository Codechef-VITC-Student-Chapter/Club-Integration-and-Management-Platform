package routes

import (
	"log"
	"net/http"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/controllers"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/middlewares"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/utils"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Route: /api/task
func SetupTaskRoutes(r *gin.RouterGroup) {
	r.Use(middlewares.VerifyValidTokenPresence())

	r.GET("/club/:club_id", getTasksByClubID)
	r.GET("/dept/:dept_id", getTasksByDepartmentID)

	r.POST("/add", middlewares.VerifyLeadUser(), addTask)
	r.PATCH("/update/:id", middlewares.VerifyLeadUser(), updateTaskDetails)
	r.DELETE("/delete/:id", middlewares.VerifyLeadUser(), deleteTask)
}

func getTasksByClubID(c *gin.Context) {
	clubID := c.Param("club_id")
	tasks, err := controllers.GetAllTasksByClubID(clubID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.TasksResponse{
			Message: "Error fetching tasks",
			Tasks:   []types.FullTask{},
		})
		return
	}

	c.JSON(http.StatusOK, types.TasksResponse{
		Message: "Tasks fetched successfully",
		Tasks:   tasks,
	})
}

func getTasksByDepartmentID(c *gin.Context) {
	deptID := c.Param("dept_id")
	tasks, err := controllers.GetAllTasksByDepartmentID(deptID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.TasksResponse{
			Message: "Error fetching tasks",
			Tasks:   []types.FullTask{},
		})
		return
	}

	c.JSON(http.StatusOK, types.TasksResponse{
		Message: "Tasks fetched successfully",
		Tasks:   tasks,
	})
}

func addTask(c *gin.Context) {
	var taskInfo types.TaskInfo
	if err := c.ShouldBindBodyWithJSON(&taskInfo); err != nil {
		log.Printf("Error decoding JSON body: %v", err)
		c.JSON(http.StatusBadRequest, types.AddTaskResponse{
			Message: "Error decoding JSON body",
			TaskID:  "",
		})
		return
	}

	newTask := schemas.Task{
		ID:           utils.GetTaskID(taskInfo.CreatedBy),
		Title:        taskInfo.Title,
		Points:       taskInfo.Points,
		ClubID:       taskInfo.ClubID,
		DepartmentID: taskInfo.DepartmentID,
		CreatedBy:    taskInfo.CreatedBy,
		IsActive:     true,
	}

	taskID, err := controllers.AddTask(newTask)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.AddTaskResponse{
			Message: "Error adding task",
			TaskID:  "",
		})
		return
	}

	c.JSON(http.StatusOK, types.AddTaskResponse{
		Message: "Task added successfully",
		TaskID:  taskID,
	})
}

func updateTaskDetails(c *gin.Context) {
	var update types.TaskUpdateInfo
	if err := c.ShouldBindBodyWithJSON(&update); err != nil {
		log.Printf("Error parsing JSON body: %v", err)
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: "Error parsing JSON body",
		})
		return
	}

	taskID := c.Param("id")
	if taskID == "" {
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: "Task ID is required",
		})
		return
	}

	err := controllers.UpdateTaskDetails(taskID, update)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "No Task found with the given ID",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error updating task details",
		})
		return
	}

	c.JSON(http.StatusOK, types.MessageResponse{
		Message: "Task details updated successfully",
	})
}

func deleteTask(c *gin.Context) {
	taskID := c.Param("id")
	err := controllers.DeleteTask(taskID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error deleting task",
		})
		return
	}

	c.JSON(http.StatusOK, types.MessageResponse{
		Message: "Task deleted successfully",
	})
}
