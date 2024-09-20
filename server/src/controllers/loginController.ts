import express, { Request, Response } from "express"
import * as loginService from "../services/loginService"
import colors from "colors"

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const loginResponse = await loginService.login(email, password)
        res.json(loginResponse)
    } catch (error) {
        console.log(colors.red(`Error: ${error}`))
        res.status(500).json({ error: error.message })
    }
}