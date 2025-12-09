// workout routes
const express = require("express")
const router = express.Router()
const { redirectLogin } = require('../middleware/auth');
const { addWorkout, removeWorkout } = require('../middleware/workoutTool');
const { query, validationResult, body } = require('express-validator');

router.get('/', (req, res, next) => {
    // Fetch all types and their rules
    let sql = "SELECT * FROM workout_types ORDER BY name ASC";
    
    db.query(sql, (err, results) => {
        if (err) return next(err);
        const recentWorkoutsSql = 'SELECT * FROM workouts WHERE user_id = ? ORDER BY date_logged DESC LIMIT 5';

        db.query(recentWorkoutsSql, [req.session.userId], (err, workoutResults) => { // retrieve recent workouts
        if (err) return next(err);

        // pass results as 'workoutTypes'
        res.render('workouts.ejs', { 
            workoutTypes: results,
            recentWorkouts: workoutResults
        });
    });});
});

router.post('/add', redirectLogin,[body('duration').toFloat(), body('distance').toFloat(), body('reps').toInt(), body('sets').toInt()], function (req, res, next) {
    console.log('Add workout route hit');
    const userId = req.session.userId;
    const { type, duration, distance, reps, sets } = req.body;

    addWorkout(userId, type, duration, distance, reps, sets);
    res.redirect('./workouts');
});

router.post('/remove', redirectLogin, function (req, res, next) {
    const userId = req.session.userId;
    const workoutId = req.body.workoutId;

    removeWorkout(userId, workoutId);
    res.redirect('./workouts');
});

module.exports = router