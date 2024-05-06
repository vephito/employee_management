import express from 'express';
import { Auth } from '../controllers/auth/authentication';
import { TokenVerifier, isAdmin } from '../middlewares/authMiddleware';
import { UserController } from '../controllers/users/users';
import { createUserValidate,updateUserValidate, loginUserValidate} from '../middlewares/validations/userValidator'; 
import { validate  } from '../middlewares/validations/validateMiddleware';

const router = express.Router();
const userController = new UserController()
const tokenVerifier = new TokenVerifier()
const auth = new Auth()

router.get('/users', tokenVerifier.verifyToken, userController.getAllUser)
router.get('/users/search',tokenVerifier.verifyToken,userController.getSearchUser)
router.get('/users/:id',tokenVerifier.verifyToken, userController.getUserById)

router.post("/users", createUserValidate, validate, userController.createUser)
router.post('/users/register', createUserValidate, validate, auth.register)
router.post('/users/login',loginUserValidate, validate, auth.login)

router.put('/users/:id',updateUserValidate,validate, tokenVerifier.verifyToken, userController.updateUser)

router.delete('/users/:id',tokenVerifier.verifyToken,isAdmin, userController.deleteUser )
export default router;