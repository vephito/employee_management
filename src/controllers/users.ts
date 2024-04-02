import {Request, Response} from 'express';
import { UserModel } from '../db/users';
import { Document } from 'mongoose';
import {db} from "../db/db"
const { ObjectId } = require('mongodb');

interface User{
    name:string;
    email:string;
    deleted:boolean;
}
interface CustomResponse extends Response {
    paginatedUsers?: any; 
}
const collectionName = "users"

export class UserController{
  
    async getAllUser(req:Request, res:CustomResponse) {
        // Pagination
        // const page = parseInt(req.query.page as string ) || 1
        // const limit = parseInt(req.query.limit as string) || 10
        // const startIndex = (page - 1) * limit
        //const results = await UserModel.find({deleted:false}).limit(limit).skip(startIndex)
        
        // query for all users
        // const allUser:User[] | null = await UserModel.find({deleted:false}).select('name email')
        // if (allUser?.length == 0){
        //     return res.status(404).send({error:"No User Found"})
        // }
        const resultss = res.paginatedUsers;
        res.status(200).send(resultss)
    };

    async getUserById(req:Request,res:Response) {
        const id:string = req.params.id
        const results = await db.collection(collectionName).findOne({_id: new ObjectId(id),deleted:false})
        if (!results){
            return res.status(404).send({error:"User not found"})
        }
        res.status(200).send(results);
    };

    async updateUser(req:Request,res:Response){
        try{
            const id:string = req.params.id
            const data:Partial<User> = req.body;
            await db.collection(collectionName).updateOne({_id: new ObjectId(id), deleted:false}, { $set: data})
            res.status(200).send({"message":"update Success"})
        }catch(err){
            console.log(err)
            res.status(500).send({"error":"update Failed"})
        }
    }

    async createUser(req:Request,res:Response){
        try{
            const data:User = req.body;
            if (!data.name || !data.email){
                return res.status(400).send("Invalid Input")
            }
            const existUser = await db.collection(collectionName).findOne({
                $or: [{ name: data.name}, {email:data.email}]
            });
            if (existUser){
                return res.status(400).send("User already exists")
            }
            data.deleted = false;
            await db.collection(collectionName).insertOne(data)
            res.status(200).send({"message":"User created success"})
        }catch(err){
            res.status(500).send({error:"Creating failed"}) 
        }
    }
    async deleteUser(req:Request,res:Response){
        try{
        const id:string = req.params.id;
        await db.collection(collectionName).updateOne({_id: new ObjectId(id)},{$set: {deleted:true}})
        res.status(200).send({"message":"User Deleted"})
        }catch(err){
            console.log(err)
            res.status(500).send({"error":"Failed to delete"})
        }
    }
}
