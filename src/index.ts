const express = require('express')
import {connect} from "./db/db"
import userRoutes from './routes/routes'
import userDetailRoutes from "./routes/userDetails"
const client = require('./db/redis')
require('dotenv').config({path:'./.env'})

const app = express()
app.use(express.json())
app.use(userRoutes)
app.use(userDetailRoutes)
client.connect()


connect()
.then(()=>{
    console.log("connected to the database")
})
.catch((err:Error) =>{
    console.log("Error connection to the databaes",err)
    throw err;
})


  
const server = app.listen(3030, () =>{
    console.log("server running on http://localhost:3030/")
})

//export default app;
module.exports = {app , server}








