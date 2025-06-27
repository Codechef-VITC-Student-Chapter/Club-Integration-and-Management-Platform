package routes

import (
	"fmt"
	"log"
	"net/http"
	"slices"
	"sync"
	"time"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/controllers"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/middlewares"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/utils"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupContributionRoutes(r *gin.RouterGroup) {
	r.Use(middlewares.VerifyValidTokenPresence())
	r.POST("/add", addContribution)
	r.PATCH("/update/details", updateContributionDetails)
	r.PATCH("/update/status", middlewares.VerifyLeadUser(), updateContributionStatus)
	r.PATCH("/add/id/user", addContributionToUser)
}

func addContribution(c *gin.Context) {
	var contInfo types.ContributionInfo
	if err := c.ShouldBindBodyWithJSON(&contInfo); err != nil {
		log.Printf("Error decoding the JSON Body: %v", err)
		c.JSON(http.StatusBadRequest, types.AddContributionResponse{
			Message:        "Error decoding the JSON Body",
			ContributionID: "",
		})
		return
	}

	if contInfo.Points < 0 {
		log.Printf("Points less than zero")
		c.JSON(http.StatusBadRequest, types.AddContributionResponse{
			Message:        "Points value less than zero",
			ContributionID: "",
		})
		return
	}

	new_cont := schemas.Contribution{
		ID:          utils.GetContributionID(contInfo.UserID),
		Title:       contInfo.Title,
		Points:      uint(contInfo.Points),
		UserID:      contInfo.UserID,
		Description: contInfo.Description,
		ProofFiles:  contInfo.ProofFiles,
		Target:      contInfo.Target,
		SecTargets:  contInfo.SecTargets,
		ClubID:      contInfo.ClubID,
		Department:  contInfo.Department,
		Status:      schemas.Pending,
		CreatedAt:   time.Now(),
	}

	newContID, err := controllers.AddContribution(new_cont)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.AddContributionResponse{
			Message:        "Error adding contribution",
			ContributionID: "",
		})
		return
	}

	err = controllers.AddContributionIDToUser(contInfo.UserID, newContID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.AddContributionResponse{
			Message:        "Error adding cont ID to User , Send the ID to other endpoint just to push",
			ContributionID: newContID,
		})
		return
	}
	c.JSON(http.StatusOK, types.AddContributionResponse{
		Message:        "Contribution Added Successfully",
		ContributionID: newContID,
	})
}

func updateContributionDetails(c *gin.Context) {
	var ContInfo types.ContributionUpdateInfo
	if err := c.ShouldBindBodyWithJSON(&ContInfo); err != nil {
		log.Printf("error parsing JSON body: %v", err)
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: "Error parsing JSON body",
		})
		return
	}

	cont, err := controllers.GetContributionByID(ContInfo.ContributionID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("No Contribution found with the given contribution id: %v", err)
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "No Contribution found with the given ID",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error fetching contribution details",
		})
		return
	}

	if cont.Contribution.UserID != ContInfo.UserID {
		c.JSON(http.StatusUnauthorized, types.MessageResponse{
			Message: "User with give user id is not the owner of this contribution",
		})
		return
	}

	if cont.Contribution.Status == schemas.Approved {
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: "User Contribution Already Approved",
		})
		return
	}

	if ContInfo.Points != nil && *ContInfo.Points < 0 {
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: "Points to be updated can't be negative",
		})
		return
	}

	err = controllers.UpdateContributionDetails(ContInfo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error updating the details",
		})
		return
	}
	c.JSON(http.StatusOK, types.MessageResponse{
		Message: "Contribution Details Updated Successfully",
	})

}

