import { ObjectId, Document} from "mongodb"
import { db } from "./db"

interface User{
    name:string,
    email:string,
    deleted:boolean,
    password:string
}
export class UserDatabase{
    collectionName:string
    constructor(collectionName:string){
        this.collectionName = collectionName
    }
    
    async getOne(id:string){
        const result = await db.collection(this.collectionName).findOne({_id: new ObjectId(id),deleted:false})
        return result
    }
   
    async updateOne(id:string,data:User){
        const result = await db.collection(this.collectionName).updateOne({_id: new ObjectId(id), deleted:false}, { $set: data})
        return result
    }
    async getAll(page:number, limit:number) {
        const firstIndex:number = (page - 1) * limit
        const paginatedResults = await db.collection(this.collectionName).find({deleted:false}).skip(firstIndex).limit(limit).toArray()
        return paginatedResults
    };

    async deleteOne(id:string){
        try{
            const result = await db.collection(this.collectionName).updateOne({_id: new ObjectId(id)},{$set: {deleted:true}})
            return result
        }catch(err){
            console.log(err)
        }
    }
    async createOne<T extends Document>(data:T){
        try{
            const result = await db.collection(this.collectionName).insertOne(data)
            return result 
        }catch(err){
            console.log(err)
        }
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
            const result = await db.collection(this.collectionName).findOne({user_id:user_id,deleted:false})
            return result
        }catch(err){
            console.log(err)
        }
    }
    async getOneData(user_id:string){
        const result = await db.collection(this.collectionName).findOne({user_id:user_id,deleted:false})
      
        return result
    }
}