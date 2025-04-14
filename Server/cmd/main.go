package main

import (
	"log"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/controllers"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/routes"
	"github.com/Sasank-V/CIMP-Golang-Backend/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	r := gin.Default()
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error while loading env: ", err)
	}
	log.Printf("ENV Loaded")

	services.SetUpEmailDialer()

	controllers.ConnectClubCollection()
	controllers.ConnectDepartmentCollection()
	controllers.ConnectContributionCollection()
	controllers.ConnectUserCollection()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	authApi := r.Group("/api/auth")
	userApi := r.Group("/api/user")
	contApi := r.Group("/api/contribution")
	clubApi := r.Group("/api/club")
	deptApi := r.Group("/api/department")

	routes.SetupUserRoutes(userApi)
	routes.SetupAuthRoutes(authApi)
	routes.SetupContributionRoutes(contApi)
	routes.SetupClubRoutes(clubApi)
	routes.SetupDepartmentRoutes(deptApi)

	if err := r.Run(":3000"); err != nil {
		log.Fatal("Failed to start the server", err)
	}
}
