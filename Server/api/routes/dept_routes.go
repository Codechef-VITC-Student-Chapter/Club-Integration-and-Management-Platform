package routes

import (
	"net/http"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/controllers"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/middlewares"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupDepartmentRoutes(r *gin.RouterGroup) {
	r.Use(middlewares.VerifyValidTokenPresence())
	r.GET("/info/:id", getDepartmentInfo)
	r.GET("/leads/:id", getDepartmentLeads)
}

func getDepartmentInfo(c *gin.Context) {
	deptID := c.Param("id")

	dept, err := controllers.GetDepartmentByID(deptID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.DepartmetInfoResponse{
				Message:    "No Department found with the given ID",
				Department: schemas.Department{},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.DepartmetInfoResponse{
			Message:    "Error fetching department Data",
			Department: schemas.Department{},
		})
		return
	}

	c.JSON(http.StatusOK, types.DepartmetInfoResponse{
		Message:    "Department Info Fetched Successfully",
		Department: dept,
	})
}

func getDepartmentLeads(c *gin.Context) {
	deptID := c.Param("id")
	leads, err := controllers.GetDepartmentLeadsByID(deptID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.DepartmentLeadsResponse{
				Message: "No Department found with the given ID",
				Leads:   []types.LeadsInfo{},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.DepartmentLeadsResponse{
			Message: "Error fetching department data",
			Leads:   []types.LeadsInfo{},
		})
		return
	}

	c.JSON(http.StatusOK, types.DepartmentLeadsResponse{
		Message: "Department Leads Data fetched successfully",
		Leads:   leads,
	})
}
