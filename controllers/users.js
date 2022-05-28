const User = require('../models/user')

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    res.render('users/profile', {user, page: 'profile'})
  } catch(err) {
    req.flash('error', err.message);
    return res.redirect('/');
  }
}