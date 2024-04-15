// import chai from "chai"
// const expect = chai.expect
// import {describe, it,test} from 'node:test';
// import assert from 'node:assert';
import request from 'supertest';
import app from "../index"
import { Auth } from '../controllers/auth/authentication';
const auth = new Auth()
import {connect} from "../db/db"
import {connectTest} from "../db/testdb"

const user = {
    _id:"testid",
    name:"testUser",
}
describe('User Routes', () => {
    beforeAll(async () => { 
        await connectTest()
        //await connect(); 
    });
    
    describe("GET /users",() =>{
        it('should response status of 200',async() => {
            const Token = auth.generateToken(user)
            const response = await request(app)
                .get('/users')
                .set('Authorization',Token)
            expect(response.statusCode).toEqual(200);
            })
        it('should response status of 401',async() =>{
            const Token = "invalidToken"
            const response = await request(app)
            .get('/users')
            .set('Authorization',Token)
        expect(response.statusCode).toEqual(401)
        })
    })
    describe("POST /users/register",() =>{
        it('should respond with status 201 and create a new user', async () =>{
            const newUser = {
                _id:"507f1f77bcf86cd799439011",
                name:"newUser",
                email:"email@gmail.com",
                password:"password",
            }
            const Token = auth.generateToken(user)
         
            const response = await request(app)
                .post('/users/register')
                .set('Authorization',Token)
                .send(newUser)
            expect(response.statusCode).toEqual(201)
        })
        it('should respond with status 400 User already exist', async () =>{
            const newUser = {
                name:"newUser",
                email:"email@gmail.com",
                password:"password",
            }
            const Token = auth.generateToken(user)
            const response = await request(app)
                .post('/users/register')
                .set('Authorization',Token)
                .send(newUser)
            expect(response.statusCode).toEqual(400)
        })

    })
    describe("PUT /users/:id",() =>{
        it('should respond with status 200 and update user',async()=>{
            const UserId ="507f1f77bcf86cd799439011";
            const Token = auth.generateToken(user)
            const updateUserData = {
                name:"UpdatedTestName"
            };
            const res = await request(app)
                .put(`/users/${UserId}`)
                .set('Authorization',Token)
                .send(updateUserData)
            expect(res.statusCode).toEqual(200)
        })
    })
    describe("DELETE /users/:id",() =>{
        it('should respond with status 200 and delete the user', async()=>{
            const UserId ="507f1f77bcf86cd799439011";
            const Token = auth.generateToken(user)
            const deleteUser = {
                delete: true
            }
            const res = await request(app)
                .delete(`/users/${UserId}`)
                .set('Authorization',Token)
                .send(deleteUser)
            expect(res.statusCode).toEqual(200)
        })
    })
})


// describe('Personal Data Routes', () => {
//     describe('GET /users/data/all', ()=>{
//         it('should respond 200', async() =>{
//             const Token = auth.generateToken(user)
//             const res = await request(app)
//                 .get('/users/data/all')
//                 .set('Authorization',Token)
//             expect(res.statusCode).toEqual(200);
//         })
//     })
//     describe('POST /users/data/', () =>{
//         it('should respond with status 201', async ()=>{
//             const testData = {
//                 _id: '507f1f77bcf86cd799439012',
//                 address:"testadd",
//                 dateOfBirth:"342",
//                 gender:"male",
//                 pincode:"34234",
//                 phone:"23423423",
//             }
//             const Token = auth.generateToken(user)
//             const res = await request(app)
//                 .post('/users/data')
//                 .set('Authorization',Token)
//                 .send(testData)
//             expect(res.statusCode).toEqual(201)
//         })
//     })
// })