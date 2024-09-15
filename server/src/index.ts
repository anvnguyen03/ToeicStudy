import express, {Express, Request, Response} from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import bodyParser from 'body-parser'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8080
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const password_db = process.env.PASSWORD_MONGODB;
const MONGO_URL = `mongodb+srv://an2572003:${password_db}@cluster0.fje00yg.mongodb.net/ToeicStudy?retryWrites=true&w=majority`;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript server')
})

app.listen(port, () => {
    console.log(colors.blue(`[Server]: Server is running at http://localhost:${port}`))
})