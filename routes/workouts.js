// workout routes
const express = require("express")
const router = express.Router()
const { redirectLogin } = require('../middleware/auth');
const { addWorkout, removeWorkout } = require('../middleware/workoutTool');

router.get('/', redirectLogin, function(req, res, next){
    res.render('workouts.ejs')
});

router.post('/add', redirectLogin, function (req, res, next) {
    console.log('Add workout route hit');
    const userId = req.session.userId;
    const { type, duration, distance, reps, sets } = req.body;

    addWorkout(userId, type, duration, distance, reps, sets);
    res.redirect('/workouts');
});

router.post('/remove', redirectLogin, function (req, res, next) {
    const userId = req.session.userId;
    const workoutId = req.body.workoutId;

    removeWorkout(userId, workoutId);
    res.redirect('/workouts');
});

module.exports = router