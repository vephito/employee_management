import { UserModel } from "../db/users";
import express, {Request, Response} from 'express'
import { Document } from "mongodb";
const bycrypt = require('bcrypt')
require("dotenv").config();
const jwt = require('jsonwebtoken')

interface User extends Document{
    name:string;
    email:string;
    deleted:boolean;
}

// registering/creating a new user
// loggin in a user

export const register =  async (req:Request, res:Response) => {
    try{
        const {name,email,password} = req.body
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
        const hashPassword = await bycrypt.hash(password, 10) 
        const newUser = await new UserModel({name, email, password:hashPassword})
        newUser.save()
        console.log(newUser)
        res.status(200).send({message: "User registered successfully"})
    }catch(err){
        console.log(err)
        res.status(500).send({error: "Registration failed"})
    }
}

export const login = async (req:Request, res:Response) => {
    try{
        const secretKey = process.env.SECRET_KEY
        const {name, password} = req.body
        if (!name || !password){
            return res.status(400).send({error: "Invalid Input"})
        }
        const user = await UserModel.findOne({name})
        if (!user){
            return res.status(401).send({error:"Authentication failed"})
        }
        const hashPass = await bycrypt.compare(password, user.password)
        if (!hashPass){
            return res.status(401).send({error:"Authentication failed"})
        }
        console.log(user)
        const token = jwt.sign({id:user._id,name:user.name},secretKey)
        console.log(token)
        res.status(200).send({token})
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Login failed"})
    }
    
}