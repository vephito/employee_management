import {connect} from "./db/db"
const client = require('./db/redis')
require('dotenv').config({path:'./.env'})
import app from "./app"

client.connect()

connect()
.then(()=>{
    console.log("connected to the database")
})
.catch((err:Error) =>{
    console.log("Error connection to the databaes",err)
    throw err;
})


app.listen(3030, () =>{
    console.log("server running on http://localhost:3030/")
})










