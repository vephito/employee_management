import {Request, Response} from 'express';
import { UserDatabase } from '../../services/usersService';

interface User{
    name:string;
    email:string;
    deleted:boolean;
    password: string;
}

export class UserController{
    db;
    constructor() {
        this.db = new UserDatabase("users");
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }
   
    // Request handlers
    getAllUser = async(req:Request, res:Response) => {
        try{
            const page:number = parseInt(req.query.page as string) || 1
            const limit:number = parseInt(req.query.limit as string ) || 10
            const paginatedResults = await this.db.getAll(page,limit)
            res.status(200).send(paginatedResults)
        }catch(err){
            console.log(err)
            res.status(500).send({error:"Server error"})
        }
    };

    getUserById = async (req:Request,res:Response)=>{
        try{
            const id:string = req.params.id
            const results = await this.db.getOne(id)
            if (!results){
                return res.status(404).send({error:"User not found"})
            }
            res.status(200).send(results);
        }catch(err){
            console.error("An Error Occured",err)
            res.status(500).send({error:"Server Error"})
        }
    };

    getSearchUser = async (req:Request,res:Response) => {
        try{
            const search_data = req.query.search as string
            const result = await this.db.getSearchUser(search_data)
            res.status(200).send(result)
        }catch(err){
            console.log(err)
            res.status(500).send({error:"Server Error"})
        }
    }

    async updateUser(req:Request,res:Response){
        try{
            const id:string = req.params.id
            const data = req.body;
            let result = this.updateUserValidate(data) 
            if (result === false){
                return res.status(400).send({"error":"Invalid input"})
            }
            await this.db.updateOne(id,data) 
            res.status(200).send({"message":"update Success"})
        }catch(err){
            console.log(err)
            res.status(500).send({"error":"update Failed"})
        }
    }

    async createUser(req:Request,res:Response){
        try{
            const data:User = req.body;
            const validate = this.createUserValidate(data)
            if (validate === false){
                return res.status(400).send("Invalid Input")
            }
            const userExist = await this.db.getUser(validate)
            if (userExist){
                return res.status(400).send("User already exists")
            }
            await this.db.createOne(validate)
            res.status(201).send({"message":"User created success"})
        }catch(err){
            console.log(err)
            res.status(500).send({error:"Creating failed"}) 
        }
    }
    deleteUser = async (req:Request,res:Response) =>{
        try{
            const id:string = req.params.id;
            await this.db.deleteOne(id)
            res.status(200).send({"message":"User Deleted"})
        }catch(err){
            console.log(err)
            res.status(500).send({"error":"Failed to delete"})
        }
    }

    // Validators
    createUserValidate(data:User){
        if (!data.name || !data.email || !data.password){
            return false
        }
        let payload = {
            name: data.name,
            email: data.email,
            deleted:false,
            password:data.password,
        }
        return payload
    }
    updateUserValidate(data:User){
        const allowedFields = ['name', 'email', 'password', 'deleted'];
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
