const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/usr/365/users/login');
  }
  next();
}

module.exports = { redirectLogin };