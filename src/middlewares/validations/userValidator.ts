import { body } from "express-validator";

const isValidRole = (value:string):boolean=> {
    return ['user','manager', 'admin'].includes(value)
}
export const createUserValidate = [
    body('name').notEmpty().isString(),
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().isString().isLength({min:6}),
    body('role')
    .optional()
    .isIn(['admin', 'user', 'manager'])
    .withMessage('Invalid role. Allowed values: admin, user, editor')]

export const updateUserValidate = [
    body('name').optional().notEmpty().isString(),
    body('email').optional().notEmpty().isEmail(),
    body('password').optional().notEmpty().isString().isLength({min:6})
]

export const loginUserValidate = [
    body('name').notEmpty().isString(),
    body('password').notEmpty().isString().isLength({min:4})
]

export const createPersonalValidate = [
    body('address').notEmpty().isString(),
    body('dateOfBirth').notEmpty().isString(),
    body('gender').notEmpty().isString(),
    body('pincode').notEmpty().isString(),
    body('phone').notEmpty().isString(),
    body('deleted').notEmpty().isBoolean(),
]

export const updatePersonalValidate = [
    body('address').optional().notEmpty().isString(),
    body('dateofBirth').optional().notEmpty().isString(),
    body('gender').optional().notEmpty().isString(),
    body('pincode').optional().notEmpty().isString(),
    body('phone').optional().notEmpty().isString(), 
]