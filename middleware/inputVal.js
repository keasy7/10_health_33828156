const bcrypt = require('bcrypt');
const saltrounds = 10;
const { check, validationResult } = require('express-validator');

const validate = (type) => {
    switch (type) { 
        case 'email':
            return check('email')
                .isEmail()
                .withMessage('Invalid email address');
        case 'password':
            return check('password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters');
        case 'username':
            return check('username')
            .isLength({ min: 5, max: 20})
            .withMessage('Username must be between 5 and 20 characters');
        case 'first':
            return check('first')
            .isLength({ min: 1, max: 50})
            .withMessage('First name must be between 1 and 50 characters');
        case 'last':
            return check('last')
            .isLength({ min: 1, max: 50})
            .withMessage('Last name must be between 1 and 50 characters');
        default:
            throw new Error(`Unknown validation type: ${type}`);
    }
};

const hashPassword = async (plainTextPassword) => {
    const hash = await bcrypt.hash(plainTextPassword, saltrounds);
    return hash;
}

module.exports = { validate, hashPassword };