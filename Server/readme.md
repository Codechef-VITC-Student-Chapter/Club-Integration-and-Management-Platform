# CIMP Golang Backend

## 🚀 Overview
This is the **backend system** for the **CodeChef VIT-Chennai Chapter Management Platform (CIMP)**, rewritten in **Golang** using **Gin** for better scalability and performance.

**Key Features:**
- **Fast & efficient**: Golang offers better performance than Node.js.
- **Well-structured architecture**: Designed for maintainability and scalability.
- **JWT Authentication**
- **MongoDB Integration**
- **Middleware for security & validation**

---

## 🏗️ Project Structure
This project follows a **modular folder structure** to ensure clarity, maintainability, and scalability.

```
CIMP-Golang-Backend/
│── api/
│   ├── controllers/       # Business logic for each resource
│   ├── middlewares/       # Authentication & validation logic
│   ├── routes/            # API endpoints
│   ├── types/             # Data structures and type definitions
│   ├── utils/             # Helper functions
│
│── cmd/
│   ├── main.go            # Application entry point
│
│── database/
│   ├── schemas/           # MongoDB Schema definitions
│   ├── db.go              # Database connection setup
│
│── lib/
│   ├── email_templates.go # Email template management
│   ├── limits.go          # Rate limits, config variables
│
│── services/
│   ├── email_service.go   # Email sending service
│
│── scripts/               # Any scripts for automation
│── tmp/                   # Temporary files (logs, builds)
│── .env                   # Environment variables
│── go.mod                 # Go module dependencies
│── go.sum                 # Package checksums
│── README.md              # Documentation
```

---

## ✍️ How to Contribute & Write Code
### 1️⃣ **Controllers (`api/controllers/`)**
- Each controller **handles the logic** for a resource.
- Should be **stateless** and follow a **single responsibility principle**.
- All the functions which need that controller collection should be defined only inside that controller
- **Example:**
  ```go
  package controllers

  import (
      "github.com/gin-gonic/gin"
      "net/http"
  )

  func GetUsers() []string {
      users := []string{"Alice", "Bob", "Charlie"}
      return users
  }
  ```

### 2️⃣ **Routes (`api/routes/`)**
- Each file **defines API endpoints**.
- Each Route handler handles input validation and sends the required arguments to the controller functions
- **Example:**
  ```go
  package routes

  import (
      "github.com/gin-gonic/gin"
      "CIMP-Golang-Backend/api/controllers"
  )

  func SetupAuthRoutes(r *gin.RouterGroup) {
	r.POST("/login", loginHandler)
	r.POST("/login/verify-otp", verifyLoginOTPHandler)
	r.GET("/send/otp/:reg", sendOTPHandler)
	r.PATCH("/set/pass", setNewPasswordHandler)
    }
  ```

### 3️⃣ **Middlewares (`api/middlewares/`)**
- Used for **authentication, logging, validation**.
- **Example:**
  ```go
  package middlewares

  import (
      "github.com/gin-gonic/gin"
      "net/http"
  )

  func AuthMiddleware() gin.HandlerFunc {
      return func(c *gin.Context) {
          token := c.GetHeader("Authorization")
          if token == "" {
              c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
              c.Abort()
              return
          }
          c.Next()
      }
  }
  ```

### 4️⃣ **Schemas (`database/schemas/`)**
- Defines **MongoDB models**.
- **Example:**
  ```go
  package schemas

  type User struct {
      ID       string `bson:"id" json:id"`
      Name     string `bson:"name" json:"name"`
      Email    string `bson:"email" json:"email"`
  }
  ```

### 5️⃣ **Database (`database/db.go`)**
- Connects to **MongoDB**.
- **Example:**
  ```go
  package database

  import (
      "context"
      "go.mongodb.org/mongo-driver/mongo"
      "go.mongodb.org/mongo-driver/mongo/options"
      "log"
  )

  var DB *mongo.Client

  func ConnectDB() {
      clientOptions := options.Client().ApplyURI("your-mongo-uri")
      client, err := mongo.Connect(context.Background(), clientOptions)
      if err != nil {
          log.Fatal(err)
      }
      DB = client
  }
  ```

---

## 🚀 Running the Project
### 1️⃣ **Install Dependencies**
```sh
go mod tidy
```

### 2️⃣ **Run Locally**
```sh
go run cmd/main.go
```

### 3️⃣ **Run with Air (Live Reload)**
```sh
air
```

---

## 📚 Best Practices for Writing Code
- ✅ **Follow the folder structure** – Keep logic **modular** and **separated**.
- ✅ **Use environment variables** – Do not hardcode secrets in the codebase.
- ✅ **Write efficient controllers** – Avoid **actual logic inside routes**.
- ✅ **Follow naming conventions** – Stick to `camelCase` for variables and `PascalCase` for structs.
- ✅ **Use middleware for security** – Apply **authentication & validation** centrally.
- ✅ **Keep utility functions separate** – Put reusable logic inside `api/utils/`.

---

## 🛠 Future Improvements
- ✅ Add unit tests.
- ✅ Improve logging & error handling.
- ✅ Implement caching (Redis).
- ✅ Improve API documentation with Swagger.

---

## 📬 Contact & Contribution
If you're part of the **CodeChef VIT-Chennai Chapter**, feel free to contribute! Follow the best practices mentioned here and keep the codebase clean. Happy coding! 🚀
