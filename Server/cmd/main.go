package main

import (
	"log"
	"os"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/controllers"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	if err := godotenv.Load(); err != nil {
		log.Printf("Error while loading env: %v", err)
	}
	log.Printf("ENV Loaded")

	controllers.ConnectClubCollection()
	controllers.ConnectDepartmentCollection()
	controllers.ConnectContributionCollection()
	controllers.ConnectUserCollection()
	controllers.ConnectTaskCollection()

	clientURL := os.Getenv("CLIENT_URL")
	allowOrigins := []string{
		"http://localhost:5173",
		"http://localhost:3001",
	}

	if clientURL != "" {
		allowOrigins = append(allowOrigins, clientURL)
	}
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	authApi := r.Group("/api/auth")
	userApi := r.Group("/api/user")
	contApi := r.Group("/api/contribution")
	clubApi := r.Group("/api/club")
	deptApi := r.Group("/api/department")
	taskApi := r.Group("/api/task")

	routes.SetupUserRoutes(userApi)
	routes.SetupAuthRoutes(authApi)
	routes.SetupContributionRoutes(contApi)
	routes.SetupClubRoutes(clubApi)
	routes.SetupDepartmentRoutes(deptApi)
	routes.SetupTaskRoutes(taskApi)

	if err := r.Run(":3000"); err != nil {
		log.Fatal("Failed to start the server", err)
	}
}
