import express from 'express';
import { Auth } from '../controllers/auth/authentication';
import { TokenVerifier } from '../middlewares/authMiddleware';
import { UserController } from '../controllers/users/users';
import { PersonalDataController } from "../controllers/personalData/personalData";
import { createUserValidate,updateUserValidate, loginUserValidate, createPersonalValidate,updatePersonalValidate } from '../middlewares/validations/userValidator'; 
import { validate  } from '../middlewares/validations/validateMiddleware';

const router = express.Router();
const userController = new UserController()
const personalDataController = new PersonalDataController()
const tokenVerifier = new TokenVerifier()
const auth = new Auth()


router.get('/users/data',tokenVerifier.verifyToken,personalDataController.getOneData)
router.get('/users/data/all',personalDataController.getAllData)
router.get('/users', tokenVerifier.verifyToken, userController.getAllUser)
router.get('/users/search',tokenVerifier.verifyToken,userController.getSearchUser)
router.get('/users/:id',tokenVerifier.verifyToken, userController.getUserById)
  

router.post("/users", createUserValidate, validate, userController.createUser)
router.post('/users/register', createUserValidate, validate, auth.register)
router.post('/users/login',loginUserValidate, validate, auth.login)
router.post("/users/data",createPersonalValidate, validate, tokenVerifier.verifyToken,personalDataController.createPersonalData)

router.put('/users/data/:id',updatePersonalValidate, validate, tokenVerifier.verifyToken,personalDataController.updatePersonalData)
router.put('/users/:id',updateUserValidate,validate, tokenVerifier.verifyToken, userController.updateUser)

router.delete('/users/data/:id',tokenVerifier.verifyToken,personalDataController.deletePersonalData)
router.delete('/users/:id',tokenVerifier.verifyToken, userController.deleteUser )
export default router;