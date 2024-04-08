import {Request, Response} from 'express'
const bycrypt = require('bcrypt')
require("dotenv").config();
const jwt = require('jsonwebtoken')
import {UserDatabase} from "../../services/usersService"

interface User {
    name:string;
    email:string;
    deleted:boolean;
    password:string;
}
export class Auth{
    db;
    constructor(){
        this.db = new UserDatabase("users")
    }
    register = async  (req:Request, res:Response) =>{
        try{
            const data: User = req.body
            const validate = this.createUserValidate(data)
            if (validate === false){
                return res.status(400).send({
                    error:"Invalid Input"
                })
            }
            const existUser = await this.db.getUser(data)
            if (existUser){
                return res.status(400).send("User already exists")
            }
            const hashPassword:string = await bycrypt.hash(data.password, 10) 
            const payload = this.createPayload(data,hashPassword)
            await this.db.createOne(payload)
            res.status(200).send({message: "User registered successfully"})
        }catch(err){
            console.log(err)
            res.status(500).send({error: "Registration failed"})
        }
    }
    login = async (req:Request, res:Response) =>{
        try{
            const secretKey:string | undefined = process.env.SECRET_KEY
            const data = req.body
            const validate = this.loginValidate(data)
            if (validate === false){
                return res.status(400).send({error: "Invalid Input"})
            }
            const user = await this.db.getUser(data)
            if (!user){
                return res.status(401).send({error:"No user found"})
            }
            const hashPass:string = await bycrypt.compare(data.password, user.password)
            if (!hashPass){
                return res.status(401).send({error:"Authentication faileds"})
            }
            const token = jwt.sign({id:user._id,name:user.name},secretKey)
            console.log(token)
            res.status(200).send({token})
        }catch(err){
            console.log(err)
            res.status(500).json({error: "Login failed"})
        }
    }
    
    // Balidator
    createUserValidate(data:User){
        if (!data.name || !data.email || !data.password){
            return false
        }
        
    }
    createPayload(data:User,password:string):User{
        let payload = {
            name: data.name,
            email: data.email,
            deleted:false,
            password:password,
        }
        return payload
    }
    loginValidate(data:User){
        const allowedFields = ['name','password'];
        // if (!data.name && !data.email && !data.password && !data.deleted) {
        //     return false;
        for (let key in data) {
            if (!allowedFields.includes(key)){
                return false
            }
        }
        return true 
    }
}

