const express = require("express")
const router = express.Router()
const { redirectLogin } = require('../middleware/auth');

router.get('/',function(req, res, next){
    res.render('index.ejs')
});
module.exports = router