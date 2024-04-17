import { MongoClient,Db } from "mongodb";
require("dotenv").config();
const defaultUrl:string = process.env.DB_CONN_STRING!

const defaultDbname = "test"

//const client = new MongoClient(defaultUrl);

export let db:Db ;

export const connect = async (url:string = defaultUrl, dbName: string = defaultDbname) =>{
    const client = new MongoClient(url);
    const conn = await client.connect()
    db = conn.db(dbName);
    return client;
}

