const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('users/login'); // <--- Add 'return' here
  }
  next();
}

module.exports = { redirectLogin };