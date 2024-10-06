import { UserModel } from "../models/user"
import { sendEmail } from "../utils/sendEmail"
import { ApiResponse } from "../dto/response/apiResponse"
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken"
import colors from "colors"

const validatePassword = (password: string): boolean => {
    // regex for minimum 6 characters, at least 1 letter and 1 number
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    return regex.test(password)
}

export const registerUser = async (fullName: string, email: string, password: string) => {
    let response: ApiResponse<any>
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

    const newUser = new UserModel({
        fullName,
        email,
        password
    })

    try {
        await newUser.save()
        const activationLink = `http://localhost:${process.env.port}/api/v1/auth/activate-account/` + jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5m' })
        const subject = 'TOEIC Study - Account activation'
        const message = `<p>Click the following link to activate your account: </p>
                        <a href="${activationLink}">Active!</a>`
        await sendEmail(email, subject, message)

        response = {
            statusCode: 200,
            message: 'Check your email for confirmation',
            data: null,
            error: null
        }
    } catch (error) {
        console.log(colors.red(`Error while sending email: ${error}`))
        response = {
            statusCode: 400,
            message: 'Error while sending mail. Please try again later.',
            data: null,
            error: error.message
        }
    }
    return response
}

export const activateAccount = async (activeToken: string) => {
    let response: ApiResponse<any>

    try {
        const decoded = jwt.verify(activeToken, process.env.JWT_SECRET) as JwtPayload

        const userId = decoded.id
        const user = await UserModel.findById(userId)

        // check legit user
        if (!user) {
            response = {
                statusCode: 404,
                message: 'Activation process failed',
                data: null,
                error: 'Account does not exist'
            }
            return response
        }

        user.isActivated = true
        await user.save()
        response = {
            statusCode: 200,
            message: 'Account activated',
            data: null,
            error: null
        }
        return response

    } catch (error) {
        // In case of token's expired, create a new token for user
        if (error instanceof TokenExpiredError) {
            const decoded = jwt.decode(activeToken) as JwtPayload
            const userId = decoded.id
            const user = await UserModel.findById(userId)

            const activationLink = `http://localhost:${process.env.port}/api/v1/auth/activate-account/` + jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' })
            const subject = 'TOEIC Study - Account activation'
            const message = `<p>Click the following link to activate your account: </p>
                        <a href="${activationLink}">Active!</a>`
            await sendEmail(user.email, subject, message)

            response = {
                statusCode: 400,
                message: "Activation link's expired. We've just sent a new active link to your email.",
                data: null,
                error: "Token's expired"
            }
            return response
        } else {
            throw error
        }
    }
}