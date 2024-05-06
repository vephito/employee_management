import {Queue, Worker } from "bullmq";
import { UserDatabase } from "../services/usersService";
import { RedisUserDatabase } from "../services/redisUserService";

const client = require('../db/redis')
const db = new UserDatabase('users')
const dbs = new RedisUserDatabase(client)

export const createQueue = new Queue('create-queue', { connection: {
    host: "localhost",
    port:6399
}})


export const createQueueWorker = new Worker('create-queue', async (job) => {
    try {
        console.log(`Creating User ${job.data.name}`);
        const id = await db.createOne(job.data);
        const key = "users";
        job.data.deleted = "false";
        job.data._id = job.data._id.toString();
        await dbs.createOne(key, id, job.data);
        console.log("User created successfully.");
    } catch (error) {
        console.error("Error creating user:", error);
        throw error; // Rethrow the error to ensure it's handled properly
    }
},{
    connection: {
        host: 'localhost', 
        port: 6399, 
    }
});

createQueueWorker.on('completed', () =>{
    console.log("Create success")
    
})
createQueueWorker.on('failed', ()=>{
    console.log("create failed")
})
createQueue.on('error', (error) => {
    console.error("Queue error:", error);
});

createQueueWorker.on('error', (error) => {
    console.error("Worker error:", error);
});