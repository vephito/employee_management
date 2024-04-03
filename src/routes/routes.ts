import express from 'express';
import { Auth } from '../controllers/authentication';
import { TokenVerifier } from '../middlewares/authMiddleware';
import { UserController } from '../controllers/users';
const router = express.Router();
const userController = new UserController()

const tokenVerifier = new TokenVerifier()
const auth = new Auth()


router.get('/users', tokenVerifier.verifyToken, userController.getAllUser)
router.get('/users/search',userController.getSearchUser)
router.get('/users/:id',tokenVerifier.verifyToken, userController.getUserById)


router.post("/users", userController.createUser)
router.post('/users/register', auth.register)
router.post('/users/login',auth.login)

router.put('/users/:id',tokenVerifier.verifyToken, userController.updateUser)
router.delete('/users/:id',tokenVerifier.verifyToken, userController.deleteUser )
export default router;