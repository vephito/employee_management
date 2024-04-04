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
}