const express = require("express")
const router = express.Router()
const { redirectLogin } = require('../middleware/auth');

router.get('/',function(req, res, next){
    if (req.session.userId) {
        res.redirect('/dashboard',);
        return;
    }else{  
    res.render('index.ejs')
}});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
     if (err) {
        return res.redirect('./') //removing cookies information and sending them to homepage
   }
    res.render('index.ejs');
    })
})

router.get('/dashboard', (req, res, next) => {
  const userId = req.session.userId; // get the logged-in user ID from the session

  if (!userId) {
    return res.redirect('/users/login'); // redirect if not logged in
  }

  const sql = 'SELECT id, username, first_name, last_name, email FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0]; // retrieve user info
    res.render('dashboard.ejs', { user }); // pass user to dashboard view
  });
});


module.exports = router