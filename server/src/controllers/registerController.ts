import * as registerService from "../services/registerService"
import { Request, Response } from "express"
import { ApiResponse } from "../dto/response/apiResponse"

export const postRegister = async (req: Request, res: Response) => {
    const { fullName, email, password} = req.body

    try {
        const registerResponse: ApiResponse<any> = await registerService.registerUser(fullName, email, password)
        res.json(registerResponse)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const postVerifyAccount = async (req: Request, res: Response) => {
    const { email, otp } = req.body

    try {
        const verifyResponse: ApiResponse<any> = await registerService.verifyOTP(email, otp)
        res.json(verifyResponse)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}