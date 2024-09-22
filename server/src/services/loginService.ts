import { UserModel } from "../models/user"
import { ApiResponse } from "../dto/response/apiResponse"
import jwt from "jsonwebtoken"
import { LoginResponse } from "dto/response/auth/loginResponse"

export const login = async (email: string, password: string) => {
    let response: ApiResponse<LoginResponse>

    const user = await UserModel.findOne({ email })
    if (!user) {
        return response = {
            statusCode: 401,
            message: 'Invalid login credentials - email',
            data: null,
            error: "Unauthorized"
        }
    }

    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
        return response = {
            statusCode: 401,
            message: 'Invalid login credentials',
            data: null,
            error: "Unauthorized"
        }
    }
    
    response = {
        statusCode: 200,
        message: "Login successfully",
        data: generateTokens(user),
        error: null
    }
    return response;
}

const generateAccessToken = (user: typeof UserModel.prototype) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

const generateRefreshToken = (user: typeof UserModel.prototype) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

const generateTokens = (user: typeof UserModel.prototype) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    let loginResponse: LoginResponse = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
            email: user.email,
            fullName: user.fullName,
            address: user.address,
            role: {
                id: null,
                name: null,
                permissions: null
            }
        }
    }
    return loginResponse;
}