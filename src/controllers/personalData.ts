import { Request, Response} from 'express'
import { UserDatabase } from '../db/database';

interface UserData{
    user_id:string;
    address:string;
    pincode:string;
    phone:string;
    dateOfBirth:string;
    gender:string;
    deleted:boolean;
}
interface customRequest extends Request{
    userId?:{id:string,name:string}
}

export class PersonalDataController{
    db;
    constructor(){
        this.db = new UserDatabase("personal_data")
    }
    
    getAllData = async (req:Request, res:Response) =>{
        const page:number = parseInt(req.query.page as string) || 1
        const limit:number = parseInt(req.query.limit as string) || 10
        const paginatedResults = await this.db.getAll(page,limit)
        res.status(200).send(paginatedResults)
    }
    getOneData = async(req:customRequest, res:Response) => {
        try{
            const id = req.userId!.id
            const result = await this.db.getOneData(id)
            if (!result){
                return res.status(404).send({"error":"Data not found"})
            }
            res.status(200).send(result)
        }catch(err){
            console.log(err)
            res.status(500).send({"Error":"Internel error"})
        }
    }

    updatePersonalData = async(req:customRequest,res:Response) =>{
        const id:string = req.params.id;
        const user_id = req.userId!.id;
        const body:UserData = req.body;
        const isUser = await this.db.isUser(id,user_id)
        if (!isUser){
            return res.status(401).send({"error":"UnAuthorized"})
        }
        const validateData = this.validateUpdateData(body)
        if(validateData === false){
            return res.status(400).send({"error":"Invalid Input"})
        }
        await this.db.updateOne(id,body)
        res.status(200).send({"message":"Success"})
    }
    deletePersonalData = async(req:customRequest,res:Response)=>{
        try{
            const id:string = req.params.id;
            const user_id = req.userId!.id;
            const isUser = await this.db.isUser(id,user_id)
            if(!isUser){
                return res.status(401).send({"error":"UnAuthorized"})
            }
            await this.db.deleteOne(id)
            res.status(200).send({"message":"Delete Success"})
        }catch(err){
            console.log(err)
        }
    }
    createPersonalData = async(req:customRequest,res:Response) =>{
        try{
            const body:UserData = req.body
            const user_id =  req.userId!.id
            const validateData = this.validate(body,user_id)
            if (validateData === false){
                return res.status(401).send({error:"Invalid Input"})
            }
            const dataExists = await this.db.getData(user_id)
            if (dataExists){
                return res.status(400).send({"error":"Data Already Exists"})
            }
            //create data
            await this.db.createOne(validateData)
            res.status(200).send({"message":"Create Success"})
        }catch(err){
            console.log(err)
            return res.status(500).send({"error":"Creating Personal Data Failed"})
        }
    }

    validate(data:UserData,user_id:string | undefined){
        if (!data.address || !data.dateOfBirth || !data.gender || !data.phone || !data.pincode){
            return false
        }
        let payload = {
            user_id:user_id,
            address:data.address,
            dateOfBirth:data.dateOfBirth,
            gender:data.gender,
            pincode:data.pincode,
            phone:data.phone,
            deleted:false
        }
        return payload
    }
    validateUpdateData(data:UserData){
        const allowedFields = ['address','dateOfBirth','gender','pincode','phone']
        for (let key in data){
            if (!allowedFields.includes(key)){
                return false
            }
        }
       
        return true
    } 

    
}