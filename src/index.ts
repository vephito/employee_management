const express = require('express')
const mongoose = require('mongoose')
import router from './routes/users'
require('dotenv').config({path:'./.env'})

const url:string = process.env.DB_CONN_STRING!

const app = express()
app.use(express.json())
app.use(router)


mongoose.connect(url)
.then(() => {   
    console.log("Connected to the database")
  
})
.catch((err:Error) => {
    console.log("Error connecting to the database", err)
})

app.listen(3030, () =>{
    console.log("server running on http://localhost:3030/")
})


