const express = require("express");
const router = express.Router();
const passport = require('passport');

const {
  asyncErrorHandler,
  validatePassword,
  verifyEmail,
} = require("../middleware");

const { postRegister, postLogin, logOut } = require("../controllers/auth");

router.post(
  "/register",
  asyncErrorHandler(verifyEmail),
  validatePassword,
  asyncErrorHandler(postRegister)
);

router.post("/login", passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/',
}), asyncErrorHandler(postLogin));

router.get("/logout", logOut);

module.exports = router;
