import express,{Request, Response} from 'express';
import { UserModel } from '../db/users';
import { Document } from 'mongoose';
const router = express.Router();

interface User extends Document{
    name:string;
    email:string;
    deleted:boolean;
}

router.get('/users', async(req:Request, res:Response) => {
    const allUser:User[] | null = await UserModel.find({deleted:false})
    if (!allUser){
        return res.status(404).send({error:"No User Found"})
    }
    res.status(200).send(allUser)
});

router.get('/users/:id', async (req:Request,res:Response) =>{
    const id:string = req.params.id
    const user:User | null = await UserModel.find({_id:id,deleted:false})
    if (!user){
        return res.status(404).send({error:"User not found"})
    }
    res.status(200).send(user);
}) 

router.put('/users/:id', async(req:Request,res:Response)=>{
    const id:string = req.params.id
    const data:Partial<User> = req.body;

    const user:User | null = await UserModel.findOneAndUpdate({_id:id, deleted:false}, data, {new :true})
    if (!user){
        return res.status(404).send({error:"User not found"})
    }
    const result:User = await UserModel.find({_id:id})
    res.status(200).send(result)
})

router.post("/users", async (req:Request,res:Response)=>{
    try{
        const data:User = req.body;
        if (!data.name || !data.email){
            return res.status(400).send("Invalid Input")
        }
        const existUser:User | null = await UserModel.findOne({
            $or: [{ name: data.name}, {email:data.email}]
        });
        if (existUser){
            return res.status(400).send("User already exists")
        }
        const user:User = await UserModel.create(data)
        res.status(200).send(user)
    }catch(err){
       res.status(500).send({error:"Creating failed"}) 
    }
})
router.delete('/users/:id', async(req,res)=>{
    const id:string = req.params.id;
    const user:User | null = await UserModel.findById(id)
    if (!user){
        return res.status(404).send({error:"User not found"})
    }
    user.deleted = true;
    await user.save() 
    res.status(200).send("Deleted")
})
export default router;