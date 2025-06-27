package routes

import (
	"fmt"
	"net/http"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/controllers"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/middlewares"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Route : /api/user
func SetupUserRoutes(r *gin.RouterGroup) {
	r.Use(middlewares.VerifyValidTokenPresence())
	r.GET("/info/:id", getUserInfo)
	r.GET("/contributions/:id", getUserContributions)
	r.GET("/lead/requests/:id", middlewares.VerifyLeadUser(), getLeadUserRequests)
	r.POST("/lead/upload/handles", middlewares.VerifyLeadUser(), uploadClubMemebersHandles)
	// r.POST("/lead/sync/contests/", middlewares.VerifyLeadUser(), syncContestPoints)
}

func getUserInfo(c *gin.Context) {
	userID := c.Param("id")
	user, err := controllers.GetUserByID(userID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.GetUserResponse{
				Message: "No User found with the given ID",
				User:    schemas.User{},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.GetUserResponse{
			Message: "Error fetching user data, Try Again Later",
			User:    schemas.User{},
		})
		return
	}
	c.JSON(http.StatusOK, types.GetUserResponse{
		Message: "User Data retrived successfully",
		User:    user,
	})
}

func getUserContributions(c *gin.Context) {
	userID := c.Param("id")

	contributions, err := controllers.GetAllUserContributions(userID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.GetUserContributionsResponse{
				Message:       "No document found with either UserID or Contribution ID",
				Contributions: []types.FullContribution{},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.GetUserContributionsResponse{
			Message:       "Error fetching user contribution",
			Contributions: []types.FullContribution{},
		})
		return
	}

	c.JSON(http.StatusOK, types.GetUserContributionsResponse{
		Message:       "User request fetched successfully",
		Contributions: contributions,
	})
}

func getLeadUserRequests(c *gin.Context) {
	userID := c.Param("id")

	user, err := controllers.GetUserByID(userID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.GetLeadUserRequestsResponse{
				Message:  "User Not Found with the given ID",
				Requests: []types.FullContribution{},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.GetLeadUserRequestsResponse{
			Message:  "Error while fetching user data",
			Requests: []types.FullContribution{},
		})
		return
	}

	if !user.IsLead {
		c.JSON(http.StatusBadRequest, types.GetLeadUserRequestsResponse{
			Message:  "User is NOT a Lead",
			Requests: []types.FullContribution{},
		})
		return
	}

	requests, err := controllers.GetContributionsWithTarget(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.GetLeadUserRequestsResponse{
			Message:  "Error getting requests , Try again later",
			Requests: []types.FullContribution{},
		})
		return
	}

	c.JSON(http.StatusOK, types.GetLeadUserRequestsResponse{
		Message:  "Lead user requests fetched successfully",
		Requests: requests,
	})

}

func uploadClubMemebersHandles(c *gin.Context) {
	var HandlesInfo types.UploadMembersHandlesInfo
	if err := c.ShouldBind(&HandlesInfo); err != nil {
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: fmt.Sprintf("Error parsing the JSON body: %v", err),
		})
		return
	}
	file, err := c.FormFile("csv_file")
	if err != nil {
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: "Failed to get the CSV File",
		})
		return
	}
	err = controllers.UploadMemberHandles(file, HandlesInfo.LeadUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error uploading user handles",
		})
		return
	}
	c.JSON(http.StatusOK, types.MessageResponse{
		Message: "Member handles Uploaded Successfully",
	})
}

// func syncContestPoints(c *gin.Context) {
// 	//Get All the Users from the Club
// 	// For every user Check the Last Contest Contribution Update If found else take the startDate given in the body
// 	// Take the Range from the Last Contest Contribution Created Date to Date.Now()
// 	// Fetch all the contests and Sum up the Points
// 	//Create a New Contribution with the Template
// 	//Add and Approve it
// }
