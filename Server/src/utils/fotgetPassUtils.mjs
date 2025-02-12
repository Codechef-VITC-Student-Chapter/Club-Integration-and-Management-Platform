import mongoose from "mongoose";
import dotenv from "dotenv";
import userSchema from "../DB/Schemas/userSchema.mjs";
import crypto from "crypto"
import { getUserByEmail } from "./userUtils.mjs";
import nodemailer from "nodemailer";
const User = mongoose.models.User || mongoose.model("User", userSchema,"users");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // 465 for SSL, 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: "mailId@domain.com", // Your Gmail ID
    pass: "CreatedAppPasswordfromGoogleSecurityCenter", // Use App Password, not your actual Gmail password
  },
});

export const generateOtp = ()=>{
    const otp = crypto.randomInt(1000,9999);
    return otp;
}

export const verifyEmail = async(email)=>{
    try{
        const  user = await getUserByEmail(email);  
        console.log(user);
        if(!user){
          return false;
        }
        return user;
      }catch(err){
          console.log(err)
          res.status(500).json({error:err.message});
      }
}


export const setOtp = async(email,otp)=>{
    try{
        const user = await User.findOneAndUpdate(
            { email: email },  // Find user by email
            { $set: { otp: otp } }, // Set the otp field
            { new: true }  // Return the updated document
        );
        return user;
    }catch(err){
        console.log(err);
    }
}


export const sendOtp = async(email,otp)=>{
    try{
        const info = await transporter.sendMail({
            from:"revanthkannam05@gmail.com",
            to:email,
            subject:"CIMP Password reset otp",
            text:`Here is your otp for password reset :- ${otp} , Pls dont share with anyone`
        })

        console.log("Email sent sucessfully",info);
    }catch(err){
        console.log(err);
    }
}

export const verifyOtp = async(email,otp)=>{
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error("User not found");
        }
        else{
            console.log(user.otp===otp)
            if(user.otp===otp){
                const secretCode = crypto.randomInt(10000,99999);
                console.log(secretCode);
                try{
                    const user = await User.findOneAndUpdate(
                        { email: email },  // Find user by email
                        { new: true }  // Return the updated document
                    );
                    return true;
                }catch(err){
                    console.log("error setting secretCode :- ",err);
                    return false;
                }
                ;
            }else{
                return false;
            }
        }
        return user;
      } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch user");
      }
}

export const verifyCodeAndReset = async(email,otp,newPassword)=>{
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error("User not found");
        }
        else{
            console.log(user.otp===otp)
            if(user.otp===otp){
                try{
                    const user = await User.findOneAndUpdate(
                        { email: email },  // Find user by email
                        { 
                            $set: { 
                                password: newPassword 
                            },
                            $unset:{
                                otp:""
                            }
                        }, 
                        { new: true }  // Return the updated document
                    );                    
                    return true;
                }catch(err){
                    console.log("error setting NewPassword :- ",err);
                    return false;
                }
                ;
            }else{
                return false;
            }
        }
      } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch user");
      }
}
