import {Request, Response} from 'express';
import { UserDatabase } from '../../services/usersService';
import { RedisUserDatabase } from '../../services/redisUserService';
const client = require('../../db/redis')
interface User{
    _id?:any;
    name:string;
    email:string;
    deleted:boolean | string;
    password: string;
}

export class UserController{
    db;
    dbs;
    constructor() {
        this.db = new UserDatabase("users");
        this.dbs = new RedisUserDatabase(client)
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }
   
    // Request handlers
    getAllUser = async(req:Request, res:Response) => {
        try{
            const page:number = parseInt(req.query.page as string) || 1
            const limit:number = parseInt(req.query.limit as string ) || 10
            const paginatedCacheResults = await this.dbs.getAll(page,limit)
            if (paginatedCacheResults){
                return res.status(200).send(paginatedCacheResults)
            }
            const Results = await this.db.getAll(page,limit)
            res.status(200).send(Results)  
        }catch(err){
            console.log(err)
            res.status(500).send({error:"Server error"})
        }
    };

    getUserById = async (req:Request,res:Response)=>{
        try{
            const id:string = req.params.id
            const cache = await this.dbs.getCacheUser(id)
            if ( Object.keys(cache).length !== 0){
                console.log("cache hit")
                return res.status(200).send(cache)
            }
            const results = await this.db.getOneUser(id)
            if (!results){
                return res.status(404).send({error:"User not found"})
            }
            const validate = this.createUserValidate(results as User)
            if (validate) {
                validate._id = id;
                await this.dbs.createOne("users", id, validate);
            }
            res.status(200).send(results);
        }catch(err){
            console.log(err)
            res.status(500).send({error:"Server Error"})
        }
    };

    getSearchUser = async (req:Request,res:Response) => {
        try{
            const search_data = req.query.search as string
            const result = await this.db.getSearchUser(search_data)
            
            res.status(200).send(result)
        }catch(err){
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
            const key = `users:${id}`
            await this.dbs.updateOne(key,data) 
            res.status(200).send({"message":"update Success"})
        }catch(err){
            res.status(500).send({"error":"update Failed"})
        }
    }

    async createUser(req:Request,res:Response){
        try{
            const data:User = req.body;
            const validate = this.createUserValidate(data)
            if (validate === null){
                return res.status(400).send("Invalid Input")
            }
            
            const userExist = await this.db.getUser(data)
            if (userExist){
                return res.status(400).send("User already exists")
            }
            const id = await this.db.createOne(validate)
            const key = "users"
            validate._id = validate._id.toString()
            await this.dbs.createOne(key,id,validate)
          
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
            const key = `users:${id}`
            await this.dbs.deleteOne(key)
            res.status(200).send({"message":"User Deleted"})
        }catch(err){
            res.status(500).send({"error":"Failed to delete"})
        }
    }

    // Validators
    createUserValidate(data:User){
        if (!data.name || !data.email || !data.password){
            return null 
        }
        let payload:User = {
            _id:undefined,
            name: data.name,
            email: data.email,
            deleted:'false',
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
