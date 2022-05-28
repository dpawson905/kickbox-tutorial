const express = require("express");
const router = express.Router();

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
router.post("/login", asyncErrorHandler(postLogin));
router.get("/logout", logOut);

module.exports = router;
