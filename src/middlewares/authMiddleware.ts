const jwt = require('jsonwebtoken')
import { NextFunction, Request,Response } from "express"
require("dotenv").config();

interface User {
    id: string;
    name: string;
    role: string;
}

interface userRequest extends Request{
    userId?:User;
}

export class TokenVerifier {
    async verifyToken(req:userRequest,res:Response, next:any){
        let jwtToken = req.cookies
        console.log(jwtToken)
        const token = req.header('Authorization')
        if (!token){
            return res.status(401).send({error:'Access denied'})
        }
        try{
            const isToken = jwt.verify(token,process.env.SECRET_KEY)
            req.userId = isToken
            next();
        }catch(error){
            res.status(401).json({error:'Invalid token'});
        }
    }
}

export const isAdmin = (req:userRequest,res:Response,next: NextFunction) => {
    if (!req.userId){
        return res.status(401)
    }
    const userRole = req.userId.role

    if(userRole !== "admin"){
        return res.status(403).send({message:"Unauthroized acess"})
    }
    next()
}
