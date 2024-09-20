import express from "express"
import * as loginController from "../controllers/loginController"
import { login } from "services/loginService"

const loginRoute = express.Router()

export default (): express.Router => {
    loginRoute.post('/login', loginController.login)
    return loginRoute
}