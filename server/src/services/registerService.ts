import { UserModel } from "../models/user"
import { sendOTPViaMail } from "../utils/sendOTPViaEmail"
import { ApiResponse } from "../dto/response/apiResponse"
import colors from "colors"

const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const validatePassword = (password: string): boolean => {
    // regex for minimum 6 characters, at least 1 letter and 1 number
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    return regex.test(password)
}

export const registerUser = async (fullName: string, email: string, password: string) => {
    let response: ApiResponse
    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {
        response = {
            statusCode: 400,
            message: 'Register failed',
            data: null,
            error: 'User already exists'
        }
        return response
    }

    if (!validatePassword(password)) {
        response = {
            statusCode: 400,
            message: 'Register failed',
            data: null,
            error: 'Password must be at least 6 characters long and contain both letters and numbers'
        }
        return response
    }

    const otp = generateOTP()
    const newUser = new UserModel({
        fullName,
        email,
        password,
        otp
    })
    
    try {
        await newUser.save()
        await sendOTPViaMail(email, otp)  

        response = {
            statusCode: 200,
            message: 'OTP sent via Email',
            data: null,
            error: null
        }
    } catch (error) {
        console.log(colors.red(`Error while sending email: ${error}`))
    }
    return response
}

export const verifyOTP = async (email: string, otp: string) => {
    const user = await UserModel.findOne({ email });
    let response: ApiResponse
    if (!user) {
        response = {
            statusCode: 400,
            message: 'Can not verify',
            data: null,
            error: 'User not found'
        }
        return response
    }

    // Check if OTP is correct and not expired
    if (user.otp === otp) {
        user.isActivated = true;
        user.otp = undefined;
        await user.save();
        response = {
            statusCode: 200,
            message: 'Verify success. Account activated',
            data: null,
            error: null
        }
    } else {
        response = {
            statusCode: 400,
            message: 'Invalid or expired OTP',
            data: null,
            error: null
        }
    }

    return response
};