func updateContributionStatus(c *gin.Context) {
	var updateInfo types.ContributionStatusInfo
	if err := c.ShouldBindBodyWithJSON(&updateInfo); err != nil {
		log.Printf("error parsing JSON body: %v", err)
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: "Error parsing JSON body data",
		})
		return
	}

	var user schemas.User
	var cont types.FullContribution
	var userErr, contErr error
	var wg sync.WaitGroup
	wg.Add(2)

	go func(id string) {
		defer wg.Done()
		user, userErr = controllers.GetUserByID(id)
	}(updateInfo.LeadUserID)

	go func(id string) {
		defer wg.Done()
		cont, contErr = controllers.GetContributionByID(id)
	}(updateInfo.ContributionID)

	wg.Wait()

	if userErr != nil {
		if userErr == mongo.ErrNoDocuments {
			log.Printf("no user found with the given id: %v", userErr)
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "No Lead User found with the given ID",
			})
			return
		}
		log.Printf("error fetching lead user details: %v", userErr)
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error fetching lead user details",
		})
		return
	}

	if contErr != nil {
		if contErr == mongo.ErrNoDocuments {
			log.Printf("no contribution found with the given id: %v", contErr)
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "No Contribution found with the given ID",
			})
			return
		}
		log.Printf("error fetching contribution details: %v", contErr)
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error fetching contribution details",
		})
		return
	}

	if !user.IsLead {
		c.JSON(http.StatusUnauthorized, types.MessageResponse{
			Message: "Give Lead User is NOT a Lead",
		})
		return
	}

	if cont.Contribution.Target != updateInfo.LeadUserID && !slices.Contains(cont.Contribution.SecTargets, updateInfo.LeadUserID) {
		c.JSON(http.StatusUnauthorized, types.MessageResponse{
			Message: "You are not the Targeted Lead",
		})
		return
	}

	if cont.Contribution.Status == schemas.Status(updateInfo.Status) {
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: "Update Status is the same as the current status",
		})
		return
	}

	var prevStatus = cont.Contribution.Status
	err := controllers.UpdateContributionStatus(updateInfo.ContributionID, updateInfo.Status, updateInfo.Reason)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "No Contribution found to be updated",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error updating contribution status",
		})
		return
	}

	//Increase the total_points field for the user if pending/rejected -> approved
	//Decrease the total_points field for the user if approved -> rejected/pending
	//Do Nothing for rejected <-> pending
	var updatePoints int = 0
	if (prevStatus == schemas.Pending || prevStatus == schemas.Rejected) && updateInfo.Status == string(schemas.Approved) {
		updatePoints = int(cont.Contribution.Points)
	} else if prevStatus == schemas.Approved {
		updatePoints = -int(cont.Contribution.Points)
	}

	if updatePoints > 0 {
		err = controllers.UpdateUserTotalPoints(cont.Contribution.UserID, updatePoints)
		if err != nil {
			controllers.UpdateContributionStatus(updateInfo.ContributionID, string(prevStatus), updateInfo.Reason)
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, types.MessageResponse{
					Message: "No User found to update the total_points",
				})
				return
			}
			c.JSON(http.StatusInternalServerError, types.MessageResponse{
				Message: "Error updating user total_points , Try Again",
			})
			return
		}
	}

	c.JSON(http.StatusOK, types.MessageResponse{
		Message: "Contribution Status Updated Successfully",
	})
}

func addContributionToUser(c *gin.Context) {
	var info types.AddContributionIDUserInfo
	if err := c.ShouldBindBodyWithJSON(&info); err != nil {
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: "Error parsing JSON Body data",
		})
		return
	}

	user, err := controllers.GetUserByID(info.UserID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "No User found with the given ID",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error fetching the user details",
		})
		return
	}

	if slices.Contains(user.Contributions, info.ContributionID) {
		c.JSON(http.StatusAccepted, types.MessageResponse{
			Message: "Contribution ID Already Exist in the User Contributions",
		})
		return
	}

	err = controllers.AddContributionIDToUser(info.UserID, info.ContributionID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "No User found to add the contribution ID",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: fmt.Sprintf("Error adding contID to user: %v", err),
		})
		return
	}
	c.JSON(http.StatusOK, types.MessageResponse{
		Message: "Contribution ID Added to User",
	})
}
