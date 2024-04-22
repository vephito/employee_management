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
    client:any
    constructor(redisClient:any){
        this.client = redisClient 
    }
   

    async updateOne<T>(id:string,data:Partial<T>){
        //const result = await db.collection(this.collectionName).updateOne({_id: new ObjectId(id), deleted:false}, { $set: data})
        
        const user = await this.client.HSET(id,data)
        return user
    }
    async getAll(page:number, limit:number) {
        const firstIndex:number = (page - 1) * limit
        const paginatedResults = await this.client.SCAN(0,'users:*',0) 
        //const paginatedResults = await this.client.SCAN(0,'users:*',0)
        const keysForPage = paginatedResults.keys.slice(firstIndex, firstIndex + limit);
        const res: any = [];
        for (const key of keysForPage) {
            const keyType = await this.client.type(key);
            if (keyType === 'string') {
                const user = await this.client.get(key);
                res.push(JSON.parse(user));
            } 
        }
        return res
    };

    async deleteOne(id:string){
        try{
            const result = await this.client.DEL(id);

            return result
        }catch(err){
            console.log(err)
        }
    }
    //HASH
    async createOnes<T extends Document>(key:string,id:any,data:T){
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
    //STRING
    async createOne<T extends Document>(key:string,id:any,data:T){
        let ids;
        if (id.insertedId) {
            ids = id.insertedId.toString()
        }else{
            ids = id
        }
        await this.client.SET(`${key}:${ids}`,JSON.stringify(data))
        return key
    }
    async getCacheUser(id:string){
        const res = await this.client.HGETALL(`users:${id}`)
        return res 
    }
  
    

   
    async addUserToOnline(id:string){
        await this.client.SADD('online:users', id)
    }
    async addSorted(){
        await this.client.zAdd('rank:user',[{
            score: 1,
            value: 'a'
            }]); 
            await this.client.zAdd('rank:user',[{
            score: 2,
            value: 'df'
            }]);  
    }
    async getByScore(){
        await this.client.ZRANGE('rank:user', 1, -1,'withscores')
    }

}