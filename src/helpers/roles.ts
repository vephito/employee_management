import { UserDatabase } from '../services/usersService';

const db = new UserDatabase("users");
export const isManager = async(id:string) =>{

    const user = await db.getOneUser(id) 
    if (user){
        if (user.role === "manager"){
            return true
        }
        return false
    }
}

export const isAdmin = async(id:string) =>{
    const user = await db.getOneUser(id) 
    if (user){
        if (user.role === "admin"){
            return true
        }
        return false
    }
}

