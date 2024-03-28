import { UserModel } from "../db/users";
import {Request, Response} from 'express'
import { Document } from "mongodb";
const bycrypt = require('bcrypt')
require("dotenv").config();
const jwt = require('jsonwebtoken')

interface User extends Document{
    name:string;
    email:string;
    password:string;
}
export class Auth{
    async register (req:Request, res:Response){
        try{
            const {name,email,password}: User = req.body
            if (!name || !email || !password){
                return res.status(400).send({
                    error:"Invalid Input"
                })
            }
            const existUser:User[] | null = await UserModel.findOne({
                $or: [{ name: name}, {email:email}]
            });
            if (existUser){
                return res.status(400).send("User already exists")
            }
            const hashPassword:string = await bycrypt.hash(password, 10) 
            const newUser:User = await new UserModel({name, email, password:hashPassword})
            await newUser.save()
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
            const user:User | null = await UserModel.findOne({name})
            if (!user){
                return res.status(401).send({error:"Authentication failed"})
            }
            const hashPass:string = await bycrypt.compare(password, user.password)
            if (!hashPass){
                return res.status(401).send({error:"Authentication failed"})
            }
            const token = jwt.sign({id:user._id,name:user.name},secretKey)
            res.status(200).send({token})
        }catch(err){
            console.log(err)
            res.status(500).json({error: "Login failed"})
        }
    }
}