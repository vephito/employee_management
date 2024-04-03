const express = require('express')
import {connect} from "./db/db"
import router from './routes/routes'
require('dotenv').config({path:'./.env'})

const app = express()
app.use(express.json())
app.use(router)

connect()
.then(()=>{
    console.log("connected to the database")
})
.catch((err:Error) =>{
    console.log("Error connection to the databaes",err)
})

app.listen(3030, () =>{
    console.log("server running on http://localhost:3030/")
})


