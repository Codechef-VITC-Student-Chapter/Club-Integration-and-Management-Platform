package lib

import "time"

var MAX_OTP_RETRIES = 5

// LoginOTPExpiry is how long a login OTP remains valid after being sent.
var LoginOTPExpiry = 5 * time.Minute
