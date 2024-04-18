import { ObjectId, Document} from "mongodb"
import { db } from "../db/db"

interface User{
    _id?:any,
    name:string,
    email:string,
    deleted:boolean | string,
    password:string
}

export class RedisUserDatabase{
    collectionName:string
    client:any
    constructor(collectionName:string,redisClient:any){
        this.collectionName = collectionName
        this.client = redisClient 
    }
    async getOneUser(id:string){
        const result = await db.collection(this.collectionName).findOne({_id: new ObjectId(id),deleted:false})
        return result
    } 
    async getOne(id:string){
        try{
            let pipeline = []
            pipeline.push({
                $match:{
                    _id:new ObjectId(id)
                }
            })
            pipeline.push({
                $lookup:{
                    from:"personal_data",
                    localField:"_id",
                    foreignField:"user_id",
                    as:"personal_details",
                }
            })
            pipeline.push({
                $unwind:{
                    path:"$personal_details"
                }
            })
            pipeline.push({
                $project:{
                    _id:1,
                    name:1,
                    email:1,
                    personal_details:{
                        address:1,
                        dateOfBirth:1,
                        gender:1,
                        pincode:1,
                        phone:1
                    }
                }
            })
            const result = await db.collection(this.collectionName).aggregate(pipeline).toArray()
            return result
        }catch(err){
            console.log(err)
        }
    }

    async updateOne<T>(id:string,data:Partial<T>){
        //const result = await db.collection(this.collectionName).updateOne({_id: new ObjectId(id), deleted:false}, { $set: data})
        
        const user = await this.client.HSET(id,data)
        return user
    }
    async getAll(page:number, limit:number) {
        const firstIndex:number = (page - 1) * limit
        const paginatedResults = await this.client.SCAN(0,'users:*',0)
        const keysForPage = paginatedResults.keys.slice(firstIndex, firstIndex + limit);
        const res: any = [];
        for (const key of keysForPage) {
            const user = await this.client.HGETALL(key);
            res.push(user);
        }
        return res;
    };

    async deleteOne(id:string){
        try{
            const result = await this.client.DEL(id);

            return result
        }catch(err){
            console.log(err)
        }
    }
    async createOne<T extends Document>(key:string,id:any,data:T){
        // try{
        //     const result = await db.collection(this.collectionName).insertOne(data)
        //     return result 
        // }catch(err){
        //     console.log(err)
        // }
        let ids;
        if (id.insertedId) {
            ids = id.insertedId.toString()
        }else{
            ids = id
        }
        //HSETNX (only if the user is not created)
        await this.client.HSET(`${key}:${ids}`,data)
        return key 
    }
    async getCacheUser(id:string){
        const res = await this.client.HGETALL(`users:${id}`)
        return res 
    }
  
    async getUser(data:User){
        const existUser = await db.collection(this.collectionName).findOne({
            $or: [{ name: data.name}, {email:data.email}]
        });
        
        return existUser
    }
    async getSearchUser(search_data:string){
        try{
            const pipeline = []
            pipeline.push({
                $search:{
                    index: 'user_search',
                    text:{
                        query: search_data,
                        path:['name','email'],
                        fuzzy:{},
                    },
                }
            })
            const result = await db.collection(this.collectionName).aggregate(pipeline)
            const array = await result.toArray()
            return array
        }catch(err){
            console.log(err)
        }
    }

    // Mostly Personal Data
    async getData(user_id:string){
        try{
            const result = await db.collection(this.collectionName).findOne({user_id: new ObjectId(user_id),deleted:false})
            return result
        }catch(err){
            console.log(err)
        }
    }
    
    async isUser(id:string,user_id:string){
        const users = await db.collection(this.collectionName).findOne({_id:new ObjectId(id),deleted:false})
        
        if (users!.user_id.toString() === user_id){
           
            return true
        }
        return false
    }
}