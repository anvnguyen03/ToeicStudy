import express from "express"
import * as forgotPassController from "../controllers/forgotPasswordController"

const forgotPassRoute = express.Router()

export default (): express.Router => {
    forgotPassRoute.post('/password-reset', forgotPassController.postPasswordReset)
    forgotPassRoute.post('/change-new-password', forgotPassController.postChangeNewPassword)
    return forgotPassRoute
}