package middlewares

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/controllers"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/gin-gonic/gin"
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
