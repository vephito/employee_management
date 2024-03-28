import {Request, Response} from 'express';
import { UserModel } from '../db/users';
import { Document } from 'mongoose';

interface User extends Document{
    name:string;
    email:string;
    deleted:boolean;
}
interface CustomResponse extends Response {
    paginatedUsers?: any; 
}

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
        const user:User[] | null = await UserModel.find({_id:id,deleted:false})
        if (user?.length == 0){
            return res.status(404).send({error:"User not found"})
        }
        res.status(200).send(user);
    };

    async updateUser(req:Request,res:Response){
        const id:string = req.params.id
        const data:Partial<User> = req.body;
        const user:User[] | null = await UserModel.findOneAndUpdate({_id:id, deleted:false}, data, {new :true})
        if (!user){
            return res.status(404).send({error:"User not found"})
        }
        const result:User[] = await UserModel.find({_id:id})
        res.status(200).send(result)
    }

    async createUser(req:Request,res:Response){
        try{
            const data:User = req.body;
            if (!data.name || !data.email){
                return res.status(400).send("Invalid Input")
            }
            const existUser:User[] | null = await UserModel.findOne({
                $or: [{ name: data.name}, {email:data.email}]
            });
            if (existUser){
                return res.status(400).send("User already exists")
            }
            const user:User = await UserModel.create(data)
            console.log(user)
            res.status(200).send(user)
        }catch(err){
            res.status(500).send({error:"Creating failed"}) 
        }
    }
    async deleteUser(req:Request,res:Response){
        const id:string = req.params.id;
        const user:User | null = await UserModel.findById(id)
        if (!user){
            return res.status(404).send({error:"User not found"})
        }
        user.deleted = true;
        await user.save() 
        res.status(200).send("Deleted")
    }
}
