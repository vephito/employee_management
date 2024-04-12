import express from 'express';
import { PersonalDataController } from "../controllers/personalData/personalData";
import { TokenVerifier } from "../middlewares/authMiddleware";
const personalDataController = new PersonalDataController()
import { 
    createPersonalValidate,
    updatePersonalValidate 
} from '../middlewares/validations/userValidator'; 

import { validate } from '../middlewares/validations/validateMiddleware';
const tokenVerifier = new TokenVerifier();

const router = express.Router();

router.get('/users/data/one',tokenVerifier.verifyToken,personalDataController.getOneData)
router.get('/users/data/all',personalDataController.getAllData)

router.post("/users/data",createPersonalValidate, validate, tokenVerifier.verifyToken,personalDataController.createPersonalData)

router.put('/users/data/:id',updatePersonalValidate, validate, tokenVerifier.verifyToken,personalDataController.updatePersonalData)

router.delete('/users/data/:id',tokenVerifier.verifyToken,personalDataController.deletePersonalData)

export default router;