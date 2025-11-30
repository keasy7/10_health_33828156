const express = require("express")
const router = express.Router()
const { redirectLogin } = require('./middleware/auth');
const { validate, hashPassword } = require('./middleware/inputVal');
const { query, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', 
        [validate('email'), 
        validate('username'),
        validate('first'),
        validate('password')], 
    async function (req, res, next) {  // async handler - allows for other processing while hashing goes on
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // 1. Hash the password asynchronously
            const hashedPassword = await hashPassword(req.body.password);

            // 2. Prepare sanitized values for DB insertion
            const newRecord = [
                req.sanitize(req.body.first),
                req.sanitize(req.body.last),
                req.sanitize(req.body.email),
                req.sanitize(req.body.username),
                hashedPassword
            ];

            // 3. Insert into database
            const sqlQuery = "INSERT INTO users (first, last, email, username, password) VALUES (?,?,?,?,?)";
            db.query(sqlQuery, newRecord, (err, result) => {
                if (err) {
                    return next(err);
                }

                // 4. Create session using the inserted user's ID from the actual table
                req.session.userId = result.insertId; 

                // 5. Send confirmation message
                const message = `Hello ${newRecord[0]} ${newRecord[1]}! You are now registered. We will send an email to ${newRecord[2]}.`;
                res.send(message);
            });
        } catch (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Internal server error');
        }
    }
);

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})

router.post('/loggedIn', function (req, res, next) {
    let sqlquery = "SELECT * FROM users WHERE username = ?"
    const username = req.sanitize(req.body.username)
    const plainPassword = req.body.password

    db.query(sqlquery, [username], (err, results) => {
        if (err) {
            return next(err)
        }

        if (results.length === 0) { //checks if username is correct
            return res.send('Login failed, please check your username and password and try again. Username error.')
        }

        const hashedPassword = results[0].password; // get hashed password from database

        bcrypt.compare(plainPassword, hashedPassword, function(err, result) {
            if (err) {
                return res.send('fatal error')
            }

            if (result == true) {
                req.session.userId = results[0].id; //creating session
                return res.send('You are now logged in, welcome back '+ username)
            } else {
                return res.send('Login failed, please check your username and password and try again.')
            }
        })
    })
})
// Export the router object so index.js can access it
module.exports = router
