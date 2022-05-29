const express = require('express');
const router = express.Router();

const {
  asyncErrorHandler,
  isNotAuthenticated
} = require('../middleware')

const {
  getUserProfile
} = require("../controllers/users");

/* GET users listing. */
router.get('/profile/:username', isNotAuthenticated, asyncErrorHandler(getUserProfile));

module.exports = router;
