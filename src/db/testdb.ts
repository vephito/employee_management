import { MongoMemoryServer } from "mongodb-memory-server";
import {connect} from "./db"


export const connectTest = async () =>{
    const mongoDb = await MongoMemoryServer.create()
    const url = mongoDb.getUri();
    await connect(url)
}
