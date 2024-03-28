import { NextFunction,Request,Response } from "express"

interface PaginatedResults{
    results?:any
}
interface CustomResponse extends Response {
    paginatedUsers?: any; 
}

export class Pagination{
    paginatedUser(model:any){
        return async (req:Request,res:CustomResponse,next:NextFunction)=>{
            const page:number = parseInt(req.query.page as string) || 1
            const limit:number = parseInt(req.query.limit as string ) || 10
            const firstIndex:number = (page - 1) * limit
           
            const paginatedResults:PaginatedResults = {}
            
         paginatedResults.results = await model.find({deleted:false}).skip(firstIndex).limit(limit)
         
         res.paginatedUsers = paginatedResults
         next();
        }
    }
}