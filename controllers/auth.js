const debug = require('debug')('kickbox-tuts:auth-controller');
const passport = require('passport');

const User = require('../models/user');

exports.postRegister = async (req, res, next) => {
  const userInfo = req.body;
  try {
    const newUser = new User({
      email: userInfo.email,
      username: userInfo.username,
      isVerified: true,
    });
    delete userInfo.password2;
    const user = await User.register(newUser, userInfo.password);
    req.flash(
      'success',
      `Thanks for registering ${user.username}... Please login to your account`
    );
    return res.redirect('back');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/',
      successFlash: true,
      failureFlash: true,
    })(req, res, next);
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back')
  }
};

exports.logOut = (req, res, next) => {
  req.logout(() => {
    req.flash('success', 'See ya later...')
    return res.redirect("/");
  });
};
