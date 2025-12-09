const express = require("express")
const router = express.Router()
const { redirectLogin } = require('../middleware/auth');
const { validate, hashPassword } = require('../middleware/inputVal');
const { query, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');


router.get('/register', function (req, res, next) {
    res.render('register.ejs', { errors: [] })
})

router.post('/registered', 
        [validate('email'), 
        validate('username'),
        validate('first'),
        validate('password')], 
    async function (req, res, next) {  // async handler - allows for other processing while hashing goes on
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.render('register.ejs', { errors: errors.array() }); // render with errors instead of redirect
        }

        try {
            // hash password
            const hashedPassword = await hashPassword(req.body.password);

            //  clean inputs
            const newRecord = [
                req.sanitize(req.body.username),
                hashedPassword,
                req.sanitize(req.body.email),
                req.sanitize(req.body.first),
                req.sanitize(req.body.last)
            ];

            //insert into database
            let sqlquery = "INSERT INTO users (username, password, email, first_name, last_name) VALUES (?,?,?,?,?)";
            db.query(sqlquery, newRecord, (err, result) => {
                if (err) {
                    return next(err);
                }

                // create session using the inserted user's ID from the actual table
                req.session.userId = result.insertId; 

                //  confirmation message
                //const message = `Hello ${newRecord[0]} ${newRecord[1]}! You are now registered. We will send an email to ${newRecord[2]}.`;
                //res.send(message);
                console.log('User registered successfully:', newRecord[0]);
                res.redirect(`/users/profile/${newRecord[0]}`); // newRecord[0] = username

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
            return res.redirect('/users/login'); //returns if username not found
        }

        const hashedPassword = results[0].password; // get hashed password from database

        bcrypt.compare(plainPassword, hashedPassword, function(err, result) {
            if (err) {
                return res.send('fatal error')
            }

            if (result == true) {
                req.session.userId = results[0].id; //creating session
                return res.redirect('/usr/365/dashboard');
            } else {
                return res.redirect('/users/login'); //returns if password incorrect
            }
        })
    })
})

router.get('/profile/:username', async (req, res, next) => { 
    const username = req.params.username;

    try {
        const sql = 'SELECT id, first_name, last_name, email, username FROM users WHERE username = ?';
        db.query(sql, [username], (err, results) => {
            if (err) return next(err);

            if (results.length === 0) {
                return res.status(404).send('User not found');
            }

            const user = results[0];                   // retrieve user info
            const self = req.session.userId === user.id; // Check if viewing own profile

            const recentWorkoutsSql = 'SELECT * FROM workouts WHERE user_id = ? ORDER BY date_logged DESC LIMIT 5';

            db.query(recentWorkoutsSql, [user.id], (err, workoutResults) => { // retrieve recent workouts
                if (err) return next(err);

                const friendsQuery = "SELECT * FROM friends WHERE user_id = ? OR friend_id = ?";
                db.query(friendsQuery, [req.session.userId, req.session.userId], (err2, friends) => {
                    if (err2) return next(err2);

                    res.render('profile.ejs', { user, self, workouts: workoutResults, friends, loggedInUserId: req.session.userId});
                });
            });
        });

    } catch (err) {
        next(err);
    }
});

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search_result', 
    [query('search_text').isLength({ min: 1 }),
     query('search_text').trim().escape()],
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('search.ejs'); // resets page if wrong input
        } else {  
            const keyword = `%${req.query.search_text}%`;
            const loggedInUserId = req.session.userId; // makes sure logged in user isnt a search result themselves
            const sqlquery = "SELECT * FROM users WHERE username LIKE ? AND id != ?";

            db.query(sqlquery, [keyword, loggedInUserId], (err, result) => {
                if (err) return next(err);

                    const friendsQuery = "SELECT * FROM friends WHERE user_id = ? OR friend_id = ?"; //gets all friend involvements from database involving the logged in user
                    db.query(friendsQuery, [loggedInUserId, loggedInUserId], (err2, friends) => {
                        if (err2) return next(err2);


            
            res.render('search_result.ejs', { users: result, friends, loggedInUserId });
        });
    });
}});

// Export the router object so index.js can access it
module.exports = router
