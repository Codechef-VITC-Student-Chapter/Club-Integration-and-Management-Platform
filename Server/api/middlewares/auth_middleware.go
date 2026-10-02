package middlewares

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/controllers"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func VerifyValidTokenPresence() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, types.MessageResponse{
				Message: "No token found in the Authorization Header",
			})
			c.Abort()
			return
		}

		fields := strings.Fields(token)
		if len(fields) != 2 || fields[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, types.MessageResponse{
				Message: "Invalid token format. Expected 'Bearer <token>'",
			})
			c.Abort()
			return
		}

		claims, err := controllers.VerifyToken(fields[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, types.MessageResponse{
				Message: fmt.Sprintf("Error verifying token: %v", err),
			})
			c.Abort()
			return
		}
		c.Set("Claims", claims)
		c.Next()
	}
}

func VerifyLeadUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, exists := c.Get("Claims")
		if !exists {
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "Token Not Verified and Claims not set",
			})
			c.Abort()
			return
		}

		userClaims, ok := claims.(types.CustomClaims)
		if !ok {
			c.JSON(http.StatusInternalServerError, types.MessageResponse{
				Message: "Invalid JWT Claims structure",
			})
			c.Abort()
			return
		}
		if !userClaims.IsLead {
			c.JSON(http.StatusUnauthorized, types.MessageResponse{
				Message: fmt.Sprintf("You are not a Lead %v", userClaims.Name),
			})
			c.Abort()
			return
		}
		c.Next()
	}
}

func VerifyLeadOwnID() gin.HandlerFunc {
	return func(c *gin.Context) {
		claimsValue, exists := c.Get("Claims")
		claims, ok := claimsValue.(types.CustomClaims)
		if !exists || !ok || !claims.IsLead {
			c.JSON(http.StatusForbidden, types.MessageResponse{Message: "Lead access required"})
			c.Abort()
			return
		}
		if c.Param("id") != claims.ID {
			c.JSON(http.StatusForbidden, types.MessageResponse{Message: "You can only access your own lead data"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func VerifyUserAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		claimsValue, exists := c.Get("Claims")
		claims, ok := claimsValue.(types.CustomClaims)
		if !exists || !ok {
			c.JSON(http.StatusUnauthorized, types.MessageResponse{Message: "Token not verified"})
			c.Abort()
			return
		}

		targetID := c.Param("id")
		if targetID == claims.ID {
			c.Next()
			return
		}
		if !claims.IsLead {
			c.JSON(http.StatusForbidden, types.MessageResponse{Message: "You can only access your own user data"})
			c.Abort()
			return
		}

		lead, err := controllers.GetUserByID(claims.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.MessageResponse{Message: "Error verifying access"})
			c.Abort()
			return
		}
		target, err := controllers.GetUserByID(targetID)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, types.MessageResponse{Message: "User not found"})
			} else {
				c.JSON(http.StatusInternalServerError, types.MessageResponse{Message: "Error verifying access"})
			}
			c.Abort()
			return
		}

		for _, leadClub := range lead.Clubs {
			for _, targetClub := range target.Clubs {
				if leadClub == targetClub {
					c.Next()
					return
				}
			}
		}
		c.JSON(http.StatusForbidden, types.MessageResponse{Message: "You cannot access users outside your club"})
		c.Abort()
	}
}
