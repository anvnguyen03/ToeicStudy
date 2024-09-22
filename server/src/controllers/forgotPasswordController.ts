import * as forgotPassService from "../services/forgotPasswordService"
import { Request, Response } from "express"
import { ApiResponse } from "../dto/response/apiResponse"

export const postPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body

    try {
        const resetResponse: ApiResponse<any> = await forgotPassService.generateResetToken(email)
        res.json(resetResponse)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const postChangeNewPassword = async (req: Request, res: Response) => {
    const { email, otp, newPass} = req.body

    try {
        const changeNewPassResponse: ApiResponse<any> = await forgotPassService.resetPassword(email, otp, newPass)
        res.json(changeNewPassResponse)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
