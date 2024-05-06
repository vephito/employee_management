import express from 'express'
import userRoutes from '../src/routes/routes'
import userDetailRoutes from "../src/routes/userDetails"
import cookieParser from 'cookie-parser'
const app = express()
app.use(express.json())
app.use(userRoutes)
app.use(userDetailRoutes)
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
export default app