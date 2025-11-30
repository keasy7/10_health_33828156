const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('users/login');
    } else {
        next();
    }
}; 

module.exports = { redirectLogin };