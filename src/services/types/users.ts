export interface UserDataInterface{
    user_id:string;
    address:string;
    pincode:string;
    phone:string;
    dateOfBirth:string;
    gender:string;
    deleted:boolean;
}

export interface UserInterface {
    _id?:object | string;
    name:string;
    email:string;
    deleted:boolean | string;
    password:string;
    isAdmin?:boolean;
}