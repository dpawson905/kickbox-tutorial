const kickbox = require("kickbox")
  .client(process.env.KICKBOX_API_KEY)
  .kickbox();
const debug = require("debug")("kickbox-tuts:middleware");
const User = require("../models/user");

const middleware = {
  asyncErrorHandler: (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  },
  validatePassword: (req, res, next) => {
    const userInfo = req.body;
    if (userInfo.password !== userInfo.password2) {
      req.flash("error", "Passwords do not match");
      return res.redirect("back");
    }
    return next();
  },
  verifyEmail: async (req, res, next) => {
    try {
      await kickbox.verify(req.body.email, (err, response) => {
        if (err) return next(err);
        const { result, reason } = response.body;
        if (result === "deliverable" && reason === "accepted_email") {
          return next();
        } else {
          req.flash(
            "error",
            "Email is unable to be verified. Please use a different email address."
          );
          return res.redirect("back");
        }
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("/");
    }
  },
};

module.exports = middleware;
