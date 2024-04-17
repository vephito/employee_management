import {Request, Response} from 'express'
const bycrypt = require('bcrypt')
require("dotenv").config();
const jwt = require('jsonwebtoken')
import {UserDatabase} from "../../services/usersService"
import { UserInterface } from "../../services/types/users"
import { ObjectId } from 'mongodb';
export class Auth{
    db;
    constructor(){
        this.db = new UserDatabase("users")
    }
    register = async (req:Request, res:Response) =>{
        try{
            const data: UserInterface = req.body
            const user = await this.db.getUser(data)
            if (user){
                return res.status(400).send("User already exists")
            }
            const isAdmin = req.body.isAdmin || false;
            const hashPassword:string = await bycrypt.hash(data.password, 10) 
          
            const payload = this.createPayload(data,hashPassword,isAdmin)
            await this.db.createOne(payload)
            res.status(201).send({message: "User registered successfully"})
        }catch(err){
            res.status(500).send({error: "Registration failed"})
        }
    }
    login = async (req:Request, res:Response) =>{
        try{
            const data = req.body
            const user = await this.authenticateUser(data);
            if (!user){
                return res.status(401).send({error:"No user found"});
            }
            const hashPass = await this.comparePasswords(data.password,user.password)
            if (!hashPass){
                throw new Error("Authentication failed")
            }
            const token = this.generateToken(user)
            res.status(200).send({token})
        }catch(err){
            res.status(500).json({error: "Login failed"})
        }
    }
    

    //helpers
    authenticateUser = async (data:any) =>{
        const validate = this.loginValidate(data)
        if(validate === false){
            throw new Error("Invalid Input");
        }
        const user = await this.db.getUser(data)
       
        if (!user){
            return null;
        }
        return user 
    }
    generateToken = (user:any) =>{
        const secretKey : string | undefined = process.env.SECRET_KEY
        return jwt.sign({id:user._id, name: user.name, isAdmin: user.isAdmin}, secretKey)
    }
    comparePasswords = async(password:string, hashedPassword:string) =>{
        return await bycrypt.compare(password,hashedPassword)
    }

    // Balidator
    createUserValidate(data:UserInterface){
        if (!data.name || !data.email || !data.password){
            return false
        }
    }
    createPayload(data:UserInterface,password:string,isAdmin:boolean):UserInterface{
        let payload:Partial<UserInterface> = {
            name: data.name,
            email: data.email,
            deleted:false,
            password:password,
            isAdmin:isAdmin
        }
        if (typeof data._id === 'string'){
            payload._id = new ObjectId(data._id)
        }
        return payload as UserInterface
    }
    loginValidate(data:UserInterface){
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

