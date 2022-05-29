const User = require('../models/user')
const passport = require("passport");

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    res.render('users/profile', {user, page: 'profile'})
  } catch(err) {
    req.flash('error', err.message);
    return res.redirect('/');
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    delete req.body.password2;
    await user.setPassword(req.body.password, async (err) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      user.attempts = 0;
      await user.save();
      req.flash("success", "Password has been changed.");
      res.redirect("back");
    });
  } catch(err) {
    console.log(err)
    req.flash('error', err.message);
    return res.redirect('back')
  }
};