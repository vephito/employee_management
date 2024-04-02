import { UserModel } from "../db/users";
import {Request, Response} from 'express'
const bycrypt = require('bcrypt')
require("dotenv").config();
const jwt = require('jsonwebtoken')
import { db } from "../db/db";

interface User {
    name:string;
    email:string;
    password:string;
}
const collectionName = "users"
export class Auth{
    async register (req:Request, res:Response){
        try{
            const {name,email,password}: User = req.body
            if (!name || !email || !password){
                return res.status(400).send({
                    error:"Invalid Input"
                })
            }
            const existUser = await db.collection(collectionName).findOne({
                $or: [{ name: name}, {email:email}]
            });
            if (existUser){
                return res.status(400).send("User already exists")
            }
            const hashPassword:string = await bycrypt.hash(password, 10) 
            await db.collection(collectionName).insertOne({name, email, password:hashPassword,deleted:false})
            res.status(200).send({message: "User registered successfully"})
        }catch(err){
            console.log(err)
            res.status(500).send({error: "Registration failed"})
        }
    }
    async login(req:Request, res:Response)  {
        try{
            const secretKey:string | undefined = process.env.SECRET_KEY
            const {name, password}:User = req.body
            if (!name || !password){
                return res.status(400).send({error: "Invalid Input"})
            }
            const user = await db.collection(collectionName).findOne({name})
            if (!user){
                return res.status(401).send({error:"Authentication failed"})
            }
            const hashPass:string = await bycrypt.compare(password, user.password)
            if (!hashPass){
                return res.status(401).send({error:"Authentication failed"})
            }
            const token = jwt.sign({id:user._id,name:user.name},secretKey)
            console.log(token)
            res.status(200).send({token})
        }catch(err){
            console.log(err)
            res.status(500).json({error: "Login failed"})
        }
    }
}