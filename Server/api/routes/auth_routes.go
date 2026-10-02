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
	// Signup is disabled - handler kept in place but not routed.
	// r.POST("/signup", signupHandler)
	r.POST("/login", loginHandler)
	r.POST("/login/verify-otp", verifyLoginOTPHandler)
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

	passwordHash, err := utils.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.AuthResponse{Message: "Invalid password", Token: ""})
		return
	}
	new_user := schemas.User{
		ID:        utils.GetUserIDFromRegNumber(user.RegNumber),
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		Password:  passwordHash,
		RegNumber: strings.ToUpper(user.RegNumber),
		IsLead:    false,
		Clubs:     []string{"codechefvitc"},
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

	passwordValid, legacyPassword := utils.VerifyPassword(login.Password, user.Password)
	if !passwordValid {
		c.JSON(http.StatusBadRequest, types.AuthResponse{
			Message: "Incorrect Password",
			Token:   "",
		})
		return
	}
	if legacyPassword {
		upgradedHash, err := utils.HashPassword(login.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.AuthResponse{Message: "Error securing password", Token: ""})
			return
		}
		if err := controllers.SetNewPasswordToUser(user.ID, upgradedHash); err != nil {
			c.JSON(http.StatusInternalServerError, types.AuthResponse{Message: "Error securing password", Token: ""})
			return
		}
	}

	// Credentials are valid, but the user is not fully authenticated yet.
	// Generate a short-lived OTP and email it via the existing Resend setup;
	// a token is only issued once verifyLoginOTPHandler confirms the OTP.
	otp, err := utils.GenerateOTP()
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.AuthResponse{Message: "Error generating login OTP", Token: ""})
		return
	}
	expiry := time.Now().Add(lib.LoginOTPExpiry)

	otpHash, err := utils.HashOTP(otp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.AuthResponse{Message: "Error securing login OTP", Token: ""})
		return
	}
	if err := controllers.SetLoginOTPToUser(user.ID, otpHash, expiry); err != nil {
		fmt.Printf("Error setting login OTP: %v\n", err)
		c.JSON(http.StatusInternalServerError, types.AuthResponse{
			Message: "Error while starting login, Try Again Later",
			Token:   "",
		})
		return
	}

	emailBody := lib.GetLoginOTPTemplate(otp)
	if err := services.SendEmailFromClub(user.Email, "Your CIMP Login OTP", emailBody); err != nil {
		fmt.Printf("Error sending login OTP email: %v\n", err)
		c.JSON(http.StatusInternalServerError, types.AuthResponse{
			Message: "Error sending OTP to your mail, Try Again Later",
			Token:   "",
		})
		return
	}

	c.JSON(http.StatusOK, types.AuthResponse{
		Message: fmt.Sprintf("OTP sent to your registered email : %v", user.Email),
		Token:   "",
	})
}

func verifyLoginOTPHandler(c *gin.Context) {
	var verify types.LoginOTPVerifyInfo

	if err := c.ShouldBindBodyWithJSON(&verify); err != nil {
		fmt.Printf("Error in login OTP verification: %v", err)
		c.JSON(http.StatusBadRequest, types.AuthResponse{
			Message: "Error in the data sent , Not a JSON Object",
			Token:   "",
		})
		return
	}

	userID := utils.GetUserIDFromRegNumber(verify.RegNumber)
	user, uerr := controllers.GetUserByID(userID)
	if uerr != nil {
		if uerr == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, types.AuthResponse{
				Message: "No User found with the given ID",
				Token:   "",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, types.AuthResponse{
			Message: "Some Error occured while verifying OTP , Try Again Later",
			Token:   "",
		})
		return
	}

	if user.LoginOTP == "" || user.LoginOTPExpiry.IsZero() {
		c.JSON(http.StatusBadRequest, types.AuthResponse{
			Message: "No OTP requested , Please login again",
			Token:   "",
		})
		return
	}

	if time.Now().After(user.LoginOTPExpiry) {
		_ = controllers.ClearLoginOTP(userID)
		c.JSON(http.StatusBadRequest, types.AuthResponse{
			Message: "OTP expired , Please login again",
			Token:   "",
		})
		return
	}

	if !utils.VerifyOTP(verify.OTP, user.LoginOTP) {
		c.JSON(http.StatusBadRequest, types.AuthResponse{
			Message: "Incorrect OTP",
			Token:   "",
		})
		return
	}

	// Consume the OTP atomically so concurrent requests cannot both use it.
	consumed, err := controllers.ConsumeLoginOTP(userID, user.LoginOTP)
	if err != nil {
		fmt.Printf("Error clearing login OTP: %v\n", err)
		c.JSON(http.StatusInternalServerError, types.AuthResponse{
			Message: "Server Error while verifying OTP , Try again later",
			Token:   "",
		})
		return
	}
	if !consumed {
		c.JSON(http.StatusBadRequest, types.AuthResponse{Message: "OTP expired or already used", Token: ""})
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

	otp, err := utils.GenerateOTP()
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.MessageResponse{Message: "Error generating OTP"})
		return
	}
	emailBody := lib.GetOTPTemplate(otp)
	otpHash, err := utils.HashOTP(otp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.MessageResponse{Message: "Error securing OTP"})
		return
	}

	var wg sync.WaitGroup
	var emailErr, userErr error
	wg.Add(2)

	go func(email string, body string) {
		defer wg.Done()
		emailErr = services.SendEmailFromClub(email, "OTP for Password Reset", body)
	}(user.Email, emailBody)

	go func(id string, otp string) {
		defer wg.Done()
		userErr = controllers.SetResetOTPToUser(userID, otpHash)
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

	if !utils.VerifyOTP(SetPassInfo.OTP, user.OTP) {
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

	passwordHash, err := utils.HashPassword(SetPassInfo.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.MessageResponse{Message: "Invalid password"})
		return
	}
	err = controllers.SetNewPasswordToUser(userID, passwordHash)
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
