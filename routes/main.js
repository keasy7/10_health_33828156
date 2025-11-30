const express = require("express")
const router = express.Router()
const { redirectLogin } = require('./middleware/auth');

router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
     if (err) {
        return res.redirect('./')
   }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
})


module.exports = router