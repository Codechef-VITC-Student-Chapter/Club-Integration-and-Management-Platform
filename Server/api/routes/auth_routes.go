package routes

import (
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/Sasank-V/CIMP-Golang-Backend/api/controllers"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/types"
	"github.com/Sasank-V/CIMP-Golang-Backend/api/utils"
	"github.com/Sasank-V/CIMP-Golang-Backend/database/schemas"
	"github.com/Sasank-V/CIMP-Golang-Backend/lib"
	"github.com/Sasank-V/CIMP-Golang-Backend/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupAuthRoutes(r *gin.RouterGroup) {
	r.POST("/signup", signupHandler)
	r.POST("/login", loginHandler)
	r.GET("/send/otp/:reg", sendOTPHandler)
	r.PATCH("/set/pass", setNewPasswordHandler)
}

func signupHandler(c *gin.Context) {
	var user types.UserSignUpInfo

	if err := c.ShouldBindBodyWithJSON(&user); err != nil {
		fmt.Printf("Error in signup: %v", err)
		c.JSON(http.StatusBadRequest, types.AuthResponse{
			Message: "Error in the data sent , Not a JSON Object",
			Token:   "",
		})
		return
	}

	new_user := schemas.User{
		ID:        utils.GetUserIDFromRegNumber(user.RegNumber),
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		Password:  utils.HashSHA256(user.Password),
		RegNumber: strings.ToUpper(user.RegNumber),
		IsLead:    false,
	}
	if err := controllers.AddUser(new_user); err != nil {
		fmt.Printf("Error adding user: %v\n", err)
		c.JSON(http.StatusInternalServerError, types.AuthResponse{
			Message: fmt.Sprintf("Error adding user: %s , Try Again Later", err),
			Token:   "",
		})
		return
	}

	payload := types.TokenPayload{
		ID:     new_user.ID,
		Name:   new_user.FirstName + " " + new_user.LastName,
		IsLead: new_user.IsLead,
	}
	token, err := controllers.GenerateToken(payload)
	if err != nil {
		fmt.Printf("Error generating token: %v\n", err)
		controllers.DeleteUser(new_user.ID)
		c.JSON(http.StatusInternalServerError, types.AuthResponse{
			Message: "Error while generating Token , Try Again Later",
			Token:   "",
		})
		return
	}

	c.JSON(http.StatusOK, types.AuthResponse{
		Message: "User Signup Successfull",
		Token:   token,
	})
}

func loginHandler(c *gin.Context) {
	var login types.UserLoginInfo

	if jerr := c.ShouldBindBodyWithJSON(&login); jerr != nil {
		fmt.Printf("Error logining in : %v", jerr)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Error loggin in the data sent, Not a JSON object",
		})
		return
	}
	user, uerr := controllers.GetUserByID(utils.GetUserIDFromRegNumber(login.RegNumber))
	if uerr != nil {
		if uerr == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.AuthResponse{
				Message: "No User found with the given ID",
				Token:   "",
			})
			return
		}
		fmt.Printf("Error loggin in : %v", uerr)
		c.JSON(http.StatusInternalServerError, types.AuthResponse{
			Message: "Some Error occured while logging in , Try Again Later",
			Token:   "",
		})
		return
	}

	pass_hash := utils.HashSHA256(login.Password)
	if user.Password != pass_hash {
		c.JSON(http.StatusBadRequest, types.AuthResponse{
			Message: "Incorrect Password",
			Token:   "",
		})
		return
	}

	payload := types.TokenPayload{
		ID:     user.ID,
		Name:   user.FirstName + " " + user.LastName,
		IsLead: user.IsLead,
	}
	token, terr := controllers.GenerateToken(payload)
	if terr != nil {
		fmt.Printf("Error while generating token: %v", terr)
		c.JSON(http.StatusInternalServerError, types.AuthResponse{
			Message: "Server Error while creating token , Try again later",
			Token:   "",
		})
		return
	}

	c.JSON(http.StatusOK, types.AuthResponse{
		Message: "User Logged in Successfully",
		Token:   token,
	})

}

func sendOTPHandler(c *gin.Context) {
	regNo := c.Param("reg")
	userID := utils.GetUserIDFromRegNumber(regNo)

	user, err := controllers.GetUserByID(userID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "No user found with the given Register No",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error fetching user data",
		})
		return
	}

	otp := utils.GenerateOTP()
	emailBody := lib.GetOTPTemplate(otp)

	var wg sync.WaitGroup
	var emailErr, userErr error
	wg.Add(2)

	go func(email string, body string) {
		defer wg.Done()
		emailErr = services.SendEmailFromClub(email, "OTP for Password Reset", body)
	}(user.Email, emailBody)

	go func(id string, otp string) {
		defer wg.Done()
		userErr = controllers.SetResetOTPToUser(userID, utils.HashSHA256(otp))
	}(userID, otp)

	wg.Wait()

	if emailErr != nil {
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "error sending OTP to your mail, Try Again Later",
		})
		return
	}
	if userErr != nil {
		if userErr == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "No user found to set the OTP",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error setting up user OTP , Try Again",
		})
		return
	}
	c.JSON(http.StatusOK, types.MessageResponse{
		Message: fmt.Sprintf("OTP sent to your email : %v", user.Email),
	})
}

func setNewPasswordHandler(c *gin.Context) {
	var SetPassInfo types.SetNewPassInfo
	if err := c.ShouldBindBodyWithJSON(&SetPassInfo); err != nil {
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: "Error parsing JSON body data",
		})
		return
	}
	fmt.Printf("%v", SetPassInfo)
	userID := utils.GetUserIDFromRegNumber(SetPassInfo.RegNo)
	user, err := controllers.GetUserByID(userID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "No User found with the given Register No",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error fetching user data",
		})
		return
	}

	if time.Now().Compare(user.LockedTill) == -1 {
		c.JSON(http.StatusBadRequest, types.MessageResponse{
			Message: "User Account is Locked after Maximum Retries , Try again after some time",
		})
		return
	}

	if strings.Compare(user.OTP, utils.HashSHA256(SetPassInfo.OTP)) != 0 {
		if user.OTPRetries == lib.MAX_OTP_RETRIES {
			c.JSON(http.StatusForbidden, types.MessageResponse{
				Message: "Max Retries Reached , Try again after some time",
			})
			err = controllers.LockUserAccountPasswordReset(userID, time.Now().Add(3*time.Hour))
			if err != nil {
				c.JSON(http.StatusInternalServerError, types.MessageResponse{
					Message: "Error locking the account",
				})
			}
			return
		} else {
			c.JSON(http.StatusBadRequest, types.MessageResponse{
				Message: "Incorrect OTP ,Try again",
			})
			err = controllers.IncreaseUserOTPRetries(userID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, types.MessageResponse{
					Message: "Error increasing retries",
				})
				return
			}
			return
		}
	}

	err = controllers.SetNewPasswordToUser(userID, utils.HashSHA256(SetPassInfo.Password))
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.MessageResponse{
				Message: "No user got their password set",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error setting up new password to user",
		})
		return
	}
	err = controllers.ResetOTPandLockValuesForUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.MessageResponse{
			Message: "Error reseting the OTP , Retries and Lock Cool Down",
		})
	}
	c.JSON(http.StatusOK, types.MessageResponse{
		Message: "New Password successfully set to the user",
	})

}
