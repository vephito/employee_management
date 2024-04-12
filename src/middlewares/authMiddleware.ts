const jwt = require('jsonwebtoken')
import { Request,Response } from "express"
require("dotenv").config();

interface userRequest extends Request{
    userId?:string
}

export class TokenVerifier {
    async verifyToken(req:userRequest,res:Response, next:any){
        const token = req.header('Authorization')
        console.log(req)
        if (!token){
            return res.status(401).send({error:'Access denied'})
        }
        try{
            const isToken = jwt.verify(token,process.env.SECRET_KEY)
            req.userId = isToken
            next();
        }catch(error){
            console.log(error)
            res.status(401).json({error:'Invalid token'});
        }
    }
}
