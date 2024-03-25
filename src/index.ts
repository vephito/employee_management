const express = require('express')
const mongoose = require('mongoose')
import router from './routes/users'
require('dotenv').config({path:'../.env'})

const url:string = process.env.DB_CONN_STRING!


const app = express()
app.use(express.json())
app.use(router)



mongoose.connect('mongodb+srv://nekogaming390:vcsQOqU76tOwVB3D@cluster0.upjgobo.mongodb.net/')
.then(() => {   
    console.log("Connected to the database")
})
.catch((err:any) => {
    console.log("Error connecting to the database", err)
})

app.listen(3030, () =>{
    console.log("server running on http://localhost:3030/")
})






