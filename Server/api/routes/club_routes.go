package routes

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/controllers"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/middlewares"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var ClubColl *mongo.Collection
var ClubConnect sync.Once

func SetupClubRoutes(r *gin.RouterGroup) {
	r.Use(middlewares.VerifyValidTokenPresence())
	r.GET("/info/:id", getClubInfo)
	r.GET("/info/all/members/:id", middlewares.VerifyLeadUser(), getAllClubMemebers)
	r.GET("/info/all/departments/:id", getAllClubDepartments)
}

func getClubInfo(c *gin.Context) {
	clubID := c.Param("id")
	club, err := controllers.GetClubByID(clubID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.ClubInfoResponse{
				Message: "No Club found with the given ID",
				Club:    schemas.Club{},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.ClubInfoResponse{
			Message: "Error fetching Club",
			Club:    schemas.Club{},
		})
		return
	}
	c.JSON(http.StatusOK, types.ClubInfoResponse{
		Message: "Club fetched Successfully",
		Club:    club,
	})
}

func getAllClubMemebers(c *gin.Context) {
	clubID := c.Param("id")
	fmt.Printf("%v", clubID)
	members, err := controllers.GetAllUserInClub(clubID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.AllClubMemebersResponse{
			Message: "Error fetching all club members",
			Members: []schemas.User{},
		})
		return
	}
	c.JSON(http.StatusOK, types.AllClubMemebersResponse{
		Message: "Club Members Fetched Succesfully",
		Members: members,
	})
}

func getAllClubDepartments(c *gin.Context) {
	clubID := c.Param("id")

	departments, err := controllers.GetAllDepartmentsInClub(clubID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.AllClubDepartmentsResponse{
			Message:     "Error fetching departments in the club",
			Departments: []schemas.Department{},
		})
		return
	}

	c.JSON(http.StatusOK, types.AllClubDepartmentsResponse{
		Message:     "All Departments in Club Fetched Successfully",
		Departments: departments,
	})
}
