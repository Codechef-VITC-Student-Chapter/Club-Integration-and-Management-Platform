import express from "express"
import crypto from "crypto";
import {getUserByEmail} from "../utils/userUtils.mjs"
import { verifyEmail,generateOtp, setOtp, sendOtp, verifyOtp, verifyCodeAndReset} from "../utils/fotgetPassUtils.mjs";

const forgetPassRouter = express.Router();

forgetPassRouter.post("/getOtp/:emailId",async(req,res)=>{
    const email = req.params.emailId
    var user = await verifyEmail(email);
    if(!user){
        res.status(401).json("No such user found"); 
    }
    const otp = generateOtp();
    console.log(otp);
    setOtp(email,otp);
    sendOtp(email,otp);
    res.status(200).json("OTP Sent successfully");
})

forgetPassRouter.post("/verifyOtp/:email/:enteredOtp",async(req,res)=>{
    const email = req.params.email;
    const otp = req.params.enteredOtp;
    const status = await verifyOtp(email,otp);
    if(status){
        res.status(200).json({message:"OTP Verified",resetAccessCode:status});
    }else{
        res.status(401).json("Wrong OTP");
    }
})

forgetPassRouter.post("/resetPassword/:emailId/:otp/:newPassword",async(req,res)=>{
    const email = req.params.emailId;
    const otp = req.params.otp;
    const newPassword = req.params.newPassword;
    const result = await verifyCodeAndReset(email,otp,newPassword);
    if(result){
        res.status(200).json("Password changed successfully");
    }else{
        res.status(401).json("Not verified ");
    }


})

export default forgetPassRouter;