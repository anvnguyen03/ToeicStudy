import * as registerService from "../services/registerService"
import { Request, Response } from "express"
import { ApiResponse } from "../dto/response/apiResponse"

export const postRegister = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body

    try {
        const registerResponse: ApiResponse<any> = await registerService.registerUser(fullName, email, password)
        res.json(registerResponse)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const postActivateAccount = async (req: Request, res: Response) => {
    const { activeToken } = req.body

    try {
        const activeResponse: ApiResponse<any> = await registerService.activateAccount(activeToken)
        res.json(activeResponse)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}