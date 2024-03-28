import express from 'express';
import { Auth } from '../controllers/authentication';
import { TokenVerifier } from '../middlewares/authMiddleware';
import { UserController } from '../controllers/users';
import { Pagination } from '../middlewares/paginationMiddleware';
import { UserModel } from '../db/users';
const router = express.Router();
const userController = new UserController()
const paginatedUsers = new Pagination()
const tokenVerifier = new TokenVerifier()
const auth = new Auth()

router.get('/users', tokenVerifier.verifyToken,paginatedUsers.paginatedUser(UserModel), userController.getAllUser)
router.get('/users/:id',tokenVerifier.verifyToken, userController.getUserById)
router.put('/users/:id',tokenVerifier.verifyToken, userController.updateUser)
router.post("/users", userController.createUser)
router.delete('/users/:id',tokenVerifier.verifyToken, userController.deleteUser )

router.post('/users/register', auth.register)
router.post('/users/login',auth.login)
export default router;