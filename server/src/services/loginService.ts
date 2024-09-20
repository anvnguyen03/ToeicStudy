import { UserModel } from "../models/user"
import { ApiResponse } from "../dto/response/apiResponse"
import jwt from "jsonwebtoken"

export const login = async (email: string, password: string) => {
    let response: ApiResponse

    const user = await UserModel.findOne({ email })
    if (!user) {
        response = {
            statusCode: 401,
            message: 'Invalid login credentials - email',
            data: null,
            error: "Unauthorized"
        }
        return response
    }

    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
        response = {
            statusCode: 401,
            message: 'Invalid login credentials',
            data: null,
            error: "Unauthorized"
        }
        return response;
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
    return { accessToken, refreshToken };
}