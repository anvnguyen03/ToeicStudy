import { UserModel } from "../models/user";
import { sendEmail } from "../utils/sendEmail"
import { ApiResponse } from "../dto/response/apiResponse"
import dotenv from "dotenv"
import colors, { reset } from "colors"
import { PassThrough } from "stream";

dotenv.config()

const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const validatePassword = (password: string): boolean => {
    // regex for minimum 6 characters, at least 1 letter and 1 number
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    return regex.test(password)
}

export const generateResetToken = async (email: string) => {
    let response: ApiResponse<any>
    const existingUser = await UserModel.findOne({ email })

    if (!existingUser) {
        response = {
            statusCode: 400,
            message: 'Invalid email',
            data: null,
            error: 'Can not find User'
        }
        return response
    }

    const otp = generateOTP()
    existingUser.otp = otp
    await existingUser.save()

    const port = process.env.PORT
    const resetUrl = `http://localhost:${port}/api/v1/auth/change-new-password`
    const subject = 'Link to reset your password'
    const message = `You requested a password reset. Your OTP: ${otp}. Click <a href="${resetUrl}">here</a> to reset your password.`

    try {
        await sendEmail(email, subject, message)
        return response = {
            statusCode: 200,
            message: 'We have sent a reset password link to your Email.',
            data: null,
            error: null
        }
    } catch (error) {
        console.log(colors.red(`Error: ${error.message}`))
        response = {
            statusCode: 400,
            message: 'Can not sent Email',
            data: null,
            error: error.message
        }
        return response
    }
}

export const resetPassword = async (email: string, otp: string, newPass: string) => {
    let response: ApiResponse<any>
    const existingUser = await UserModel.findOne({ email })

    if (!existingUser) {
        response = {
            statusCode: 400,
            message: 'User not found',
            data: null,
            error: null
        }
        return response
    }

    if (existingUser.otp !== otp) {
        response = {
            statusCode: 400,
            message: 'Invalid or expired OTP',
            data: null,
            error: null
        }
        return response
    }

    if (!validatePassword(newPass)) {
        response = {
            statusCode: 400,
            message: 'Password must be at least 6 characters long and contain both letters and numbers',
            data: null,
            error: null
        }
        return response
    }

    existingUser.password = newPass
    existingUser.otp = undefined

    try {
        await existingUser.save()
        response = {
            statusCode: 200,
            message: 'Change password succesfully, please re-login to confirm',
            data: null,
            error: null
        }
        
        return response
    } catch (error) {
        console.log(colors.red(`Error: ${error}`))
        response = {
            statusCode: 400,
            message: 'Can not change password',
            data: null,
            error: error.message
        }
        return response
    }
}