const express = require('express');
const router = express.Router();

const {
  asyncErrorHandler,
  isNotAuthenticated,
  validatePassword
} = require('../middleware')

const {
  getUserProfile,
  updatePassword
} = require("../controllers/users");

router.route('/profile/:username')
  .get(isNotAuthenticated, asyncErrorHandler(getUserProfile))
  .put(isNotAuthenticated, validatePassword, asyncErrorHandler(updatePassword))

module.exports = router;
