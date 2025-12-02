const express = require("express")
const router = express.Router()
const { redirectLogin } = require('../middleware/auth');
const { addWorkout, removeWorkout } = require('../middleware/workoutTool');

router.get('/', redirectLogin, function(req, res, next){
    res.render('index.ejs')
});





module.exports = router