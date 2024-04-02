import { MongoClient,Db } from "mongodb";
require("dotenv").config();
const url:string = process.env.DB_CONN_STRING!

const defaultDbname = "test"

const client = new MongoClient(url)

export let db:Db;

export const connect = async (dbName: string = defaultDbname) =>{
    const conn = await client.connect()
    db = conn.db(dbName);
    return client;
}