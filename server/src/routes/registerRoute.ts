import express from 'express'
import * as registerController from '../controllers/registerController'

const registerRoute = express.Router()

export default (): express.Router => {
    registerRoute.post('/register', registerController.postRegister)
    registerRoute.post('/activate-account', registerController.postActivateAccount)
    return registerRoute
}
