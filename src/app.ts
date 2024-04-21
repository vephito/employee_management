import express from 'express'
import userRoutes from '../src/routes/routes'
import userDetailRoutes from "../src/routes/userDetails"
const app = express()
app.use(express.json())
app.use(userRoutes)
app.use(userDetailRoutes)

export default app